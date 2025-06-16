
let useState = React.useState;

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
      <button class="btn btn-sm" onClick={increment}>Increment</button>
      <button class="btn btn-sm" onClick={decrement}>Decrement</button>
    </div>
  );
}

ReactDOM.createRoot(document.querySelector("#simpleaccounting")).render(<App />);


