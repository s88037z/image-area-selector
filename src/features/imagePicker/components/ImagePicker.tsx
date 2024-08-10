import TwoPaneLayout from "@/components/TwoPaneLayout";
import ImageUploader from "./ImageUploader";
import ImagePreviewer from "./ImagePreviewer";
import DataPrviewer from "./DataPrviewer";
import { Selection } from "../types";
import useSelections from "../hooks/useSelections";

export default function ImagePicker() {
  const { selections, scale, selectionsHandler } = useSelections();

  return (
    <TwoPaneLayout
      left={
        <ImageUploader
          renderPreview={(url) => (
            <ImagePreviewer
              url={url}
              selections={selections}
              selectionsHandler={selectionsHandler}
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
