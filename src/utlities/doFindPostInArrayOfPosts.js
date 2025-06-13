// const dmp = new diff_match_patch();

// function doCompare(text, sample) {
//    return dmp.diff_main(text, sample)
// }


function doFindPostInArrayOfPosts(post, postsArray) {
  let words = post.split(' ')
  .map(word => word.replace(/<[^>]*>?/gm, ''))
  .filter(w => w.length > 3);
 // console.log(words.length);
  let found = false;
  Array.isArray(postsArray) && postsArray.forEach(sample => {
    if (sample.includes(words[0])) {
       if (sample.includes(words[1])) {
          if (sample.includes(words[2])) {
                  found = true
     //     console.log(post)
        }
      }

      //     dmp.diff_main(text, sample)[0][0]!== -1) {
      //     console.log(dmp.diff_main(text, sample));
      //      found = true;
      //       //  console.log(doCompare(post, sample));
    }
  })
 // console.log("Do find Post in Array of Posts");
  return !!found ? {found: true} : {found: false, post: post, words: words}
}

export default doFindPostInArrayOfPosts