# Konvo — local setup

Written for: developers joining the Konvo mobile project.

Konvo runs entirely on free tiers. **No payment card is required anywhere**, and that
constraint shapes the architecture — read [Why there is no backend](#why-there-is-no-backend)
before changing anything in `firestore.rules`.

## Expo Go will not work

This project needs a **development build**. Three of its dependencies have no Expo Go
support: `expo-notifications`, `react-native-mmkv` v4 (Nitro native modules), and the
`expo-image-picker` / `expo-contacts` config plugins.

```bash
npx eas build --profile development --platform android   # or ios
```

Install the resulting build on your device, then `yarn start` and connect to it.

## 1. Dependencies

```bash
corepack enable && corepack prepare yarn@4.9.4 --activate
yarn install
```

## 2. Firebase project — free Spark plan

In the [Firebase console](https://console.firebase.google.com):

1. Create the project. **Stay on the free Spark plan.**
2. **Authentication** → _Sign-in method_ → enable **Google** and **Email link
   (passwordless sign-in)**. Do not enable Email/Password — there are no passwords.
3. **Firestore Database** → _Create database_ → production mode → pick a region.
4. **Realtime Database** → _Create database_. This carries presence and typing
   indicators; Firestore has no `onDisconnect` primitive, so without it a force-quit
   would leave a user showing as online indefinitely.
5. **Do not** enable Cloud Storage — it requires the paid Blaze plan on projects
   created after October 2024. Images go to Cloudinary instead (step 4 below).
6. **Project settings → Your apps → Web app** → register one and copy the config.

Then point the CLI at it:

```bash
npx firebase login
npx firebase use --add        # writes .firebaserc
```

### Email-link sign-in: what actually works

Verified against the live project, because the answer is not what the Firebase docs
imply:

| `continueUrl`                         | Result                              |
| ------------------------------------- | ----------------------------------- |
| `konvo://auth/email-link`             | ❌ `auth/unauthorized-continue-uri` |
| `exp://…/--/auth/email-link`          | ❌ `auth/unauthorized-continue-uri` |
| `https://<project>.firebaseapp.com/…` | ✅ accepted                         |

Only an https URL on an authorized domain is allowed, which is why
`buildContinueUrl()` derives it from `authDomain` rather than using a custom scheme.

**Accepting the URL is not the same as the link reopening the app.** Firebase Dynamic
Links — the mechanism that used to do that — has been shut down. Tapping the emailed
link opens a browser until you configure:

- **Android App Links**: register the app's SHA-256 fingerprint in the Firebase
  console (`eas credentials` shows it), then add an `intentFilters` entry for the auth
  domain with `autoVerify: true` in `app.config.ts`.
- **iOS Universal Links**: the associated-domains entitlement for the same domain.

Both need a real build, so neither can be done before the first dev build exists.
Until then the sign-in screen offers a **paste-the-link** fallback, which produces a
genuine account and works everywhere. Delete `completePastedSignInLink` and its UI
once App Links are verified.

## 3. Google sign-in credentials

Google Cloud Console → _APIs & Services_ → _Credentials_ → create OAuth client IDs for
Web, iOS and Android. These go into `.env` as the three `GOOGLE_*_CLIENT_ID` values and
are read by `expo-auth-session`.

## 4. Cloudinary — image hosting

Free tier, 25 GB, no card.

1. Create an account at [cloudinary.com](https://cloudinary.com).
2. _Settings → Upload → Add upload preset_, **signing mode: Unsigned**.
3. Restrict the preset: allowed formats `jpg,png,webp`, max file size 10 MB,
   folder `konvo`.

Those restrictions matter. An unsigned preset ships inside the app, so anyone who
extracts it can upload to your account — the preset's own limits are the only thing
constraining that.

## 5. Environment

```bash
cp .env.example .env
```

Fill in the `FIREBASE_*` values from step 2, `FIREBASE_DATABASE_URL` from the Realtime
Database page, the three `GOOGLE_*_CLIENT_ID` values, and the two `CLOUDINARY_*`
values. `SENTRY_DSN` is optional — leave it blank and Sentry stays disabled rather
than erroring.

## 6. Deploy rules and indexes

```bash
yarn deploy:rules
```

Do this before running the app against a real project. Default Firestore rules deny
everything; the rules in this repo are what grant access.

## 7. Emulators (recommended for day-to-day work)

The Firestore and Database emulators are Java programs, so you need a **JDK 11 or
newer** on `PATH`. Check with `java -version`.

If you do not have one and cannot install system-wide, a portable JRE works — unzip
[Temurin 21](https://adoptium.net/temurin/releases/?package=jre&os=windows) anywhere and
prepend its `bin` to `PATH` for the session. On Windows in Git Bash, convert the path
first or it will be split on the drive-letter colon:

```bash
export PATH="$(cygpath -u 'C:/path/to/jre')/bin:$PATH"
```

```bash
yarn emulators
```

Then set in `.env`:

```
EXPO_PUBLIC_USE_EMULATORS=1
EXPO_PUBLIC_EMULATOR_HOST=localhost   # 10.0.2.2 on an Android emulator
```

The emulator UI is at http://localhost:4000.

## Why there is no backend

Cloud Functions require Firebase's paid Blaze plan, so this project has none. Every
operation a server would have performed is a batched client write instead:

- **Sending a message** writes the message, stamps `lastMessage` on the conversation,
  and increments each other member's unread count — all in one atomic batch, from the
  sender's device.
- **Creating a conversation** writes the conversation document first, then its receipts
  and inbox documents in a second batch.
- **Unread badges** are cleared by the reader.

The consequence is that **`firestore.rules` is the entire authorization model.** There
is no privileged writer to fall back on and no server-side validation. Two deliberate
relaxations are documented in the rules file itself; read the comments there before
editing.

Two things follow from this that are easy to get wrong:

1. **Membership lives on the conversation document** (`memberIds` / `admins`), not in a
   subcollection. Firestore evaluates each write in a batch against the state of the
   database _before_ the batch, so a rule on a child document cannot verify a parent
   that the same batch is creating. Working around that with `!exists(parent)` would let
   anyone pre-seed themselves into a conversation that does not exist yet — and direct
   conversation IDs are deterministic (`dm_<sorted uids>`), so an attacker could squat
   on two specific people's future DM and read it.
2. **Create the conversation document before anything that references it.** Receipts and
   inbox documents go in a second write.

Push notifications are deferred for the same reason: sending one requires a server to
hold the credentials. Messages still arrive instantly while the app is open.

## Verification

```bash
yarn typecheck
yarn lint
yarn test          # jest
yarn test:rules    # security rules against the emulator (needs Java)
npx expo-doctor
```

`yarn test:rules` is the highest-value suite in this project by a wide margin. With no
server, a mistake in `firestore.rules` is a silent data leak that nothing else will
catch. Every change to the rules should land with a test in the same commit.

## Conventions worth knowing

- **Nothing outside `src/services/firebase/` may import from `firebase/*`.** ESLint
  enforces this. The seam is what keeps a future move to a real backend contained.
- **Never put chat data in the `persistedSecured` Redux tree.** It serialises into a
  single `expo-secure-store` key, which warns above 2 KB and can fail outright on
  Android Keystore. Identity only; everything else goes to MMKV.
- **Text components default to dark.** Screens on a photo or teal background must pass
  `ColorTheme.text.inverse` explicitly.
- **Watch the Spark quotas**: 50k Firestore reads and 20k writes per day. Exceeding them
  takes the app down until midnight Pacific — it is an availability limit, not a bill.
  Groups are capped at 20 members because each message costs `memberCount + 2` writes.
- Line endings are LF, enforced by `.gitattributes`.
