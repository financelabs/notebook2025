import { useState } from "react";
//import { createRoot } from "react-dom/client";

// import markdownFile from "./example.md";

//import App from "./App";

function App() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  console.log("Test");

  return (
    <div>
      <p>Count: {count}</p>
      <button className="btn btn-sm btn-outline-primary" onClick={increment}>Increment</button>
      {" "}
      <button className="btn btn-sm btn-outline-primary" onClick={decrement}>Decrement</button>
    </div>
  );
}

export default App

// createRoot(document.querySelector("#simpleaccounting")).render(<App />);