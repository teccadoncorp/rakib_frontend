# Digital Service

Public website plus a role-aware Express API and an animated staff control room for **Digital Service** (Jaynagar).

The marketing site keeps the original layout, copy, and CSS. Staff, invites, and partner-gated services live on top of that.

## Roles

| Role | How they join | What they can do |
| --- | --- | --- |
| **Admin** | Seeded account | See every customer and application, and edit the full record |
| **Superior** | Admin create endpoint + long `SUPERIOR_CREATE_SECRET` | Almost-admin workspace. No self-signup |
| **Distributor** | Invited by admin (or superior) | Manage their retailers, see tagged applications. No self-signup |
| **Retailer** | Invited by admin, superior, or a distributor | Use their partner ID on gated services. No self-signup |
| **User** | Public signup | Most services. AEPS, all mobile recharge, and PAN need a retailer/distributor ID — or they can show interest while logged in |

Emails go through **Resend** (SMTP or HTTP API): signup verification, forgot-password resets, staff invites, and application status changes. If mail is not configured, the API logs the message and returns the invite link in the staff UI.

## Run locally

**1. Frontend**

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

**2. Backend** (`server/index.js` only — no `src/` folder)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

API listens on [http://127.0.0.1:43124](http://127.0.0.1:43124).

The API is deploy-ready for **Railway** (`Dockerfile`, `railway.toml`) and **Cloudflare** (`wrangler.toml` Workers, or `wrangler.container.toml` + Docker). See `server/README.md`.

### Environment

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://127.0.0.1:43124
NEXT_PUBLIC_SITE_URL=https://sruniquecreation.in

# server/.env
MONGODB_URI=mongodb+srv://USER:PASS@cluster/digital-service
# Atlas Network Access must allow this machine's IP (or 0.0.0.0/0)
JWT_SECRET=your-long-secret
SUPERIOR_CREATE_SECRET=a-long-random-string
FRONTEND_URL=http://127.0.0.1:43123
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_xxxxxxxxx
SMTP_FROM="Digital Service <noreply@your-verified-domain.com>"
SMTP_SECURE=1
RESEND_API_KEY=
```

## Default accounts (local seed)

| Role | Portal | Login | Password | Partner ID |
| --- | --- | --- | --- | --- |
| Admin | `/admin/login` | `admin`, `admin@example.com`, or `7872292614` | env `ADMIN_PASSWORD` (local seed uses that value) | `ADM-0001` |
| Superior | `/admin/login` | `superior@example.com` | `super123` | `SUP-DEMO01` |
| Distributor | `/user-login` and `/admin/login` | `dist@example.com` | `dist123` | `DST-DEMO01` |
| Retailer | `/user-login` and `/admin/login` | `retail@example.com` | `retail123` | `RTL-DEMO01` |
| User | `/user-login` | `user@example.com` or `9000000004` | `user123` | none |

Create a superior from **Staff → Invite** with `SUPERIOR_CREATE_SECRET`.

## Staff CMS

The old PHP admin’s content tools are now in this staff panel:

| Page | What it manages |
| --- | --- |
| **Site settings** | Business name, phone, email, WhatsApp, address, hours, UPI, about copy, copyright, map. These drive the public header, footer, contact page, and payment QR. |
| **Services & docs** | Live catalog: title, slug, description, price, partner gate, and the document checklist used on the website and customer apply form. |
| **Customer enquiries** | Every service application and PVC order, with customer uploads, staff notes, and issued documents (trade licence PDF, reports) that only that customer can download. |

Public pages load `/api/settings` and `/api/services`. If the API is down they fall back to the built-in Jaynagar defaults.

## Partner-gated services

AEPS, All Mobile Recharge, and PAN require an active `DST-` or `RTL-` code. Demo codes: `DST-DEMO01`, `RTL-DEMO01`. Users without a code can submit interest from the apply page.

## SEO and rendering

Public pages (home, services, service details, PVC catalog, about, contact, track, policies) are **server-rendered**. Forms stay as small client islands. Each public page has a unique title, description, canonical URL, Open Graph tags, and JSON-LD. `/sitemap.xml` and `/robots.txt` are generated.

Pretty URLs:

- `/services/gst-registration` (old `?slug=` links redirect here)
- `/pvc-print/aadhaar-pvc`

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` to your live domain so canonical and sitemap URLs stay correct.

## Cloudflare frontend

The Worker name is `rakib-frontend` (`wrangler.jsonc`). Set these in the Cloudflare build:

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
- **Root:** repo root (not `server/`)

Set `NEXT_PUBLIC_API_URL` (or `API_PROXY_URL`) and `NEXT_PUBLIC_SITE_URL` as Cloudflare environment variables.

The staff panel talks to `/api` on the same website, then Next.js proxies to the Express backend. Phones must not call `127.0.0.1` — that address is the phone itself and shows **Failed to fetch**.

On Railway, set `FRONTEND_URL` / `ALLOWED_ORIGINS` to the live site (`https://sruniquecreation.in` and the `www` host if you use it).

## Stack

- Next.js 15 (App Router), original public CSS, Lottie on the staff panel
- Express 5, JWT, Multer, optional MongoDB, Nodemailer SMTP
