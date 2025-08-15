import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';

import QuizCardWithStorage from "./original/components/QuizCardWithStorage/";

import { store } from '../original/state/store.jsx';

document.querySelectorAll('.quizcardwithstorage')
  .forEach(domContainer => {
    const quizId = domContainer.dataset.quizid;
    console.log(quizId);
    // root.render(e(LikeButton, { commentID: commentID }));
    createRoot(domContainer).render(
      <StrictMode>
        <Provider store={store}>
          <QuizCardWithStorage
            header="Типовая задача"
            title="Доходность по методу сложных процентов"
            theme="Финансовые вычисления"
            text="Инвестор сформировал портфель на 10 млн. руб. и через за 5 лет продал его за {=12+{var1-10}}.<br>Какова годовая доходность инвестора в процентах?"
            answer="(POWER((12+{var1-10})/10,1/5)-1)*100"
            hint={"1. Найдите, во сколько раз увеличилась сумма инвестиций.<br>2. Найдите корень 5-й степени из этого числа или возведите в степень 1/5.<br>3. Ответом является процентный прирост за год<br>4. Воспользуйтесь функцией POWER (СТЕПЕНЬ - для русскоязычной версии)<br>Но правильней, конечно, воспользоваться функцией <a href='https://support.microsoft.com/ru-ru/office/%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F-%D0%B2%D1%81%D0%B4-64925eaa-9988-495b-b290-3ad0c163c1bc' target='_blank>IRR(ВСД)</a>"}
          />
        </Provider>
      </StrictMode>
    )});







