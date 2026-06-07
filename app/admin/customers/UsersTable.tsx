'use client';

import { useState, useTransition } from 'react';
import { toggleAdminAction, deleteUserAction, sendPasswordResetAction } from './actions';
import { Shield, ShieldOff, Trash2, RefreshCw, Search, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  is_admin: boolean;
  order_count: number;
};

export default function UsersTable({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState('');
  const [localUsers, setLocalUsers] = useState(users);
  const [isPending, startTransition] = useTransition();

  const filtered = localUsers.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleAdmin = (userId: string, currentIsAdmin: boolean) => {
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_admin: !currentIsAdmin } : u))
    );
    startTransition(async () => {
      try {
        await toggleAdminAction(userId, !currentIsAdmin);
        toast.success(currentIsAdmin ? 'Admin-Rechte entzogen' : 'Admin-Rechte vergeben');
      } catch {
        setLocalUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_admin: currentIsAdmin } : u))
        );
        toast.error('Fehler beim Ändern der Rechte');
      }
    });
  };

  const handleDelete = (userId: string, email: string) => {
    if (!confirm(`"${email}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) return;
    startTransition(async () => {
      try {
        await deleteUserAction(userId);
        setLocalUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success('User gelöscht');
      } catch {
        toast.error('Fehler beim Löschen');
      }
    });
  };

  const handlePasswordReset = (email: string) => {
    startTransition(async () => {
      try {
        await sendPasswordResetAction(email);
        toast.success('Passwort-Reset-Mail gesendet');
      } catch {
        toast.error('Fehler beim Senden');
      }
    });
  };

  return (
    <div>
      <div className="relative mb-5 max-w-xs">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Name oder E-Mail suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9 py-2 text-sm w-full"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-brand-lightgray/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name / E-Mail</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Rolle</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Bestellungen</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Letzter Login</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Registriert</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Keine User gefunden
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-brand-lightgray/40 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-medium text-navy-DEFAULT">
                          {user.full_name || <span className="text-gray-300 font-normal">—</span>}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {user.email_confirmed_at ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                          <CheckCircle size={12} /> Bestätigt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-600 text-xs font-medium">
                          <XCircle size={12} /> Unbestätigt
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                          user.is_admin
                            ? 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {user.is_admin ? <Shield size={11} /> : <ShieldOff size={11} />}
                        {user.is_admin ? 'Admin' : 'User'}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-navy-DEFAULT">{user.order_count}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString('de-DE')
                        : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">
                      {new Date(user.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handlePasswordReset(user.email)}
                          disabled={isPending}
                          title="Passwort-Reset senden"
                          className="p-1.5 text-gray-400 hover:text-navy-DEFAULT rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.email)}
                          disabled={isPending}
                          title="User löschen"
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        {filtered.length} von {localUsers.length} Usern
      </p>
    </div>
  );
}
