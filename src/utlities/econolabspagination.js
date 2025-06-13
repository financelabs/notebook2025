import paginate from "./paginate";

const $ = document.querySelector.bind(document);

class EcomolabsPagination {
  constructor(selector, itemsPerPage, buttonsInRow, callBack) {
    this.ul = $(`#${selector}`);
    this.selector = selector;
    this.callBack = callBack;
    this.currPage = 1;
    this.itemsPerPage = itemsPerPage;
    this.buttonsInRow = buttonsInRow;
  }

  loading() {
    this.ul.innerHTML = `
    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item"><a class="page-link" href="#">...</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>`
  }

  reinitiate(items) {
    this.currPage = 1;
    this.addEvents(items); 
  }

  addEvents(items) {
  //  console.log(items);

    const {
      totalItems, pageSize, totalPages, startPage,
      endPage, currentPage, startIndex, endIndex, pages } = paginate(items.length, this.currPage, this.itemsPerPage, this.buttonsInRow);

  //  console.log("Selected pages " + pages);
  //  this.callBack({ startIndex, endIndex });

    let mypaginationHTML = pages
      .map((item, index) => {
        return `
         <li class='${item === currentPage ? "page-item active " + this.selector : "page-item " + this.selector}'>
          <a class="page-link" page=${item}>
          ${pageSize === 1 && items[index]?.label  ? items[index].label  : item }
          </a>
         </li>`
      }).join("");


    this.ul.innerHTML = mypaginationHTML;
    let pagesLi = document.getElementsByClassName(this.selector);
    for (var i = 0; i < pagesLi.length; i++) {
      pagesLi[i].addEventListener('click',

        (e) => {
          const $this = e.target;
      //    console.log(parseInt($this.getAttribute("page")));

          if (this.itemsPerPage === 1) {
            this.callBack({ id: items[parseInt($this.getAttribute("page"))-1].id  });
          } else {
            const start = (currentPage - 1) * pageSize, end = currentPage * pageSize;
            let filteredItems = [];
            items.slice(start, end).forEach(el => {
              filteredItems.push(el);
            });
            this.callBack({ startIndex, endIndex, filteredItems });
          }

     
        
    //      console.log($this);

          if ($this.classList.contains("page-link")) {
            this.currPage = parseInt($this.getAttribute("page"))
    //        console.log(this.currPage);
          }

          // if ($this.classList.contains("next")) {
          //   this.currPage += 1;
          //   console.log(this.currPage);          
          // }
          // if ($this.classList.contains("prev")) {
          //   this.currPage -= 1;
          //   console.log(this.currPage);
          // }

          this.addEvents(items)
          //   this.updateActiveButtonStates(items.length, e.target.id)
          //   console.log(e.target.id)

        }, false);
    }
  }
}


export default EcomolabsPagination