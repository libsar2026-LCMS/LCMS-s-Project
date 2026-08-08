"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, CheckCircle, User } from "lucide-react";
import { updateProfile } from "@/actions/members";
import { profileSchema, type ProfileInput } from "@/lib/validations/member";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
interface Props { profile: Profile }

const GENDERS        = [{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Prefer not to say" }];
const ACADEMIC_LEVELS = [{ value: "undergraduate", label: "Undergraduate" }, { value: "postgraduate", label: "Postgraduate" }, { value: "phd", label: "PhD" }, { value: "alumni", label: "Alumni" }];

// Rwanda provinces and their districts (focused on Kigali & Southern Province / Nyanza)
const RWANDA_DISTRICTS: Record<string, string[]> = {
  "Kigali City":       ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Southern Province": ["Nyanza", "Huye", "Gisagara", "Kamonyi", "Muhanga", "Nyamagabe", "Nyaruguru", "Ruhango"],
  "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Eastern Province":  ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
  "Western Province":  ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rutsiro", "Rusizi"],
};

// Sectors for Nyanza District and Kigali areas
const RWANDA_SECTORS: Record<string, string[]> = {
  Nyanza:      ["Busasamana", "Cyabakamyi", "Kibirizi", "Kigoma", "Mukingo", "Muyira", "Ntyazo", "Nyagisozi", "Rwabicuma"],
  Gasabo:      ["Bumbogo", "Gatsata", "Gikomero", "Gisozi", "Jabana", "Jali", "Kacyiru", "Kimihurura", "Kimironko", "Kinyinya", "Ndera", "Nduba", "Remera", "Rusororo", "Rutunga"],
  Kicukiro:    ["Gahanga", "Gatenga", "Gikondo", "Kagarama", "Kanombe", "Kicukiro", "Kigarama", "Masaka", "Niboye", "Nyarugunga"],
  Nyarugenge:  ["Gitega", "Kanyinya", "Kigali", "Kimisagara", "Mageragere", "Muhima", "Nyakabanda", "Nyamirambo", "Nyarugenge", "Rwezamenyo"],
};

export function ProfileForm({ profile }: Props) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile.profile_photo_url);
  const [success, setSuccess]           = useState(false);
  const [serverError, setServerError]   = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name:               profile.full_name,
      phone:                   profile.phone,
      gender:                  profile.gender,
      county:                  profile.county,
      university:              profile.university,
      department:              profile.department,
      academic_level:          profile.academic_level,
      emergency_contact_name:  profile.emergency_contact_name,
      emergency_contact_phone: profile.emergency_contact_phone,
      profile_photo_url:       profile.profile_photo_url ?? "",
      rwanda_province:         profile.rwanda_province,
      rwanda_district:         profile.rwanda_district,
      rwanda_sector:           profile.rwanda_sector,
    },
  });

  const photoUrl         = watch("profile_photo_url");
  const selectedProvince = watch("rwanda_province");
  const selectedDistrict = watch("rwanda_district");
  const displayPhoto     = photoUrl || photoPreview;

  const availableDistricts = selectedProvince ? (RWANDA_DISTRICTS[selectedProvince] ?? []) : [];
  const availableSectors   = selectedDistrict ? (RWANDA_SECTORS[selectedDistrict] ?? []) : [];

  async function onSubmit(data: ProfileInput) {
    setServerError("");
    setSuccess(false);
    const result = await updateProfile(data);
    if (result.error) setServerError(result.error);
    else {
      setSuccess(true);
      setPhotoPreview(data.profile_photo_url || null);
    }
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Photo */}
      <div className="flex items-start gap-5">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-4 ring-border">
          {displayPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayPhoto} alt="Profile" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User size={28} className="text-primary/30" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="mb-1.5 font-semibold text-text-primary">{profile.full_name}</p>
          <p className="mb-2 text-xs text-text-secondary">{profile.membership_id ?? "Member"}</p>
          <input
            {...register("profile_photo_url")}
            placeholder="https://example.com/your-photo.jpg"
            className={inputCls}
          />
          {errors.profile_photo_url && (
            <p className="mt-1 text-xs text-accent">{errors.profile_photo_url.message}</p>
          )}
          <p className="mt-1 text-[11px] text-text-secondary">Paste a public image URL for your profile photo</p>
        </div>
      </div>

      {/* Personal info */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Personal Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Full name</label>
            <input {...register("full_name")} className={inputCls} />
            {errors.full_name && <p className="mt-1 text-xs text-accent">{errors.full_name.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Phone number</label>
            <input {...register("phone")} placeholder="+250 000 000 000" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Gender</label>
            <select {...register("gender")} className={inputCls}>
              <option value="">Select gender</option>
              {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">County of origin</label>
            <input {...register("county")} placeholder="e.g. Montserrado" className={inputCls} />
          </div>
        </div>
      </section>

      {/* Academic info */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Academic Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">University</label>
            <input {...register("university")} placeholder="Your university" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Department / Faculty</label>
            <input {...register("department")} placeholder="e.g. Computer Science" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Academic level</label>
            <select {...register("academic_level")} className={inputCls}>
              <option value="">Select level</option>
              {ACADEMIC_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Rwanda address */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Rwanda Address</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Province</label>
            <select {...register("rwanda_province")} className={inputCls}>
              <option value="">Select province</option>
              {Object.keys(RWANDA_DISTRICTS).map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">District</label>
            <select {...register("rwanda_district")} className={inputCls} disabled={!selectedProvince}>
              <option value="">Select district</option>
              {availableDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Sector</label>
            <select {...register("rwanda_sector")} className={inputCls} disabled={!selectedDistrict}>
              <option value="">Select sector</option>
              {availableSectors.length > 0
                ? availableSectors.map((s) => <option key={s} value={s}>{s}</option>)
                : selectedDistrict
                  ? <option value={selectedDistrict + " (sector)"}>{selectedDistrict} area</option>
                  : null}
            </select>
          </div>
        </div>
      </section>

      {/* Emergency contact */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Emergency Contact</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Contact name</label>
            <input {...register("emergency_contact_name")} placeholder="Full name" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Contact phone</label>
            <input {...register("emergency_contact_phone")} placeholder="+250 000 000 000" className={inputCls} />
          </div>
        </div>
      </section>

      {serverError && (
        <div className="rounded-xl border border-accent/20 bg-accent/8 px-4 py-3 text-sm text-accent">{serverError}</div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success/8 px-4 py-3 text-sm text-success">
          <CheckCircle size={16} /> Profile updated successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Save size={15} />
        {isSubmitting ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
