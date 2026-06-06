import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Datenschutzerklärung' };

export default function DatenschutzPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-navy-DEFAULT mb-3">
          Datenschutzerklärung
        </h1>
        <p className="text-gray-500 text-sm mb-10">Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</p>

        <div className="prose-klarkit space-y-8 text-sm">
          <section>
            <h2>1. Datenschutz auf einen Blick</h2>
            <h3>Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber,
              was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3>Datenschutz</h3>
            <p>
              Der Betreiber dieser Seiten nimmt den Schutz Ihrer persönlichen
              Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
              vertraulich und entsprechend der gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <h3>Verantwortliche Stelle</h3>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser
              Website ist:<br />
              KlarKit / [Dein Name]<br />
              E-Mail: hallo@klarkit.de
            </p>
          </section>

          <section>
            <h2>3. Datenerfassung auf dieser Website</h2>
            <h3>Cookies</h3>
            <p>
              Unsere Website verwendet Cookies. Dabei handelt es sich um kleine
              Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert.
              Cookies helfen uns dabei, unser Angebot nutzerfreundlicher,
              effektiver und sicherer zu machen.
            </p>

            <h3>Server-Log-Dateien</h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch
              Informationen in so genannten Server-Log-Dateien, die Ihr Browser
              automatisch an uns übermittelt. Dies sind: Browsertyp und
              Browserversion, verwendetes Betriebssystem, Referrer URL,
              Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage,
              IP-Adresse.
            </p>

            <h3>Kontaktformular</h3>
            <p>
              Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben
              inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks
              Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei
              uns gespeichert.
            </p>
          </section>

          <section>
            <h2>4. Zahlungsanbieter</h2>
            <h3>Stripe</h3>
            <p>
              Für die Abwicklung von Zahlungen nutzen wir den Dienst Stripe.
              Anbieter ist Stripe Inc., 510 Townsend Street, San Francisco, CA
              94103, USA. Stripe ist PCI-DSS-zertifiziert. Beim Bezahlvorgang
              werden Ihre Zahlungsdaten an Stripe übermittelt. Es gelten die
              Datenschutzbestimmungen von Stripe:{' '}
              <a
                href="https://stripe.com/de/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-DEFAULT hover:underline"
              >
                stripe.com/de/privacy
              </a>
            </p>
          </section>

          <section>
            <h2>5. Supabase</h2>
            <p>
              Wir nutzen Supabase für die Datenbankinfrastruktur und
              Authentifizierung. Supabase ist DSGVO-konform und speichert Daten
              in EU-Rechenzentren. Weitere Informationen:{' '}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-DEFAULT hover:underline"
              >
                supabase.com/privacy
              </a>
            </p>
          </section>

          <section>
            <h2>6. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über
              Ihre gespeicherten personenbezogenen Daten, deren Herkunft und
              Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf
              Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren
              Fragen zum Thema personenbezogene Daten können Sie sich jederzeit
              an hallo@klarkit.de wenden.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
