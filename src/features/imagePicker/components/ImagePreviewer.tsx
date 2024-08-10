import { COLOR } from "@/constants";
import { css } from "@emotion/react";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import SelectionComp from "./Selection";
import useDrawSelection, { PointerStatus } from "../hooks/useDrawSelection";
import { Selection } from "../types";

const ImagePreviewerCss = {
  self: css({
    width: `${355 / 16}rem`,
    marginTop: "24px",
    position: "relative",
  }),
  img: css({
    width: "100%",
    display: "block",
  }),
};
const DrawingSelectionCss = {
  self: css({
    border: `3px dashed ${COLOR.orange500}`,
  }),
};

type ImagePreviewerProps = {
  url: string;
};

export default function ImagePreviewer({ url }: ImagePreviewerProps) {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [currentSelectionId, setCurrentSelectionId] = useState<string | null>(
    null,
  );
  const currentSelectionRef = useRef<Rnd>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const {
    darwingSelection,
    setPointerStatus,
    startDrawingPoint,
    drawingSelection,
    completeSelection,
  } = useDrawSelection({
    previewRef,
    setSelections,
  });

  function handleDeleteSelection(id: string) {
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
  function updateSelection(currentId: string, newData: Partial<Selection>) {
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

  return (
    <div
      css={ImagePreviewerCss.self}
      onPointerDown={startDrawingPoint}
      onPointerMove={drawingSelection}
      onPointerUp={completeSelection}
      ref={previewRef}
    >
      <img src={url} css={ImagePreviewerCss.img} draggable="false" />
      {selections &&
        previewRef.current &&
        selections.map(({ x, y, width, height, id }, idx) => {
          return (
            <SelectionComp
              ref={id == currentSelectionId ? currentSelectionRef : undefined}
              bounds={previewRef.current!}
              onClick={() => handleDeleteSelection(id)}
              key={id}
              size={{ width, height }}
              position={{ x, y }}
              onDragStop={(_, newData) => {
                if (checkCollision(idx, { x: newData.x, y: newData.y })) return;
                updateSelection(id, newData);
              }}
              onResizeStop={(_e, _d, ref, _delta, position) => {
                const newData = {
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  ...position,
                };
                if (checkCollision(idx, newData)) {
                  resetPostion(idx);
                } else {
                  updateSelection(id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    ...position,
                  });
                }
              }}
              onDrag={() => {
                setCurrentSelectionId(selections[idx].id);
              }}
              onPointerEnter={() => {
                setPointerStatus(PointerStatus.In);
              }}
              onPointerLeave={() => {
                setPointerStatus(PointerStatus.Out);
              }}
            />
          );
        })}
      {darwingSelection && (
        <Rnd
          css={DrawingSelectionCss.self}
          position={{ x: darwingSelection.x, y: darwingSelection.y }}
          size={{
            width: darwingSelection.width,
            height: darwingSelection.height,
          }}
        />
      )}
    </div>
  );
}

function hasCollision(current: Selection, other: Selection) {
  const noColision =
    current.x > other.x + other.width ||
    current.x + current.width < other.x ||
    current.y > other.y + other.height ||
    current.y + current.height < other.y;

  return !noColision;
}
