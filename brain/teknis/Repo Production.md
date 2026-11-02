# Repo production (kolavo.app)

Prototipe desain ada di repo ini (`nandhakolavo-dev/kolavo-dev`, folder `Redesign/`). Aplikasi yang
benar-benar tayang di **kolavo.app** ada di repo terpisah milik Dev Lead (Satria Winarah):

| | |
|---|---|
| Repo | **https://github.com/satriawinarah/kolavo** (privat) |
| Akses kita | akun GitHub `nandhakolavo-dev`, izin **WRITE** (boleh push branch & buka PR, merge oleh Satria) |
| Deploy | Vercel, otomatis dari branch **`main`** → production kolavo.app. Branch lain → Preview. |
| Reviewer | `satriawinarah` |

## Stack singkat

Next.js 16 (App Router) + TypeScript, Tailwind CSS 4, shadcn/ui, next-intl (teks di `messages/id/*.json`).
API: Hono di `server/` (SQL mentah ke Postgres), dipasang di `/api/v1`. Aturan kerja wajib dibaca:
`AGENTS.md` dan `docs/engineering-playbook.md` di repo itu; kontrak API di `docs/api/openapi.yaml`.

## Alur dari prototipe ke production

1. Ubah & setujui dulu di prototipe (`Redesign/`, artifact), catat keputusan di `Redesign/REFERENCE.md`.
2. Di repo production: buat branch **dari `main`**, kerjakan versi production-nya.
   - Perubahan API: mulai dari `openapi.yaml` → route → test integrasi (`server/src/integration/`).
   - Perubahan database: berkas migrasi baru bernomor di `server/migrations/` (jangan ubah yang lama).
3. Jalankan `pnpm check` (typecheck, lint, format, unit test, build); test integrasi dengan
   `TEST_DATABASE_URL=… pnpm test:integration`.
4. Push branch, buka PR **ke `main`**, minta review `satriawinarah`, tulis urutan rilisnya di PR.

## Pelajaran yang sudah terjadi

- **PR selalu ke `main`, jangan ditumpuk.** PR yang base-nya branch PR lain (stacked) akan ter-merge ke
  branch itu, bukan ke `main`, kalau PR dasarnya sudah di-merge duluan — fiturnya tidak pernah sampai
  production (kejadian PR #2 → perlu PR #4, Okt 2026). Kalau terpaksa menumpuk, ubah base ke `main`
  begitu PR dasar masuk.
- **Migrasi tidak otomatis.** `pnpm db:migrate` dijalankan manual oleh Satria ke `DATABASE_URL`
  production **sebelum** PR yang membutuhkan kolom baru di-merge; kalau tidak, halaman yang membaca kolom
  itu error.
- **Env baru** (mis. `CRON_SECRET` untuk `/api/v1/jobs/*`) harus ditambahkan Satria di Vercel; tulis di PR.
- **Check Vercel merah di PR kita** = Vercel tidak mengenali akun pembuat commit (`yunandha.i@gmail.com`
  bukan anggota tim Vercel). Bukan error kode; build jalan setelah Satria merge/push.

## Menjalankan lokal (Mac)

```bash
gh repo clone satriawinarah/kolavo kolavo-web && cd kolavo-web
fnm use 24 && corepack enable pnpm && pnpm install
brew install postgresql@16 && brew services start postgresql@16 && createdb kolavo_dev
cp .env.example .env.local   # DATABASE_URL=postgres://localhost/kolavo_dev, JWT_SECRET acak,
                             # DEV_LOGIN=true, ENABLE_DEV_LOGIN=true, APP_URL/CORS_ORIGIN = alamat lokal
DATABASE_URL=postgres://localhost/kolavo_dev pnpm db:migrate && DATABASE_URL=postgres://localhost/kolavo_dev pnpm db:seed
pnpm dev                     # masuk lewat /masuk → "Masuk sebagai Rina Pengurus" (akun seed)
```

Skrip migrasi membaca `server/.env`, bukan `.env.local` — beri `DATABASE_URL` langsung di perintahnya.
Untuk cek visual di pane browser Claude, `pnpm build && pnpm start` lebih stabil daripada `pnpm dev`
(hot-reload sering gagal dan memuat ulang halaman terus).
