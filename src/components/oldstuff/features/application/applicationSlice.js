import { createSlice } from '@reduxjs/toolkit';

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

export const applicationSlice = createSlice({
  name: 'application',
  initialState: !!loadState() && !!loadState()?.application ? { ...loadState().application } : {
    email: '',
    user: '',
    avatarUrl: '',
    currentProjectTitle: '',
    currentProjectComment: '',
    currentProjectMediaAndDataAndTemplatesURL: '',
    currentProjectSourseDataURL: '',
    currentProjectMoneyScale: '',
    currentProjectReportIndicatorsDictionary: '',
    activePage: null
  },
  reducers: {
    setActivePage: (state, action) => {
      state.activePage = action.payload;
    },
    set_user_profile: (state, action) => {
      state.email = action.payload.email;
      state.user = action.payload.user;
      state.avatarUrl = action.payload.avatarUrl;
    },
    set_currentProject: (state, action) => {
      state.currentProjectTitle = action.payload.currentProjectTitle;
      state.currentProjectComment = action.payload.currentProjectComment;
      state.currentProjectMediaAndDataAndTemplatesURL = action.payload.currentProjectMediaAndDataAndTemplatesURL;
      state.currentProjectSourseDataURL = action.payload.currentProjectSourseDataURL;
      state.currentProjectMoneyScale = action.payload.currentProjectMoneyScale;
      state.currentProjectReportIndicatorsDictionary = action.payload.currentProjectReportIndicatorsDictionary
    }
  },
});

export const {
  setActivePage,
  set_user_profile, set_currentProject } = applicationSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const selectApplication = state => state.application;
export const selectActivePage = state => state.application.activePage;

export default applicationSlice.reducer;