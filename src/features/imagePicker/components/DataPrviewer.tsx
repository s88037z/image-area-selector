import { COLOR } from "@/constants";
import { css } from "@emotion/react";

const DataPrviewerCss = {
  container: css({
    width: "100%",
    height: "100%",
    backgroundColor: COLOR.blue900,
  }),
};

export default function DataPrviewer() {
  return <div css={DataPrviewerCss.container}></div>;
}
