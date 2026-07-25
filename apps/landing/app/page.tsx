import Hero from "./components/sections/Hero";
import Features from "./components/sections/Features";
import Modules from "./components/sections/Modules";
import Pricing from "./components/sections/Pricing";
import Cta from "./components/sections/Cta";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 font-sans">
      <Hero />
      <Features />
      <Modules />
      <Pricing />
      <Cta />
    </div>
  );
}
