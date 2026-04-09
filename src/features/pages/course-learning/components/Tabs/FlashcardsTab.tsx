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
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      {/* Hide WebKit scrollbars globally for this component */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `,
        }}
      />
      <div className="font-['DM_Serif_Display'] text-[1.3rem] text-[#2B2D42] mb-[1.2rem]">
        Flashcards
      </div>
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
                  className="min-w-[200px] h-[140px] rounded-[12px] bg-transparent cursor-pointer shrink-0 [perspective:600px]"
                  onClick={() => toggleFlip(f.id)}
                >
                  <div
                    className={`w-full h-full relative transition-[transform] duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
                  >
                    <div className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center p-[1rem] text-center rounded-[12px] bg-[#F9F5F0] text-[0.8rem] font-semibold text-[#2B2D42] border border-[#E5DDD4]">
                      {f.card_question}
                    </div>
                    <div className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center p-[1rem] text-center rounded-[12px] bg-[#e87a2e1f] text-[0.75rem] text-[#D06A20] border border-[#E5DDD4] [transform:rotateY(180deg)] leading-[1.4]">
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
