# KlarKit – Setup-Anleitung

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (KlarKit Branding)
- **Datenbank**: Supabase (PostgreSQL + Auth + Storage)
- **Zahlungen**: Stripe
- **Hosting**: Vercel

---

## 1. Supabase einrichten

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein kostenloses Konto
2. Erstelle ein neues Projekt
3. Gehe zu **SQL Editor** und führe diese Dateien aus (in dieser Reihenfolge):
   - `supabase/migrations/001_initial_schema.sql` (Schema + Beispieldaten)
   - `supabase/migrations/002_functions.sql` (Hilfsfunktionen)
4. Gehe zu **Settings → API** und kopiere:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` Key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Stripe einrichten

1. Erstelle ein kostenloses Konto auf [stripe.com](https://stripe.com)
2. Gehe zu **Dashboard → Developers → API Keys**
3. Kopiere:
   - Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret Key → `STRIPE_SECRET_KEY`
4. Für Webhooks:
   - Gehe zu **Developers → Webhooks → Add endpoint**
   - URL: `https://deine-domain.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`
   - Kopiere Signing Secret → `STRIPE_WEBHOOK_SECRET`

**Zahlungsarten aktivieren:**
- Gehe zu Stripe Dashboard → Settings → Payment methods
- Aktiviere: Card, PayPal, SEPA Debit, Sofort

---

## 3. Umgebungsvariablen

Erstelle `.env.local`:

```bash
cp .env.example .env.local
```

Fülle alle Werte aus:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Lokal starten

```bash
npm install
npm run dev
```

App läuft auf: http://localhost:3000

---

## 5. Auf Vercel deployen

1. Erstelle kostenloses Konto auf [vercel.com](https://vercel.com)
2. Verbinde dein GitHub-Repository
3. Klicke **Import** und wähle das `klarkit` Repository
4. Füge alle Umgebungsvariablen aus `.env.local` hinzu
5. Setze `NEXT_PUBLIC_APP_URL` auf deine Vercel-Domain
6. Klicke **Deploy**

---

## 6. Admin-Benutzer erstellen

Nach dem ersten Login:

1. Gehe zu **Supabase → Table Editor → profiles**
2. Suche deinen Benutzer nach E-Mail
3. Setze `is_admin = true`

Du kannst jetzt das Admin-Panel unter `/admin` aufrufen.

---

## 7. Digitale Produkte hochladen

1. Gehe zu **Supabase → Storage**
2. Erstelle einen Bucket `products` (nicht öffentlich)
3. Lade deine Dateien hoch
4. Kopiere die URL und trage sie im Produkt-Formular unter `file_url` ein

---

## Seitenübersicht

| URL | Beschreibung |
|-----|-------------|
| `/` | Startseite |
| `/products` | Alle Produkte |
| `/products/[slug]` | Produktdetailseite |
| `/cart` | Warenkorb |
| `/checkout` | Kasse |
| `/tools` | Tool-Empfehlungen |
| `/blog` | Blog |
| `/about` | Über KlarKit |
| `/admin` | Admin-Dashboard |
| `/admin/products` | Produkte verwalten |
| `/admin/orders` | Bestellungen |
| `/account` | Kundenkonto |
| `/account/downloads` | Downloads |
| `/impressum` | Impressum (DSGVO) |
| `/datenschutz` | Datenschutz |
| `/agb` | AGB + Widerruf |

---

## Wichtige Hinweise

- **Impressum**: Trage deine echten Kontaktdaten in `/app/impressum/page.tsx` ein
- **AGB**: Lasse die AGB von einem Rechtsanwalt prüfen
- **USt-ID**: Trage deine Umsatzsteuer-ID im Impressum ein
- **Stripe-Test**: Teste Zahlungen mit Testkarte `4242 4242 4242 4242`
