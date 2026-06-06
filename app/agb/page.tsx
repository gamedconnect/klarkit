import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'AGB' };

export default function AGBPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-navy-DEFAULT mb-3">
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
        </p>

        <div className="prose-klarkit space-y-8 text-sm">
          <section>
            <h2>§ 1 Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen gelten für alle
              Geschäftsbeziehungen zwischen KlarKit und seinen Kunden. Maßgebend
              ist die jeweils zum Zeitpunkt des Vertragsschlusses gültige Fassung.
            </p>
          </section>

          <section>
            <h2>§ 2 Vertragsschluss</h2>
            <p>
              Die Darstellung der Produkte im Online-Shop stellt kein rechtlich
              bindendes Angebot, sondern eine Aufforderung zur Bestellung
              (invitatio ad offerendum) dar. Mit dem Klick auf den Bestellbutton
              geben Sie eine verbindliche Bestellung auf. Die Annahme erfolgt
              durch Zusendung einer Auftragsbestätigung per E-Mail.
            </p>
          </section>

          <section>
            <h2>§ 3 Digitale Produkte</h2>
            <p>
              KlarKit vertreibt digitale Produkte (Downloads). Nach Zahlungseingang
              erhalten Sie sofortigen Zugang zu Ihren Produkten. Die Lieferung
              erfolgt durch Bereitstellung eines Download-Links per E-Mail.
            </p>
          </section>

          <section>
            <h2>§ 4 Preise und Zahlung</h2>
            <p>
              Alle Preise verstehen sich inklusive der gesetzlichen
              Mehrwertsteuer. Die Zahlung erfolgt über unseren Zahlungsanbieter
              Stripe. Akzeptierte Zahlungsmethoden: Kreditkarte, PayPal,
              SEPA-Lastschrift, Sofortüberweisung.
            </p>
          </section>

          <section id="widerruf">
            <h2>§ 5 Widerrufsrecht</h2>
            <p>
              <strong>Ausschluss des Widerrufsrechts bei digitalen Inhalten:</strong>
            </p>
            <p>
              Das Widerrufsrecht erlischt gemäß § 356 Abs. 5 BGB vorzeitig, wenn
              wir mit der Ausführung des Vertrags begonnen haben, nachdem Sie
              ausdrücklich zugestimmt haben, dass wir mit der Ausführung des
              Vertrags vor Ablauf der Widerrufsfrist beginnen, und Ihre
              Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit
              Beginn der Ausführung des Vertrags Ihr Widerrufsrecht verlieren.
            </p>
          </section>

          <section>
            <h2>§ 6 Nutzungsrechte</h2>
            <p>
              Mit dem Kauf eines digitalen Produkts erwerben Sie ein einfaches,
              nicht übertragbares Nutzungsrecht für den persönlichen oder
              geschäftlichen Gebrauch. Eine Weitergabe, Weiterveräußerung oder
              Vervielfältigung der Produkte ist nicht gestattet.
            </p>
          </section>

          <section>
            <h2>§ 7 Haftung</h2>
            <p>
              KlarKit haftet unbegrenzt für Schäden aus der Verletzung des
              Lebens, des Körpers oder der Gesundheit. Für sonstige Schäden
              haftet KlarKit nur bei Vorsatz oder grober Fahrlässigkeit.
            </p>
          </section>

          <section>
            <h2>§ 8 Affiliate-Links</h2>
            <p>
              Diese Website enthält Affiliate-Links. Wenn Sie über diese Links
              einkaufen, erhalten wir möglicherweise eine Provision. Für Sie
              entstehen dadurch keine zusätzlichen Kosten. Affiliate-Links sind
              auf dieser Website stets als solche gekennzeichnet.
            </p>
          </section>

          <section>
            <h2>§ 9 Geltendes Recht</h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss
              des UN-Kaufrechts. Gerichtsstand ist, soweit gesetzlich zulässig,
              der Sitz von KlarKit.
            </p>
          </section>

          <section>
            <h2>§ 10 Kontakt</h2>
            <p>
              Bei Fragen zu diesen AGB wenden Sie sich bitte an:
              hallo@klarkit.de
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
