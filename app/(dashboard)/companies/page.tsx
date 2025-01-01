export default function CompaniesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Companies</h1>
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Company 1</h3>
            <p className="text-sm text-muted-foreground">Technology</p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Company 2</h3>
            <p className="text-sm text-muted-foreground">Healthcare</p>
          </div>
        </div>
      </div>
    </div>
  );
}
