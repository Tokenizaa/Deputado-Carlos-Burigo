import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { useApp } from '../../context/AppContext';
import { InternalOnboardingView } from './InternalOnboardingView';

export const InternalOnboardingGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  const [checking, setChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!currentUser) {
          if (active) setNeedsOnboarding(false);
          return;
        }

        const client = await getSupabaseClient();
        const { data, error } = await client
          .from('profiles')
          .select('onboarding_completed_at')
          .eq('id', currentUser.id)
          .single();

        if (error) throw error;
        if (active) setNeedsOnboarding(!data?.onboarding_completed_at);
      } catch {
        if (active) setNeedsOnboarding(false);
      } finally {
        if (active) setChecking(false);
      }
    })();

    return () => { active = false; };
  }, [currentUser]);

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#00863f]" />
      </div>
    );
  }

  if (needsOnboarding) return <InternalOnboardingView />;

  return <>{children}</>;
};
