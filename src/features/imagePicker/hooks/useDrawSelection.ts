import { useState } from "react";
import { Selection, PointerStatus } from "../types";

type PressLocation = {
  data?: {
    x: number;
    y: number;
  };
  isPointerDown: boolean;
};

type useDrawSelectionProp = {
  setSelections: React.Dispatch<React.SetStateAction<Selection[]>>;
  previewRef: React.RefObject<HTMLDivElement>;
  pointerStatus: PointerStatus;
};

export default function useDrawSelection({
  setSelections,
  previewRef,
  pointerStatus,
}: useDrawSelectionProp) {
  const [pressLocation, setPressLocation] = useState<PressLocation>({
    isPointerDown: false,
  });
  const [darwingSelection, setDarwingSelection] = useState<Selection | null>(
    null,
  );

  function startDrawingPoint(e: React.PointerEvent<HTMLDivElement>) {
    if (previewRef.current) {
      const x = e.clientX - previewRef.current.getBoundingClientRect().left;
      const y = e.clientY - previewRef.current.getBoundingClientRect().top;
      if (pointerStatus == PointerStatus.In) return;
      setPressLocation({
        data: {
          x,
          y,
        },
        isPointerDown: true,
      });
    }
  }
  function drawingSelection(e: React.PointerEvent<HTMLDivElement>) {
    if (
      pressLocation.isPointerDown &&
      pressLocation.data &&
      previewRef.current
    ) {
      const newX = e.clientX - previewRef.current.getBoundingClientRect().left;
      const newY = e.clientY - previewRef.current.getBoundingClientRect().top;
      setDarwingSelection({
        id: crypto.randomUUID(),
        x: pressLocation.data.x,
        y: pressLocation.data.y,
        width: newX - pressLocation.data.x,
        height: newY - pressLocation.data.y,
      });
    }
  }
  function completeSelection() {
    setPressLocation({ isPointerDown: false });
    if (darwingSelection) {
      setSelections((pre) => [...pre, darwingSelection!]);
      setDarwingSelection(null);
    }
  }

  return {
    darwingSelection,
    setDarwingSelection,
    startDrawingPoint,
    drawingSelection,
    completeSelection,
  };
}
