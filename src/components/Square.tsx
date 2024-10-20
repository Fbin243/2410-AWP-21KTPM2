import { SquareStatus, TABLE_SIZE } from "../utils/types";

interface SquareProps {
  value: SquareStatus;
  onClick: (rowIndex: number, cellIndex: number) => void;
  rowIndex: number;
  cellIndex: number;
  winnerSquares: Array<number>;
}

export default function Square({ value, onClick, rowIndex, cellIndex, winnerSquares }: SquareProps) {
  const position = rowIndex * TABLE_SIZE + cellIndex;
  const isWinningSquare = winnerSquares.includes(position);
  return (
    <button className={isWinningSquare ? `square !bg-green-300` : `square`} onClick={() => onClick(rowIndex, cellIndex)}>
      {value == SquareStatus.Empty ? "" : value}
    </button>
  );
}
