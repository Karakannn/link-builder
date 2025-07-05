import React from "react";
import CallToAction from "./_components/call-to-action";
import DashboardSnippet from "./_components/dashboard-snippet";
import { PricingSection } from "./_components/pricing";
import FeaturesSection from "./_components/features";
import ContactSection from "./_components/contact";

type Props = {};

const page = (props: Props) => {
  return (
    <main className="md:px-10 py-20 flex flex-col gap-12">
      <div>
        <CallToAction />
        <DashboardSnippet />
      </div>
      <FeaturesSection />
      <PricingSection />
      <ContactSection />
    </main>
  );
};

export default page;
