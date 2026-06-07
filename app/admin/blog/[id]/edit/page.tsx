import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import BlogForm from '../../BlogForm';
import { updatePostAction } from '../../actions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Beitrag bearbeiten – Admin' };

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!post) notFound();

  const boundAction = updatePostAction.bind(null, post.id);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-navy-DEFAULT mb-6">Beitrag bearbeiten</h1>
      <BlogForm post={post} action={boundAction} />
    </div>
  );
}
