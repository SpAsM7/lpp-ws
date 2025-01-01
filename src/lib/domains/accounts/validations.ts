import * as z from "zod";

export const trustAccountSchema = z.object({
  trustType: z.enum(["living", "testamentary", "charitable", "business"], {
    required_error: "Please select a trust type",
  }),
  taxId: z.string().min(1, "Tax ID is required"),
  formationDate: z.string().min(1, "Formation date is required"),
  taxYearEnd: z.string().regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/, {
    message: "Please enter a valid date in MM/DD format",
  }),
  usPersonStatus: z.boolean({
    required_error: "Please select US person status",
  }),
  trustStructure: z.enum(["Revocable", "Irrevocable"], {
    required_error: "Please select trust structure",
  }),
  grantorStatus: z.enum(["Grantor Trust", "Non-Grantor Trust"], {
    required_error: "Please select grantor status",
  }),
  formedToInvest: z.boolean({
    required_error: "Please select if formed to invest",
  }),
  mailingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    suite: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, {
      message: "Please enter a valid ZIP code",
    }),
  }),
});

export const teamMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["Signer", "Admin", "Editor", "Viewer"], {
    required_error: "Please select a role",
  }),
});

export type TrustAccountFormData = z.infer<typeof trustAccountSchema>;
export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
