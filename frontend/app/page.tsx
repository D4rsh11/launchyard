import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { DeploymentFlow } from "@/components/landing/DeploymentFlow";
import { DeploymentPreview } from "@/components/landing/DeploymentPreview";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Infrastructure } from "@/components/landing/Infrastructure";
import { GithubSection } from "@/components/landing/GithubSection";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <DeploymentFlow />
      <DeploymentPreview />
      <HowItWorks />
      <Features />
      <Infrastructure />
      <GithubSection />
      <CTA />
      <Footer />
    </main>
  );
}
