import Link from "next/link"

export default function CompaniesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Companies</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'Company 1', href: '/companies/company-1' },
          { name: 'Company 2', href: '/companies/company-2' },
        ].map((company) => (
          <Link
            key={company.name}
            href={company.href}
            className="block p-6 bg-card hover:bg-accent rounded-lg border transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
            <p className="text-muted-foreground">View company details →</p>
          </Link>
        ))}
      </div>
    </div>
  )
} 