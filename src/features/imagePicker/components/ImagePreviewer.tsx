import { COLOR } from "@/constants";
import { css } from "@emotion/react";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import Selection from "./Selection";

const ImagePreviewerCss = {
  self: css({
    width: `${355 / 16}rem`,
    marginTop: "24px",
    position: "relative",
  }),
  img: css({
    width: "100%",
    position: "absolute",
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

type Selection = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
type PressLocation = {
  data?: {
    x: number;
    y: number;
  };
  isPressed: boolean;
};

enum PointerStatus {
  In = "in-selection",
  Out = "out-selection",
}

export default function ImagePreviewer({ url }: ImagePreviewerProps) {
  const [pointerStatus, setPointerStatus] = useState<PointerStatus>(
    PointerStatus.Out,
  );
  const [pressLocation, setPressLocation] = useState<PressLocation>({
    isPressed: false,
  });
  const [darwingSelection, setDarwingSelection] = useState<Selection | null>(
    null,
  );
  const [selections, setSelections] = useState<Selection[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  function startDrawingPoint(e: React.PointerEvent<HTMLDivElement>) {
    if (previewRef.current) {
      const x = e.clientX - previewRef.current?.getBoundingClientRect().left;
      const y = e.clientY - previewRef.current?.getBoundingClientRect().top;
      if (pointerStatus == PointerStatus.In) return;
      setPressLocation({
        data: {
          x,
          y,
        },
        isPressed: true,
      });
    }
  }
  function drawingSelection(e: React.PointerEvent<HTMLDivElement>) {
    if (pressLocation.isPressed && pressLocation.data && previewRef.current) {
      const newX = e.clientX - previewRef.current?.getBoundingClientRect().left;
      const newY = e.clientY - previewRef.current?.getBoundingClientRect().top;
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
    setPressLocation({ isPressed: false });
    if (darwingSelection) {
      setSelections((pre) => [...pre, darwingSelection!]);
      setDarwingSelection(null);
    }
  }

  function handleDeleteSelection(id: string) {
    const newSlections = selections.filter((selection) => selection.id !== id);
    setSelections(newSlections);
    setPointerStatus(PointerStatus.Out);
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
        selections.map(({ x, y, width, height, id }) => {
          return (
            <Selection
              onClick={() => handleDeleteSelection(id)}
              key={id}
              default={{ x, y, width, height }}
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
