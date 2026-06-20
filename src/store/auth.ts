import { create } from 'zustand';
import { supabase, usernameToEmail } from '@/lib/supabase';

type Status = 'loading' | 'signedOut' | 'signedIn';

type AuthState = {
  status: Status;
  userId: string | null;
  username: string | null;
  displayName: string | null;
  isAdmin: boolean;
  // Topic slugs the instructor has unlocked for this student.
  grantedTopics: string[];
  // Topic slugs this student has already requested (status = pending) — so the
  // UI can show "Requested" instead of letting them spam the instructor.
  pendingRequests: string[];

  init: () => void;
  signIn: (username: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  reloadProfile: () => Promise<void>;
  requestUnlock: (topicSlug: string) => Promise<{ error?: string }>;
};

const signedOutState = {
  status: 'signedOut' as Status,
  userId: null,
  username: null,
  displayName: null,
  isAdmin: false,
  grantedTopics: [] as string[],
  pendingRequests: [] as string[],
};

let initialized = false;

export const useAuth = create<AuthState>((set, get) => ({
  status: 'loading',
  userId: null,
  username: null,
  displayName: null,
  isAdmin: false,
  grantedTopics: [],
  pendingRequests: [],

  init: () => {
    if (initialized) return;
    initialized = true;

    // Resolve the current session on load, then react to future auth changes
    // (sign in, sign out, token refresh) so the app stays in sync in any tab.
    void get().reloadProfile();
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        set(signedOutState);
      } else {
        void get().reloadProfile();
      }
    });
  },

  reloadProfile: async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      set(signedOutState);
      return;
    }

    const [profileRes, accessRes, reqRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('username, display_name, is_admin')
        .eq('id', user.id)
        .single(),
      supabase.from('topic_access').select('topic_slug').eq('student_id', user.id),
      supabase
        .from('unlock_requests')
        .select('topic_slug')
        .eq('student_id', user.id)
        .eq('status', 'pending'),
    ]);

    set({
      status: 'signedIn',
      userId: user.id,
      username: profileRes.data?.username ?? null,
      displayName: profileRes.data?.display_name ?? null,
      isAdmin: profileRes.data?.is_admin ?? false,
      grantedTopics: (accessRes.data ?? []).map((r) => r.topic_slug),
      pendingRequests: (reqRes.data ?? []).map((r) => r.topic_slug),
    });
  },

  signIn: async (username, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(username),
      password,
    });
    if (error) {
      // Supabase returns a generic "Invalid login credentials" — keep it
      // student-friendly without leaking which half was wrong.
      return { error: 'Wrong username or password. Please check and try again.' };
    }
    await get().reloadProfile();
    return {};
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set(signedOutState);
  },

  requestUnlock: async (topicSlug) => {
    const userId = get().userId;
    if (!userId) return { error: 'You are not signed in.' };
    // Don't duplicate an existing pending request.
    if (get().pendingRequests.includes(topicSlug)) return {};
    const { error } = await supabase
      .from('unlock_requests')
      .insert({ student_id: userId, topic_slug: topicSlug });
    if (error) return { error: error.message };
    set((s) => ({ pendingRequests: [...s.pendingRequests, topicSlug] }));
    return {};
  },
}));
