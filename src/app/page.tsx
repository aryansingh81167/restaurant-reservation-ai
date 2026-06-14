"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        <img alt="Lumiere Dining Room" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA89NkEdiguBqjfmCmLEqJ0Xok6DeXpBqKqiJ9ulm69xxeKfmoi28hKAprh_SV0E44eGZEbUf8e_XJj3odb1_1Mp00dVHJlyCOhX6V9RO1x_A_dI8lUuE7CNCTjTd5r1Y--mzxNzmO7Rnf_WZCxML9ju_5F2f0Sa4J54cCarV_u8-af97fpqV4jI-DAduJysGMqxltHOHBnJN7KcOj3Un4-3mNCSUUPcBpQdEFbhRtfkG7MJWQSSLXuqBaJ-17Hy482OY51-wI_IjY" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop">
          <h1 className="font-display-lg text-display-lg md:text-[64px] text-white max-w-3xl mb-stack-md">Reserve Your Table</h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mb-stack-lg">Book instantly, explore our menu, or let our virtual concierge assist you.</p>
          <div className="flex flex-col sm:flex-row gap-gutter">
            <Link href="/dashboard" onClick={() => track("book_a_table_clicked")} className="bg-white text-primary px-10 py-4 font-label-caps text-label-caps hover:bg-surface-container-low transition-colors active:scale-95 text-center">Book a Table</Link>
            <Link href="/menu" className="border border-white text-white px-10 py-4 font-label-caps text-label-caps hover:bg-white/10 transition-colors active:scale-95 text-center">View Menu</Link>
          </div>
        </div>
      </section>
      
      {/* Virtual Concierge Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-section-gap items-center">
          <div className="space-y-stack-lg order-2 lg:order-1">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em]">Exclusivity Redefined</span>
            <h2 className="font-display-lg text-display-lg text-primary">Your Personal Maître d', Digitally Perfected</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Experience the next evolution of hospitality. Our AI-powered virtual concierge anticipates your preferences, from dietary nuances to preferred seating, ensuring every reservation is as unique as your palate.
            </p>
            <ul className="space-y-stack-md pt-stack-md">
              <li className="flex items-center space-x-4">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-body-md text-body-md">Personalized Wine Pairings &amp; Menu Suggestions</span>
              </li>
              <li className="flex items-center space-x-4">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-body-md text-body-md">Priority Access to Seasonal Tasting Events</span>
              </li>
              <li className="flex items-center space-x-4">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-body-md text-body-md">Seamless Multi-Guest Coordination</span>
              </li>
            </ul>
            <div className="pt-stack-lg">
              <Link href="/dashboard/concierge" className="text-underline-gold font-label-caps text-label-caps text-secondary uppercase">Activate Concierge</Link>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/5] bg-surface-container-low relative overflow-hidden group">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQrfwUAsRS0GuRAoJ8bFcahXx6hS3mVzdv-ksTzXaV8hfaNRDsA0zk7KHts7iOdhdad7T_IETpj_WI-PphEpsGUY8pK1mINIyGTv1eZX0neltoBaBoMCltR8jCDFayt6LOm9q_lnOVzBSxkcTUI3k93Iwog5fWBUgfSPHBGDXzHB1-fGRqOZ6a2d2B8u9j61IXUINW2S7OAg4G6yYvIPyBN7hRR-m9URKgRONskLLKWwUkDYxlh_uVWdZo0c8FNBz4WWlBVJLJ9iY" alt="Concierge" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none"></div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-secondary/5 -z-10 hidden md:block"></div>
          </div>
        </div>
      </section>

      {/* Bento Highlights */}
      <section className="bg-surface-container-low py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="mb-section-gap text-center space-y-4">
            <h2 className="font-headline-md text-headline-md text-primary">The Lumière Experience</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">Curated moments of culinary excellence, designed for those who appreciate the finer details of gastronomy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-[300px]">
            <div className="md:col-span-8 md:row-span-2 relative overflow-hidden luxury-shadow group">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCILbkAyaCTdrM8SsILOLRmmJgAIshZ2gcxtx5-5NKf59SzI0xY9gK0iHzKfIRRu2rOtw-Y5jjvvxaRwSz1WrZGws_w30zzB0ORen8rTrVmgwbVGHebJ48yR3GI5wd2nn4iou3aAysYV0J4mjyJa-UVLTSKfRkU1syJa0SVtIb7myEvsqmqudQ7OfkUA2VRBzJ6npoE6IywgkOWXgfo2-HGA1NQycQaAyiq930kbFExd53cavlqEbZipt_qg6_D9GIif48M60wpTWU" alt="The Kitchen" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-stack-lg">
                <span className="font-label-caps text-label-caps text-secondary-fixed mb-2 uppercase">The Kitchen</span>
                <h3 className="font-headline-sm text-headline-sm text-white">Artistry in Every Plate</h3>
              </div>
            </div>
            <div className="md:col-span-4 relative overflow-hidden luxury-shadow group">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYrQnGaTafquF6UXWYhuf3wD1LseVsRpVB5m15DjWS8WdzYWDFhoJezC8vkUe-jO46krEkN2ciMEArKGF7uDqWmCWcC4h46Hp-7Uu6QSN12zPmT8n2TRRbU9WxWD_-HeeH5-D37d-4h3zaKIiYz0FoiVqadrUk0P_fOR0OmqVNsh8RJjptWaBlV8-3Bji8jQ9XT-RkzVA42NFZRe-fESOtDjSJQtjfzsKRa7Nw7-gy3WwlOuMYmx0nl3QeIXZMMGVVZDOOE1cXOL0" alt="The Cellar" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-stack-md">
                <h3 className="font-headline-sm text-headline-sm text-white">The Cellar</h3>
              </div>
            </div>
            <div className="md:col-span-4 relative overflow-hidden luxury-shadow group">
              <div className="absolute inset-0 bg-secondary flex flex-col justify-center items-center text-center p-stack-lg">
                <span className="material-symbols-outlined text-white text-5xl mb-4">stars</span>
                <h3 className="font-headline-sm text-headline-sm text-white mb-2">Member Exclusive</h3>
                <p className="text-white/80 font-body-md">Priority bookings for the Chef's Table.</p>
                <button className="mt-stack-md text-white border-b border-white pb-1 font-label-caps text-label-caps hover:opacity-80 transition-opacity">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
