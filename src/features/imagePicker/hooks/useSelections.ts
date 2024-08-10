import { useState } from "react";
import { Selection } from "../types";

export type SelectionsHandler = {
  deleteOne: (id: string) => void;
  updateOne: (currentId: string, newData: Partial<Selection>) => void;
  updateAll: (newSelections: Selection[]) => void;
  updateScale: (newScale: number) => void;
};

export default function useSelections() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [scale, setScale] = useState<number | null>(null);

  function deleteOne(id: string) {
    const newSelections = selections.filter((selection) => selection.id !== id);
    setSelections(newSelections);
  }
  function updateOne(currentId: string, newData: Partial<Selection>) {
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
  function updateAll(newSelections: Selection[]) {
    setSelections(newSelections);
  }
  function updateScale(newScale: number) {
    setScale(newScale);
  }

  const selectionsHandler: SelectionsHandler = {
    deleteOne,
    updateOne,
    updateAll,
    updateScale,
  };

  return {
    selections,
    scale,
    selectionsHandler,
  };
}
