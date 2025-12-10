import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ConsentModal from '@/components/ConsentModal';

const ConsentPage = () => {
  const { updateConsent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(true);

  const handleConsent = async (consented) => {
    const result = await updateConsent(consented);
    if (result.success) {
      if (consented) {
        // Redirect to intended destination or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        // If declined, still allow access but maybe show a message
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    }
  };

  const handleClose = () => {
    // Don't allow closing without making a choice
    // Could redirect to auth or show a message
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <ConsentModal
        open={showModal}
        onClose={handleClose}
        onConsent={handleConsent}
      />
    </div>
  );
};

export default ConsentPage;