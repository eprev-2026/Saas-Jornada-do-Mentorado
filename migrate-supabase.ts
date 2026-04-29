
import { createClient } from '@supabase/supabase-js';

// CREDENCIAIS ANTIGAS (ORIGEM)
const oldUrl = 'https://vlgoyylvlhveqlgecrzg.supabase.co';
const oldAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZ295eWx2bGh2ZXFsZ2VjcnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNTQzNjcsImV4cCI6MjA3OTYzMDM2N30.0eKf5p1RsdY-lW-gcdIQmcPi_eKvqmH1L793-xW0I7Y';

// CREDENCIAIS NOVAS (DESTINO) - Usando Service Role para garantir escrita
const newUrl = 'https://ynttwyrhocfbfqgawhqq.supabase.co';
const newServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludHR3eXJob2NmYmZxZ2F3aHFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc1OTA0MiwiZXhwIjoyMDkxMzM1MDQyfQ.Bh33SNFzWDBlobY9pOJsH3OxiebvT7muqpcE-hh1nW4';

const oldSupabase = createClient(oldUrl, oldAnonKey);
const newSupabase = createClient(newUrl, newServiceKey);

async function migrate() {
    console.log("🚀 Iniciando migração de dados...");
    const tables = ['system_settings', 'user_progress', 'knowledge_base'];

    for (const table of tables) {
        console.log(`\n--- Tabela: ${table} ---`);
        
        // 1. Buscar dados do antigo
        console.log(`Buscando dados da origem (${oldUrl})...`);
        const { data: oldData, error: fetchError } = await oldSupabase.from(table).select('*');

        if (fetchError) {
            console.error(`❌ Erro ao buscar dados da tabela ${table}:`, fetchError.message);
            if (fetchError.message.includes('fetch failed')) {
                console.error(`⚠️ O projeto antigo parece estar pausado ou inacessível. Não é possível migrar.`);
            }
            continue;
        }

        if (!oldData || oldData.length === 0) {
            console.log(`ℹ️ Nenhum dado encontrado na tabela ${table}.`);
            continue;
        }

        console.log(`✅ ${oldData.length} registros encontrados. Iniciando inserção no destino...`);

        // 2. Inserir no novo
        // Usamos upsert para evitar duplicatas se rodar mais de uma vez
        const { error: insertError } = await newSupabase.from(table).upsert(oldData);

        if (insertError) {
            console.error(`❌ Erro ao inserir dados na tabela ${table}:`, insertError.message);
        } else {
            console.log(`✨ Migração da tabela ${table} concluída com sucesso!`);
        }
    }

    console.log("\n🏁 Processo de migração finalizado.");
}

migrate();
