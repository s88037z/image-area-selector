import { css, type Interpolation, type Theme } from "@emotion/react";
const VisuallyHiddenProps = {
  self: css({
    position: "absolute",
    overflow: "hidden",
    clipPath: "rect(0 0 0 0)",
    width: "1px",
    height: "1px",
    margin: "-1px",
    padding: 0,
    border: 0,
  }),
};

type VisuallyHiddenProps = React.PropsWithChildren<
  {
    css?: Interpolation<Theme>;
  } & React.HTMLAttributes<HTMLDivElement>
>;

export default function VisuallyHidden({
  children,
  ...rest
}: VisuallyHiddenProps) {
  return (
    <div css={VisuallyHiddenProps.self} {...rest}>
      {children}
    </div>
  );
}
