export default function DocumentsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Documents</h1>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium">Document Name</th>
                  <th className="p-4 text-left font-medium">Type</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Account</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Q3 2023 Report</td>
                  <td className="p-4">Quarterly Report</td>
                  <td className="p-4">Oct 15, 2023</td>
                  <td className="p-4">Account 1</td>
                </tr>
                <tr>
                  <td className="p-4">2023 K-1</td>
                  <td className="p-4">Tax Document</td>
                  <td className="p-4">Mar 1, 2024</td>
                  <td className="p-4">Account 2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
