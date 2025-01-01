import Link from "next/link";
import { Suspense } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Account } from "@/types/account";

async function getAccounts() {
  const supabase = createClient();

  // TODO: Implement actual data fetching with pagination
  // const { data: accounts, error } = await supabase
  //   .from('accounts')
  //   .select('*')
  //   .order('created_at', { ascending: false });

  // if (error) {
  //   console.error('Error fetching accounts:', error);
  //   return [];
  // }

  // Temporary mock data
  const accounts: Account[] = [
    {
      id: "ACCT-2024-001",
      name: "Smith Family Trust",
      type: "Trust Account",
      status: "Active",
      lastActivity: "2024-01-10"
    },
    {
      id: "ACCT-2024-002",
      name: "Johnson LLC",
      type: "Entity Account",
      status: "Pending",
      lastActivity: "2024-01-09"
    }
  ];

  return accounts;
}

function AccountsList({ accounts }: { accounts: Account[] }) {
  return (
    <div className="space-y-4">
      {accounts.map(account => (
        <Link key={account.id} href={`/accounts/${account.id}`}>
          <Card className="hover:bg-zinc-50 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{account.name}</CardTitle>
                  <CardDescription>ID: {account.id}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-zinc-100">
                    {account.type}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={
                      account.status === "Active" 
                        ? "border-green-500 text-green-500" 
                        : "border-yellow-500 text-yellow-500"
                    }
                  >
                    {account.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500">
                Last activity: {new Date(account.lastActivity).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Accounts</h1>
          <p className="text-zinc-500">Manage your investment accounts</p>
        </div>
        <Link href="/accounts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Account
          </Button>
        </Link>
      </div>

      {/* Accounts List */}
      <Suspense fallback={<div>Loading accounts...</div>}>
        <AccountsList accounts={accounts} />
      </Suspense>
    </div>
  );
}
