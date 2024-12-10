import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AccountDetails } from "@/components/accounts/details/account-details";
import { AccountTeam } from "@/components/accounts/details/account-team";
import { createClient } from "@/lib/supabase/server";
import type { Account } from "@/types/account";

interface AccountPageProps {
  params: {
    id: string;
  };
}

export default async function AccountPage({ params }: AccountPageProps) {
  const supabase = createClient();

  // TODO: Implement actual data fetching
  // const { data: account, error } = await supabase
  //   .from('accounts')
  //   .select('*')
  //   .eq('id', params.id)
  //   .single();

  // if (error) {
  //   console.error('Error fetching account:', error);
  //   return notFound();
  // }

  // Temporary mock data
  const account: Account = {
    id: "ACCT-2024-001",
    name: "Smith Family Trust",
    type: "Trust Account",
    status: "Active",
    lastActivity: new Date().toISOString()
  };

  if (!account) return notFound();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{account.name}</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-zinc-100">{account.type}</Badge>
          <Badge variant="outline" className="border-green-500 text-green-500">{account.status}</Badge>
          <p className="text-sm text-zinc-500">ID: {account.id}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details Section */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading account details...</div>}>
            <AccountDetails accountId={params.id} />
          </Suspense>
        </div>

        {/* Team Management Section */}
        <div>
          <Suspense fallback={<div>Loading team members...</div>}>
            <AccountTeam accountId={params.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
