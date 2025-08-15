import { createRoot } from "react-dom/client";
let { Provider } = ReactRedux;

import { Counter } from '../original/features/counter/Counter';
import CdnQuizCardWithStorage from "../original/components/cdnQuizCardWithStorage";

import store from '../original/state/cdnStore';

createRoot(document.querySelector("#currentbundle")).render(
    <Provider store={store}>
        <Counter />
        <CdnQuizCardWithStorage />
    </Provider>
);