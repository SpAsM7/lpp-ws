export default function InvestmentsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Investments</h1>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium">Company</th>
                  <th className="p-4 text-left font-medium">Investment</th>
                  <th className="p-4 text-left font-medium">Value</th>
                  <th className="p-4 text-left font-medium">Return</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Company 1</td>
                  <td className="p-4">Series A</td>
                  <td className="p-4">$500,000</td>
                  <td className="p-4 text-green-600">+15.4%</td>
                </tr>
                <tr>
                  <td className="p-4">Company 2</td>
                  <td className="p-4">Series B</td>
                  <td className="p-4">$750,000</td>
                  <td className="p-4 text-green-600">+22.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
