import { COLOR } from "@/constants";
import { css } from "@emotion/react";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import SelectionComp from "./Selection";
import useDrawSelection from "../hooks/useDrawSelection";
import { PointerStatus, Selection } from "../types";
import useSelectionsHandlers from "../hooks/useSelectionsHandlers";

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
  selections: Selection[];
  url: string;
  onSelectionChange: (selections: Selection[]) => void;
  onImageScaleChange: (newScale: number) => void;
};

export default function ImagePreviewer({
  selections,
  url,
  onSelectionChange,
  onImageScaleChange,
}: ImagePreviewerProps) {
  const [pointerStatus, setPointerStatus] = useState<PointerStatus>(
    PointerStatus.Out,
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function updatePointerStatus(newStatus: PointerStatus) {
    setPointerStatus(newStatus);
  }
  const {
    initOnDragSelection,
    currentSelectionRef,
    currentSelectionId,
    updateOneSelection,
    deleteOneSelection,
    checkCollision,
    resetPostion,
  } = useSelectionsHandlers({
    selections,
    updatePointerStatus,
    onSelectionChange,
  });

  const {
    darwingSelection,
    startDrawingPoint,
    drawingSelection,
    completeSelection,
  } = useDrawSelection({
    previewRef,
    selections,
    onSelectionChange,
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
      <img
        src={url}
        css={ImagePreviewerCss.img}
        draggable="false"
        ref={imgRef}
        onLoad={() => {
          const el = imgRef.current!;
          onImageScaleChange(el.naturalWidth / el.clientWidth);
        }}
      />
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
                const newPosition = { x: newData.x, y: newData.y };
                if (checkCollision(curIdx, { x: newData.x, y: newData.y }))
                  return;
                updateOneSelection(id, newPosition);
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
