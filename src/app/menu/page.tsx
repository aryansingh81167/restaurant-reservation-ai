export default function MenuPage() {
  return (
    <>
      <main className="pb-section-gap max-w-container-max mx-auto px-margin-desktop">
        {/* Hero Branding */}
        <section className="mb-section-gap text-center space-y-stack-md pt-8">
          <p className="font-label-caps text-label-caps text-secondary tracking-[0.2em] uppercase">Michelin Star Experience</p>
          <h2 className="font-display-lg text-display-lg italic mx-auto max-w-3xl">An orchestration of season, terroir, and refined technique.</h2>
        </section>
        
        {/* Category: Starters */}
        <section className="mb-section-gap">
          <div className="flex items-baseline justify-between border-b border-outline-variant pb-stack-sm mb-stack-lg">
            <h3 className="font-display-lg text-headline-md tracking-tight">Starters</h3>
            <span className="font-label-caps text-label-caps text-on-surface-variant italic">01 — L'OUVERTURE</span>
          </div>
          <div className="menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '48px 24px' }}>
            {/* Item 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden mb-stack-md bg-surface-container">
                <img alt="Hokkaido Scallops" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIvnd-3wN_fWwUhP-EJXxglW9qmDzM8N0zntQdFM9_FRvTccBWEeaP-cH6ACo9Rk9o62ISwAQi17QhzORTR_lRmhzlVSAIosqHJpDo4kDmldSQi_sHgYiurgit0AfBFuFoBkxbnJd4OPn4_QnXAGfWxWGvDrohyJmrpDILUoQPy0aKHlOGh1GkmZWaAkA3nybAywSeqd2Ozv-cGVwtcB-78fskO8DouuJJV8ebN6AOd-sdG-oRQ8K44HHhIJP5a5ps7lqy4_GHVf4"/>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-headline-sm text-headline-sm">Hokkaido Scallops</h4>
                <span className="font-body-md text-body-md text-secondary">$38</span>
              </div>
              <p className="font-body-md text-on-surface-variant mb-4">Pan-seared pearls, minted pea emulsion, citrus foam, garden radish.</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-low font-label-caps text-[10px] rounded">GF</span>
              </div>
            </div>
            {/* Item 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden mb-stack-md bg-surface-container">
                <img alt="Heritage Burrata" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk65Gfaendf1LmpnpSeX0PIllJbSLguhfZrQjxraJGjWn0Wj8DgrZ4VUXWfEwRMg0hGs338cAzUL9gv7ZILXc_jPzU40FFX5pLoh10_EuosDPC8n_xztLLeOSdRSGS7FbtNMZ3XhEgP4FkuYsbJlrKOUQ7qcxQkz4DA77_S1d9-HOtHZTWjsbZEWfjLm1VehkZn8LzBxjO5NMOlBVJak-W_T0ls1EYnOhLajDBKvEPtRulW_pKYI4TxyJMn82Vw5OTKpp1ZERo258"/>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-headline-sm text-headline-sm">Heritage Burrata</h4>
                <span className="font-body-md text-body-md text-secondary">$32</span>
              </div>
              <p className="font-body-md text-on-surface-variant mb-4">Aged balsamic spheres, heirloom tomato essence, toasted pine nuts.</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-low font-label-caps text-[10px] rounded">V</span>
                <span className="px-2 py-1 bg-surface-container-low font-label-caps text-[10px] rounded">GF</span>
              </div>
            </div>
          </div>
        </section>

        {/* Category: Main Courses */}
        <section className="mb-section-gap">
          <div className="flex items-baseline justify-between border-b border-outline-variant pb-stack-sm mb-stack-lg">
            <h3 className="font-display-lg text-headline-md tracking-tight">Main Courses</h3>
            <span className="font-label-caps text-label-caps text-on-surface-variant italic">02 — LE CŒUR</span>
          </div>
          <div className="menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '48px 24px' }}>
            {/* Item 3 */}
            <div className="group cursor-pointer col-span-1 md:col-span-2 flex flex-col md:flex-row gap-8 items-center bg-white p-6 shadow-sm border border-outline-variant/30">
              <div className="w-full md:w-1/2 aspect-[16/9] overflow-hidden bg-surface-container">
                <img alt="A5 Wagyu Reserve" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAFDrROMen32Cy1oKvpfwd-GnGoOorgtjNgYhm_zv-F09fcunaJcf88LsbCQ-Hd1ZqFAjLkb6Ql-BbAJfybk_cZ41fQLkfKBLrTn3IgBgl2P5ytxlSo8FS2D-8PEKOtlBm3e9fHhm98IIuKUgbZVwl5NSN5nIwNdc2Q5HystDubjQmxkjiQmHHBHXvt2b4hkEIuV2mu4xNip43dqrXwTpDoHdg3yK301NMPU4iooVsvRUp1-ZF0rmkanORQDWCjF3vHlHs71hUv4U"/>
              </div>
              <div className="w-full md:w-1/2 pr-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-headline-md text-headline-md">A5 Wagyu Reserve</h4>
                  <span className="font-body-lg text-body-lg text-secondary">$145</span>
                </div>
                <p className="font-body-lg text-on-surface-variant mb-6">Périgord truffle, smoked pomme purée, charred leeks, bordelaise reduction.</p>
                <div className="flex gap-3">
                  <span className="px-3 py-1 bg-surface-container-low font-label-caps text-label-caps rounded-full">SIGNATURE</span>
                  <span className="px-3 py-1 bg-surface-container-low font-label-caps text-label-caps rounded-full">GF</span>
                </div>
              </div>
            </div>
            {/* Item 4 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden mb-stack-md bg-surface-container">
                <img alt="Wild Sea Bass" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEZAicp6JGQn1dwKVVg29UyL0vyDulQRxhO-uioI7eUV68Sy7MNgt1z05hImNKQoRZzZ0STsmayPhP6BJuoAo8RvnyhhIGTMzPhZa-wVFtAfx_-LLWvi3Tx-t43oBZRlcrdXbGtEhG6MJLL97zkC0wxEk7kfjg850Q_efyBf5M8Z7murteQL1yMZAyeNjWFKiYNuIxYIgXQq9F2Eh5_5OcUlTv5oTaOsCuFOWN4SBnVc7npwoHA3PhKfZR4nBZm0vdImnWigpIkV4"/>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-headline-sm text-headline-sm">Wild Sea Bass</h4>
                <span className="font-body-md text-body-md text-secondary">$52</span>
              </div>
              <p className="font-body-md text-on-surface-variant mb-4">Saffron broth, seasonal asparagus, fennel pollen, finger lime.</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-low font-label-caps text-[10px] rounded">GF</span>
              </div>
            </div>
          </div>
        </section>

        {/* Category: Desserts */}
        <section className="mb-section-gap">
          <div className="flex items-baseline justify-between border-b border-outline-variant pb-stack-sm mb-stack-lg">
            <h3 className="font-display-lg text-headline-md tracking-tight">Desserts</h3>
            <span className="font-label-caps text-label-caps text-on-surface-variant italic">03 — LA FIN</span>
          </div>
          <div className="menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '48px 24px' }}>
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden mb-stack-md bg-surface-container">
                <img alt="Noir Chocolate Fondant" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPLN2NGoEOOZ2ma6ZxWnSWgadScNvWVJ5s54Mbr7iC9smoSuBufK3KRW6148miarrJ2RQWquGiecBxPXfONlAQpGjjIxyetQJOPhakYanvrKh0vRHeb_NvHDlUoL_abvaAJWMGQdSAID7f-USQD0z3ZkpU6dfvJGGXDs_WwytmYaIUrhYvUOO9lqR1w2j8w_fGBUkLMPWtfSizNA2u7jrospXqtG_oLtxUGSWRwZcVcyXGqM7x0WMJ-Gl2SDtm9q1SKWnzNG_UdkM"/>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-headline-sm text-headline-sm">Noir Fondant</h4>
                <span className="font-body-md text-body-md text-secondary">$22</span>
              </div>
              <p className="font-body-md text-on-surface-variant">72% Araguani chocolate, gold leaf, vanilla bean gelato.</p>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden mb-stack-md bg-surface-container">
                <img alt="Lemon Verbena Tart" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc-gwGP2Zyiyi76yqromkNiC-DUSMr9-CymK6TT3zcu1m4r5M_ek1RaM9BQ6fmfy85UTPaTgTXe7C-73dKZyYorsY3VW5AInu0HfRINLHNRge30wY3deMyWTi1SA5nixjiCO0CqdmNvkdKkhroaCdnJvsRGaehXuNwKawOgDDXVHOT-0wqqVB2kbrulWELh9mKrcGaxrE3y_iLmEoriKBd4fuUJGtT6dTc0VZdVL-ZQ0wDXgOuTyBo_Ps1cSMsbG6pIyPk6UJphGo"/>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-headline-sm text-headline-sm">Verbena Tart</h4>
                <span className="font-body-md text-body-md text-secondary">$18</span>
              </div>
              <p className="font-body-md text-on-surface-variant">Compressed berries, lime zest, shortbread soil.</p>
            </div>
            <div className="bg-surface-container-low p-8 flex flex-col justify-center border-l-4 border-secondary">
              <h4 className="font-headline-sm text-headline-sm mb-4">The Sommelier's Selection</h4>
              <p className="font-body-md mb-6 italic text-on-surface-variant">Curated pairings available for each course to elevate your dining journey.</p>
              <button className="text-secondary underline font-label-caps text-label-caps hover:text-primary transition-colors text-left uppercase tracking-widest">View Wine List</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
