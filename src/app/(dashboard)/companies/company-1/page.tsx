export default function Company1Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Company 1</h1>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Company Details</h3>
            <p className="text-sm text-muted-foreground">Technology</p>
            <div className="mt-4 grid gap-2">
              <div>
                <div className="text-2xl font-bold">$10M</div>
                <p className="text-sm text-muted-foreground">Revenue</p>
              </div>
              <div>
                <div className="text-2xl font-bold">50</div>
                <p className="text-sm text-muted-foreground">Employees</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Your Investment</h3>
            <div className="text-2xl font-bold">$500,000</div>
            <p className="text-sm text-muted-foreground">Series A</p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Return</h3>
            <div className="text-2xl font-bold text-green-600">+15.4%</div>
            <p className="text-sm text-muted-foreground">Since investment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
