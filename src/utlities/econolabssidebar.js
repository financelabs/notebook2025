import paginate from "./paginate";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


class EcomolabsSidebar {
    constructor(selector, itemsPerPage, buttonsInRow, callBack) {
        this.listGroupSelector = $(`#${selector}`);
        this.selector = selector;
        this.callBack = callBack;
        this.currPage = 1;
        this.itemsPerPage = itemsPerPage;
        this.buttonsInRow = buttonsInRow;
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
                return `<a href="#" aria-current="true"
                            page=${item}
                            class=${item === currentPage ?
                                "list-group-item list-group-item-action active py-3 lh-sm " + this.selector
                                : "list-group-item list-group-item-action py-3 lh-sm " + this.selector}
                            >
                             ${pageSize === 1 && items[index]?.label ? items[index].label : item}
                            </div>         
                        </a>`})
                        .join("");


        this.listGroupSelector.innerHTML = mypaginationHTML;
        let pagesLi = [...$$(("a.list-group-item"))]
     //   let pagesLi = document.getElementsByClassName(this.selector);
     //   console.log(pagesLi);
        for (var i = 0; i < pagesLi.length; i++) {
            pagesLi[i].addEventListener('click',

                (e) => {
                    const $this = e.target;
                 //   console.log($this)
                 //   console.log($this.getAttribute("page"));

                    if (this.itemsPerPage === 1) {
                        this.callBack({ id: items[parseInt($this.getAttribute("page")) - 1].id });
                    } else {
                        const start = (currentPage - 1) * pageSize, end = currentPage * pageSize;
                        let filteredItems = [];
                        items.slice(start, end).forEach(el => {
                            filteredItems.push(el);
                        });
                        this.callBack({ startIndex, endIndex, filteredItems });
                    }



                    //      console.log($this);

                    // if ($this.classList.contains("list-group-item")) {
                    //     this.currPage = parseInt($this.getAttribute("page"))
                    //     //        console.log(this.currPage);
                    // }

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

export default EcomolabsSidebar