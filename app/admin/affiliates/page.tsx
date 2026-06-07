import { createClient } from '@/lib/supabase/server';
import AffiliateSidebar from './AffiliateSidebar';
import { ExternalLink, Star } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Affiliate-Links – Admin' };

export default async function AdminAffiliatesPage() {
  const supabase = createClient();
  const { data: links } = await supabase
    .from('affiliate_links')
    .select('*')
    .order('category')
    .order('sort_order');

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-DEFAULT">Affiliate-Links</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Links werden auf der <a href="/tools" target="_blank" className="text-teal-DEFAULT hover:underline">Tool-Empfehlungs-Seite</a> angezeigt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-brand-lightgray/50">
              <p className="font-medium text-navy-DEFAULT text-sm">Vorschau ({links?.length ?? 0} Links)</p>
            </div>
            {!links || links.length === 0 ? (
              <p className="text-center py-12 text-gray-400 text-sm">Noch keine Links vorhanden.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {links.map(link => (
                  <div key={link.id} className="px-5 py-4 flex items-center gap-3 hover:bg-brand-lightgray/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-navy-DEFAULT text-sm">{link.name}</p>
                        {link.is_recommended && (
                          <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded font-medium">
                            <Star size={8} fill="currentColor" /> Empfohlen
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{link.category} · {link.pricing}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{link.description}</p>
                    </div>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-300 hover:text-teal-DEFAULT transition-colors flex-shrink-0">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Create / Edit */}
        <div>
          <AffiliateSidebar links={links ?? []} />
        </div>
      </div>
    </div>
  );
}
