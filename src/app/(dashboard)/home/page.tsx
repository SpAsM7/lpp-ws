export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Home</h1>
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Total Portfolio Value</h3>
            <p className="text-2xl font-bold">$1,234,567</p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Active Investments</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Total Return</h3>
            <p className="text-2xl font-bold text-green-600">+24.5%</p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold">Documents</h3>
            <p className="text-2xl font-bold">45</p>
          </div>
        </div>
      </div>
    </div>
  );
}
