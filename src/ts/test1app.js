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
                <button className="btn btn-sm btn-outline-secondary mx-1" onClick={increment}>Increment</button>
                <button className="btn btn-sm btn-outline-secondary mx-1" onClick={decrement}>Decrement</button>
            </div>
        );
    }

    export default App