import Link from "next/link"

export default function AccountsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Accounts</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'Account 1', href: '/accounts/account-1' },
          { name: 'Account 2', href: '/accounts/account-2' },
        ].map((account) => (
          <Link
            key={account.name}
            href={account.href}
            className="block p-6 bg-card hover:bg-accent rounded-lg border transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">{account.name}</h2>
            <p className="text-muted-foreground">View account details →</p>
          </Link>
        ))}
      </div>
    </div>
  )
} 