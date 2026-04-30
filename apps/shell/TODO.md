Follow the steps below to finish setting up your application.

## Auth

The shell uses [Auth.js](https://authjs.dev/) with a Credentials provider.
No external IdP is configured by default — sign in with the demo account:

- Username: `rift-demo`
- Password: `demo`

The demo user's `id` matches the seeded player's `subjectId`, so the API
resolves the signed-in player without any extra mapping.

```env
// .env
AUTH_SECRET=<generate with: npx auth secret>
```

> \[!NOTE]
> Login route is `http://localhost:3000/login`.
> Logout route is `http://localhost:3000/api/auth/signout`.

