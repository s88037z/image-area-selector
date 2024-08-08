import { COLOR } from "@/constants";
import { css } from "@emotion/react";

const TwoPaneLayoutCss = {
  container: css({
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
  }),
  leftPane: css({
    width: `${433 / 16}rem`,
    height: `${792 / 16}rem`,
    boxShadow: `0px 8px 24px 4px ${COLOR.grey300}`,
    borderRadius: "8px",
    overflow: "hidden",
  }),
  rightPane: css({
    width: `${548 / 16}rem`,
    height: `${703 / 16}rem`,
    border: "1px solid black",
    borderRadius: "8px",
    overflow: "hidden",
  }),
  spacer: css({
    flexBasis: "135px",
    flexShrink: 999,
  }),
};

type TwoPaneLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export default function TwoPaneLayout({ left, right }: TwoPaneLayoutProps) {
  return (
    <main css={TwoPaneLayoutCss.container}>
      <section css={TwoPaneLayoutCss.leftPane}>{left}</section>
      <div css={TwoPaneLayoutCss.spacer} />
      <section css={TwoPaneLayoutCss.rightPane}>{right}</section>
    </main>
  );
}
