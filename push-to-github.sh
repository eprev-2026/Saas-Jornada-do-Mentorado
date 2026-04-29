#!/bin/bash

# Configurações
TOKEN="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"
REPO_URL="github.com/eprev-2026/Saas-Jornada-do-Mentorado"
USER_NAME="eprev-2026"
USER_EMAIL="equipe@escolapraticaprevidenciaria.com"

echo "🚀 Iniciando configuração do Git e Push manual..."

# Configurar identidade do Git
git config --global user.email "$USER_EMAIL"
git config --global user.name "$USER_NAME"

# Inicializar repositório se não existir
if [ ! -d ".git" ]; then
    git init
    echo "✅ Repositório Git inicializado."
fi

# Adicionar arquivos
git add .

# Criar commit
git commit -m "Deploy manual via AI Studio - V16"

# Configurar o remote com o token para autenticação
# Formato: https://<token>@github.com/<user>/<repo>.git
REMOTE_URL="https://$TOKEN@$REPO_URL.git"

# Remover remote antigo se existir e adicionar o novo
git remote remove origin 2>/dev/null
git remote add origin "$REMOTE_URL"

# Forçar o push para a branch main
echo "📤 Enviando arquivos para o GitHub..."
git push -u origin master --force || git push -u origin main --force

echo "🏁 Processo finalizado!"
