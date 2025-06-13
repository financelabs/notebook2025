function vanillajsShowFinancialResultsMarkUp(
    records, rows 

) {
    let periods = [...new Set(records.map(item => item.period))];
    const [title, ...indicators] = rows;

    function checkTypePeriod(records = [], indicator = "cash", period) {
        let sum = 0;
        records.forEach(item => {
            if (!!item?.type && item.type.includes(indicator) && item.period === period) { sum = sum + parseFloat(item.sum) }
            return null;
        });
        return sum;
    }


    return "<table class='table'><thead><tr class='bg-secondary text-white'>"
        + [title, ...periods]
            .map((item) => { return `<th scope="col">${item}</th>` })
            .join("")
        + "</tr></thead><tbody>" +

        indicators.map((indicator) => {
            return `<tr>
            <th scope="row" class="text-small">${indicator}</th>
            ${periods.map((period) => {
                return `<td>${checkTypePeriod(records, indicator, period)}</td>`

            }).join("")}                            
        </tr>`
        })
        +
        "</tbody></table>"

}


export default vanillajsShowFinancialResultsMarkUp