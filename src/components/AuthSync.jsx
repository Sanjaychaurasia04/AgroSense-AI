// src/components/AuthSync.jsx
// Place this ONCE inside your Auth0Provider in main.jsx or App.jsx
// It runs after every Auth0 login (Google redirect OR OTP) and syncs
// the user to MongoDB. It is completely invisible — renders nothing.

import { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const API = import.meta.env.VITE_API_URL || 'https://agro-sense-ai-backend.vercel.app';

export default function AuthSync() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const syncedForSub = useRef(null); // tracks which sub we've already synced

  useEffect(() => {
    // Wait until Auth0 has finished loading
    if (isLoading) return;
    // Must be authenticated with a real user object
    if (!isAuthenticated || !user?.sub) return;
    // Don't sync the same user twice in one session
    if (syncedForSub.current === user.sub) return;

    syncedForSub.current = user.sub; // mark immediately to prevent double-fire

    const sync = async () => {
      try {
        console.log('🔄 Syncing user to MongoDB:', user.email);

        const res = await fetch(`${API}/api/users/sync`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            auth0Id: user.sub,
            name:    user.name || user.nickname || user.email.split('@')[0],
            email:   user.email,
            picture: user.picture || '',
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('❌ Sync failed:', data.error);
          syncedForSub.current = null; // allow retry on next render
          return;
        }

        // Persist auth0Id so every other part of the app can use it
        localStorage.setItem('auth0Id', user.sub);
        console.log('✅ User synced to MongoDB:', data.user?.name);
      } catch (err) {
        console.error('❌ Sync error:', err.message);
        syncedForSub.current = null; // allow retry
      }
    };

    sync();
  }, [isLoading, isAuthenticated, user]);

  return null; // renders nothing
}