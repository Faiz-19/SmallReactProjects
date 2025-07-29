import React from "react";

export default function CreateArea({ handleFom, state }) {
  return (
    <div>
      <form action={handleFom}>
        <input name="title" value={state.title} placeholder="Title" />
        <textarea
          name="content"
          value={state.content}
          placeholder="Take a note..."
          rows="3"
          required
        />
        <button>Add</button>
      </form>
    </div>
  );
}
