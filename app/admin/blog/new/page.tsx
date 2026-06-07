import BlogForm from '../BlogForm';
import { createPostAction } from '../actions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Neuer Beitrag – Admin' };

export default function NewBlogPostPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-navy-DEFAULT mb-6">Neuer Beitrag</h1>
      <BlogForm action={createPostAction} />
    </div>
  );
}
