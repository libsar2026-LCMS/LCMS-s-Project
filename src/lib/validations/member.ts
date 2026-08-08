import { z } from "zod";

export const profileSchema = z.object({
  full_name:               z.string().min(2, "Name must be at least 2 characters"),
  phone:                   z.string().nullable().optional(),
  gender:                  z.string().nullable().optional(),
  county:                  z.string().nullable().optional(),
  university:              z.string().nullable().optional(),
  department:              z.string().nullable().optional(),
  academic_level:          z.string().nullable().optional(),
  emergency_contact_name:  z.string().nullable().optional(),
  emergency_contact_phone: z.string().nullable().optional(),
  profile_photo_url:       z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  rwanda_province:         z.string().nullable().optional(),
  rwanda_district:         z.string().nullable().optional(),
  rwanda_sector:           z.string().nullable().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
