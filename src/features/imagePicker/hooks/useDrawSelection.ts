import { useState } from "react";
import { Selection, PointerStatus } from "../types";
import { checkAllCollision } from "../utils/helper";

type PressLocation = {
  data?: {
    x: number;
    y: number;
  };
  isPointerDown: boolean;
};

type useDrawSelectionProp = {
  selections: Selection[];
  onSelectionsChange: (selections: Selection[]) => void;
  previewRef: React.RefObject<HTMLDivElement>;
  pointerStatus: PointerStatus;
};

export default function useDrawSelection({
  selections,
  onSelectionsChange,
  previewRef,
  pointerStatus,
}: useDrawSelectionProp) {
  const [pressLocation, setPressLocation] = useState<PressLocation>({
    isPointerDown: false,
  });
  const [creatingSelection, setCreatingSelection] = useState<Selection | null>(
    null,
  );

  function startDraw(e: React.PointerEvent<HTMLDivElement>) {
    if (previewRef.current) {
      if (pointerStatus == PointerStatus.In) return;
      const x = e.clientX - previewRef.current.getBoundingClientRect().left;
      const y = e.clientY - previewRef.current.getBoundingClientRect().top;
      setPressLocation({
        data: {
          x,
          y,
        },
        isPointerDown: true,
      });
    }
  }
  function drawing(e: React.PointerEvent<HTMLDivElement>) {
    if (
      pressLocation.isPointerDown &&
      pressLocation.data &&
      previewRef.current
    ) {
      const newX = e.clientX - previewRef.current.getBoundingClientRect().left;
      const newY = e.clientY - previewRef.current.getBoundingClientRect().top;
      setCreatingSelection({
        id: crypto.randomUUID(),
        x: pressLocation.data.x,
        y: pressLocation.data.y,
        width: newX - pressLocation.data.x,
        height: newY - pressLocation.data.y,
      });
    }
  }
  function completeDraw() {
    setPressLocation({ isPointerDown: false });
    if (creatingSelection) {
      if (!checkAllCollision(creatingSelection, selections)) {
        onSelectionsChange([...selections, creatingSelection]);
      }
      setCreatingSelection(null);
    }
  }

  return {
    creatingSelection,
    setCreatingSelection,
    startDraw,
    drawing,
    completeDraw,
  };
}
