import { useState, type FormEvent } from 'react';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/primitives';

// Full-screen sign-in. Rendered by AuthGate whenever there's no session, so it
// stands alone (no TopNav / Shell around it).
export function Login() {
  const signIn = useAuth((s) => s.signIn);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn(username, password);
    if (res.error) {
      setError(res.error);
      setBusy(false);
    }
    // On success the auth store flips to 'signedIn' and AuthGate swaps us out
    // for the app — no navigation needed here.
  }

  return (
    <div className="min-h-screen grid place-items-center bg-cream px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center bg-amber-600 font-serif text-[15px] font-bold leading-none text-white">
            C
          </span>
          <span className="font-serif text-[18px] font-semibold text-ink">
            C# Course
          </span>
        </div>

        <div className="border border-hairline bg-white p-7 shadow-sm">
          <h1 className="font-serif text-h2 text-ink">Sign in</h1>
          <p className="mt-1.5 text-caption text-ink-400">
            Enter the username and password your instructor gave you.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-caption font-semibold text-ink"
              >
                Username or email
              </label>
              <input
                id="username"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-hairline bg-white px-3 py-2.5 text-body text-ink focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-caption font-semibold text-ink"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-hairline bg-white px-3 py-2.5 text-body text-ink focus:border-amber-600 focus:outline-none"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="border-l-2 border-err bg-err-soft/40 px-3 py-2 text-caption text-err-text"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              tone="primary"
              size="lg"
              block
              disabled={busy || !username || !password}
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-5 border-t border-hairline pt-4 text-caption text-ink-400 space-y-2">
            <p className="font-semibold text-ink">How to log in</p>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Your instructor gives you a username and a password.</li>
              <li>Type them in the boxes above, exactly as written.</li>
              <li>Tap <span className="font-semibold text-ink">Sign in</span>.</li>
            </ol>
            <p>
              Passwords are case-sensitive — capital and small letters matter, and
              don&apos;t add spaces. Login not working? Ask your instructor.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-caption text-ink-400">
          C# Course · crafted by Kiran Javvaji
        </p>
      </div>
    </div>
  );
}
