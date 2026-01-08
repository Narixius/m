import React from "react";

export const DottedMapInteractivity = () => {
  React.useEffect(() => {
    const circleIds = [
      "paris",
      "london",
      "istanbul",
      "moscow",
      "tehran",
      "tunis",
      "reykjavik",
    ];
    let index = 0;

    const movePointer = () => {
      const currentId = circleIds[index];
      const circleElement = document.getElementById(currentId);
      const pointerIcon = document.getElementById("pointer-icon")!;

      if (
        circleElement &&
        pointerIcon &&
        document.getElementById("dotted-map-svg")
      ) {
        const cx = circleElement.getAttribute("cx");
        const cy = circleElement.getAttribute("cy");

        if (cx && cy) {
          const x = Number.parseFloat(cx);
          const y = Number.parseFloat(cy);

          // Use transform for smoother GPU-accelerated animation
          requestAnimationFrame(() => {
            pointerIcon.style.transform = `translate(${x - 1}px, ${y + 1}px)`;
          });
        }
      }

      index = (index + 1) % circleIds.length;
    };

    // Initial position
    movePointer();

    const interval = setInterval(movePointer, 3000);

    return () => clearInterval(interval);
  }, []);
};
