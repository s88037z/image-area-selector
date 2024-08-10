import { COLOR } from "@/constants";
import { css } from "@emotion/react";
import { Selection } from "../types";

const DataPrviewerCss = {
  container: css({
    width: "100%",
    height: "100%",
    backgroundColor: COLOR.blue900,
  }),
  data: css({
    color: COLOR.white,
    padding: "24px",
    margin: 0,
  }),
};

type DataPrviewerProps = {
  data: Selection[];
};

export default function DataPrviewer({ data }: DataPrviewerProps) {
  const showData: Omit<Selection, "id">[] = data.map(
    ({ id: _, ...rest }) => rest,
  );
  return (
    <div css={DataPrviewerCss.container}>
      <pre css={DataPrviewerCss.data}>{JSON.stringify(showData, null, 2)}</pre>
    </div>
  );
}
