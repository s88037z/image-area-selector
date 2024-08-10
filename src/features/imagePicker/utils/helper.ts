import { Selection } from "@/features/imagePicker/types";

export function checkAllCollision(
  current: Selection,
  selections: Selection[],
  nextPostion?: Partial<Selection>,
) {
  return selections.some((selection) => {
    if (selection.id == current.id) return;
    if (
      hasCollision(
        { ...current, ...(nextPostion ? nextPostion : {}) },
        selection,
      )
    )
      return true;
  });
}

export function hasCollision(current: Selection, other: Selection) {
  const noColision =
    current.x > other.x + other.width ||
    current.x + current.width < other.x ||
    current.y > other.y + other.height ||
    current.y + current.height < other.y;

  return !noColision;
}
