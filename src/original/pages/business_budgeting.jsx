import React from "react";
import { Container } from "react-bootstrap";

import QuizCardWithStorage from "../components/QuizCardWithStorage";
import SimpleAccounting from "../laboratory/SimpleAccounting";
import AccountingWithProfitsCash from "../laboratory/AccountingWithProfitsCash";

function BusinessBudgeting() {
    return <Container>

        <h1>Баланс</h1>
       
      <table>
        <tbody>
          <tr>
            <th>АКТИВЫ</th>
            <th>
              ПАССИВЫ
            </th>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Основные средства</td>
            <td>Уставный капитал</td>
          </tr>
          <tr>
            <td></td>
            <td>Нераспределенная прибыль</td>
          </tr>
          <tr>
            <td>Материалы</td>
            <td></td>
          </tr>
          <tr>
            <td>Незавершенное производство</td>
            <td>Долгосрочный банковский кредит</td>
          </tr>
          <tr>
            <td>Готовая продукция</td>
            <td></td>
          </tr>
          <tr>
            <td>Дебиторская задолженность</td>
            <td>Краткосрочный банковский кредит</td>
          </tr>
          <tr>
            <td>Деньги</td>
            <td>Кредиторская задолженность</td>
          </tr>
        </tbody>
      </table>

      <p><a className="link-offset-3" href="https://www.gazprom.ru/f/posts/05/118974/gazprom-accounting-report-2020.pd">Отчетность Газпрома</a></p>



<h6>Что может случиться с балансом?</h6> 

<ul className="list-group list-group-flush">
  <li className="list-group-item">А+Х, А-Х</li>
  <li className="list-group-item">А+Х, П+X</li>
  <li className="list-group-item">А-Х, П-Х</li>
  <li className="list-group-item">П+Х, П-Х</li>
</ul>


<QuizCardWithStorage set={"business_budgeting"} setTitle="Тесты по балансовым уравнениям"/>

<h6>Практика</h6>

<ul className="list-group list-group-flush">
  <li className="list-group-item">Слева - увеличение активов, уменьшение пассивов</li>
  <li className="list-group-item">Справа - уменьшение активов, увеличение пассивов</li>
</ul>

 <QuizCardWithStorage type={"OneRandomManyAnswers"} set={"simple_accounting"} setTitle="Задачи по балансовым уравнениям"/>

<SimpleAccounting />


<AccountingWithProfitsCash />




    </Container>
}



export default BusinessBudgeting