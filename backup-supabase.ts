
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://vlgoyylvlhveqlgecrzg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZ295eWx2bGh2ZXFsZ2VjcnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNTQzNjcsImV4cCI6MjA3OTYzMDM2N30.0eKf5p1RsdY-lW-gcdIQmcPi_eKvqmH1L793-xW0I7Y';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function backup() {
    console.log("Iniciando backup do Supabase...");
    const tables = ['system_settings', 'user_progress', 'knowledge_base'];
    const backupData: Record<string, any> = {};

    for (const table of tables) {
        console.log(`Buscando dados da tabela: ${table}...`);
        try {
            const { data, error } = await supabase.from(table).select('*');
            if (error) {
                console.error(`Erro na tabela ${table}:`, error.message);
                backupData[table] = { error: error.message };
            } else {
                console.log(`Sucesso! ${data?.length || 0} registros encontrados em ${table}.`);
                backupData[table] = data;
            }
        } catch (err: any) {
            console.error(`Exceção na tabela ${table}:`, err.message);
            backupData[table] = { error: err.message };
        }
    }

    const fileName = 'supabase_backup.json';
    fs.writeFileSync(fileName, JSON.stringify(backupData, null, 2));
    console.log(`\nBackup concluído! Arquivo salvo como: ${fileName}`);
}

backup();
