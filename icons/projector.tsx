"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ProjectorIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ProjectorIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const RAY_LINE_VARIANTS: Variants = {
  visible: { pathLength: 1, opacity: 1, scale: 1 },
  hidden: { pathLength: 0, opacity: 0, scale: 1 },
};

const PROJECTOR_BODY_VARIANTS: Variants = {
  normal: {
    scale: 1,
    y: 0,
  },
  animate: {
    scale: [1, 1.08, 1],
    y: [0, -1, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

const ProjectorIcon = forwardRef<ProjectorIconHandle, ProjectorIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const pathControls = useAnimation();
    const bodyControls = useAnimation();
    const isRefControlled = ref != null;

    const runRayDrawSequence = useCallback(async () => {
      await pathControls.start((i: number) => ({
        scale: [1, 1.08, 1],
        pathLength: 0,
        opacity: 0,
        transition: { delay: i * 0.1, duration: 0.3 },
      }));
      await pathControls.start((i: number) => ({
        scale: [1, 1.08, 1],
        pathLength: 1,
        opacity: 1,
        transition: { delay: i * 0.1, duration: 0.35, ease: "easeOut" },
      }));
    }, [pathControls]);

    const resetRaysVisible = useCallback(() => {
      void pathControls.start("visible");
    }, [pathControls]);

    const startAll = useCallback(async () => {
      void bodyControls.start("animate");
      await runRayDrawSequence();
    }, [bodyControls, runRayDrawSequence]);

    const stopAll = useCallback(() => {
      resetRaysVisible();
      void bodyControls.start("normal");
    }, [bodyControls, resetRaysVisible]);

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
        onMouseLeave={onMouseLeave}
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
          <motion.path
            animate={pathControls}
            custom={0}
            d="M5 7 3 5"
            initial="visible"
            style={{ transformBox: "fill-box" as const }}
            variants={RAY_LINE_VARIANTS}
          />
          <motion.path
            animate={pathControls}
            custom={1}
            d="M9 6V3"
            initial="visible"
            style={{ transformBox: "fill-box" as const }}
            variants={RAY_LINE_VARIANTS}
          />
          <motion.path
            animate={pathControls}
            custom={2}
            d="m13 7 2-2"
            initial="visible"
            style={{ transformBox: "fill-box" as const }}
            variants={RAY_LINE_VARIANTS}
          />
          <motion.g
            animate={bodyControls}
            initial="normal"
            variants={PROJECTOR_BODY_VARIANTS}
          >
            <circle cx="9" cy="13" r="3" />
            <path d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17" />
            <path d="M16 16h2" />
          </motion.g>
        </svg>
      </div>
    );
  },
);

ProjectorIcon.displayName = "ProjectorIcon";

export { ProjectorIcon };
