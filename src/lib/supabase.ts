import { createClient } from "@supabase/supabase-js"

const options = {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' },
  },
}

export const supabase = createClient(
  "https://ppnelpqockhwtepvpnyw.supabase.co", 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbmVscHFvY2tod3RlcHZwbnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE2Mjg4MjAsImV4cCI6MTk4NzIwNDgyMH0.fC0vUw7YvZjcJ5koEbMnnoXOa-JgO7thsnMujwCKOH8",
  options
  )