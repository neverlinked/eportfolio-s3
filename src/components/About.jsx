import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function About() {
  const aboutRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("about-page");
  
    return () => {
      document.body.classList.remove("about-page");
    };
  }, []);

  useEffect(() => {
    const elements = aboutRef.current.querySelectorAll(".about-col");
    gsap.fromTo(
      elements,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <section className="about" ref={aboutRef}>
      <div className="about-col">
        <p>Hello!</p>
        <p>
          My name is Josif and I'm a Front-end developer, who's passionate
          about Web Development, Blockchain technologies and AI. In the 
          future I would like to transition my front-end stack and combine 
          it with a Blockchain Back-end skills to be able to collaborate 
          on cool projects in the Web 3 space.
        </p>
        <p>
          Languages spoken: 🇬🇧 🇧🇬 🇯🇵  + 🇳🇱 (In progress)
        </p>
      </div>
      <div className="about-col">
        <h1>Front-End Technologies</h1>
        <p>
          React, Vue.js, GSAP, JavaScript, HTML, CSS
        </p>
        <h1>Back-end Technologies</h1>
        <p>
          C#, Python, SQL, Django, Node.js
        </p>
      </div>
    </section>
  );
}

export default About;