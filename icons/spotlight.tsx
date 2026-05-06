"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle } from "react";

import { cn } from "@/lib/utils";

export interface SpotlightIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SpotlightIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const LINE_VARIANTS: Variants = {
  animate: {
    opacity: [0, 1],
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
  },
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

    const startAll = useCallback(() => {
      beamControls.start("animate").catch(() => {
        // ignore when interrupted by a new animation
      });
      lineControls.start("animate").catch(() => {
        // ignore when interrupted by a new animation
      });
    }, [beamControls, lineControls]);

    const stopAll = useCallback(() => {
      beamControls.start("normal").catch(() => {
        // ignore when interrupted
      });
      lineControls.start("visible").catch(() => {
        // ignore when interrupted
      });
    }, [beamControls, lineControls]);

    useImperativeHandle(
      ref,
      () => ({
        startAnimation: () => {
          startAll();
        },
        stopAnimation: () => stopAll(),
      }),
      [startAll, stopAll]
    );

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isRefControlled) {
          onMouseEnter?.(e);
        } else {
          startAll();
        }
      },
      [isRefControlled, onMouseEnter, startAll]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isRefControlled) {
          onMouseLeave?.(e);
        } else {
          stopAll();
        }
      },
      [isRefControlled, onMouseLeave, stopAll]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          style={{ overflow: "visible" }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.g
            animate={beamControls}
            initial="normal"
            style={{ transformOrigin: "8px 10px" }}
            variants={BEAM_GROUP_VARIANTS}
          >
            <path d="M8 9V2" />
            <path d="M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z" />
            <motion.path
              animate={lineControls}
              d="M15.295 19.562 16 22"
              variants={LINE_VARIANTS}
            />
            <motion.path
              animate={lineControls}
              d="m17 16 3.758 2.098"
              variants={LINE_VARIANTS}
            />
            <motion.path
              animate={lineControls}
              d="m19 12.5 3.026-.598"
              variants={LINE_VARIANTS}
            />
          </motion.g>
        </svg>
      </div>
    );
  }
);

SpotlightIcon.displayName = "SpotlightIcon";

export { SpotlightIcon };
