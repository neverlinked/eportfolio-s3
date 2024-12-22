import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Title({ text, direction }) {
  const titleRef = useRef(null);

  useEffect(() => {
    const element = titleRef.current;
    if (element) {
      // Split text into spans for animation
      const chars = text.split("");
      element.innerHTML = "";
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.innerHTML = char === " " ? "&nbsp;" : char;
        element.appendChild(span);
      });

      const spans = element.querySelectorAll("span");
      const yOffset = direction === "next" ? 60 : -60;

      // Set initial position
      gsap.set(spans, { y: yOffset });

      // Animate into view
      gsap.to(spans, {
        y: 0,
        duration: 1.25,
        stagger: 0.02,
        ease: "hop",
      });

      // Clean up function to animate out when the component unmounts
      return () => {
        gsap.to(spans, {
          y: -yOffset,
          duration: 1.25,
          stagger: 0.02,
          ease: "hop",
        });
      };
    }
  }, [text, direction]);

  return <h1 ref={titleRef}></h1>;
}

export default Title;