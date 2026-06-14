import Link from "next/link";

export default function TopNavBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-background/90 backdrop-blur-md border-b border-outline-variant">
      <div className="flex justify-between items-center px-margin-desktop py-stack-md w-full max-w-container-max mx-auto">
        <Link href="/" className="font-display-lg text-display-lg text-primary tracking-tight">LUMIÈRE</Link>
        <nav className="hidden md:flex items-center space-x-10">
          <Link href="/menu" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-caps text-label-caps">Menu</Link>
          <Link href="/dashboard" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-caps text-label-caps">Reservations</Link>
          <Link href="/dashboard" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-caps text-label-caps">My Bookings</Link>
          <Link href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-caps text-label-caps">Contact</Link>
        </nav>
        <div className="flex items-center space-x-gutter">
          <button aria-label="Toggle Dark Mode" className="p-2 hover:bg-surface-container-high transition-all rounded-full flex items-center">
            <span className="material-symbols-outlined text-primary">dark_mode</span>
          </button>
          <Link href="/login" className="hidden md:block text-on-surface font-medium hover:opacity-80 transition-opacity font-label-caps text-label-caps">Sign In</Link>
          <Link href="/dashboard" className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all text-center">Book Now</Link>
          <button className="md:hidden flex items-center">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
