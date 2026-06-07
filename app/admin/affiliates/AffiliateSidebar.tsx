'use client';

import { useState, useTransition } from 'react';
import { createLinkAction, updateLinkAction, deleteLinkAction } from './actions';
import toast from 'react-hot-toast';

export type AffiliateLink = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  pricing: string;
  is_recommended: boolean;
  use_case: string;
  sort_order: number;
};

const CATEGORIES = [
  'Produktivität & Organisation',
  'Design & Kreativität',
  'E-Mail Marketing',
  'KI-Tools',
  'Website & Hosting',
  'Buchhaltung & Rechnungen',
  'Sonstiges',
];

const empty: Omit<AffiliateLink, 'id'> = {
  name: '', description: '', url: '', category: '', pricing: '',
  is_recommended: false, use_case: '', sort_order: 0,
};

function Form({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<AffiliateLink, 'id'>;
  onSave: (fd: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await onSave(fd);
        toast.success('Gespeichert');
      } catch {
        toast.error('Fehler beim Speichern');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="label">Name *</label>
        <input name="name" required defaultValue={initial.name} className="input text-sm" />
      </div>
      <div>
        <label className="label">URL *</label>
        <input name="url" required type="url" defaultValue={initial.url} className="input text-sm" placeholder="https://..." />
      </div>
      <div>
        <label className="label">Kategorie</label>
        <select name="category" defaultValue={initial.category} className="input text-sm">
          <option value="">– keine –</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Beschreibung</label>
        <textarea name="description" rows={2} defaultValue={initial.description} className="input text-sm resize-none" />
      </div>
      <div>
        <label className="label">Use Case</label>
        <textarea name="use_case" rows={2} defaultValue={initial.use_case} className="input text-sm resize-none" />
      </div>
      <div>
        <label className="label">Preis-Badge</label>
        <input name="pricing" defaultValue={initial.pricing} className="input text-sm" placeholder="z.B. Freemium" />
      </div>
      <div>
        <label className="label">Reihenfolge</label>
        <input name="sort_order" type="number" defaultValue={initial.sort_order} className="input text-sm" />
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" name="is_recommended" value="true" defaultChecked={initial.is_recommended} className="w-4 h-4 accent-teal-500" />
        Als empfohlen markieren
      </label>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={isPending} className="btn-primary text-sm py-2">
          {isPending ? 'Speichern…' : 'Speichern'}
        </button>
        <button type="button" onClick={onCancel} className="text-sm px-3 py-2 border border-gray-200 rounded-xl text-gray-500 hover:border-gray-300 transition-colors">
          Abbrechen
        </button>
      </div>
    </form>
  );
}

export default function AffiliateSidebar({ links }: { links: AffiliateLink[] }) {
  const [localLinks, setLocalLinks] = useState(links);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" wirklich löschen?`)) return;
    startTransition(async () => {
      try {
        await deleteLinkAction(id);
        setLocalLinks(prev => prev.filter(l => l.id !== id));
        toast.success('Gelöscht');
      } catch { toast.error('Fehler beim Löschen'); }
    });
  };

  const handleCreate = async (fd: FormData) => {
    await createLinkAction(fd);
    setCreating(false);
    window.location.reload();
  };

  const handleUpdate = (id: string) => async (fd: FormData) => {
    await updateLinkAction(id, fd);
    setEditing(null);
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {!creating && (
        <button onClick={() => setCreating(true)} className="btn-primary text-sm py-2.5 w-full justify-center">
          + Neuer Link
        </button>
      )}
      {creating && (
        <div className="card p-5 border-teal-DEFAULT/30">
          <p className="font-semibold text-navy-DEFAULT mb-4">Neuer Affiliate-Link</p>
          <Form initial={empty} onSave={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}

      {localLinks.map(link => (
        <div key={link.id} className="card p-4">
          {editing === link.id ? (
            <>
              <p className="font-semibold text-navy-DEFAULT mb-4">Bearbeiten: {link.name}</p>
              <Form initial={link} onSave={handleUpdate(link.id)} onCancel={() => setEditing(null)} />
            </>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="font-medium text-navy-DEFAULT text-sm">{link.name}</p>
                  {link.category && <p className="text-xs text-gray-400">{link.category}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditing(link.id)} className="p-1.5 text-gray-400 hover:text-navy-DEFAULT rounded-lg hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                  </button>
                  <button onClick={() => handleDelete(link.id, link.name)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 truncate">{link.url}</p>
              {link.is_recommended && (
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded font-medium">★ Empfohlen</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
