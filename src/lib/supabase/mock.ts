/**
 * Returns true when running with placeholder / no real Supabase credentials.
 */
export function isPreviewMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return !url || url.includes("placeholder") || url.includes("your-project-ref");
}

type AnyChain = any;

function mockQuery(): AnyChain {
  const q: AnyChain = {};
  const noop = () => q;
  const resolve = () => Promise.resolve({ data: [], error: null, count: 0 });
  const resolveSingle = () => Promise.resolve({ data: null, error: null });

  q.select   = noop;
  q.insert   = noop;
  q.update   = noop;
  q.delete   = noop;
  q.upsert   = noop;
  q.eq       = noop;
  q.neq      = noop;
  q.ilike    = noop;
  q.lt       = noop;
  q.lte      = noop;
  q.gte      = noop;
  q.gt       = noop;
  q.in       = noop;
  q.order    = noop;
  q.limit    = noop;
  q.range    = noop;
  q.head     = noop;
  q.single   = resolveSingle;
  q.then     = (fn: AnyChain) => resolve().then(fn);

  return q;
}

export function createMockClient(): any {
  return {
    from: (_table: string) => mockQuery(),
    auth: {
      getUser:               () => Promise.resolve({ data: { user: null }, error: null }),
      getSession:            () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword:    () => Promise.resolve({ data: null, error: null }),
      signUp:                () => Promise.resolve({ data: null, error: null }),
      signOut:               () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      updateUser:            () => Promise.resolve({ data: null, error: null }),
      onAuthStateChange:     () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: (_bucket: string) => ({
        upload:       () => Promise.resolve({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}
