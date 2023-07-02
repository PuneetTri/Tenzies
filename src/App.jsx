import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./app.css";
import Dice from "./components/Dice";

export default function App() {
  const randomizeDice = () => {
    let array = [];

    for (let i = 0; i < 10; ++i) {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      array.push({ value: randomNumber, isHeld: false });
    }

    return array;
  };

  const [diceValues, setDiceValues] = useState(() => randomizeDice());
  const [tenzies, setTenzies] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const score = localStorage.getItem("bestScore");
    if (score) return score;
    return 0;
  });

  const rollDice = () => {
    const randomizedValues = randomizeDice();
    setDiceValues((prevDiceValues) => {
      return prevDiceValues.map((prevDiceValue, index) => {
        if (!prevDiceValue.isHeld) {
          return {
            value: randomizedValues[index].value,
            isHeld: false,
          };
        }
        return prevDiceValue;
      });
    });

    setRollCount((prevRollCount) => prevRollCount + 1);
  };

  const newGame = () => {
    if (bestScore > rollCount || bestScore == 0) {
      setBestScore(rollCount);
      localStorage.setItem("bestScore", rollCount);
    }

    setRollCount(0);
    setDiceValues(randomizeDice);
  };

  const holdDice = (id) => {
    setDiceValues((prevDiceValues) => {
      return prevDiceValues.map((prevDiceValue, index) => {
        if (index === id) {
          return { value: prevDiceValue.value, isHeld: !prevDiceValue.isHeld };
        }
        return prevDiceValue;
      });
    });
  };

  useEffect(() => {
    const firstValue = diceValues[0].value;
    for (let i = 1; i < diceValues.length; i++) {
      if (diceValues[i].value !== firstValue.value && !diceValues[i].isHeld) {
        setTenzies(false);
        return;
      }
    }
    setTenzies(true);
    localStorage.getItem("highScore");
  }, [diceValues]);

  return (
    <main>
      {tenzies && <Confetti />}
      <div style={{ textAlign: "center", paddingBottom: "10px" }}>
        <h1>Tenzies</h1>
        <h4>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </h4>
      </div>
      <div className="dice-container">
        {diceValues.map((diceValue, index) => (
          <Dice
            key={index}
            value={diceValue.value}
            isHeld={diceValue.isHeld}
            holdDice={() => holdDice(index)}
          />
        ))}
      </div>

      <button onClick={tenzies ? newGame : rollDice} className="roll">
        {tenzies ? "New Game" : "Roll"}
      </button>

      <div className="score-board">
        <span>Number of rolls: {rollCount}</span>
        <span>Your best score: {bestScore}</span>
      </div>
    </main>
  );
}
