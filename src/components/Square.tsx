import { SquareStatus } from "../utils/types";

interface SquareProps {
  value: SquareStatus | null;
  onClick: (rowIndex: number, cellIndex: number) => void;
  rowIndex: number;
  cellIndex: number;
}

export default function Square({ value, onClick, rowIndex, cellIndex }: SquareProps) {
  return (
    <button className="square" onClick={() => onClick(rowIndex, cellIndex)}>
      {value == SquareStatus.Empty ? "" : value}
    </button>
  );
}
