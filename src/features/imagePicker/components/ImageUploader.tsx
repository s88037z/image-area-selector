import ImageIcon from "@/components/ImageIcon";
import { COLOR } from "@/constants";
import { css } from "@emotion/react";
import { useEffect, useId, useState } from "react";
import ImagePreviewer from "./ImagePreviewer";

const ImageUploaderCss = {
  container: css({
    display: "flex",
    flexDirection: "column",
    height: "100%",
  }),
  header: css({
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: `${56 / 16}rem`,
    padding: "4px 24px",
    backgroundColor: COLOR.grey100,
  }),
  content: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: COLOR.blue100,
    height: "100%",
  }),
  uploadArea: css({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: `${355 / 16}rem`,
    height: `${156 / 16}rem`,
    marginTop: "40px",
    border: `2px solid ${COLOR.grey300}`,
    borderRadius: "8px",
    backgroundColor: COLOR.white,
    color: COLOR.grey700,
  }),
  circle: css({
    display: "block",
    width: `${24 / 16}rem`,
    height: `${24 / 16}rem`,
    backgroundColor: COLOR.grey300,
    borderRadius: `${12 / 16}rem`,
  }),
  hiddenInput: css({
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0,
    "&:hover": {
      cursor: "pointer",
    },
  }),
};

export default function ImageUploader() {
  const imageUploadId = useId();
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e?.target?.files?.[0]) return;
    const file = e.target.files[0];
    const objectURL = window.URL.createObjectURL(file);
    setPreviewURL(objectURL);
  }

  useEffect(() => {
    return () => {
      if (previewURL) {
        window.URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  return (
    <div css={ImageUploaderCss.container}>
      <header css={ImageUploaderCss.header}>
        <span css={ImageUploaderCss.circle} />
      </header>
      <div css={ImageUploaderCss.content}>
        {previewURL ? (
          <ImagePreviewer url={previewURL} />
        ) : (
          <div css={ImageUploaderCss.uploadArea}>
            <ImageIcon size={36} />
            <input
              css={ImageUploaderCss.hiddenInput}
              type="file"
              id={`image-uploader-${imageUploadId}`}
              onChange={handleFileChange}
            />
            <label htmlFor={`image-uploader-${imageUploadId}`}>
              Upload Image
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
