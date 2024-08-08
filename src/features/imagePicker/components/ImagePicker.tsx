import TwoPaneLayout from "@/components/TwoPaneLayout";
import ImageUploader from "./ImageUploader";
import DataPrviewer from "./DataPrviewer";

export default function ImagePicker() {
  return <TwoPaneLayout left={<ImageUploader />} right={<DataPrviewer />} />;
}
