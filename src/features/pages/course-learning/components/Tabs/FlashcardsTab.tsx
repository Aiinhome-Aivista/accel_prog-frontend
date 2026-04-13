import React, { useState, useRef, useEffect } from "react";
import type { Flashcard } from "../../../dashboard/dashboard.models";
import { dashboardService } from "../../../../../services/dashboardService";

export const FlashcardsTab: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleFlip = (idx: number) => {
    setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: "smooth" });
      setHasScrolled(true);
    }
  };

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getFlashcards();
        if (response.data && Array.isArray(response.data)) {
          setFlashcards(response.data);
          setError(null);
        }
      } catch (err) {
        setError("Failed to load flashcards");
        console.error("Error fetching flashcards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        setHasScrolled(scrollLeft > 0);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="learning-tab-container">
      <h2 className="std-section-title mb-[1.2rem]">
        Flashcards
      </h2>
      <p className="text-[0.74rem] text-[#6B6D7B] mt-[-0.8rem] mb-[0.6rem]">
        Click to flip. Practice daily.
      </p>

      {loading && (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E87A2E]"></div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-8">
          <div className="text-[0.9rem] text-[#D06A20]">{error}</div>
        </div>
      )}

      {!loading && !error && flashcards.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="text-[0.9rem] text-[#6B6D7B]">
            No flashcards available
          </div>
        </div>
      )}

      {!loading && !error && flashcards.length > 0 && (
        <div className="relative">
          {/* Left Arrow - Only show when scrolled */}
          {hasScrolled && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors border border-gray-200"
              style={{ marginLeft: "-1rem" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors border border-gray-200"
            style={{ marginRight: "-1rem" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-[1rem] overflow-x-hidden py-[0.3rem] mb-[0.8rem] scrollbar-hide px-8"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            {flashcards.map((f) => {
              const isFlipped = flippedCards[f.id] || false;
              return (
                <div
                  key={f.id}
                  className="flashcard-item"
                  onClick={() => toggleFlip(f.id)}
                >
                  <div
                    className={`flashcard-inner ${isFlipped ? "is-flipped" : ""}`}
                  >
                    <div className="flashcard-face flashcard-front">
                      {f.card_question}
                    </div>
                    <div className="flashcard-face flashcard-back">
                      {f.card_answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
