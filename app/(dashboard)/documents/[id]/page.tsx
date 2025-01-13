import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getDocumentById } from '@/lib/actions/documents/get-document-by-id';
import { DocumentPreviewClient } from '../_components/document-preview/DocumentPreviewClient';
import type { Database } from '@/types/supabase';

interface DocumentPageProps {
  params: {
    id: string;
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value ?? '';
        },
        async set(name: string, value: string, options: any) {
          const cookieStore = await cookies();
          cookieStore.set({ name, value, ...options });
        },
        async remove(name: string, options: any) {
          const cookieStore = await cookies();
          cookieStore.delete(name);
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    notFound();
  }

  const result = await getDocumentById(params.id, user.id);
  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <DocumentPreviewClient
        document={result.data}
        userId={user.id}
      />
    </div>
  );
} 