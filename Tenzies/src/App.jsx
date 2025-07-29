import { useState } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti"

function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());
  // const [heldDice, setHeldDice] = useState([]);

  const gamewon = dice.every((e) => e.isHeld) &&
  dice.every((e) => e.value === dice[0].value)
  
  

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      id: nanoid(),
      isHeld: false,
      value: Math.ceil(Math.random() * 6),
    }));
  }

  function handleClick() {
    if(gamewon){
      setDice(() =>generateAllNewDice())
      
      return;
    }
    setDice((oldDice) =>
      oldDice.map((e) => e.isHeld ? e : ({ ...e, value: Math.ceil(Math.random() * 6) }))
    );
  }

function diceClick(id) {
  setDice((oldDice) =>
    oldDice.map((e) =>
      e.id === id ? { ...e, isHeld: !e.isHeld } : e
    )
  );
}
  const diceElemnt = dice.map((e) => (
    <Die key={e.id} value={e.value} isHeld={e.isHeld} id={e.id} onClick={diceClick} />
  ));

  return (
    <main>
      {gamewon && <Confetti />}
      <div className="container">
        <h1>Tenzies</h1>
        <p>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls
        </p>
        <div className="btnContainer">{diceElemnt}</div>
        <button onClick={() => handleClick()} className="roll">
          {gamewon ? "New Game" : "Roll"}
        </button>
      </div>
    </main>
  );
}

export default App;
