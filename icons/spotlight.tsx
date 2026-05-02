"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface SpotlightIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SpotlightIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const LINE_VARIANTS: Variants = {
  visible: { pathLength: 1, opacity: 1 },
  hidden: { pathLength: 0, opacity: 0 },
};

const BEAM_GROUP_VARIANTS: Variants = {
  normal: { rotate: 0 },
  animate: {
    rotate: [0, -10, 10, -5, 5, 0],
    transition: {
      duration: 1.2,
      ease: "easeInOut",
    },
  },
};

const SpotlightIcon = forwardRef<SpotlightIconHandle, SpotlightIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const lineControls = useAnimation();
    const beamControls = useAnimation();
    const isRefControlled = ref != null;

    const runLineIntro = useCallback(async () => {
      await lineControls.start((i: number) => ({
        pathLength: 0,
        opacity: 0,
        transition: { delay: i * 0.1, duration: 0.3 },
      }));
      await lineControls.start((i: number) => ({
        pathLength: 1,
        opacity: 1,
        transition: { delay: i * 0.1, duration: 0.3 },
      }));
    }, [lineControls]);

    const startAll = useCallback(async () => {
      void beamControls.start("animate");
      await runLineIntro();
    }, [beamControls, runLineIntro]);

    const stopAll = useCallback(() => {
      void lineControls.start("visible");
      void beamControls.start("normal");
    }, [beamControls, lineControls]);

    useImperativeHandle(
      ref,
      () => ({
        startAnimation: () => void startAll(),
        stopAnimation: () => stopAll(),
      }),
      [startAll, stopAll],
    );

    const handleMouseEnter = useCallback(
      async (e: React.MouseEvent<HTMLDivElement>) => {
        if (isRefControlled) {
          onMouseEnter?.(e);
        } else {
          await startAll();
        }
      },
      [isRefControlled, onMouseEnter, startAll],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isRefControlled) {
          onMouseLeave?.(e);
        } else {
          stopAll();
        }
      },
      [isRefControlled, onMouseLeave, stopAll],
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 9V2" />

          <motion.g
            animate={beamControls}
            initial="normal"
            style={{ transformOrigin: "8px 10px" }}
            variants={BEAM_GROUP_VARIANTS}
          >
            <path d="M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z" />
            <motion.path
              animate={lineControls}
              custom={0}
              d="M15.295 19.562 16 22"
              initial="visible"
              variants={LINE_VARIANTS}
            />
            <motion.path
              animate={lineControls}
              custom={1}
              d="m17 16 3.758 2.098"
              initial="visible"
              variants={LINE_VARIANTS}
            />
            <motion.path
              animate={lineControls}
              custom={2}
              d="m19 12.5 3.026-.598"
              initial="visible"
              variants={LINE_VARIANTS}
            />
          </motion.g>
        </svg>
      </div>
    );
  },
);

SpotlightIcon.displayName = "SpotlightIcon";

export { SpotlightIcon };
