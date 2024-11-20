import { SupabaseTest } from '@/components/supabase-test'

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Home</h1>
      <p className="mb-8">Welcome to the LP Portal dashboard.</p>
      <SupabaseTest />
    </div>
  )
}
