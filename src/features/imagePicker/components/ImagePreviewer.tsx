import { COLOR } from "@/constants";
import { css } from "@emotion/react";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import SelectionComp from "./Selection";
import useDrawSelection from "../hooks/useDrawSelection";
import { PointerStatus } from "../types";
import useSelections from "../hooks/useSelections";

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
  const [pointerStatus, setPointerStatus] = useState<PointerStatus>(
    PointerStatus.Out,
  );
  const previewRef = useRef<HTMLDivElement>(null);

  const {
    currentSelectionRef,
    currentSelectionId,
    initOnDragSelection,
    selections,
    setSelections,
    updateOneSelection,
    deleteOneSelection,
    checkCollision,
    resetPostion,
  } = useSelections({
    setPointerStatus,
  });

  const {
    darwingSelection,
    startDrawingPoint,
    drawingSelection,
    completeSelection,
  } = useDrawSelection({
    previewRef,
    setSelections,
    pointerStatus,
  });

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
        selections.map(({ x, y, width, height, id }, curIdx) => {
          return (
            <SelectionComp
              ref={id == currentSelectionId ? currentSelectionRef : undefined}
              bounds={previewRef.current!}
              onIconClick={() => deleteOneSelection(id)}
              key={id}
              size={{ width, height }}
              position={{ x, y }}
              onDragStop={(_, newData) => {
                if (checkCollision(curIdx, { x: newData.x, y: newData.y }))
                  return;
                updateOneSelection(id, newData);
              }}
              onResizeStop={(_e, _d, ref, _delta, position) => {
                const newData = {
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  ...position,
                };
                if (checkCollision(curIdx, newData)) {
                  resetPostion(curIdx);
                } else {
                  updateOneSelection(id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    ...position,
                  });
                }
              }}
              onDrag={() => {
                initOnDragSelection(selections[curIdx].id);
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
