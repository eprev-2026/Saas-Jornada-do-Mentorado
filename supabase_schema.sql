-- 1. Habilitar a extensão pgvector para busca vetorial
create extension if not exists vector;

-- 2. Tabela de Configurações do Sistema (Workflow, Cronograma, etc)
create table if not exists system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabela de Progresso dos Usuários
create table if not exists user_progress (
  cpf text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabela de Base de Conhecimento (RAG)
create table if not exists knowledge_base (
  id uuid default gen_random_uuid() primary key,
  title text,
  content text,
  embedding vector(1536), -- Dimensão padrão para text-embedding-004
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Função de Busca Vetorial (RPC)
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_base.id,
    knowledge_base.title,
    knowledge_base.content,
    1 - (knowledge_base.embedding <=> query_embedding) as similarity
  from knowledge_base
  where 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- 6. Configurar RLS (Row Level Security) - Opcional, mas recomendado
-- Por enquanto, vamos permitir acesso total para simplificar a migração inicial
alter table system_settings enable row level security;
alter table user_progress enable row level security;
alter table knowledge_base enable row level security;

create policy "Permitir tudo para anon" on system_settings for all using (true) with check (true);
create policy "Permitir tudo para anon" on user_progress for all using (true) with check (true);
create policy "Permitir tudo para anon" on knowledge_base for all using (true) with check (true);
