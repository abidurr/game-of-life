import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const numRows = 35;
const numCols = 80;

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
];

const generateEmptyGrid = () => {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 300);
  }, []);

  return (
    <>
    <div className="buttons">
      <h1>Conway's (RIP) Game of <b>Life</b></h1>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </button>

      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.75 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        Random
      </button>

      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        Clear
      </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) => 
        rows.map((cols, j) => (
          <div
          key={`${i}-${j}`}
          onClick={() => {
            const newGrid = produce(grid, gridCopy => {
              gridCopy[i][j] = grid[i][j] ? 0 : 1;
            });
            setGrid(newGrid);
          }}
          style={{
            width: 20,
            height: 20,
            backgroundColor: grid[i][j] ? "#1891ac" : undefined,
            border: "solid 1px #253b6e"
          }}
          />
        ))
        )}
      </div>
    </>
  );
};

export default App;
