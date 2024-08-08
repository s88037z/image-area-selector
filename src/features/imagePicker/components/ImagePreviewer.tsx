import { css } from "@emotion/react";

type ImagePreviewerProps = {
  url: string;
};

const ImagePreviewerCss = {
  self: css({
    width: `${355 / 16}rem`,
    marginTop: "24px",
  }),
  img: css({
    width: "100%",
  }),
};

export default function ImagePreviewer({ url }: ImagePreviewerProps) {
  return (
    <div css={ImagePreviewerCss.self}>
      <img src={url} css={ImagePreviewerCss.img} />
    </div>
  );
}
