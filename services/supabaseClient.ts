
import { createClient } from '@supabase/supabase-js';

// Prioritiza variáveis de ambiente, com fallback para as chaves atuais
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ynttwyrhocfbfqgawhqq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludHR3eXJob2NmYmZxZ2F3aHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTkwNDIsImV4cCI6MjA5MTMzNTA0Mn0.2ZX0hhWbvffRNQTGF1u-B6XM3_kf8emYUI38pdMZ5H0';

if (!supabaseUrl || supabaseUrl.includes('ynttwyrhocfbfqgawhqq')) {
    console.info("✅ Conectado ao novo projeto Supabase 'ynttwyrhocfbfqgawhqq'.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
