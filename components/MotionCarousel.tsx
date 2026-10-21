"use client";

import * as React from "react";
import { motion, type Transition } from "framer-motion";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";

type PropType = {
  children: React.ReactNode[];
  options?: EmblaOptionsType;
  autoplayInterval?: number;
  labels?: string[];
};

type EmblaControls = {
  selectedIndex: number;
  scrollSnaps: number[];
  prevDisabled: boolean;
  nextDisabled: boolean;
  onDotClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

type DotButtonProps = {
  selected?: boolean;
  label: string;
  onClick: () => void;
};

const transition: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 24,
  mass: 1,
};

const useEmblaControls = (
  emblaApi: EmblaCarouselType | undefined
): EmblaControls => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [prevDisabled, setPrevDisabled] = React.useState(true);
  const [nextDisabled, setNextDisabled] = React.useState(true);

  const onDotClick = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateSelectionState = (api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  };

  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    updateSelectionState(api);
  }, []);

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    updateSelectionState(api);
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    emblaApi.on("reInit", onInit).on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onInit).off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  };
};

function MotionCarousel(props: PropType) {
  const { children, options, autoplayInterval = 4000, labels } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    ...options,
  });
  
  const {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  } = useEmblaControls(emblaApi);

  const [isHovered, setIsHovered] = React.useState(false);

  // Autoplay logic
  React.useEffect(() => {
    if (!emblaApi || isHovered || !autoplayInterval) return;

    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      }
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [emblaApi, isHovered, autoplayInterval]);

  return (
    <div 
      className="w-full space-y-6 [--slide-spacing:1.5rem] [--slide-size:85%] sm:[--slide-size:80%] md:[--slide-size:75%]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {React.Children.map(children, (child, index) => {
            const isActive = index === selectedIndex;

            return (
              <motion.div
                key={index}
                className="mr-[var(--slide-spacing)] basis-[var(--slide-size)] flex-none flex min-w-0"
              >
                <motion.div
                  className="size-full"
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.9,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  transition={transition}
                >
                  {child}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center px-4">
        <button 
          onClick={onPrev} 
          disabled={prevDisabled}
          className="flex items-center justify-center p-2 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex flex-wrap justify-center items-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              label={labels?.[index] || `Slide ${index + 1}`}
              selected={index === selectedIndex}
              onClick={() => onDotClick(index)}
            />
          ))}
        </div>

        <button 
          onClick={onNext} 
          disabled={nextDisabled}
          className="flex items-center justify-center p-2 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

function DotButton({ selected = false, label, onClick }: DotButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      initial={false}
      className="flex cursor-pointer select-none items-center justify-center rounded-full border-none bg-accent text-accent-foreground text-sm overflow-hidden"
      animate={{
        width: selected ? "auto" : 12,
        height: selected ? 24 : 12,
      }}
      transition={transition}
      aria-label={label}
    >
      <motion.span
        layout
        initial={false}
        className="block whitespace-nowrap px-3 py-1 text-[10px] uppercase font-bold"
        animate={{
          opacity: selected ? 1 : 0,
          scale: selected ? 1 : 0,
          filter: selected ? "blur(0)" : "blur(4px)",
        }}
        transition={transition}
      >
        {selected ? label : ""}
      </motion.span>
    </motion.button>
  );
}

export { MotionCarousel };
