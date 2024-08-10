export type Selection = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum PointerStatus {
  In = "in-selection",
  Out = "out-selection",
}
