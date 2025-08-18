 import { default as React } from "react";
 import { default as ReactDOM } from "react-dom/client";
// Define the shape of the props for the Counter component
interface CounterProps {
  initialValue?: number; // Optional initial value for the counter
}

const Counter: React.FC<CounterProps> = ({ initialValue = 0 }) => {
  // Declare a state variable 'count' and a function 'setCount' to update it
  // The type of 'count' is inferred as number by TypeScript
  const [count, setCount] = useState<number>(initialValue);

  // Event handler for incrementing the counter
  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  // Event handler for decrementing the counter
  const handleDecrement = () => {
    setCount(prevCount => prevCount - 1);
  };

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  );
};




ReactDOM.createRoot(document.querySelector("#root")).render(<Counter />);