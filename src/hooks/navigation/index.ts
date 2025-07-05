import { useEffect, useState } from "react";

export const useNavigation = () => {
  const [section, setSection] = useState<string>("/");

  // Detect which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["features", "pricing", "contact"];
      const scrollPosition = window.scrollY + 200; // Offset for better detection

      // Check if we're at the top of the page
      if (window.scrollY < 100) {
        setSection("/");
        return;
      }

      // Check which section is currently in view
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setSection(`#${sectionId}`);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSetSection = (path: string) => {
    setSection(path);
    
    // Handle smooth scrolling
    if (path === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (path.startsWith("#")) {
      const elementId = path.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        const offsetTop = element.offsetTop - 100; // Offset for header height
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }
  };

  return {
    section,
    onSetSection,
  };
};
