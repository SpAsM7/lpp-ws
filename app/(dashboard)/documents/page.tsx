import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DocumentsClient } from './_components/DocumentsClient';
import { getDocumentsForUser } from '@/lib/actions/documents/get-documents-for-user';

export default async function DocumentsPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookies()).get(name)?.value;
        },
        async set(name: string, value: string, options: any) {
          (await cookies()).set({ name, value, ...options });
        },
        async remove(name: string, options: any) {
          (await cookies()).delete(name);
        },
      },
    }
  );
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/auth/login');
  }

  try {
    // Fetch initial documents on the server
    const response = await getDocumentsForUser(user.id);

    // Log the full response for debugging
    console.log('Documents response:', JSON.stringify(response, null, 2));

    if (!response.success) {
      console.error('Error fetching documents:', response.error);
      throw new Error(response.message);
    }

    return (
      <DocumentsClient 
        userId={user.id} 
        initialDocuments={response.data || []}
      />
    );
  } catch (err) {
    // Log the full error for debugging
    console.error('Failed to load documents:', err);
    if (err instanceof Error) {
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        cause: err.cause,
      });
    }
    // Return empty array but don't fail the page load
    return <DocumentsClient userId={user.id} initialDocuments={[]} />;
  }
}
