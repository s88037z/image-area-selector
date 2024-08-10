import { useRef, useState } from "react";
import { Selection, PointerStatus } from "../types";
import { Rnd } from "react-rnd";

type useSelectionsProps = {
  setPointerStatus: React.Dispatch<React.SetStateAction<PointerStatus>>;
};

export default function useSelections({
  setPointerStatus,
}: useSelectionsProps) {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [currentSelectionId, setCurrentSelectionId] = useState<string | null>(
    null,
  );
  const currentSelectionRef = useRef<Rnd>(null);

  function deleteOneSelection(id: string) {
    const newSlections = selections.filter((selection) => selection.id !== id);
    setSelections(newSlections);
    setPointerStatus(PointerStatus.Out);
  }

  function checkCollision(curIdx: number, newData: Partial<Selection>) {
    const current = selections[curIdx];
    return selections.some((selection) => {
      if (selection.id == current.id) return;
      if (hasCollision({ ...current, ...newData }, selection)) return true;
    });
  }
  function updateOneSelection(currentId: string, newData: Partial<Selection>) {
    const newSelections = selections.map((selection) => {
      if (selection.id == currentId) {
        return {
          ...selection,
          ...newData,
        };
      }
      return { ...selection };
    });

    setSelections(newSelections);
  }

  function resetPostion(curIdx: number) {
    if (currentSelectionRef.current) {
      return currentSelectionRef.current.updatePosition({
        x: selections[curIdx].x,
        y: selections[curIdx].y,
      });
    }
  }

  function trackCurrentSelectionId(id: string) {
    setCurrentSelectionId(id);
  }

  return {
    currentSelectionRef,
    currentSelectionId,
    initOnDragSelection: trackCurrentSelectionId,
    selections,
    setSelections,
    updateOneSelection,
    deleteOneSelection,
    checkCollision,
    resetPostion,
  };
}

function hasCollision(current: Selection, other: Selection) {
  const noColision =
    current.x > other.x + other.width ||
    current.x + current.width < other.x ||
    current.y > other.y + other.height ||
    current.y + current.height < other.y;

  return !noColision;
}
