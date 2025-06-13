import React from "react";
import parse from 'html-react-parser';
import { useSelector } from "react-redux";

import { useFirebaseNode } from "../hooks/useFirebaseNode";

import { selectApplication } from "../features/application/applicationSlice";
import { createProtoArray } from "../features/spreadsheet/spreadsheetSlice";

import ShowMedia, { GetSeriesCategoriesOptionsForApexChart, GetReadyScatterApexChart, GetReadyDatalineQuotesApexChart } from "../mediatemplates/ShowMedia";
import ShowXlTableArrayOfArrays from "../mediatemplates/ShowXlTableArrayOfArrays";
import ShowXlTableWithPredefinedIndicators from "../mediatemplates/ShowXlTableWithPredefinedIndicators";
import PrepareDataFromDictionaryForChart, { GetReadyProcessBalanceStackedBars } from "../mediatemplates/PrepareDataFromDictionaryForChart";
import MediaTemplatesAccountingWithProfitsCash from "../mediatemplates/MediaTemplatesAccountingWithProfitsCash";

import { Alert } from "react-bootstrap";

import Layout from "../components/layout";

import isObject from "../../utlities/isObject";


export function ProcessWorkBook({userPosts = [], avatarUrl="", user="", userEmail="temp_gmail_com"}) {

  let data = Object.keys(userPosts).map((item) => {
    return userPosts[item];
  });
  const uniqueThemes = !!data ? [...new Set(data.map((item) => item.theme))] : []; // [ 'A', 'B']

  console.log(uniqueThemes)

  return (
    <div className="container">
      <div className="media border p-3 mb-5">
        <img
          src={avatarUrl}
          alt=""
          className="m-3"
          style={{
            verticalAlign: "middle",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            filter: "grayscale(100%)",
            objectFit: "cover",
          }}
        />
        <div className="media-body">
          <h4>
            {user}{" "}
            <small>
              <i>
                {new Intl.DateTimeFormat("ru", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date())}
              </i>
            </small>
          </h4>
          <p>Рабочая тетрадь</p>
        </div>
      </div>
      <div>
        {!!uniqueThemes &&
          uniqueThemes.map((theme) => (
            <div key={theme}>
              <Alert variant="primary">{theme}</Alert>
              {data
                .filter((quiz) => quiz.theme === theme)
                .map((quiz) => {
               //   console.log(quiz?.answer);
                  return (
                    <div key={quiz.id}>
                      <Alert variant="secondary" className="mt-3">
                        {!!quiz.avatarUrl ? (
                          <img
                            src={quiz.avatarUrl}
                            alt=""
                            className="m-2"
                            style={{
                              verticalAlign: "middle",
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              filter: "grayscale(100%)",
                              objectFit: "cover",
                            }}
                          />
                        ) : null}
                        {quiz.title}
                      </Alert>
                      <div>
                        {quiz.type === "accountingwithprofitscash" && isObject(quiz.quizString) ? <ShowXlTableArrayOfArrays xlArray={createProtoArray(quiz.quizString, 0, 0)} /> :
                         parse(!!quiz?.quizString ? quiz?.quizString : '' )}
                        {parse(`<br><span>Ответ: ${quiz.type === "calculation" ? quiz.comment : quiz.answer}</span>
                              <span class="ml-5">Дата/время: ${quiz.date}</span><br>
                              ${!!quiz.user ? "Решено: " + quiz.user : ""}
                              `)}
                      </div>


                      {quiz?.htmlfeedback && <div>{parse(quiz.htmlfeedback)}</div>}

                      {quiz.type === "spreadsheet" && !!quiz?.content && <ShowXlTableArrayOfArrays xlArray={createProtoArray(quiz.content, 0, 0)} />}

                      {quiz.type === "calculation" && <ShowXlTableWithPredefinedIndicators quiz={quiz} xlArray={createProtoArray(quiz.content, 0, 0)} />}

                      {quiz.type === "balancestackedbars" && <GetReadyProcessBalanceStackedBars quiz={quiz} />}

                      {(quiz.type === "balancestackedbarswithpredefinedindicators" ||
                        quiz.type === "arraycategoriesbarapexchartwithpredefinedindicators" ||
                        quiz.type === "arraycategorieslineapexchartwithpredefinedindicators"
                      ) && quiz?.deleted !== true && <PrepareDataFromDictionaryForChart quiz={quiz} />}

                      {(quiz.type === "html" || quiz.type === "markdown") && <div>{parse(quiz.content)}</div>}

                      {(quiz.type === "datetimebarapexchart" || quiz.type === "datetimelineapexchart" ||
                        quiz.type === "arraycategorieslineapexchart" || quiz.type === "arraycategoriesbarapexchart")
                        && quiz?.deleted !== true && <GetSeriesCategoriesOptionsForApexChart firenode={quiz.content} mediaItem={quiz.type} />
                      }

                      {(quiz.type === "scatterquotesapexchart" || quiz.type === "scatterquotesapexchartoptions" ||
                        quiz.type === "scatterapexchart") && quiz?.deleted !== true && <GetReadyScatterApexChart firenode={quiz.content} />
                      }

                      {(quiz.type === "datalinequotesapexchart" || quiz.type === "datalinequotesapexchartoptions" ||
                        quiz.type === "datetimeareanocategoriesapexchart") && quiz?.deleted !== true && <GetReadyDatalineQuotesApexChart firenode={quiz.content} />
                      }


                      {quiz.type === "media" ? <ShowMedia datafirenode={"/usersCraft/" + userEmail + "/data/" + quiz.content} /> : null}

                      {quiz.type === "accountingwithprofitscash" ? <MediaTemplatesAccountingWithProfitsCash records={quiz.content} mediaItems={quiz.mediaItems} /> : null}


                    </div>
                  );
                })}
            </div>
          ))}
      </div>
    </div>
  );


}



