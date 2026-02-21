# Plan A: Express Proxy Architecture (Documented)

This architecture was designed to provide a secure "Gatekeeper" between the
Frontend and Supabase.

## 🏗️ How it Works

1. **Frontend Isolation**: The React app never talks to Supabase directly. It
   only knows about the Express server (`http://localhost:5000/api`).
2. **The Proxy**:
   - **Authentication**: Express handles sign-up/login and proxies the request
     to Supabase Auth.
   - **Authorization**: Express receives Supabase tokens and verifies them using
     `supabase.auth.getUser()`.
   - **Data**: All product, review, and user fetching happens via Express
     controllers.
3. **Secret Logic**:
   - **Pricing**: The calculation of final prices and totals is done on the
     server, preventing users from manipulating prices in the browser.

## 💾 Components

- `Back-ends/src/app.ts`: Main Express application.
- `Back-ends/src/controllers/`: Logic for Auth, Products, Reviews, and Pricing.
- `Back-ends/src/api/middlewares/authMiddleware.ts`: Verifies user identity for
  every request.

## 🛡️ Security

- **RLS**: Managed on the server level.
- **Tokens**: Forwards the Supabase token for verification.
- **Service Key**: (Optional) Used for admin-level bypasses.

> [!NOTE]
> This architecture is powerful for complex business rules but adds overhead
> (running a second server).
