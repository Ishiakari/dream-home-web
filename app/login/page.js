'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LogInModal from '@/components/auth/LogInModal';
import SignUpModal from '@/components/auth/SignUpModal';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read the ?next= param so we redirect back to the right place after login
  const redirectTo = searchParams.get('next') || '/';

  const [showSignup, setShowSignup] = useState(false);

  // Closing the modal takes the user back to home (since there's no "background" page)
  const handleClose = () => {
    router.push('/');
  };

  return (
    <>
      <LogInModal
        isOpen={!showSignup}
        onClose={handleClose}
        onSwitchToSignup={() => setShowSignup(true)}
        redirectTo={redirectTo}
      />
      <SignUpModal
        isOpen={showSignup}
        onClose={handleClose}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    </>
  );
}
