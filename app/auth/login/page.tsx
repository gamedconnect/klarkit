'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(form);
    setLoading(false);
    if (error) {
      toast.error('E-Mail oder Passwort falsch');
    } else {
      toast.success('Willkommen zurück!');
      window.location.href = redirect;
    }
  };

  const handleMagicLink = async () => {
    if (!form.email) {
      toast.error('Bitte E-Mail eingeben');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error('Fehler beim Senden des Links');
    } else {
      toast.success('Magic Link gesendet! Prüfe dein Postfach.');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-brand-lightgray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
            Willkommen zurück
          </h1>
          <p className="text-gray-500 text-sm">
            Melde dich an, um auf deine Downloads zuzugreifen.
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">E-Mail</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="deine@email.de"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Passwort</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-teal-DEFAULT hover:text-teal-500"
                >
                  Vergessen?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="••••••••"
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
                  Anmelden
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-400">oder</span>
            </div>
          </div>

          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm font-medium text-navy-DEFAULT hover:bg-brand-lightgray transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Mail size={16} />
            Mit Magic Link anmelden
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Noch kein Konto?{' '}
            <Link
              href="/auth/register"
              className="text-teal-DEFAULT font-medium hover:text-teal-500"
            >
              Kostenlos registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
