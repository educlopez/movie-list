"use client";

import { useCallback, useEffect, useRef } from "react";

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  const onPointerDown = useCallback((e: PointerEvent) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current) {
      return;
    }
    const el = ref.current;
    if (!el) {
      return;
    }
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMoved.current = true;
    }
    el.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onPointerUp = useCallback((e: PointerEvent) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    isDragging.current = false;
    el.style.cursor = "grab";
    el.style.userSelect = "";
    el.releasePointerCapture(e.pointerId);
  }, []);

  const onClick = useCallback((e: MouseEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClick, true);
    };
  }, [onPointerDown, onPointerMove, onPointerUp, onClick]);

  return ref;
}
