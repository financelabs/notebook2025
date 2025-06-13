function transactionsList(bookrecords) {
    let markup =
      Array.isArray(bookrecords) && bookrecords.length > 0
        ? `<table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Дебет</th>
        <th scope="col">Кредит</th>      
      </tr>
    </thead>
    <tbody>
      ` +
        bookrecords
          .map((item, index) => {
            return `
          <tr>
        <th scope="row">${index + 1}</th>
      
        <td>${item.d}</td>
        <td>${item.k}</td>
      
      </tr>
      <tr>
      <th scope='row'>Ком</th>
      <td colspan='2'>${!!item?.comment ? item.comment : ""}</td>
      </tr>
      `;
          })
          .join("") +
        `
      </tbody>
  </table> 
      `
        : "";
  
    // console.log(markup);
    return markup;
  }

  export default transactionsList