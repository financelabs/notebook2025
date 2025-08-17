import React, { useState} from 'react';
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

export default Counter;