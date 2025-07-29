import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  const limit = count>=5;
console.log(limit);

  function add() {
    setCount(p => p+1)
  }

  function reset(){
    setCount(0)
  }

  function sub(){
    setCount((p) => p==0 ? p : p-1)
  }

  return (
    <section>
        <div className='container'>
          <h1>COUNTER</h1>
          <p>{limit? "Limit is Reached" :"5 is the limit"}</p>
          <h2>{count}</h2>
          <button onClick={reset}>reset</button>
          <div>
            <button disabled={limit} onClick={sub} className='btns'>-</button>
            <button disabled={limit} onClick={add} className='btns'>+</button>
          </div>

        </div>

    </section>
  )
}

export default App
