import React from "react";

export default function Header() {
  return (
    <nav className="w-full bg-slate-800">
      <div className="flex bg-slate-800 justify-between text-white p-4 mx-16">
        <div>
          <span className="text-green-500 font-bold text-xl">&lt;</span>
          <span className="font-bold text-xl">Pass</span>
          <span className="text-green-500 font-bold text-xl">OP/&gt;</span>
        </div>

        <button className="bg-green-600 w-20 rounded-full text-center border border-white py-1 cursor-pointer">GitHub</button>
      </div>
    </nav>
  );
}
