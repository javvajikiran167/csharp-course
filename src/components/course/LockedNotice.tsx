import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Check } from 'lucide-react';
import type { Topic } from '@/data/types';
import { useAuth } from '@/store/auth';
import { Breadcrumbs, Button, Display, Eyebrow, Lead } from '@/components/primitives';
import { inline } from '@/lib/inline';

// Shown when a student opens an authored chapter the instructor hasn't unlocked
// for them yet. Lets them send a one-click unlock request and previews what's
// inside so they know what's coming.
export function LockedNotice({ topic }: { topic: Topic }) {
  const pendingRequests = useAuth((s) => s.pendingRequests);
  const requestUnlock = useAuth((s) => s.requestUnlock);
  const [busy, setBusy] = useState(false);
  const requested = pendingRequests.includes(topic.slug);

  async function onRequest() {
    setBusy(true);
    await requestUnlock(topic.slug);
    setBusy(false);
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: topic.title }]} />

      <div className="mt-8 max-w-prose">
        <span className="inline-flex items-center gap-2 text-amber-700">
          <Lock className="h-4 w-4" aria-hidden />
          <Eyebrow>Locked chapter</Eyebrow>
        </span>
        <Display className="mt-2">{topic.title}</Display>
        <Lead className="mt-4">{inline(topic.subtitle)}</Lead>

        <div className="mt-8 border-l-4 border-amber-600 bg-amber-50 px-5 py-4">
          {requested ? (
            <div className="flex items-start gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
              <div>
                <p className="font-semibold text-ink">Request sent</p>
                <p className="mt-1 text-body text-ink-600">
                  Your instructor will unlock this chapter as the class reaches
                  it. Check back soon.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-body text-ink-600">
                This chapter isn&apos;t unlocked for you yet. Your instructor
                releases chapters as the class moves forward.
              </p>
              <div>
                <Button tone="primary" onClick={onRequest} disabled={busy}>
                  {busy ? 'Sending…' : 'Ask instructor to unlock'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {topic.lessons.length > 0 && (
        <section className="mt-12">
          <Eyebrow>What&apos;s inside</Eyebrow>
          <ol className="mt-4 divide-y divide-hairline border-y border-hairline">
            {topic.lessons.map((l) => (
              <li key={l.slug} className="flex items-start gap-5 py-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-hairline bg-cream-200 font-mono text-caption text-ink-400">
                  {`0${l.number}`.slice(-2)}
                </span>
                <div className="flex-1">
                  <div className="font-sans font-semibold text-ink">
                    {inline(l.title)}
                  </div>
                  <p className="mt-1 text-caption leading-relaxed text-ink-400">
                    {inline(l.objective)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-10">
        <Link to="/">
          <Button tone="secondary">← Back to syllabus</Button>
        </Link>
      </div>
    </div>
  );
}
