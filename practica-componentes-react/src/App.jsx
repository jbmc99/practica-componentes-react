import { useState } from "react";
import confetti from "canvas-confetti";
import { Square } from "./components/Square.jsx";
import { TURNS, WINNER_COMBOS } from "./components/constants.js";
import { saveGame, resetGameStorage } from "./storage/index.js";
function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnLocalStorage = window.localStorage.getItem("turn");
    return turnLocalStorage ? turnLocalStorage : TURNS.X;
  });
  const [winner, setWinner] = useState(null); //null es que no hay ganador,
  //false es que hay un empate y el valor de la constante TURNS es el ganador

  const checkWinner = (boardToCheck) => {
    //revisamos todas las combinaciones ganadoras
    // para ver si X o O ganó
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] && // 0 => x u o
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a];
      }
    }
    //si no hay ganador y no hay espacios vacíos, es un empate
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    resetGameStorage();
  };

  const checkEndGame = (newBoard) => {
    //revisamos si hay un empate
    //si no hay más espacios vacíos en el tablero
    return newBoard.every((square) => square !== null);
  };

  const updateBoard = (index) => {
    //no actualizamos esta posición si ya tiene un valor
    if (board[index] || winner) return;

    //actualizar el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    //cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    // guardar aqui partida
    saveGame({ board: newBoard, turn: newTurn }
    );

    //revisar si hay un ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); //empate
    }
  };

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reiniciar juego</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      {winner !== null && (
        <section className="winner">
          <div className="text">
            <h2>{winner === false ? "Empate" : "Ganó: "}</h2>

            <header className="win">
              {winner && <Square>{winner}</Square>}
            </header>

            <footer>
              <button onClick={resetGame}>Empezar de nuevo</button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
