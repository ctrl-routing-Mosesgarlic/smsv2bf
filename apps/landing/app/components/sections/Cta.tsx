import SectionWrapper from "../SectionWrapper";
import Button from "../Button";
import { LINKS } from "../../lib/links";

export default function Cta() {
  return (
    <SectionWrapper>
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold">
          Ready to Transform Your School?
        </h2>
        <p className="mt-3 max-w-xl text-foreground/60">
          Join hundreds of Kenyan schools already using CBC SchoolMS. Get
          started free — no credit card required.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Button variant="primary" href={LINKS.signUp}>Start Your Free Trial</Button>
          <Button variant="outline" href={LINKS.contact}>Talk to Sales</Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
