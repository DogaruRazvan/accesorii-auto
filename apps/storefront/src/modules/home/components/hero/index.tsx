import { Button, Heading } from "@modules/common/components/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-brand-dark">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-white font-bold uppercase tracking-wide"
          >
            MENV Divers
          </Heading>
          <Heading
            level="h2"
            className="text-xl leading-8 text-gray-300 font-normal mt-2"
          >
            Accesorii auto de calitate
          </Heading>
        </span>
        <LocalizedClientLink href="/store">
          <Button variant="secondary" className="mt-4">
            Vezi produsele
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default Hero;
