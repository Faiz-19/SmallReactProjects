export default function Die(props) {
  const style = {
    background : props.isHeld ? "#59E391" : "white"
  };

  return (
    <button style={style} onClick={() => props.onClick(props.id)} className="die-btn">
      {props.value}
    </button>
  );
}
