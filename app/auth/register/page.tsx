'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Passwort muss mindestens 8 Zeichen haben');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Bitte bestätige deine E-Mail-Adresse!');
      router.push('/auth/login');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-brand-lightgray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-navy-DEFAULT rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="text-2xl font-bold text-navy-DEFAULT">
              Klar<span className="text-teal-DEFAULT">Kit</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-navy-DEFAULT mt-6 mb-1">
            Konto erstellen
          </h1>
          <p className="text-gray-500 text-sm">
            Kostenlos registrieren und sofort loslegen.
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  placeholder="Max Mustermann"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">E-Mail *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="deine@email.de"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Passwort *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Mindestens 8 Zeichen"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Kostenlos registrieren
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Mit der Registrierung stimmst du unseren{' '}
              <Link href="/agb" className="text-teal-DEFAULT hover:underline">AGB</Link>{' '}
              und der{' '}
              <Link href="/datenschutz" className="text-teal-DEFAULT hover:underline">Datenschutzerklärung</Link>{' '}
              zu.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Bereits ein Konto?{' '}
            <Link href="/auth/login" className="text-teal-DEFAULT font-medium hover:text-teal-500">
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
