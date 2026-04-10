import React, { useEffect, useState } from "react";

const UpArrowScroll = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <button
        className={`scroll-btn ${show ? "show" : ""}`}
        title="Go to top"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <svg width="64" height="64" viewBox="0 0 42 42" fill="none">
          <circle cx="21" cy="21" r="16"/>
          <path
            d="M21 27V15M21 15L16 20M21 15L26 20"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default UpArrowScroll;
