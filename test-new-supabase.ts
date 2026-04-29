
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ynttwyrhocfbfqgawhqq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludHR3eXJob2NmYmZxZ2F3aHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTkwNDIsImV4cCI6MjA5MTMzNTA0Mn0.2ZX0hhWbvffRNQTGF1u-B6XM3_kf8emYUI38pdMZ5H0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log("Testing connection to NEW Supabase...");
    try {
        // Just a simple health check or select
        const { data, error } = await supabase.from('system_settings').select('key').limit(1);
        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Supabase Success:", data);
        }
    } catch (err) {
        console.error("Fetch Exception:", err);
    }
}

test();
