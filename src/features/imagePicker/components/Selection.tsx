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
};

type SelectionProps = {
  onClick: React.MouseEventHandler<HTMLDivElement>;
} & RemoveIndex<RndProps> &
  React.DOMAttributes<HTMLElement>;

export const Selection = forwardRef<Rnd, SelectionProps>(
  ({ onClick, ...rest }, ref) => {
    return (
      <Rnd css={SelectionCss.self} ref={ref} {...rest}>
        <div css={SelectionCss.trashCan} onClick={onClick}>
          <TrashCanIcon css={SelectionCss.icon} size={28} />
        </div>
      </Rnd>
    );
  },
);

export default Selection;
