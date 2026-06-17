import Link from "next/link";

export default function WineListPage() {
  return (
    <main className="pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 min-h-[80vh]">
      <div className="mb-stack-lg">
        <Link href="/menu" className="text-secondary font-label-caps text-label-caps hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Menu
        </Link>
      </div>

      <section className="mb-section-gap text-center space-y-stack-md">
        <p className="font-label-caps text-label-caps text-secondary tracking-[0.2em] uppercase">The Cellar</p>
        <h2 className="font-display-lg text-display-lg italic mx-auto max-w-3xl">Our Sommelier's Reserve</h2>
      </section>

      <section className="max-w-3xl mx-auto space-y-stack-lg">
        <div>
          <h3 className="font-headline-md text-headline-md border-b border-outline-variant pb-stack-sm mb-stack-md text-primary">Champagne & Sparkling</h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-baseline">
              <span className="font-headline-sm text-on-surface">Dom Pérignon Vintage 2012</span>
              <span className="font-body-md text-secondary">$450</span>
            </li>
            <li className="flex justify-between items-baseline">
              <span className="font-headline-sm text-on-surface">Krug Grande Cuvée 170ème Édition</span>
              <span className="font-body-md text-secondary">$380</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-headline-md text-headline-md border-b border-outline-variant pb-stack-sm mb-stack-md text-primary">White</h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-baseline">
              <span className="font-headline-sm text-on-surface">Domaine Leflaive Puligny-Montrachet 1er Cru 2019</span>
              <span className="font-body-md text-secondary">$290</span>
            </li>
            <li className="flex justify-between items-baseline">
              <span className="font-headline-sm text-on-surface">Gaja Gaia & Rey Chardonnay 2020</span>
              <span className="font-body-md text-secondary">$410</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-headline-md text-headline-md border-b border-outline-variant pb-stack-sm mb-stack-md text-primary">Red</h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-baseline">
              <span className="font-headline-sm text-on-surface">Château Margaux 1er Grand Cru Classé 2010</span>
              <span className="font-body-md text-secondary">$1,850</span>
            </li>
            <li className="flex justify-between items-baseline">
              <span className="font-headline-sm text-on-surface">Tenuta San Guido Sassicaia 2018</span>
              <span className="font-body-md text-secondary">$520</span>
            </li>
            <li className="flex justify-between items-baseline">
              <span className="font-headline-sm text-on-surface">Opus One Napa Valley 2018</span>
              <span className="font-body-md text-secondary">$680</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
