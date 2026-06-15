"use client";

import { useState } from "react";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
    e.currentTarget.reset();
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-surface-container-highest w-full py-section-gap px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-gutter">
      <div className="space-y-stack-md">
        <h3 className="font-display-lg text-display-lg text-primary">LUMIÈRE</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">Crafting exceptional dining experiences through seamless technology and timeless hospitality.</p>
      </div>
      <div className="grid grid-cols-2 gap-gutter">
        <div className="space-y-4">
          <h4 className="font-label-caps text-label-caps text-primary uppercase">Company</h4>
          <ul className="space-y-2">
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Sustainability</a></li>
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Careers</a></li>
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Press</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-label-caps text-label-caps text-primary uppercase">Legal</h4>
          <ul className="space-y-2">
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="space-y-stack-md">
        <h4 className="font-label-caps text-label-caps text-primary uppercase">Newsletter</h4>
        <p className="font-body-md text-body-md text-on-surface-variant">Join our inner circle for exclusive event access.</p>
        <form className="flex" onSubmit={handleSubscribe}>
          <input required className="bg-transparent border-0 border-b border-outline py-2 flex-1 focus:ring-0 focus:border-primary placeholder:text-on-surface-variant" placeholder="Email Address" type="email" />
          <button type="submit" className="ml-4 material-symbols-outlined text-primary hover:text-secondary transition-colors">arrow_forward</button>
        </form>
        {subscribed && (
          <p className="text-secondary font-label-caps text-[10px] animate-fade-in uppercase">Thank you for subscribing.</p>
        )}
        <p className="text-[10px] text-on-surface-variant pt-stack-md">© 2026 LUMIÈRE. All rights reserved.</p>
      </div>
    </footer>
  );
}
