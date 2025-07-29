import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="bg-slate-800 w-full flex items-center justify-center flex-col text-white gap-[2px]">
        <h2>
          <div>
            <span className="text-green-500 font-bold text-xl">&lt;</span>
            <span className="font-bold text-xl">Pass</span>
            <span className="text-green-500 font-bold text-xl">OP/&gt;</span>
          </div>
        </h2>
        <p>Created with love by Faiz</p>
      </div>
    </footer>
  );
}
