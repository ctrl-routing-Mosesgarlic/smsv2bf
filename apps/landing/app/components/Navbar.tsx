import Link from "next/link";
import Button from "./Button";

export default function Navbar() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-12">
      <nav className="mx-auto flex w-full max-w-[72rem] items-center justify-between border border-border bg-background/80 px-8 py-3 backdrop-blur-md">
        <Link href="/" className="font-semibold">Logo</Link>
        <div className="flex items-center gap-8">
          <Link href="/about" className="text-sm text-foreground/70 transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/modules" className="text-sm text-foreground/70 transition-colors hover:text-foreground">
            Modules
          </Link>
          <Link href="/pricing" className="text-sm text-foreground/70 transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="/contact" className="text-sm text-foreground/70 transition-colors hover:text-foreground">
            Contact
          </Link>
        </div>
        <Button>Get Started</Button>
      </nav>
    </div>
  );
}
