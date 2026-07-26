import Link from "next/link";
import Button from "./Button";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/modules", label: "Modules" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-12">
      <nav className="mx-auto flex w-full max-w-[72rem] items-center justify-between border border-border bg-background/80 px-8 py-3 backdrop-blur-md">
        <Link href="/" className="font-semibold">Logo</Link>
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/70 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Button>Get Started</Button>
      </nav>
    </div>
  );
}
