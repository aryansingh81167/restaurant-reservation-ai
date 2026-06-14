import Link from "next/link";

export default function TopNavBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 transition-all duration-300">
      <div className="flex justify-between items-center px-margin-desktop py-stack-md w-full max-w-container-max mx-auto">
        <Link href="/" className="font-display-lg text-display-lg text-primary tracking-tight hover:opacity-80 transition-opacity">LUMIÈRE</Link>
        <nav className="hidden md:flex items-center space-x-12">
          <Link href="/menu" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-caps text-label-caps uppercase tracking-widest relative group">
            Menu
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/dashboard" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-caps text-label-caps uppercase tracking-widest relative group">
            Reservations
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/dashboard" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-label-caps text-label-caps uppercase tracking-widest relative group">
            My Bookings
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>
        <div className="flex items-center space-x-gutter">
          <button aria-label="Toggle Dark Mode" className="p-2 hover:bg-surface-container-high transition-all rounded-full flex items-center hover:rotate-12 duration-300">
            <span className="material-symbols-outlined text-primary">dark_mode</span>
          </button>
          <Link href="/login" className="hidden md:block text-on-surface font-medium hover:text-secondary transition-colors font-label-caps text-label-caps uppercase tracking-widest">Sign In</Link>
          <Link href="/dashboard" className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps hover:bg-surface-tint active:scale-95 transition-all duration-300 text-center uppercase tracking-widest shadow-lg shadow-primary/10 hover:shadow-primary/20 rounded-sm">Book Now</Link>
          <button className="md:hidden flex items-center hover:text-secondary transition-colors">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
