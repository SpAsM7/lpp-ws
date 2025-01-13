import { DocumentListSkeleton } from './_components/document-list/DocumentListSkeleton';
import { DocumentSearchSkeleton } from './_components/document-search/DocumentSearchSkeleton';

export default function DocumentsLoading() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-semibold">Documents</h1>
      
      {/* Search and filters */}
      <DocumentSearchSkeleton />

      {/* Document list */}
      <DocumentListSkeleton />
    </div>
  );
} 