import { useState } from "react";
import Square from "./components/Square";
import { SquareStatus, TABLE_SIZE } from "./utils/types";

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [table, setTable] = useState(Array(TABLE_SIZE).fill(Array(TABLE_SIZE).fill(SquareStatus.Empty)));
  const [winner, setWinner] = useState<SquareStatus | null>(null);

  const handleClickOnSquare = (rowIndex: number, cellIndex: number) => {
    if (table[rowIndex][cellIndex] !== SquareStatus.Empty || winner) {
      return;
    }

    setCurrentStep(currentStep + 1);
    const updatedTable = table.map((row) => [...row]);
    updatedTable[rowIndex][cellIndex] = currentStep % 2 === 0 ? "X" : "O";
    setTable(updatedTable);
    setWinner(calculateWinner(updatedTable));
  };

  return (
    <>
      <h3>You are at move #{currentStep}</h3>
      {winner ? (
        <h3>{winner} wins!</h3>
      ) : currentStep === TABLE_SIZE * TABLE_SIZE ? (
        <h3>It's a draw!</h3>
      ) : (
        <h3>Next player: {currentStep % 2 === 0 ? SquareStatus.X : SquareStatus.O}</h3>
      )}
      {table.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="board-row">
            {row.map((cell: SquareStatus, cellIndex: number) => {
              return (
                <Square
                  key={cellIndex}
                  onClick={handleClickOnSquare}
                  value={cell}
                  rowIndex={rowIndex}
                  cellIndex={cellIndex}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function calculateWinner(table: SquareStatus[][]): SquareStatus | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const cell1 = table[Math.floor(a / TABLE_SIZE)][a % TABLE_SIZE];
    const cell2 = table[Math.floor(b / TABLE_SIZE)][b % TABLE_SIZE];
    const cell3 = table[Math.floor(c / TABLE_SIZE)][c % TABLE_SIZE];

    if (cell1 !== SquareStatus.Empty && cell1 === cell2 && cell1 === cell3) {
      return cell1;
    }
  }
  return null;
}

export default App;