function MyWorkBook() {
  const email = useSelector(selectApplication).email;
  let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
  const avatarUrl = useSelector(selectApplication).avatarUrl;
  const user = useSelector(selectApplication).user;

  const { data: userPosts, loading, error } = useFirebaseNode(
    "usersCraft/" + userEmail + "/posts/"
  );

  console.log(userPosts);


  if (!!loading || !userPosts) {
    return <Layout>...</Layout>;
  }
  if (!!error) {
    return <Layout>:-(</Layout>;
  }

  return <Layout>
    <ProcessWorkBook userPosts={userPosts} avatarUrl={avatarUrl} user={user} userEmail={userEmail}/>
  </Layout>


 

  return null

  return (
    <Layout>
      <div className="media border p-3 mb-5">
        <img
          src={avatarUrl}
          alt=""
          className="m-3"
          style={{
            verticalAlign: "middle",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            filter: "grayscale(100%)",
            objectFit: "cover",
          }}
        />
        <div className="media-body">
          <h4>
            {user}{" "}
            <small>
              <i>
                {new Intl.DateTimeFormat("ru", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date())}
              </i>
            </small>
          </h4>
          <p>Рабочая тетрадь</p>
        </div>
      </div>
      <div>
        {!!uniqueThemes &&
          uniqueThemes.map((theme) => (
            <div key={theme}>
              <Alert variant="primary">{theme}</Alert>
              {data
                .filter((quiz) => quiz.theme === theme)
                .map((quiz) => {
                  console.log(quiz?.answer);
                  return (
                    <div key={quiz.id}>
                      <Alert variant="secondary" className="mt-3">
                        {!!quiz.avatarUrl ? (
                          <img
                            src={quiz.avatarUrl}
                            alt=""
                            className="m-2"
                            style={{
                              verticalAlign: "middle",
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              filter: "grayscale(100%)",
                              objectFit: "cover",
                            }}
                          />
                        ) : null}
                        {quiz.title}
                      </Alert>
                      <div>
                        {quiz.type === "accountingwithprofitscash" && isObject(quiz.quizString) ? <ShowXlTableArrayOfArrays xlArray={createProtoArray(quiz.quizString, 0, 0)} /> :
                         parse(!!quiz?.quizString ? quiz?.quizString : '' )}
                        {parse(`<br><span>Ответ: ${quiz.type === "calculation" ? quiz.comment : quiz.answer}</span>
                              <span class="ml-5">Дата/время: ${quiz.date}</span><br>
                              ${!!quiz.user ? "Решено: " + quiz.user : ""}
                              `)}
                      </div>


                      {quiz?.htmlfeedback && <div>{parse(quiz.htmlfeedback)}</div>}

                      {quiz.type === "spreadsheet" && !!quiz?.content && <ShowXlTableArrayOfArrays xlArray={createProtoArray(quiz.content, 0, 0)} />}

                      {quiz.type === "calculation" && <ShowXlTableWithPredefinedIndicators quiz={quiz} xlArray={createProtoArray(quiz.content, 0, 0)} />}

                      {quiz.type === "balancestackedbars" && <GetReadyProcessBalanceStackedBars quiz={quiz} />}

                      {(quiz.type === "balancestackedbarswithpredefinedindicators" ||
                        quiz.type === "arraycategoriesbarapexchartwithpredefinedindicators" ||
                        quiz.type === "arraycategorieslineapexchartwithpredefinedindicators"
                      ) && quiz?.deleted !== true && <PrepareDataFromDictionaryForChart quiz={quiz} />}

                      {(quiz.type === "html" || quiz.type === "markdown") && <div>{parse(quiz.content)}</div>}

                      {(quiz.type === "datetimebarapexchart" || quiz.type === "datetimelineapexchart" ||
                        quiz.type === "arraycategorieslineapexchart" || quiz.type === "arraycategoriesbarapexchart")
                        && quiz?.deleted !== true && <GetSeriesCategoriesOptionsForApexChart firenode={quiz.content} mediaItem={quiz.type} />
                      }

                      {(quiz.type === "scatterquotesapexchart" || quiz.type === "scatterquotesapexchartoptions" ||
                        quiz.type === "scatterapexchart") && quiz?.deleted !== true && <GetReadyScatterApexChart firenode={quiz.content} />
                      }

                      {(quiz.type === "datalinequotesapexchart" || quiz.type === "datalinequotesapexchartoptions" ||
                        quiz.type === "datetimeareanocategoriesapexchart") && quiz?.deleted !== true && <GetReadyDatalineQuotesApexChart firenode={quiz.content} />
                      }


                      {quiz.type === "media" ? <ShowMedia datafirenode={"/usersCraft/" + userEmail + "/data/" + quiz.content} /> : null}

                      {quiz.type === "accountingwithprofitscash" ? <MediaTemplatesAccountingWithProfitsCash records={quiz.content} mediaItems={quiz.mediaItems} /> : null}


                    </div>
                  );
                })}
            </div>
          ))}
      </div>
    </Layout>
  );
}

export default MyWorkBook