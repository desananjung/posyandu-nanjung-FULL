#!/bin/bash
echo "=== DEPLOY FULL POSYANDU 6 SPM ==="
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi
git add .
git commit -m "feat: Posyandu 6 SPM FULL V3 - sama dengan Meta AI Share"
echo ""
echo "Buat repo baru di github.com/new dengan nama posyandu-nanjung-full"
read -p "Masukkan URL GitHub repo (https://github.com/USERNAME/posyandu-nanjung-full.git): " repo_url
if [ -z "$repo_url" ]; then echo "URL kosong"; exit 1; fi
git remote remove origin 2>/dev/null
git remote add origin $repo_url
git push -u origin main
echo ""
echo "=== PUSH SELESAI ==="
echo "Lanjut deploy di Vercel:"
echo "1. Buka https://vercel.com/new"
echo "2. Import repo posyandu-nanjung-full"
echo "3. Framework: Vite"
echo "4. Env Vars (optional untuk online):"
echo "   VITE_SUPABASE_URL"
echo "   VITE_SUPABASE_ANON_KEY"
echo "5. Deploy"
