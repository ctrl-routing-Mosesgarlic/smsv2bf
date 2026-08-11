import Button from "./components/Button";
import SectionWrapper from "./components/SectionWrapper";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <SectionWrapper>
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="max-w-3xl text-5xl font-bold leading-tight">
            Component Showcase
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/60 leading-relaxed">
            Button, Corner, and SectionWrapper copied from the landing app and
            verified here.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="outline">Outline Button</Button>
          </div>
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="text-center">
              <h3 className="text-base font-semibold">Card {n}</h3>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                A content block rendered inside another SectionWrapper to
                confirm the component works with any children.
              </p>
              <Button variant="outline" className="mt-6 w-fit">
                Action {n}
              </Button>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}
