import { createContext, useContext, useReducer } from 'react';

const ChoicesContext = createContext(null);

const ChoicesDispatchContext = createContext(null);

function choicesReducer(choices, action) {
  switch (action.type) {
    case 'added': {
      return [...choices, {
        id: action.id,
        text: action.text,
        isRight: false
      }];
    }
    // case 'changed': {
    //   return choices.map(t => {
    //     if (t.id === action.choice.id) {
    //       return action.choice;
    //     } else {
    //       return t;
    //     }
    //   });
    // }
    // case 'deleted': {
    //   return choices.filter(t => t.id !== action.id);
    // }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialChoices = {
  choices: [
  { id: 0, text: 'Philosopher’s Path', isRight: true },
  { id: 1, text: 'Visit the temple', isRight: false },
  { id: 2, text: 'Drink matcha', isRight: false }
  ]
};

export function ChoicesProvider({ children }) {
  const [choices, dispatch] = useReducer(
    !!basicfirebasecrudservices && basicfirebasecrudservices.commonReducer, // || choicesReducer,
    initialChoices
  );

  console.log(basicfirebasecrudservices.commonReducer());
  return (
    <ChoicesContext.Provider value={choices}>
      <ChoicesDispatchContext.Provider value={dispatch}>
        {children}
      </ChoicesDispatchContext.Provider>
    </ChoicesContext.Provider>
  );
}

export function useChoices() {
  return useContext(ChoicesContext);
}

export function useChoicesDispatch() {
  return useContext(ChoicesDispatchContext);
}




