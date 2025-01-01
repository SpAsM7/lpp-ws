"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { AccountDetailsProps, TrustAccount } from "@/types/account";
import { trustAccountSchema, type TrustAccountFormData } from "@/lib/validations/account";
import { updateTrustAccount } from "@/lib/actions/account";
import { Icons } from "@/components/icons";

export function AccountDetails({ accountId }: AccountDetailsProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TrustAccountFormData>({
    resolver: zodResolver(trustAccountSchema),
    defaultValues: {
      trustType: undefined,
      taxId: "",
      formationDate: "",
      taxYearEnd: "",
      usPersonStatus: undefined,
      trustStructure: undefined,
      grantorStatus: undefined,
      formedToInvest: undefined,
      mailingAddress: {
        street: "",
        suite: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
  });

  function onSubmit(data: TrustAccountFormData) {
    startTransition(async () => {
      const result = await updateTrustAccount(accountId, data);
      if (!result.success) {
        // Handle error
        console.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Account Details</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Trust Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Trust Details</CardTitle>
                <CardDescription>Basic information about the trust</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="trustType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trust Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trust type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="living">Living Trust</SelectItem>
                            <SelectItem value="testamentary">Testamentary Trust</SelectItem>
                            <SelectItem value="charitable">Charitable Trust</SelectItem>
                            <SelectItem value="business">Business Trust</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tax ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="formationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formation Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxYearEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Year End</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/DD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="usPersonStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>US Person Status</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "true")}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">US Person</SelectItem>
                            <SelectItem value="false">Non-US Person</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trustStructure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trust Structure</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select structure" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Revocable">Revocable</SelectItem>
                            <SelectItem value="Irrevocable">Irrevocable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="grantorStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grantor Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Grantor Trust">Grantor Trust</SelectItem>
                            <SelectItem value="Non-Grantor Trust">Non-Grantor Trust</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="formedToInvest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formed to Invest</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "true")}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
} 