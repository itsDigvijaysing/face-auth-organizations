# Face Auth Organization Clients

Demo frontends for organization-specific face authentication. Each app talks to the third-party authentication backend on port 5000.

## Projects

- `zomato/` — React client
- `tiktok/` — Angular client

## Prerequisites

1. Run the authentication backend locally on `http://localhost:5000`
2. Configure the organization ID used by your backend tenant

## Zomato (React)

```bash
cd zomato
cp .env.example .env
npm install
npm start
```

Environment variables:

- `REACT_APP_API_BASE_URL` — backend base URL (default `http://localhost:5000`)
- `REACT_APP_ORGANIZATION_ID` — organization identifier

## TikTok (Angular)

```bash
cd tiktok
npm install
ng serve
```

Update `tiktok/src/environments/environment.ts` for local API settings. Production values live in `environment.prod.ts`.

## API Endpoints

- `POST /login-req` — request login token for an email
- `POST /login` — submit email, token, organization, and face image
