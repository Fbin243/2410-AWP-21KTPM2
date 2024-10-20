import { useState } from "react";
import Square from "./components/Square";
import Toggle from "./components/ToggleButton";
import { SortOrder, SquareStatus, TABLE_SIZE } from "./utils/types";

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [table, setTable] = useState<SquareStatus[][]>(
    Array(TABLE_SIZE).fill(Array(TABLE_SIZE).fill(SquareStatus.Empty))
  );
  const [winner, setWinner] = useState<SquareStatus | null>(null);
  const [winnerSquares, setWinnerSquares] = useState<Array<number>>([]);
  const [history, setHistory] = useState<Array<[number, number]>>([]);
  const [sortBy, setSortBy] = useState<SortOrder>(SortOrder.Ascending);

  const handleToggleButton = () => {
    console.log("toggle button clicked");
    setSortBy((prevSortBy) => (prevSortBy == SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending));
    setHistory((prevHistory) => [...prevHistory].reverse());
  };

  const handleClickOnSquare = (rowIndex: number, cellIndex: number) => {
    if (table[rowIndex][cellIndex] !== SquareStatus.Empty || winner) {
      return;
    }

    setCurrentStep(currentStep + 1);
    const updatedTable: SquareStatus[][] = table.map((row) => [...row]);
    updatedTable[rowIndex][cellIndex] = currentStep % 2 === 0 ? SquareStatus.X : SquareStatus.O;
    setTable(updatedTable);

    const [_winner, winningSquares] = calculateWinner(updatedTable);
    setWinner(_winner);
    setWinnerSquares(winningSquares);
    setHistory([...history, [rowIndex, cellIndex]]);
  };

  const jumpTo = (move: number) => {
    setCurrentStep(move);
    setWinner(null);
    setWinnerSquares([]);

    const newHistory = history.slice(0, move);
    setHistory(newHistory);

    // const newTable: SquareStatus[][] = Array(TABLE_SIZE).fill(Array(TABLE_SIZE).fill(SquareStatus.Empty));

    const newTable: SquareStatus[][] = Array.from({ length: TABLE_SIZE }, () =>
      Array(TABLE_SIZE).fill(SquareStatus.Empty)
    );
    for (const item of newHistory) {
      const [rowIndex, cellIndex] = item;
      newTable[rowIndex][cellIndex] = table[rowIndex][cellIndex];
    }

    setTable(newTable);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        {winner ? (
          <h3>
            Game finished.
            <br /> {winner} wins!
          </h3>
        ) : currentStep === TABLE_SIZE * TABLE_SIZE ? (
          <h3>
            Game finished.
            <br />
            It's a draw!
          </h3>
        ) : (
          <h3>
            You are at move #{currentStep + 1}
            <br />
            Turn of {currentStep % 2 === 0 ? SquareStatus.X : SquareStatus.O}
          </h3>
        )}
        {table.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="board-row">
              {row.map((cell: SquareStatus, cellIndex: number) => {
                return (
                  <Square
                    winnerSquares={winnerSquares}
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
        <ol className="absolute left-[120%] top-0 min-w-[200px]">
          <Toggle sortBy={sortBy} onToggle={handleToggleButton} />
          <button className="mb-2 bg-red-300 border-red-900 border-solid border" onClick={() => jumpTo(0)}>
            Reset game
          </button>
          {history.map((step, move) => {
            if (sortBy === SortOrder.Descending) {
              move = history.length - move - 1;
            }
            
            const player = move % 2 === 0 ? SquareStatus.X : SquareStatus.O;
            const desc = ` ${player} played at [${step[0]}, ${step[1]}]`;

            return (
              <li key={move}>
                <button
                  className="mb-2 bg-red-300 border-red-900 border-solid border"
                  onClick={() => jumpTo(move + 1)}
                >{`Move #${move + 1} `}</button>{" "}
                {desc}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(table: SquareStatus[][]): [SquareStatus | null, Array<number>] {
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
      return [cell1, [a, b, c]];
    }
  }
  return [null, []];
}

export default App;
