import { useEffect } from 'react';

interface TurnstileProps {
  siteKey?: string;
  onVerify: (token: string) => void;
}

export const Turnstile = ({ siteKey = "1x00000000000000000000AA" /*process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!*/, onVerify }: TurnstileProps) => {
  useEffect(() => {
    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const callbackName = 'turnstileOnVerify';
    (window as any)[callbackName] = (token: string) => onVerify(token);
  }, [onVerify]);

  return (
    <div
      className="cf-turnstile"
      data-sitekey={siteKey}
      data-callback="turnstileOnVerify"
      data-theme="light"
    />
  );
};
