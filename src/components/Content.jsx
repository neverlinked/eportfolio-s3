import React, { useEffect, useRef } from 'react';
import { TweenMax, TimelineMax, Expo, Power1, Quint } from 'gsap';

function Content() {
  const imagesRef = useRef([]);
  const zIndexVal = useRef(1);
  let mousePos = { x: 0, y: 0 };
  let lastMousePos = { x: 0, y: 0 };
  let cacheMousePos = { x: 0, y: 0 };

  useEffect(() => {
    const getMousePos = (e) => {
      return { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      mousePos = getMousePos(e);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animateImages = () => {
      const distance = Math.hypot(mousePos.x - lastMousePos.x, mousePos.y - lastMousePos.y);
      if (distance > 100) {
        showNextImage();
        zIndexVal.current++;
        lastMousePos = { ...mousePos };
      }

      cacheMousePos.x = lerp(cacheMousePos.x, mousePos.x, 0.1);
      cacheMousePos.y = lerp(cacheMousePos.y, mousePos.y, 0.1);

      requestAnimationFrame(animateImages);
    };

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const showNextImage = () => {
      const img = imagesRef.current[zIndexVal.current % imagesRef.current.length];
      if (!img) return;

      TweenMax.killTweensOf(img);

      new TimelineMax()
        .set(img, {
          opacity: 1,
          scale: 1,
          zIndex: zIndexVal.current,
          x: cacheMousePos.x - img.width / 2,
          y: cacheMousePos.y - img.height / 2,
        })
        .to(img, 0.9, { x: mousePos.x - img.width / 2, y: mousePos.y - img.height / 2, ease: Expo.easeOut })
        .to(img, 1, { opacity: 0, ease: Power1.easeOut }, 0.4)
        .to(img, 1, { scale: 0.2, ease: Quint.easeOut }, 0.4);
    };

    animateImages();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="content">
      {[...Array(9).keys()].map((i) => (
        <img
          key={i}
          className="content__img"
          src={`/images/0${i + 1}.png`}
          alt={`content ${i + 1}`}
          ref={(el) => (imagesRef.current[i] = el)}
        />
      ))}
    </div>
  );
}

export default Content;
