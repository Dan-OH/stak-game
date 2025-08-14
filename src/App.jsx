import { useState } from 'react';
import './App.scss';
import Card from './Card';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>

      <Card type="1" />
    </>
  );
}

export default App;
