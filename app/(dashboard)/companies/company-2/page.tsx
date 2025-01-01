export default function Company2Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Company 2</h1>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Company Details</h3>
            <p className="text-sm text-muted-foreground">Healthcare</p>
            <div className="mt-4 grid gap-2">
              <div>
                <div className="text-2xl font-bold">$15M</div>
                <p className="text-sm text-muted-foreground">Revenue</p>
              </div>
              <div>
                <div className="text-2xl font-bold">75</div>
                <p className="text-sm text-muted-foreground">Employees</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Your Investment</h3>
            <div className="text-2xl font-bold">$750,000</div>
            <p className="text-sm text-muted-foreground">Series B</p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Return</h3>
            <div className="text-2xl font-bold text-green-600">+22.1%</div>
            <p className="text-sm text-muted-foreground">Since investment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
