function transactionsListFull(bookrecords) {
    let markup =
      Array.isArray(bookrecords) && bookrecords.length > 0
        ? `<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Дебет</th>
      <th scope="col">Кредит</th>
      <th scope="col">Сумма</th>
      <th scope="col">Период</th>
    </tr>
  </thead>
  <tbody>
    ` +
        bookrecords
          .map((item, index) => {
            return `
        <tr>
      <th scope="row">${index + 1}</th>
      <td>${item?.bookD}</td>
      <td>${item?.bookK}</td>
      <td>${item?.sum}</td>
       <td>${item?.period}</td>
    </tr>
    <tr>
    <th scope='row'>Ком</th>
    <td colspan='4'>${!!item?.comment ? item.comment : ""}</td>
    </tr>
    `;
          })
          .join("") +
        `
    </tbody>
  </table> 
    `
        : "";
  
    return markup;
  }

  export default transactionsListFull