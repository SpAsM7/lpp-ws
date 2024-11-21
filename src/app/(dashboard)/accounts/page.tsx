export default function AccountsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Accounts</h1>
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Account 1</h3>
            <p className="text-sm text-muted-foreground">Individual Account</p>
            <div className="mt-4">
              <div className="text-2xl font-bold">$750,000</div>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Account 2</h3>
            <p className="text-sm text-muted-foreground">IRA</p>
            <div className="mt-4">
              <div className="text-2xl font-bold">$500,000</div>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
