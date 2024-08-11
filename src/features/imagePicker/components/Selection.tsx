import TrashCanIcon from "@/components/TrashCanIcon";
import { COLOR } from "@/constants";
import { RemoveIndex } from "@/types";
import { css } from "@emotion/react";
import { forwardRef } from "react";
import { Rnd, type Props as RndProps } from "react-rnd";

const SelectionCss = {
  self: css({
    position: "relative",
    border: `3px solid ${COLOR.orange500}`,
  }),
  trashCan: css({
    position: "absolute",
    top: -2,
    right: -30,
    backgroundColor: COLOR.white,
    color: COLOR.white,
    cursor: "pointer",
  }),
  icon: css({
    display: "block",
  }),
  index: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.grey300,
    width: `${24 / 16}rem`,
    height: `${24 / 16}rem`,
    borderRadius: `${12 / 16}rem`,
    margin: `4px 0px 0px 4px`,
  }),
};

type SelectionProps = {
  onIconClick: React.MouseEventHandler<HTMLDivElement>;
} & RemoveIndex<RndProps> &
  React.DOMAttributes<HTMLElement>;

export const Selection = forwardRef<Rnd, SelectionProps>(
  ({ onIconClick, children, ...rest }, ref) => {
    return (
      <Rnd css={SelectionCss.self} ref={ref} {...rest}>
        <div css={SelectionCss.trashCan} onClick={onIconClick}>
          <TrashCanIcon css={SelectionCss.icon} size={28} />
        </div>
        <span css={SelectionCss.index}>{children}</span>
      </Rnd>
    );
  },
);

export default Selection;
