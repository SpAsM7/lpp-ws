import React from 'react';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Trash2 } from 'lucide-react';

function AccountManagement() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Smith Family Trust</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-zinc-100">Trust Account</Badge>
          <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
          <p className="text-sm text-zinc-500">ID: ACCT-2024-001</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details (Left Side - spans 2 columns) */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList>
              <TabsTrigger value="details">Account Details</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="banking">Banking</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Account Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trust Details</CardTitle>
                  <CardDescription>Basic information about the trust</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="trustType">Trust Type</Label>
                      <Select>
                        <SelectTrigger id="trustType">
                          <SelectValue placeholder="Select trust type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="living">Living Trust</SelectItem>
                          <SelectItem value="testamentary">Testamentary Trust</SelectItem>
                          <SelectItem value="charitable">Charitable Trust</SelectItem>
                          <SelectItem value="business">Business Trust</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input id="taxId" placeholder="Enter tax ID" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="formationDate">Formation Date</Label>
                      <Input id="formationDate" type="date" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxYearEnd">Tax Year End</Label>
                      <Input id="taxYearEnd" placeholder="MM/DD" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="usPerson">US Person Status</Label>
                      <Select>
                        <SelectTrigger id="usPerson">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">US Person</SelectItem>
                          <SelectItem value="false">Non-US Person</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="revocable">Trust Structure</Label>
                      <Select>
                        <SelectTrigger id="revocable">
                          <SelectValue placeholder="Select structure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Revocable</SelectItem>
                          <SelectItem value="false">Irrevocable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grantorTrust">Grantor Status</Label>
                      <Select>
                        <SelectTrigger id="grantorTrust">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Grantor Trust</SelectItem>
                          <SelectItem value="false">Non-Grantor Trust</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="formedToInvest">Formed to Invest</Label>
                      <Select>
                        <SelectTrigger id="formedToInvest">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mailing Address</CardTitle>
                  <CardDescription>Primary mailing address for the trust</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input id="street" placeholder="Enter street address" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="suite">Suite/Apt</Label>
                      <Input id="suite" placeholder="Enter suite or apt number" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter city" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ca">California</SelectItem>
                          <SelectItem value="de">Delaware</SelectItem>
                          <SelectItem value="ny">New York</SelectItem>
                          {/* Add more states */}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="Enter ZIP code" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs remain the same */}

          </Tabs>
        </div>

        {/* Team Management side panel stays the same */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage team members and their roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>

              {/* Team members list */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AccountManagement;
