var useState = React.useState;
function App() {
    var _a = useState(0), count = _a[0], setCount = _a[1];
    var increment = function () {
        setCount(count + 1);
    };
    var decrement = function () {
        setCount(count - 1);
    };
    console.log("Test");
    return (React.createElement("div", null,
        React.createElement("p", null,
            "Count: ",
            count),
        React.createElement("button", { className: "btn btn-sm btn-outline-secondary mx-1", onClick: increment }, "Increment"),
        React.createElement("button", { className: "btn btn-sm btn-outline-secondary mx-1", onClick: decrement }, "Decrement")));
}
export default App;
