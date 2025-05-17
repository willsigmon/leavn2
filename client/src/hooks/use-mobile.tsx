import { useState, useEffect } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window exists (browser environment)
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      // Set initial value
      checkMobile();

      // Add event listener
      window.addEventListener("resize", checkMobile);

      // Clean up
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  return { isMobile };
}

export default useMobile;
