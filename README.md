# Rakib frontend

Next.js public site and staff control room for Digital Service.

Pair this with the API in [rakib_backend](https://github.com/teccadoncorp/rakib_backend).

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://127.0.0.1:43123

Set `NEXT_PUBLIC_API_URL` to your backend URL.

## Demo logins

Staff portal `/admin/login`

| Role | Login | Password |
| --- | --- | --- |
| Admin | `admin` / `admin@example.com` | `admin123` |
| Superior | `superior@example.com` | `super123` |
| Distributor | `dist@example.com` | `dist123` |
| Retailer | `retail@example.com` | `retail123` |

Customer portal `/user-login`

| Role | Login | Password |
| --- | --- | --- |
| User | `user@example.com` | `user123` |
| Distributor / Retailer | same emails as above | same passwords |

Distributors and retailers use the user dashboard. The staff panel is extra.
