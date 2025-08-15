let { createSlice } =RTK;

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


export const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: !!loadState() && !!loadState()?.posts?.posts ? loadState().posts.posts : [],
    loading: false,
    hasErrors: false,
  },
  reducers: {
    createPost: (state, action) => {
      state.posts.push(action.payload);
      //       let newPosts = [...state.posts, action.payload ];
      //       savePostsInBrowser(state.posts);
    },
    setPostsArrayItems: (state, action) => {
      state.posts = action.payload;
    },
    change_post_content: (state, action) => {
      let arrayId = state.posts.findIndex(item => item.id === action.payload.id);
      state.posts[arrayId].content = action.payload.content;
    },

    mark_del_post: (state, action) => {
      let arrayId = state.posts.findIndex(item => item.id === action.payload.id);
      state.posts[arrayId].deleted = !state.posts[arrayId].deleted;
    },
    getPosts: state => {
      state.loading = true
    },
    getPostsSuccess: (state, { payload }) => {
      state.posts = payload
      state.loading = false
      state.hasErrors = false
    },
    savePostsSuccess: (state, { payload }) => {
      //    state.posts = payload
      state.loading = false
      state.hasErrors = false
    },
    getPostsFailure: state => {
      state.loading = false
      state.hasErrors = true
    },
  },
});

export const { createPost, change_post_content, mark_del_post,  getPosts, getPostsSuccess, getPostsFailure, savePostsSuccess, setPostsArrayItems } = postsSlice.actions;

export const selectPosts = state => state.posts;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//     setTimeout(() => {
//       dispatch(incrementByAmount(amount));
//     }, 1000);
//   };



// export function showPostsInBrowser() {
//     return async dispatch => {
//         dispatch(getPosts())
//         try {
//             const data = await posts.getItem('postsArray');

//             // const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
//             // const data = await response.json()

//             console.log(data);
//             dispatch(getPostsSuccess(!!data ? data : []))
//         } catch (error) {
//             dispatch(getPostsFailure())
//         }
//     }
// }  

// export function savePostsInBrowser(posts) {
//     return async dispatch => {
//    //     dispatch(getPosts())
//         try {
//             const data = await posts.setItem('postsArray', posts);
//             // const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
//             // const data = await response.json()
//             console.log(data);
//             dispatch(savePostsSuccess())
//         } catch (error) {
//             dispatch(getPostsFailure())
//         }
//     }
// } 



export default postsSlice.reducer;