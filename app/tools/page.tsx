import type { Metadata } from 'next';
import { ExternalLink, Star, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Tool-Empfehlungen',
  description: 'Unsere sorgfältig kuratierten Tool-Empfehlungen für Selbstständige, Creator und Online-Business-Starter.',
};

const staticCategories = [
  {
    name: 'Produktivität & Organisation',
    tools: [
      { name: 'Notion', description: 'All-in-one Workspace für Notizen, Projekte und Wissen', url: '#', pricing: 'Kostenlos verfügbar', is_recommended: true, use_case: 'Perfekt für Projektmanagement und persönliches Wissensmanagement' },
      { name: 'Todoist', description: 'Aufgabenverwaltung, die wirklich funktioniert', url: '#', pricing: 'Freemium', is_recommended: false, use_case: 'Ideal für einfaches Task-Management ohne Ablenkung' },
    ],
  },
  {
    name: 'Design & Kreativität',
    tools: [
      { name: 'Canva', description: 'Professionelles Design für alle – ohne Vorkenntnisse', url: '#', pricing: 'Kostenlos verfügbar', is_recommended: true, use_case: 'Social Media, Präsentationen, Flyer – alles in einem Tool' },
      { name: 'Figma', description: 'UI/UX Design und Prototyping im Browser', url: '#', pricing: 'Freemium', is_recommended: false, use_case: 'Für Website-Design und App-Prototypen' },
    ],
  },
  {
    name: 'KI-Tools',
    tools: [
      { name: 'ChatGPT', description: 'Der bekannteste KI-Assistent für Text und Analyse', url: '#', pricing: 'Freemium', is_recommended: true, use_case: 'Texte schreiben, Ideen generieren, Code erklären' },
      { name: 'Claude', description: 'KI-Assistent mit besonders starkem Verständnis', url: '#', pricing: 'Freemium', is_recommended: true, use_case: 'Komplexe Analysen, lange Dokumente, nuancierte Texte' },
    ],
  },
];

export default async function ToolsPage() {
  const supabase = createClient();
  const { data: dbLinks } = await supabase
    .from('affiliate_links')
    .select('*')
    .order('category')
    .order('sort_order');

  let categories: { name: string; tools: typeof staticCategories[0]['tools'] }[];

  if (dbLinks && dbLinks.length > 0) {
    const grouped: Record<string, typeof staticCategories[0]['tools']> = {};
    for (const link of dbLinks) {
      const cat = link.category || 'Sonstiges';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({
        name: link.name,
        description: link.description,
        url: link.url,
        pricing: link.pricing,
        is_recommended: link.is_recommended,
        use_case: link.use_case,
      });
    }
    categories = Object.entries(grouped).map(([name, tools]) => ({ name, tools }));
  } else {
    categories = staticCategories;
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-navy-DEFAULT text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-teal-DEFAULT text-sm font-medium uppercase tracking-wide mb-3">Kuratiert & getestet</p>
          <h1 className="text-4xl font-bold mb-4">Tool-Empfehlungen</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Keine wahllose Sammlung, sondern sorgfältig ausgewählte Tools, die wir selbst nutzen oder empfehlen.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            Einige Links sind Affiliate-Links – für dich kostenlos, für uns eine kleine Unterstützung.
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {categories.map((category) => (
            <div key={category.name}>
              <h2 className="text-2xl font-bold text-navy-DEFAULT mb-6">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {category.tools.map((tool) => (
                  <div key={tool.name} className={`card p-6 ${tool.is_recommended ? 'border-teal-DEFAULT/30' : ''}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-navy-DEFAULT text-lg">{tool.name}</h3>
                          {tool.is_recommended && (
                            <span className="badge bg-teal-DEFAULT/10 text-teal-DEFAULT text-[10px] flex items-center gap-0.5">
                              <Star size={8} fill="currentColor" /> Empfohlen
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-400">{tool.pricing}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                    {tool.use_case && (
                      <div className="flex items-start gap-2 mb-4 p-3 bg-brand-lightgray rounded-lg">
                        <CheckCircle size={13} className="text-teal-DEFAULT mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600">{tool.use_case}</p>
                      </div>
                    )}
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center gap-1.5 text-sm text-navy-DEFAULT font-medium hover:text-teal-DEFAULT transition-colors"
                    >
                      {tool.name} ausprobieren
                      <ExternalLink size={13} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-brand-lightgray rounded-2xl border border-gray-100">
          <h3 className="font-semibold text-navy-DEFAULT mb-2">Affiliate-Hinweis</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Einige der Links auf dieser Seite sind Affiliate-Links. Wenn du über diese Links einkaufst, erhalten wir möglicherweise eine Provision. Für dich entstehen dadurch keine zusätzlichen Kosten. Wir empfehlen nur Tools, von denen wir wirklich überzeugt sind.
          </p>
        </div>
      </div>
    </div>
  );
}
