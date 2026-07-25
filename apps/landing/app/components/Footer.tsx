import Link from "next/link";
import SectionWrapper from "./SectionWrapper";

export default function Footer() {
  return (
    <SectionWrapper className="!py-16">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="font-semibold">CBC SchoolMS</div>
          <p className="mt-2 text-sm text-foreground/50 leading-relaxed">
            Comprehensive school management platform designed for the Kenyan
            CBC curriculum.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Product</h3>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link href="/modules" className="text-sm text-foreground/50 hover:text-foreground transition-colors">
                Modules
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-sm text-foreground/50 hover:text-foreground transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-sm text-foreground/50 hover:text-foreground transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link href="/about" className="text-sm text-foreground/50 hover:text-foreground transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-foreground/50 hover:text-foreground transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-foreground/50">
            <li>info@schoolms.com</li>
            <li>+254 700 000 000</li>
            <li>Nairobi, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-center gap-0">
        <div className="h-8 w-8 border border-border flex items-center justify-center text-foreground/30 hover:text-primary hover:border-primary transition-colors cursor-pointer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </div>
        <div className="h-8 w-8 border border-border flex items-center justify-center text-foreground/30 hover:text-primary hover:border-primary transition-colors cursor-pointer">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </div>
        <div className="h-8 w-8 border border-border flex items-center justify-center text-foreground/30 hover:text-primary hover:border-primary transition-colors cursor-pointer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </div>
        <div className="h-8 w-8 border border-border flex items-center justify-center text-foreground/30 hover:text-primary hover:border-primary transition-colors cursor-pointer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.983 8.378 19 12c-.017 3.629-.285 4.736-2.558 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/></svg>
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-foreground/40">
        &copy; {new Date().getFullYear()} CBC SchoolMS. All rights reserved.
      </div>
    </SectionWrapper>
  );
}
