
{/* <div key={index}
          dangerouslySetInnerHTML={createMarkup(
            '<span class="badge bg-light text-dark">' + task?.id + '</span><br>'
            + task?.text
          )}
 /> */}

function createMarkup(markup) {
    return {__html: markup};
  }

  export default createMarkup