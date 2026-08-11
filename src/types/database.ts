// Run: npx supabase gen types typescript --project-id your-project-ref > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; role: string; created_at: string; updated_at: string };
        Insert: { id: string; role?: string };
        Update: { id?: string; role?: string; created_at?: string; updated_at?: string };
        Relationships: never[];
      };
      profiles: {
        Row: {
          id: string;
          membership_id: string | null;
          full_name: string;
          gender: string | null;
          phone: string | null;
          profile_photo_url: string | null;
          county: string | null;
          date_joined: string | null;
          membership_status: string;
          university: string | null;
          department: string | null;
          academic_level: string | null;
          committee_id: string | null;
          skills: string[] | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          rwanda_province: string | null;
          rwanda_district: string | null;
          rwanda_sector: string | null;
          must_change_password: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: { id: string; full_name?: string; must_change_password?: boolean };
        Update: {
          id?: string;
          membership_id?: string | null;
          full_name?: string;
          gender?: string | null;
          phone?: string | null;
          profile_photo_url?: string | null;
          county?: string | null;
          date_joined?: string | null;
          membership_status?: string;
          university?: string | null;
          department?: string | null;
          academic_level?: string | null;
          committee_id?: string | null;
          skills?: string[] | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          rwanda_province?: string | null;
          rwanda_district?: string | null;
          rwanda_sector?: string | null;
          must_change_password?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: never[];
      };
      committees: {
        Row: { id: string; name: string; description: string | null; head_id: string | null; is_active: boolean; created_at: string; updated_at: string };
        Insert: { name: string; description?: string };
        Update: { id?: string; name?: string; description?: string | null; head_id?: string | null; is_active?: boolean; created_at?: string; updated_at?: string };
        Relationships: never[];
      };
      leadership: {
        Row: { id: string; profile_id: string | null; position: string; academic_year: string; is_current: boolean; photo_url: string | null; bio: string | null; created_at: string; updated_at: string };
        Insert: { position: string; academic_year: string };
        Update: { id?: string; profile_id?: string | null; position?: string; academic_year?: string; is_current?: boolean; photo_url?: string | null; bio?: string | null; created_at?: string; updated_at?: string };
        Relationships: [
          {
            foreignKeyName: "leadership_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      events: {
        Row: { id: string; title: string; slug: string; description: string | null; event_type: string; status: string; start_datetime: string; end_datetime: string | null; location: string | null; cover_image_url: string | null; is_registration_required: boolean; max_attendees: number | null; created_by: string | null; created_at: string; updated_at: string };
        Insert: { title: string; slug: string; start_datetime: string };
        Update: { id?: string; title?: string; slug?: string; description?: string | null; event_type?: string; status?: string; start_datetime?: string; end_datetime?: string | null; location?: string | null; cover_image_url?: string | null; is_registration_required?: boolean; max_attendees?: number | null; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: never[];
      };
      event_registrations: {
        Row: { id: string; event_id: string; profile_id: string; attended: boolean; registered_at: string };
        Insert: { event_id: string; profile_id: string };
        Update: { id?: string; event_id?: string; profile_id?: string; attended?: boolean; registered_at?: string };
        Relationships: never[];
      };
      news: {
        Row: { id: string; title: string; slug: string; content: string | null; category: string; status: string; cover_image_url: string | null; author_id: string | null; published_at: string | null; created_at: string; updated_at: string };
        Insert: { title: string; slug: string };
        Update: { id?: string; title?: string; slug?: string; content?: string | null; category?: string; status?: string; cover_image_url?: string | null; author_id?: string | null; published_at?: string | null; created_at?: string; updated_at?: string };
        Relationships: never[];
      };
      gallery_albums: {
        Row: { id: string; title: string; description: string | null; cover_photo_url: string | null; is_published: boolean; created_by: string | null; created_at: string; updated_at: string };
        Insert: { title: string };
        Update: { id?: string; title?: string; description?: string | null; cover_photo_url?: string | null; is_published?: boolean; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: never[];
      };
      gallery_photos: {
        Row: { id: string; album_id: string; url: string; caption: string | null; uploaded_by: string | null; created_at: string };
        Insert: { album_id: string; url: string };
        Update: { id?: string; album_id?: string; url?: string; caption?: string | null; uploaded_by?: string | null; created_at?: string };
        Relationships: never[];
      };
      documents: {
        Row: { id: string; title: string; description: string | null; category: string; file_url: string; file_size: number | null; is_public: boolean; uploaded_by: string | null; created_at: string; updated_at: string };
        Insert: { title: string; file_url: string };
        Update: { id?: string; title?: string; description?: string | null; category?: string; file_url?: string; file_size?: number | null; is_public?: boolean; uploaded_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: never[];
      };
      notifications: {
        Row: { id: string; profile_id: string; title: string; message: string | null; is_read: boolean; link: string | null; created_at: string };
        Insert: { profile_id: string; title: string; message?: string | null; link?: string | null; is_read?: boolean };
        Update: { id?: string; profile_id?: string; title?: string; message?: string | null; is_read?: boolean; link?: string | null; created_at?: string };
        Relationships: never[];
      };
      contact_messages: {
        Row: { id: string; full_name: string; email: string; subject: string | null; message: string; is_read: boolean; created_at: string };
        Insert: { full_name: string; email: string; message: string; subject?: string | null };
        Update: { id?: string; full_name?: string; email?: string; subject?: string | null; message?: string; is_read?: boolean; created_at?: string };
        Relationships: never[];
      };
      settings: {
        Row: { key: string; value: Json; updated_by: string | null; updated_at: string };
        Insert: { key: string; value: Json; updated_by?: string | null };
        Update: { key?: string; value?: Json; updated_by?: string | null; updated_at?: string };
        Relationships: never[];
      };
      email_logs: {
        Row: { id: string; to: string; subject: string; type: string; status: string; error: string | null; created_at: string };
        Insert: { to: string; subject: string; type: string; status: string; error?: string | null };
        Update: never;
        Relationships: never[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_role: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
