import { createClient } from '@supabase/supabase-js'

  const supabase = createClient(
    'https://dykadwjachlupaaqypei.supabase.co',
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5a2Fkd2phY2hsdXBhYXF5cGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MjU4OTcsImV4cCI6MjA0NzEwMTg5N30.bNRs4pRRps_MmAvXM3bJucQ27zxucnIfqZ1u3GdUz0s"  );


export { supabase }