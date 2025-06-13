import { createSlice } from "@reduxjs/toolkit";
import { produce } from "immer";

import dictionary_ru_project_expert from "../../laboratory/dictionary_ru_project_expert";
import dictionary_rsbu_66n_2010 from "../../laboratory/dictionary_rsbu_66n_2010";

//import localForage from 'localforage';

// export let posts = localForage.createInstance({
//     name: "posts"
// });

export function chooseDictionary(selected) {
  if (selected === "Project Expert") {
    return dictionary_ru_project_expert;
  }
  if (selected === "РСБУ Приказ Минфин 66н 2010 г.") {
    return dictionary_rsbu_66n_2010;
  }
  return []
}

function look_down(dependentArray, data, currentProjectTitle, period) {
  let result = 0;
  dependentArray.map((item) => {
    result = !!item?.add
      ? result + doCalculate(data, currentProjectTitle, item.ru_title, period)
      : result - doCalculate(data, currentProjectTitle, item.ru_title, period);
  });
  return result;
}

function doCalculate(
  data,
  currentProjectTitle,
  indicator,
  period,
  reportIndicatorsDictionary
) {
 // let item = indicator + "___" + period;
  let found = data.find(
    (dataItem) =>
      dataItem?.code === indicator &&
      dataItem?.period === period &&
      dataItem?.projectTitle === currentProjectTitle
  );
  if (!!found) {
    return Number(found.value);
  }

  let items = !!reportIndicatorsDictionary
    ? chooseDictionary(reportIndicatorsDictionary).filter(
      (item) => item.ru_title === indicator
    )
    : null;

  //    let items = dictionary_ru_project_expert.filter(item => item.ru_title === indicator);
  let dependent = !!items && items[0]?.dependent;

  if (!!dependent && dependent.length > 0) {
    return look_down(dependent, data, currentProjectTitle, period);
    //     } else {
    //         let valueArray = report_data.filter(item => item.ru_title === field);
    //         return valueArray.length > 0 ? valueArray[0].value : 0;
  }

  return 0;
}

export function doFindValuesForForm(
  data,
  formMetaData,
  currentProjectTitle,
  reportIndicatorsDictionary
) {
  //  console.log(data);
  //  console.log(formMetaData);
  let foundInitialValues = {};
  formMetaData.reportIndicators.map((indicator) => {
    formMetaData.reportDates.map((period) => {
      let searchResult = doCalculate(
        data,
        currentProjectTitle,
        indicator,
        period,
        reportIndicatorsDictionary
      );
      if (!!searchResult) {
        let item = indicator + "___" + period;
        foundInitialValues[item] = searchResult;
      }
      //   let found = data.find(dataItem => dataItem.code === indicator && dataItem.period === period && dataItem.currentProjectTitle === currentProjectTitle) ; //   dataItem.form_name === item
      //   if (!!found) { foundInitialValues[item] = found.value }
    });
    return null
  });
  return foundInitialValues;
}




function look_downForCase(dependentArray, data, projectMediaAndDataAndTemplatesURL, period) {
  let result = 0;
  dependentArray.map((item) => {
    result = !!item?.add
      ? result +  doCalculateForCase(data, projectMediaAndDataAndTemplatesURL, item.ru_title, period)
      : result -  doCalculateForCase(data, projectMediaAndDataAndTemplatesURL, item.ru_title, period);
  });
  return result;
}

function doCalculateForCase(
  data,
  projectMediaAndDataAndTemplatesURL,
  indicator,
  period,
  reportIndicatorsDictionary
) {
 // let item = indicator + "___" + period;
  let found = data.find(
    (dataItem) =>
      dataItem?.code === indicator &&
      dataItem?.period === period &&
      dataItem?.projectMediaAndDataAndTemplatesURL === projectMediaAndDataAndTemplatesURL
  );
  if (!!found) {
    return Number(found.value);
  }

  let items = !!reportIndicatorsDictionary
    ? chooseDictionary(reportIndicatorsDictionary).filter(
      (item) => item.ru_title === indicator
    )
    : null;

  //    let items = dictionary_ru_project_expert.filter(item => item.ru_title === indicator);
  let dependent = !!items && items[0]?.dependent;

  if (!!dependent && dependent.length > 0) {
    return look_downForCase(dependent, data, projectMediaAndDataAndTemplatesURL, period);
    //     } else {
    //         let valueArray = report_data.filter(item => item.ru_title === field);
    //         return valueArray.length > 0 ? valueArray[0].value : 0;
  }

  return 0;
}



