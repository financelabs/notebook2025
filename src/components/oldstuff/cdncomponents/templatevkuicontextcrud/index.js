import { createContext, useContext, useState, useReducer } from 'react';

//https://habr.com/ru/companies/vk/articles/771772/

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

const AccountingContext = createContext(null);
const AccountingDispatchContext = createContext(null);

// const [currentUser, setCurrentUser] = useState(null);

//   const login = useCallback((response) => {
//     storeCredentials(response.credentials);
//     setCurrentUser(response.user);
//   }, []);

//   const contextValue = useMemo(() => ({
//     currentUser,
//     login
//   }), [currentUser, login]);

//   return (
//     <AuthContext.Provider value={contextValue}>
//       <Page />
//     </AuthContext.Provider>
//   );
//   As a result of this change, even if MyApp needs to re-render, the components calling useContext(AuthContext) won’t need to re-render unless currentUser has changed.


const initialState = {
    periods: ["2022", "2023", "2024", "2025"],
    tasks: [
        { id: 0, text: 'Philosopher’s Path', done: true },
        { id: 1, text: 'Visit the temple', done: false },
        { id: 2, text: 'Drink matcha', done: false }
    ]
}



export default function AccountingApp() {
    const [theme, setTheme] = useState('light');

    return (
        <MyProviders theme={theme} setTheme={setTheme}>
            <AccountingMachine />
            <WelcomePanel />
            <label>
                <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={(e) => {
                        setTheme(e.target.checked ? 'dark' : 'light')
                    }}
                />
                Use dark mode
            </label>

        </MyProviders>
    );
}

function MyProviders({ children, theme, setTheme }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [tasks, dispatch] = useReducer(
        basicfirebasecrudservices.commonReducer,
        initialState
    );

    console.log(basicfirebasecrudservices.commonReducer);

    return (
        <AccountingContext.Provider value={tasks}>
            <AccountingDispatchContext.Provider value={dispatch}>
                <ThemeContext.Provider value={theme}>
                    <CurrentUserContext.Provider
                        value={{
                            currentUser,
                            setCurrentUser
                        }}
                    >
                        {children}
                    </CurrentUserContext.Provider>
                </ThemeContext.Provider>
            </AccountingDispatchContext.Provider>
        </AccountingContext.Provider>
    );
}

function AccountingMachine() {
    const accounting = useContext(AccountingContext);
    console.log(accounting)
    return <div>
        Accounting Machine
        <div>{!!accounting ? accounting.periods.length : "---"}</div>
        <AddPeriod />
    </div>
}

function AddPeriod() {
    const [text, setText] = useState('');
    const dispatch = useContext(AccountingDispatchContext);

    return (
        <>
          <input
            placeholder="Add Period"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button onClick={() => {
            setText('');
            dispatch({
              type: "PUSH_ITEM_TO_ARRAY",
              payload: {
                arrayName: "periods",
                item: text
              }

            }); 
          }}>Add</button>
        </>
      );
}

function WelcomePanel({ children }) {
    const { currentUser } = useContext(CurrentUserContext);
    return (
        <Panel title="Welcome">
            {currentUser !== null ?
                <Greeting /> :
                <LoginForm />
            }
        </Panel>
    );
}

function Greeting() {
    const { currentUser } = useContext(CurrentUserContext);
    return (
        <p>You logged in as {currentUser.name}.</p>
    )
}

function LoginForm() {
    const { setCurrentUser } = useContext(CurrentUserContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const canLogin = firstName !== '' && lastName !== '';
    return (
        <>
            <label>
                First name{': '}
                <input
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                />
            </label>
            <label>
                Last name{': '}
                <input
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                />
            </label>
            <Button
                disabled={!canLogin}
                onClick={() => {
                    setCurrentUser({
                        name: firstName + ' ' + lastName
                    });
                }}
            >
                Log in
            </Button>
            {!canLogin && <i>Fill in both fields.</i>}
        </>
    );
}

function Panel({ title, children }) {
    const theme = useContext(ThemeContext);
    const className = 'panel-' + theme;
    return (
        <section className={className}>
            <h1>{title + " " + theme}</h1>
            {children}
        </section>
    )
}

function Button({ children, disabled, onClick }) {
    const theme = useContext(ThemeContext);
    const className = 'button-' + theme;
    return (
        <button
            className={className}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll('.reactreduxentry')
    .forEach(domContainer => {
        // Read the comment ID from a data-* attribute.
        // const commentID = parseInt(domContainer.dataset.quizid, 10);
        const root = ReactDOM.createRoot(domContainer);
        root.render(
            <AccountingApp />,
        );
    });
