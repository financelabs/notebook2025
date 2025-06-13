import { createContext, useContext, useReducer } from 'react';

const QuizCardContext = createContext(null);
const QuizCardDispatchContext = createContext(null);

const loadState = () => {
    try {
      const serializedState = localStorage.getItem('econolabs');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined
    }
  };

export function QuizCardProvider({ children }) {
    const [state, dispatch] = useReducer(
        myReducer,
        !!loadState() && !!loadState()?.application ? { ...loadState().application } : {
            
                isLoading: true,
                email: "johmdoe@gmail.com",
                user: "Иван Оленев",
                avatarUrl: "https://images.unsplash.com/photo-1490631537525-3b00d26805f9?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                quizes: initialQuizes
            
          },
    );

    return (
        <QuizCardContext.Provider value={state}>
            <QuizCardDispatchContext.Provider value={dispatch}>
                {children}
            </QuizCardDispatchContext.Provider>
        </QuizCardContext.Provider>
    );
}

export function useQuizCardContext() {
    return useContext(QuizCardContext);
}

// export function useEmail() {
//     console.log(useContext); //(QuizCardContext.email)
//     return "email";
// }

// export function useUser() {
//     console.log(useContext); //(QuizCardContext.user)
//     return "user";
// }

// export function useAvatarUrl() {
//     console.log(useContext()); //QuizCardContext.avatarUrl
//     return "avatarUrl";
// }


export function useQuizCardDispatch() {
    return useContext(QuizCardDispatchContext);
}

function myReducer(state, action) {
    switch (action.type) {
        case 'added': {
            return {
                ...state,
                quizes: [...state.quizes, {
                    id: action.id,
                    text: action.text,
                    done: false
                }]
            };
        }
        case 'changed': {
            return {
                ...state,
                quizes: state.quizes.map(t => {
                    if (t.id === action.task.id) {
                        return action.task;
                    } else {
                        return t;
                    }
                })
            };


            ;
        }
        case 'deleted': {
            return {
                ...state,
                quizes: state.quizes.filter(t => t.id !== action.id)
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const initialQuizes = [];
