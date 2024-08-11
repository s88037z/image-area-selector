import { COLOR } from "@/constants";
import { css } from "@emotion/react";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import SelectionComp from "./Selection";
import useDrawSelection from "../hooks/useDrawSelection";
import { PointerStatus, Selection } from "../types";
import { checkAllCollision } from "../utils/helper";
import { SelectionsHandler } from "../hooks/useSelections";

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
  selectionsHandler: SelectionsHandler;
  url: string;
};

export default function ImagePreviewer({
  selections,
  url,
  selectionsHandler,
}: ImagePreviewerProps) {
  const [pointerStatus, setPointerStatus] = useState<PointerStatus>(
    PointerStatus.Out,
  );
  const [currentSelectionId, setCurrentSelectionId] = useState<string | null>(
    null,
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const currentSelectionRef = useRef<Rnd>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { creatingSelection, startDraw, drawing, completeDraw } =
    useDrawSelection({
      previewRef,
      selections,
      onSelectionsChange: selectionsHandler.updateAll,
      pointerStatus,
    });

  function rePosition(curSelectionIdx: number) {
    if (currentSelectionRef.current) {
      return currentSelectionRef.current.updatePosition({
        x: selections[curSelectionIdx].x,
        y: selections[curSelectionIdx].y,
      });
    }
  }

  function trackChosenId(id: string) {
    setCurrentSelectionId(id);
  }

  return (
    <div
      css={ImagePreviewerCss.self}
      onPointerDown={startDraw}
      onPointerMove={drawing}
      onPointerUp={completeDraw}
      ref={previewRef}
    >
      <img
        src={url}
        css={ImagePreviewerCss.img}
        draggable="false"
        ref={imgRef}
        onLoad={() => {
          const el = imgRef.current!;
          selectionsHandler.updateScale(el.naturalWidth / el.clientWidth);
        }}
      />
      {selections &&
        previewRef.current &&
        selections.map(({ x, y, width, height, id }, curIdx) => {
          return (
            <SelectionComp
              onPointerDown={() => {
                trackChosenId(id);
              }}
              ref={id == currentSelectionId ? currentSelectionRef : undefined}
              bounds={previewRef.current!}
              onIconClick={() => {
                selectionsHandler.deleteOne(id);
                setPointerStatus(PointerStatus.Out);
              }}
              key={id}
              size={{ width, height }}
              position={{ x, y }}
              onDragStop={(_, newData) => {
                const newPosition = { x: newData.x, y: newData.y };
                if (
                  checkAllCollision(selections[curIdx], selections, {
                    x: newData.x,
                    y: newData.y,
                  })
                ) {
                  return;
                }
                selectionsHandler.updateOne(id, newPosition);
              }}
              onResizeStop={(_e, _d, ref, _delta, position) => {
                const newData = {
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  ...position,
                };
                if (
                  checkAllCollision(selections[curIdx], selections, newData)
                ) {
                  //Cancel resizing sometime cause unexpected postion-shifting.
                  //So re position to the same location to avoid it.
                  rePosition(curIdx);
                } else {
                  selectionsHandler.updateOne(id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    ...position,
                  });
                }
              }}
              onPointerEnter={() => {
                setPointerStatus(PointerStatus.In);
              }}
              onPointerLeave={() => {
                setPointerStatus(PointerStatus.Out);
              }}
            >
              {curIdx + 1}
            </SelectionComp>
          );
        })}
      {creatingSelection && (
        <Rnd
          css={DrawingSelectionCss.self}
          position={{ x: creatingSelection.x, y: creatingSelection.y }}
          size={{
            width: creatingSelection.width,
            height: creatingSelection.height,
          }}
        />
      )}
    </div>
  );
}
