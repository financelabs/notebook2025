import React, { useContext, useEffect, useState } from 'react';
import { GlobalDispatchContext } from "../../features/GlobalContext";

import timeout from '../../utlities/timeout';
import loadState from '../../utlities/loadState';

import caseIds from './userCaseIds';


async function getOpenCasesQuizes() {
  let res = await Promise.all(
    caseIds.map((id) =>
      basicfirebasecrudservices.getFirebaseNode({
        url: "openquizes/" + id,
        type: "object",
      })
    )
  );
  return res;
}


function AccountingUserInitialLoad() {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useContext(GlobalDispatchContext);

  useEffect(() => {
    let localStorageData = loadState();
    async function getRecords() {
      if (
        !localStorageData?.application ||
        !localStorageData.application?.email ||
        localStorageData.application.email.length < 5
      ) {
        return {
          posts: [],
          allaccountingrecords: [],
          email: null,
        };
      }
      await timeout(2000);
      let quizescases = await getOpenCasesQuizes();
      //  console.log(quizescases);
      let userEmail = localStorageData?.application?.email.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );
      let res = await basicfirebasecrudservices.getFirebaseNode({
        url: "usersCraft/" + userEmail + "/posts/",
        type: "array",
      });

      let openavatar = await basicfirebasecrudservices.getFirebaseNode({
        url: "openavatars/" + userEmail,
        type: "object",
      });

      let allaccountingrecords =
        await basicfirebasecrudservices.getFirebaseNode({
          url: "usersCraft/" + userEmail + "/posts/accounting/allbookrecords",
          type: "array",
        });


      // let resfinreportscasedemo = await basicfirebasecrudservices.getFirebaseNode({
      //   url: "/usersCraft/accounting_yandex_ru/posts/finreportscasedemo/content",
      //   type: "array",
      // });

    //  console.log(resfinreportscasedemo);


      return {
        posts: res,
        allaccountingrecords: allaccountingrecords,
        email: localStorageData?.application?.email,
        user: localStorageData?.application?.user,
        avatarUrl: !!openavatar?.avatarUrl
          ? openavatar.avatarUrl
          : !!localStorageData?.application?.avatarUrl
            ? localStorageData.application.avatarUrl
            : "../freelancer.jpg",
        userEmail: userEmail,
        quizescases: quizescases.filter((item) => !!item),
      };
    }

    getRecords().then((res) => {
      // console.log(res);
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
      } else {
        let {
          userEmail,
          posts,
          email,
          user,
          avatarUrl,
          allaccountingrecords,
          quizescases,
        } = res;

        let caseposts = posts.filter(
          (post) => post.type === "accountingwithprofitscash"
        );
        dispatch({
          type: "SEED_STATE",
          payload: {
            objects: {
              loading: false,
              posts:
                Array.isArray(caseposts) && caseposts.length > 0
                  ? caseposts
                  : 0,
              id: null,
              bookrecords: [],
              email: email,
              user: user,
              avatarUrl: avatarUrl,
              userEmail: userEmail,
              title: "",
              theme: "",
              allaccountingrecords: allaccountingrecords,
              quizescases: quizescases,
              quizString: { A1: "" },
              type: "accountingwithprofitscash",
              periods: ["2024", "2025", "2026", "2027"],
            },
          },
        });
        setLoading(false);
      }
    });
  }, []);

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

export default AccountingUserInitialLoad
