import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Brain, BarChart3, Lock } from 'lucide-react';
import { ENDPOINTS } from '@/api/api';

export default function ConsentModal({ open, onClose, onConsent }) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!accepted) {
      return;
    }

    setLoading(true);
    try {
      // Only post to server if user is authenticated (has token)
      const token = localStorage.getItem('token');
      if (token) {
        await axiosInstance.post(ENDPOINTS.consentUpdate, {
          consented: true,
          consent_text: 'I consent to AI processing and anonymous data collection for service improvement'
        });
      }
      onConsent(true);
      onClose();
    } catch (error) {
      console.error('Consent update failed:', error);
      // Still call onConsent to store locally even if server update fails
      onConsent(true);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      // Only post to server if user is authenticated (has token)
      const token = localStorage.getItem('token');
      if (token) {
        await axiosInstance.post(ENDPOINTS.consentUpdate, {
          consented: false,
          consent_text: 'Declined AI processing consent'
        });
      }
      onConsent(false);
    } catch (error) {
      console.error('Consent update failed:', error);
      // Still call onConsent to store locally even if server update fails
      onConsent(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} modal={true}>
      <DialogContent 
        className="max-w-3xl bg-card border border-border rounded-xl shadow-soft" 
        style={{ 
          maxHeight: '90vh',
          overflow: 'auto',
          padding: window.innerWidth <= 768 ? '1.5rem' : '2.5rem',
          zIndex: 9999,
          width: window.innerWidth <= 768 ? '95%' : 'auto',
          margin: window.innerWidth <= 768 ? '1rem' : 'auto'
        }}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl mb-6 text-foreground">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                <Shield size={28} className="text-primary" />
              </div>
              Your Privacy & Consent
            </div>
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-muted-foreground">
            Impify uses AI to transform your study materials. We value your privacy and want to be transparent about how we process your data.
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <h3 className="text-xl font-bold mb-6 text-foreground">
            What we collect:
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 p-4 bg-muted/5 border border-border rounded-lg">
              <Brain size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-2 text-foreground">AI Processing</p>
                <p className="text-sm text-muted-foreground">
                  Your uploaded PDFs are processed using AI (GPT-5/Gemini) to generate study notes. Documents are not stored permanently after processing.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-muted/5 border border-border rounded-lg">
              <BarChart3 size={20} className="text-accent mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-2 text-foreground">Anonymous Analytics</p>
                <p className="text-sm text-muted-foreground">
                  We collect anonymous usage data (clicks, time spent, features used) to improve the platform. No personal information is shared.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-muted/5 border border-border rounded-lg">
              <Lock size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-2 text-foreground">Data Security</p>
                <p className="text-sm text-muted-foreground">
                  All data is encrypted in transit and at rest. You can delete your notes anytime, and we'll remove them permanently.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-400 font-medium leading-relaxed">
              <strong>Important:</strong> By using Impify, you help us test and improve our AI study assistant. You can change your preferences anytime in Settings.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-primary/5 border border-primary/20 rounded-lg mb-6">
          <Checkbox 
            id="consent-checkbox" 
            checked={accepted}
            onCheckedChange={setAccepted}
            className="mt-1"
          />
          <label 
            htmlFor="consent-checkbox" 
            className="text-sm font-semibold cursor-pointer select-none leading-relaxed text-foreground"
          >
            I understand and consent to AI processing and anonymous data collection for improving this service
          </label>
        </div>

        <DialogFooter className="gap-4">
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={loading}
            className="border border-destructive/30 text-destructive hover:bg-destructive/5 px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? 'Processing...' : 'Decline'}
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!accepted || loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Accept & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
