import { useState } from "react";
import TwoPaneLayout from "@/components/TwoPaneLayout";
import ImageUploader from "./ImageUploader";
import ImagePreviewer from "./ImagePreviewer";
import DataPrviewer from "./DataPrviewer";
import { Selection } from "../types";

type PreviewData = {
  selections: Selection[];
  scale: number | null;
};

export default function ImagePicker() {
  const [previewData, setPreviewData] = useState<PreviewData>({
    selections: [],
    scale: null,
  });

  const { selections, scale } = previewData;

  function handleSelectionChange(newSelections: Selection[]) {
    setPreviewData((pre) => ({
      ...pre,
      selections: newSelections,
    }));
  }
  function handleImageScaleChange(newScale: number) {
    setPreviewData((pre) => ({
      ...pre,
      scale: newScale,
    }));
  }

  return (
    <TwoPaneLayout
      left={
        <ImageUploader
          renderPreview={(url) => (
            <ImagePreviewer
              url={url}
              selections={previewData.selections}
              onSelectionChange={handleSelectionChange}
              onImageScaleChange={handleImageScaleChange}
            />
          )}
        />
      }
      right={<DataPrviewer data={toIntrinsincSize(selections, scale)} />}
    />
  );
}

function toIntrinsincSize(
  selections?: Selection[],
  scale?: number | null,
): Selection[] {
  if (!selections || !scale) return [];
  return selections.map(({ id, ...rest }) => ({
    id,
    ...scaleProperties<typeof rest>(rest, scale),
  }));
}

function scaleProperties<T extends Record<string, number>>(
  obj: T,
  scale: number,
): T {
  const ans = (Object.keys(obj) as (keyof T)[]).reduce(
    (result, key) => {
      result[key] = Math.round(obj[key] * scale);

      return result;
    },
    {} as Record<keyof T, number>,
  );
  return ans as T;
}
