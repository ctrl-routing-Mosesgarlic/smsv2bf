import SectionWrapper from "../SectionWrapper";
import Button from "../Button";

export default function Hero() {
  return (
    <SectionWrapper className="max-h-screen">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="max-w-3xl text-5xl font-bold leading-tight">
          Complete School Management for the CBC Curriculum
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/60 leading-relaxed">
          From admissions and CBC-aligned assessments to report cards and M-Pesa
          fee collection — manage every aspect of your school with one integrated
          platform built for Kenya&apos;s Competency-Based Curriculum.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Button variant="primary">Start Free Trial</Button>
          <Button variant="outline">Explore Modules</Button>
        </div>
      </div>
      <div className="mt-16 px-8">
        <img
          src="https://framerusercontent.com/images/3TFqmzpkg29FoG0w6wdYdGdwn2E.png?width=4793&height=3454"
          alt="App screenshot"
          className="w-full rounded"
        />
      </div>
    </SectionWrapper>
  );
}
