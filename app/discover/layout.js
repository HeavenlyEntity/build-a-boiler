import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Discover Boilerplates | Build-a-Boiler",
  description: "Find the perfect boilerplate for your next project. AI-powered discovery engine for high-quality starter templates.",
  canonicalUrlRelative: "/discover",
});

export default function Layout({ children }) {
  return <>{children}</>;
}