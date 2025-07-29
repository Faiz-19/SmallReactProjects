import { useState } from "react";
import Header from "./Components/Header";
import Note from "./Components/Note.jsx";
import Footer from "./Components/Footer";
import CreateArea from "./Components/CreateArea.jsx";

function App() {
  const [data, setData] = useState([]);

  function handleFom(fromData) {
    setData((p) => [
      ...p,
      { title: fromData.get("title"), content: fromData.get("content") },
    ]);
  }

  function deleteNote(id){
    setData(prevData => prevData.filter((eachData,index) => id !== index))
    
  }

  const note = data.map((e, i) => (
    <Note key={i} title={e.title} content={e.content} deleteNote={deleteNote} id={i}/>
  ));


  return (
    <>
      <Header />
      <CreateArea handleFom={handleFom}  state ={data}/>
      {note}
      <Footer />
    </>
  );
}

export default App;
