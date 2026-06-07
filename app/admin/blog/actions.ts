'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { slugify } from '@/lib/utils';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) throw new Error('Kein Zugriff');
  return user;
}

export async function createPostAction(formData: FormData) {
  const user = await requireAdmin();
  const admin = createAdminClient();
  const title = formData.get('title') as string;
  const slug = (formData.get('slug') as string) || slugify(title);

  const { error } = await admin.from('blog_posts').insert({
    title,
    slug,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    category: formData.get('category') as string,
    cover_image: formData.get('cover_image') as string || null,
    published: formData.get('published') === 'true',
    author_id: user.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  redirect('/admin/blog');
}

export async function updatePostAction(id: string, formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const title = formData.get('title') as string;
  const slug = (formData.get('slug') as string) || slugify(title);

  const { error } = await admin.from('blog_posts').update({
    title,
    slug,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    category: formData.get('category') as string,
    cover_image: formData.get('cover_image') as string || null,
    published: formData.get('published') === 'true',
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  redirect('/admin/blog');
}

export async function deletePostAction(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('blog_posts').delete().eq('id', id);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function togglePublishedAction(id: string, published: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('blog_posts').update({ published, updated_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}
