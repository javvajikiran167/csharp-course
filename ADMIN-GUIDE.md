# Instructor guide — logins & chapter access

The course now requires a login. You (the instructor) control which **chapters**
each student can see, and you release them one at a time as the class progresses.

## Your login

- **URL:** https://javvajikiran167.github.io/csharp-course/
- **Username:** `instructor`
- **Password:** _provided to you privately — not stored in this repo._ You can change
  it anytime: sign in, or reset it from the Supabase dashboard
  (Authentication → Users → `instructor@class.local`).

When you sign in you'll see a **Console** button in the top bar (students don't).

## Creating a student

1. Open **Console**.
2. Under **Add a student**, type a username (lowercase, no spaces — e.g. `arjun`).
   Optionally set a display name. A password is generated for you (or type your own).
3. Tick any chapters you want unlocked immediately (you can leave all unticked).
4. Click **Create student**. A card shows the **username + password** — click **Copy**
   and hand them to the student. *(The password can't be retrieved later, only reset.)*

## Releasing chapters one by one

In **Console → Students**, each student has a row of chapter chips:

- **Amber chip (open padlock)** = unlocked for that student.
- **Outline chip (closed padlock)** = locked. Click it to unlock; click again to re-lock.

Changes take effect the next time the student loads/refreshes the page.

## Unlock requests (the notification inbox)

When a student opens a locked chapter they can tap **"Ask instructor to unlock."**
That appears under **Console → Unlock requests** with their name and the chapter.
Click **Grant** to unlock it (and clear the request) or **Dismiss** to ignore it.

## What students experience

- They sign in with the username/password you gave them.
- Unlocked chapters work fully (lessons, quizzes, challenges).
- Locked chapters show the chapter outline + an "Ask instructor to unlock" button —
  not the lesson content.
- Chapters with no content yet ("Coming soon") look the same to everyone.

---

### Under the hood (for future-you)

- Auth + data: **Supabase** project `mhwlivofbcxqwoedgikk` (region ap-south-1).
  Tables: `profiles`, `topic_access` (a row = an unlocked chapter), `unlock_requests`.
  Access is enforced server-side by Row Level Security, not just in the UI.
- Privileged actions (create/reset/delete student) run in the `admin-users`
  **Edge Function**, which alone holds the service-role key. Source is in
  `supabase/functions/admin-users/`.
- The site is a static build deployed to the `gh-pages` branch. Public Supabase
  values live in `.env` (safe to commit — protected by RLS).
- **Content note:** gating paces the *experience*. Because lesson text ships in the
  site bundle, a technical student could in principle dig locked text out of the
  JavaScript. Fine for class pacing; if you ever need hard content protection, the
  next step is serving lesson bodies from the database on unlock.
- **Heads-up:** a free Supabase project pauses after ~1 week of zero activity.
  Regular class use keeps it awake; if logins ever fail, un-pause it from the
  Supabase dashboard.
