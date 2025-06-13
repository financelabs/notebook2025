import React, { useContext, useEffect, useState } from 'react';
import { GlobalDispatchContext } from "../../features/GlobalContext";

import timeout from '../../utlities/timeout';
import loadState from '../../utlities/loadState';

import accounting101 from './casesSets';


function AccountingEditorInitialLoad() {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useContext(GlobalDispatchContext);

  useEffect(() => {

    let localStorageData = loadState();
   
    async function getCases() {

      await timeout(2000);     

      if (
        !localStorageData?.application ||
        !localStorageData.application?.email ||
        localStorageData.application.email.length < 5
      ) {
        return {
           email: null,
        };
      }

    //  console.log(localStorageData);

   

      let userEmail = localStorageData?.application?.email.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );


      let posts = await basicfirebasecrudservices.getFirebaseNode({
        url: "usersCraft/" + userEmail + "/posts/",
        //   "usersCraft/" + "accounting@yandex.ru".replace(/[^a-zA-Z0-9]/g, "_") + "/posts/",
        type: "array",
      });

      let openavatar = await basicfirebasecrudservices.getFirebaseNode({
        url: "openavatars/" + userEmail,
        //   "usersCraft/" + "accounting@yandex.ru".replace(/[^a-zA-Z0-9]/g, "_") + "/posts/",
        type: "object",
      });

        let groupvatars = await basicfirebasecrudservices.getFirebaseNode({
        url: "openavatars/",
        type: "array",
      });

      groupvatars = groupvatars.filter(ava => ava.group === "accounting");
    //  console.log(groupvatars);

      let quizescases = [];
      await Promise.all(
        accounting101.map(item => basicfirebasecrudservices.getFirebaseNode({
          url: "openquizes/" + item.id, type: "object",
        }))
      ).then((values) => {
        let valuesArray = [];
        values.forEach(item => {
          if (!!item) { valuesArray.push(item)}
        });
     //   console.log(valuesArray);
        accounting101.forEach(item => {
          let found = valuesArray.find(elem => item.id === elem.id);
       //   console.log(found);
          if (!!found) {
            quizescases.push(found) 
          } else {
            quizescases.push(item) 
          }
        });
      });

      let accountingteacherposts = await basicfirebasecrudservices.getFirebaseNode({
        url: "/usersCraft/accounting_yandex_ru/posts",
        type: "array",
      });
    //  console.log(accountingteacherposts);

    let allaccountingrecords =
    await basicfirebasecrudservices.getFirebaseNode({
      url: "usersCraft/" + userEmail + "/posts/accounting/allbookrecords",
      type: "array",
    });



      return { email: localStorageData?.application?.email, quizescases, openavatar, posts,
        allaccountingrecords, accountingteacherposts: accountingteacherposts.filter(item => item.type === "accountingwithprofitscash"),
      groupvatars }
    }

    getCases()
      .then(res => {
        
        if (!res?.email) {
          dispatch({
            type: "SEED_STATE",
            payload: {
              objects: {
                loading: false,
                email: null,
                user: null,
                avatarUrl: null,
                userEmail: null,
              },
            },
          });
          setLoading(false);
        }  else {
          let {
            userEmail,
            posts,
            allaccountingrecords,
            quizescases,
            accountingteacherposts,
            openavatar,
            groupvatars
          } = res;
  
          dispatch({
            type: "SEED_STATE",
            payload: {
              objects: {
                loading: false,
                posts: posts,
                id: null,
                bookrecords: [],
                email: localStorageData?.application?.email,
                user: localStorageData?.application?.user,
                avatarUrl: !!openavatar?.avatarUrl ? openavatar.avatarUrl :
                !!localStorageData?.application?.avatarUrl ? localStorageData.application.avatarUrl : "../freelancer.jpg",
                userEmail: userEmail,
                title: "",
                theme: "",
                allaccountingrecords: allaccountingrecords,
                selectedQuizCaseId: null,
                quizescases: quizescases,
                quizString: { A1: "" },
                type: "accountingwithprofitscash",
                periods: ["2024", "2025", "2026", "2027"],
                accountingteacherposts,
                groupvatars: groupvatars
              },
            },
          });
          setLoading(false);
        }
      });

  }, [])

  if (isLoading) {
    return (
      <div className="card my-3" style={{ width: "640px" }}>
        <img src="https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top" alt="..." />
        <div className="card-body">
          <div className="text-center">
            <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null


}

export default AccountingEditorInitialLoad
