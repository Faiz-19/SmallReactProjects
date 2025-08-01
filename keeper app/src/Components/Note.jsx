import React from "react";

export default function Note(props) {
  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={() => props.deleteNote(props.id)}>DELETE</button>
    </div>
  );
}
