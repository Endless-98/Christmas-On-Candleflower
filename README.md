# Christmas On Candleflower (React + Express)

A lightweight React + Express app set up adjacent to `Gracechase`. Frontend (Vite + React) lives in `client/`, backend (Express) in `server/`. No database required.

## Quick start

Prereqs: Node 18+.

1. Configure envs:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Install deps:

```bash
npm install
```

3. Run dev (two terminals recommended):

- Terminal A (API):

```bash
npm run dev:server --workspace server
```

- Terminal B (Web):

```bash
npm run dev --workspace client
```

Open http://localhost:5173 and the API listens on http://localhost:4000.

## Deploy (overview)
- Frontend: Deploy `client/` with AWS Amplify Hosting in the same AWS Organization/account as `Gracechase`.
- Backend: Deploy `server/` to AWS (options: App Runner, Elastic Beanstalk, ECS Fargate, or Lambda + API Gateway via container). No database required; API uses in-memory state.

Note: The API’s in-memory state is ephemeral and resets on restart. If persistence is needed later, we can add DynamoDB, RDS, or another store.

CI/CD and IaC (CDK) scaffolding can be added later.
