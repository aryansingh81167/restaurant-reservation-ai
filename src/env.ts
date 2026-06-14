const requiredEnvs = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'GROQ_API_KEY'
];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    // If we are just building the app, warn instead of crashing
    if (process.env.npm_lifecycle_event === 'build' || process.env.VERCEL) {
      console.warn(`⚠️ Warning: Missing environment variable during build: ${env}`);
    } else {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  groqApiKey: process.env.GROQ_API_KEY || '',
};
