import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Header() {
  const headerRef = useRef(null);

  useEffect(() => {
    const textElements = headerRef.current.querySelectorAll("p");
    gsap.fromTo(
      textElements,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <header ref={headerRef}>
      <p id="name">Josif Mitsanski</p>
      <p>Creative Designer & Developer</p>
      <p>FHICT Student</p>
    </header>
  );
}

export default Header;