export function doFindValuesForFormByProjectMediaAndDataAndTemplatesURL(
  data,
  formMetaData,
  projectMediaAndDataAndTemplatesURL,
  reportIndicatorsDictionary
) {
  //  console.log(data);
  //  console.log(formMetaData);
  let foundInitialValues = {};
  formMetaData.reportIndicators.map((indicator) => {
    formMetaData.reportDates.map((period) => {
      let searchResult = doCalculateForCase(
        data,
        projectMediaAndDataAndTemplatesURL,
        indicator,
        period,
        reportIndicatorsDictionary
      );
      if (!!searchResult) {
        let item = indicator + "___" + period;
        foundInitialValues[item] = searchResult;
      }
      //   let found = data.find(dataItem => dataItem.code === indicator && dataItem.period === period && dataItem.currentProjectTitle === currentProjectTitle) ; //   dataItem.form_name === item
      //   if (!!found) { foundInitialValues[item] = found.value }
    });
    return null
  });
  return foundInitialValues;
}

export function doFindValuesForArrayOfArraysTable(data, arrayOfArraysTable) {
  //  console.log(data);
  //  console.log(formMetaData);

  const newContent = produce(arrayOfArraysTable, (draft) => {
    for (var i = 1; i < arrayOfArraysTable.length; i++) {
      var row = arrayOfArraysTable[i];
      for (var j = 1; j < row.length; j++) {
        let objectKey =
          arrayOfArraysTable[i][0] + "___" + arrayOfArraysTable[0][j];
        let found = data.find((dataItem) => dataItem.form_name === objectKey);
        draft[i][j] = !!found ? found.value : arrayOfArraysTable[i][j];
      }
    }
  });

  return newContent;
}

export function findValueForIndicatorPeriod(userData, indicator, period, projectMediaAndDataAndTemplatesURL="") {
//  console.log(userData, indicator, period, projectMediaAndDataAndTemplatesURL);
  let found = userData.filter(item => item.ru_title === indicator
     && item.period === period.toString()
 //    && item.projectMediaAndDataAndTemplatesURL === projectMediaAndDataAndTemplatesURL
     );
 //   console.log(found); 
    if (Array.isArray(found) && found.length > 0) { return found[0].value }
  return null
}

export function doFindValuesForChartDataSeriesByIndicator(userData, indicator, periods, projectMediaAndDataAndTemplatesURL="") {
   return periods.map(period => {return findValueForIndicatorPeriod(userData, indicator, period, projectMediaAndDataAndTemplatesURL)} )
}

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("econolabs");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    data:
      !!loadState() && !!loadState()?.data?.data ? loadState().data.data : [],
    loading: false,
    hasErrors: false,
  },
  reducers: {
    createDataItem: (state, action) => {
      state.data.push(action.payload);
      //       let newPosts = [...state.posts, action.payload ];
      //       savePostsInBrowser(state.posts);
    },
    editDataItem: (state, action) => {
      //const array1 = [5, 12, 8, 130, 44];
      //const isLargeNumber = (element) => element > 13;
      //console.log(array1.findIndex(isLargeNumber));
      // expected output: 3
      let userDataArrayIndex = state.data.findIndex(
        (item) => item.id === action.payload.id
      );
      state.data[userDataArrayIndex] = action.payload;
    },
    empty_data: (state) => {
      state.data = [];
    },
    // mark_del_post: (state, action) => {
    //   let arrayId = state.posts.findIndex(item => item.id === action.payload.id);
    //   state.posts[arrayId].deleted = !state.posts[arrayId].deleted;
    // },
    getDataItems: (state) => {
      state.loading = true;
    },
    getDataSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
      state.hasErrors = false;
    },
    getDataFailure: (state) => {
      state.loading = false;
      state.hasErrors = true;
    },
  },
});

export const {
  createDataItem,
  empty_data,
  getDataItems,
  getDataSuccess,
  saveDataSuccess,
  getDataFailure,
  editDataItem,
} = dataSlice.actions; //  getDataItems, getDataSuccess, getDataFailure, saveDataSuccess

export const selectUserData = (state) => state.data;
export const selectUserDataItems = (state) => state?.data?.data ? state.data.data : [];
// export const selectUserDataItems = (state) => state.data.data;


// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//     setTimeout(() => {
//       dispatch(incrementByAmount(amount));
//     }, 1000);
//   };

export default dataSlice.reducer;