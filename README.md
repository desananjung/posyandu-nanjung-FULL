# Posyandu 6 SPM Desa Nanjung - FULL VERSION (Sama dengan Meta AI Share)

Ini versi FULL yang sama persis dengan link share: https://www.meta.ai/share/a/fbf81dd7-b141-4f16-ac8d-be002c626154

## Fitur FULL
- Login 3 role: Admin Desa (admin/desa123), Koordinator (koord/koord123), Kader (kader01/kader123)
- Sidebar lengkap: Dashboard, Input Kegiatan, Data Sasaran, 6 Bidang SPM
- Monitoring, Laporan V2, Manajemen User, Pengaturan Desa
- Mode Pratinjau Lokal (tanpa backend, siap ekspor JSON/CSV)
- Opsional Supabase untuk sync cloud

## Deploy ke Vercel (1 klik)

1. Push folder ini ke GitHub:
```bash
git init
git branch -M main
git add .
git commit -m "deploy full"
git remote add origin https://github.com/USERNAME/posyandu-nanjung-full.git
git push -u origin main
```

2. Buka https://vercel.com/new
3. Import repo tersebut
4. Framework Preset: Vite
5. Env Vars (kosongkan dulu jika mau mode demo offline):
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
6. Klik Deploy - selesai dalam 1 menit online!

Link online nanti jadi: https://posyandu-nanjung-full.vercel.app

## Local Dev
```bash
npm install --legacy-peer-deps
npm run dev
```
Buka http://localhost:5173
