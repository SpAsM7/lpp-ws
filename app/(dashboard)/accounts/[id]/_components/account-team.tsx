"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import type { AccountTeamProps, TeamMember } from "@/types/account";
import { teamMemberSchema, type TeamMemberFormData } from "@/lib/validations/account";
import { addTeamMember, removeTeamMember, updateTeamMemberRole } from "@/lib/actions/account";
import { createClient } from "@/lib/supabase/client";

export function AccountTeam({ accountId }: AccountTeamProps) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const supabase = createClient();

  // TODO: Replace with actual data fetching
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "John Smith",
      role: "Signer",
      email: "john@example.com"
    },
    {
      id: "2",
      name: "Jane Doe",
      role: "Admin",
      email: "jane@example.com"
    }
  ];

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      email: "",
      role: undefined,
    },
  });

  function onSubmit(data: TeamMemberFormData) {
    startTransition(async () => {
      const result = await addTeamMember(accountId, data);
      if (result.success) {
        setIsDialogOpen(false);
        form.reset();
      } else {
        // Handle error
        console.error(result.error);
      }
    });
  }

  function handleRemoveMember(teamMemberId: string) {
    startTransition(async () => {
      const result = await removeTeamMember(accountId, teamMemberId);
      if (!result.success) {
        // Handle error
        console.error(result.error);
      }
    });
  }

  function handleRoleChange(teamMemberId: string, role: TeamMemberFormData["role"]) {
    startTransition(async () => {
      const result = await updateTeamMemberRole(accountId, teamMemberId, role);
      if (!result.success) {
        // Handle error
        console.error(result.error);
      }
    });
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Manage team members and their roles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <Icons.UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Invite a new member to join this account's team.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Signer">Signer</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Member
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Team members list */}
        <div className="space-y-4">
          {teamMembers.map(member => (
            <div 
              key={member.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-zinc-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  defaultValue={member.role}
                  onValueChange={(value) => 
                    handleRoleChange(member.id, value as TeamMemberFormData["role"])
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Signer">Signer</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={isPending}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 