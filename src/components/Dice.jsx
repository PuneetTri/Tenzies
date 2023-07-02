export default function Dice({ value, isHeld, holdDice }) {
  return (
    <div onClick={holdDice} className={`dice ${isHeld && "held"}`}>
      <p className="dice-val">{value}</p>
    </div>
  );
}
