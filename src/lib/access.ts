import type { Topic } from '@/data/types';

// A topic is "authored" when it has real lesson content (not just a roadmap
// outline). Only authored topics participate in per-student access control —
// outline-only topics stay "coming soon" for everyone because there's nothing
// to unlock yet.
export const isAuthored = (t: Topic) => t.lessons.length > 0;

export type TopicState = 'open' | 'locked' | 'coming-soon';

export type AccessContext = {
  isAdmin: boolean;
  grantedTopics: string[];
};

// The single source of truth for "can this student see this topic right now?"
//  - admins see every authored topic
//  - a student sees an authored topic only if the instructor granted it
//  - un-authored topics are always "coming soon"
export function topicState(t: Topic, ctx: AccessContext): TopicState {
  if (!isAuthored(t)) return 'coming-soon';
  if (ctx.isAdmin) return 'open';
  return ctx.grantedTopics.includes(t.slug) ? 'open' : 'locked';
}

export const isTopicOpen = (t: Topic, ctx: AccessContext) =>
  topicState(t, ctx) === 'open';
