"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TrustAccountFormData, TeamMemberFormData } from "@/lib/validations/account";
import { trustAccountSchema, teamMemberSchema } from "@/lib/validations/account";

export async function updateTrustAccount(accountId: string, data: TrustAccountFormData) {
  try {
    // Validate the input data
    const validatedData = trustAccountSchema.parse(data);
    
    const supabase = createClient();

    // TODO: Implement actual update logic
    // const { error } = await supabase
    //   .from("accounts")
    //   .update({
    //     trust_type: validatedData.trustType,
    //     tax_id: validatedData.taxId,
    //     formation_date: validatedData.formationDate,
    //     tax_year_end: validatedData.taxYearEnd,
    //     us_person_status: validatedData.usPersonStatus,
    //     trust_structure: validatedData.trustStructure,
    //     grantor_status: validatedData.grantorStatus,
    //     formed_to_invest: validatedData.formedToInvest,
    //     mailing_address: validatedData.mailingAddress,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq("id", accountId);

    // if (error) throw error;

    revalidatePath(`/accounts/${accountId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating trust account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update account",
    };
  }
}

export async function addTeamMember(accountId: string, data: TeamMemberFormData) {
  try {
    // Validate the input data
    const validatedData = teamMemberSchema.parse(data);
    
    const supabase = createClient();

    // TODO: Implement actual team member addition logic
    // const { error } = await supabase
    //   .from("account_team_members")
    //   .insert({
    //     account_id: accountId,
    //     email: validatedData.email,
    //     role: validatedData.role,
    //     created_at: new Date().toISOString(),
    //   });

    // if (error) throw error;

    revalidatePath(`/accounts/${accountId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error adding team member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add team member",
    };
  }
}

export async function removeTeamMember(accountId: string, teamMemberId: string) {
  try {
    const supabase = createClient();

    // TODO: Implement actual team member removal logic
    // const { error } = await supabase
    //   .from("account_team_members")
    //   .delete()
    //   .eq("id", teamMemberId)
    //   .eq("account_id", accountId);

    // if (error) throw error;

    revalidatePath(`/accounts/${accountId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error removing team member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove team member",
    };
  }
}

export async function updateTeamMemberRole(
  accountId: string,
  teamMemberId: string,
  role: TeamMemberFormData["role"]
) {
  try {
    const supabase = createClient();

    // TODO: Implement actual role update logic
    // const { error } = await supabase
    //   .from("account_team_members")
    //   .update({
    //     role,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq("id", teamMemberId)
    //   .eq("account_id", accountId);

    // if (error) throw error;

    revalidatePath(`/accounts/${accountId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating team member role:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update role",
    };
  }
}
