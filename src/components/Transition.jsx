import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";

const Transition = forwardRef((_, ref) => {
  const canvasRef = useRef(null);
  const tiles = useRef([]);

  useImperativeHandle(ref, () => ({
    playTransition,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const columns = 5;
    const rows = 10;

    // Setup tiles
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const width = 1 / columns;
        const height = 1 / rows;
        tiles.current.push({ x: width * col, y: height * row, width, height, progress: 0 });
      }
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawTiles = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      tiles.current.forEach((tile) => {
        context.beginPath();
        const width = tile.width * canvas.width;
        const height = tile.height * canvas.height * tile.progress;
        context.rect(tile.x * canvas.width, tile.y * canvas.height, width, height);
        context.fillStyle = "#000";
        context.fill();
        context.closePath();
      });
    };

    gsap.ticker.add(drawTiles);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      gsap.ticker.remove(drawTiles);
    };
  }, []);

  const playTransition = (onNavigate) => {
    const canvas = canvasRef.current;

    // Enable pointer events during animation
    canvas.style.pointerEvents = "all";

    // Animate to black (first part)
    gsap
      .to(tiles.current, {
        progress: 1,
        stagger: {
          grid: [5, 10],
          from: "edges",
          amount: 0.5,
        },
        ease: "power3.inOut",
        onComplete: () => {
          if (onNavigate) onNavigate(); // Navigate to the new page after the first part
        },
      })
      .then(() => {
        // Animate back (second part)
        return gsap.to(tiles.current, {
          progress: 0,
          stagger: {
            grid: [5, 10],
            from: "edges",
            amount: 0.5,
          },
          ease: "power3.inOut",
          onComplete: () => {
            // Disable pointer events after animation
            canvas.style.pointerEvents = "none";
          },
        });
      });
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Default: disable interaction
        zIndex: 9999, // Ensure canvas is on top during animation
      }}
    />
  );
});

export default Transition;