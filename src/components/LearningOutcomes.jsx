// LearningOutcomes.jsx

import React, { useEffect, useRef, useState } from "react";
import "./LearningOutcomes.css";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Title from "./Title"; // Ensure this component is created as per previous instructions

function LearningOutcomes() {
  // References and state variables
  const sliderRef = useRef(null);
  const slideRefs = useRef([]);
  const counterRef = useRef(null);
  const itemsRef = useRef([]);
  const previewRef = useRef(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDirection, setCurrentDirection] = useState("next");
  const [currentTitle, setCurrentTitle] = useState("");

  // Slider content data
  const sliderContent = [
    {
      name: "LO1 - C.D.D",
      img: "/images/learningoutcomes/img1.jpg",
    },
    {
      name: "LO2 - Transferable production",
      img: "/images/learningoutcomes/img2.jpg",
    },
    {
      name: "LO3 - Creative iterations",
      img: "/images/learningoutcomes/img3.jpg",
    },
    {
      name: "LO4 - Professional standards",
      img: "/images/learningoutcomes/img4.jpg",
    },
    {
      name: "LO5 - Personal leadership",
      img: "/images/learningoutcomes/img5.jpg",
    },
  ];

  const totalSlides = sliderContent.length;

  // Animation configurations
  const clipPath = {
    closed: "polygon(25% 30%, 75% 30%, 75% 70%, 25% 70%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  };

  const positionStyles = {
    prev: { left: "15%", rotation: -90 },
    active: { left: "50%", rotation: 0 },
    next: { left: "85%", rotation: 90 },
  };

  const positionRotations = {
    prev: 90,
    active: 0,
    next: -90,
  };

  // Initialization hook
  useEffect(() => {
    preloadImages();
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "hop",
      "M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1"
    );

    setupInitialAnimations();
  }, []);

  // Update the current title when the active slide changes
  useEffect(() => {
    setCurrentTitle(sliderContent[activeSlideIndex - 1].name);
  }, [activeSlideIndex]);

  const preloadImages = () => {
    sliderContent.forEach((slide) => {
      const img = new Image();
      img.src = slide.img;
    });
  };

  const setupInitialAnimations = () => {
    slideRefs.current.forEach((slide, index) => {
      const position = getSlidePosition(index + 1, activeSlideIndex);
      if (position) {
        gsap.set(slide, {
          ...positionStyles[position],
          xPercent: -50,
          yPercent: -50,
          clipPath: position === "active" ? clipPath.open : clipPath.closed,
          opacity: 1,
        });
        if (position !== "active") {
          gsap.set(slide.querySelector(".slide-img"), {
            rotation: -positionRotations[position],
          });
        }
      } else {
        gsap.set(slide, { opacity: 0 });
      }
    });

    // Update counter and highlight
    updateCounterAndHighlight(activeSlideIndex);

    // Update preview image
    if (previewRef.current) {
      previewRef.current.innerHTML = `<img src="${sliderContent[activeSlideIndex - 1].img}" alt="" />`;
    }
  };

  const getSlidePosition = (index, activeIndex) => {
    const prevIndex = activeIndex - 1 < 1 ? totalSlides : activeIndex - 1;
    const nextIndex = activeIndex + 1 > totalSlides ? 1 : activeIndex + 1;
    if (index === activeIndex) return "active";
    if (index === prevIndex) return "prev";
    if (index === nextIndex) return "next";
    return null;
  };

  const updateCounterAndHighlight = (index) => {
    if (counterRef.current) {
      const counterSpans = counterRef.current.querySelectorAll("span");
      if (counterSpans.length > 0) {
        counterSpans[0].textContent = index;
      }
    }

    itemsRef.current.forEach((item, idx) => {
      if (item) {
        item.classList.toggle("activeItem", idx + 1 === index);
      }
    });
  };

  const handleSlideClick = (direction) => {
    if (isAnimating) return;
    transitionSlides(direction);
  };

  const getIndex = (index) => {
    if (index > totalSlides) return 1;
    if (index < 1) return totalSlides;
    return index;
  };

  const animateSlide = (slide, position) => {
    gsap.to(slide, {
      ...positionStyles[position],
      xPercent: -50,
      yPercent: -50,
      duration: 1,
      ease: "hop",
      clipPath: position === "active" ? clipPath.open : clipPath.closed,
      opacity: 1,
    });
    gsap.to(slide.querySelector(".slide-img"), {
      rotation: -positionRotations[position],
      duration: 1,
      ease: "hop",
    });
  };

  const updatePreviewImage = (content) => {
    const newImage = document.createElement("img");
    newImage.src = content.img;
    newImage.alt = content.name;
    previewRef.current.appendChild(newImage);

    gsap.fromTo(
      newImage,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
        delay: 0.5,
        onComplete: () => {
          const images = previewRef.current.querySelectorAll("img");
          if (images.length > 1) {
            images[0].remove();
          }
        },
      }
    );
  };

  const transitionSlides = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentDirection(direction);

    const newActiveIndex =
      direction === "next"
        ? getIndex(activeSlideIndex + 1)
        : getIndex(activeSlideIndex - 1);

    const outgoingSlide = slideRefs.current[activeSlideIndex - 1];
    const incomingSlide = slideRefs.current[newActiveIndex - 1];

    // Animate outgoing slide to its new position
    animateSlide(outgoingSlide, direction === "next" ? "prev" : "next");

    // Animate incoming slide to active position
    animateSlide(incomingSlide, "active");

    // Update positions of other slides
    slideRefs.current.forEach((slide, index) => {
      const position = getSlidePosition(index + 1, newActiveIndex);
      if (!position) {
        gsap.to(slide, { opacity: 0, duration: 0.5 });
      } else if (slide !== incomingSlide && slide !== outgoingSlide) {
        animateSlide(slide, position);
      }
    });

    // Update preview image
    updatePreviewImage(sliderContent[newActiveIndex - 1]);

    // Update counter and highlight
    setTimeout(() => updateCounterAndHighlight(newActiveIndex), 500);

    // After animation completes
    setTimeout(() => {
      setActiveSlideIndex(newActiveIndex);
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="learning-outcomes">
      {/* Slider Component */}
      <div className="slider" ref={sliderRef}>
        {sliderContent.map((slide, index) => (
          <div
            key={index}
            ref={(el) => (slideRefs.current[index] = el)}
            className="slide-container"
            onClick={() => {
              if (isAnimating) return;
              const direction =
                index + 1 > activeSlideIndex ||
                (activeSlideIndex === totalSlides && index === 0)
                  ? "next"
                  : "prev";
              handleSlideClick(direction);
            }}
          >
            <div className="slide-img">
              <img src={slide.img} alt={slide.name} />
            </div>
          </div>
        ))}

        <div className="slider-title">
          {currentTitle && (
            <Title text={currentTitle} direction={currentDirection} />
          )}
        </div>

        <div className="slider-counter" ref={counterRef}>
          <p>
            <span>{activeSlideIndex}</span>
            <span>/</span>
            <span>{totalSlides}</span>
          </p>
        </div>

        <div className="slider-items">
          {sliderContent.map((slide, index) => (
            <p
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              className={index + 1 === activeSlideIndex ? "activeItem" : ""}
              onClick={() => {
                if (isAnimating || index + 1 === activeSlideIndex) return;
                const direction = index + 1 > activeSlideIndex ? "next" : "prev";
                handleSlideClick(direction);
              }}
            >
              {slide.name}
            </p>
          ))}
        </div>

        <div className="slider-preview" ref={previewRef}>
          {/* Initial image is set via JavaScript */}
        </div>
      </div>
    </div>
  );
}

export default LearningOutcomes;