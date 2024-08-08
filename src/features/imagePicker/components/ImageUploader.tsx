import ImageIcon from "@/components/ImageIcon";
import { COLOR } from "@/constants";
import { css } from "@emotion/react";

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
    "&:hover": {
      cursor: "pointer",
    },
  }),
  circle: css({
    display: "block",
    width: `${24 / 16}rem`,
    height: `${24 / 16}rem`,
    backgroundColor: COLOR.grey300,
    borderRadius: `${12 / 16}rem`,
  }),
};

export default function ImageUploader() {
  return (
    <div css={ImageUploaderCss.container}>
      <header css={ImageUploaderCss.header}>
        <span css={ImageUploaderCss.circle} />
      </header>
      <div css={ImageUploaderCss.content}>
        <div css={ImageUploaderCss.uploadArea}>
          <ImageIcon size={36} />
          Upload Image
        </div>
      </div>
    </div>
  );
}
