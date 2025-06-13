function processRecords({
    indicator = "Sales",
    balanceIndicators = [],
    records = [],
    periods = ["default"],
    period = "default" }) {
    let DValues = 0;
    let KValues = 0;

    let assets = balanceIndicators.filter(item => item.type === "asset")
        .map(item => item.title);

    Array.isArray(records) && records.forEach(item => {
        let currentOperationPeriodIndex = periods.findIndex(
            (per) => per === item.period
        );

        let periodIndex = periods.findIndex(el => el === period) + 1;
        if (item.d === indicator && periodIndex > currentOperationPeriodIndex) {
            DValues = DValues + parseFloat(item.sum);
        }
        if (item.k === indicator && periodIndex > currentOperationPeriodIndex) {
            KValues = KValues + parseFloat(item.sum);
        }
    });
    if (assets.includes(indicator)) {
        return DValues - KValues;
    } else {
        return KValues - DValues;
    }

};



function vanillajsShowBalanceMarkUp(records, balanceIndicators) {
    let periods = [...new Set(records.map(item => item.period))];
 //   console.log(periods);

    return "<table class='table'><thead><tr class='bg-secondary text-white'>"
        + [" ", ...periods]
            .map((item) => { return `<th scope="col">${item}</th>` })
            .join("")
        + "</tr></thead><tbody>" +

        balanceIndicators
            .filter(item => item.type === "asset" && item.title.length > 2)
            .map((element) => {
                return `
                <tr>
                    <th scope="row" class="text-small">${element.title}</th>

                    ${periods.map((item, colIndex) => {
                    return `<td>${processRecords({
                        indicator: element.title,
                        balanceIndicators: balanceIndicators,
                        records: records,
                        periods,
                        period: periods[colIndex]
                    })}</td>`

                })}
                    
                </tr>`
            }).join("")
        +
        "</tbody></table>"
        +
        "<table class='table'><thead><tr class='bg-secondary text-white'>"
        + [" ", ...periods]
            .map((item) => { return `<th scope="col">${item}</th>` })
            .join("")
        + "</tr></thead><tbody>" +

        balanceIndicators
            .filter(item => item.type !== "asset" && item.title.length > 2)
            .map((element, rowIndex) => {
                return `
                <tr>
                    <th scope="row">${element.title}</th>

                    ${periods.map((item, colIndex) => {
                    return `<td>${processRecords({
                        indicator: element.title,
                        balanceIndicators: balanceIndicators,
                        records: records,
                        periods,
                        period: periods[colIndex]
                    })}</td>`

                })}
                    
                </tr>`
            }).join("")
        +
        "</tbody></table>"
}

export default vanillajsShowBalanceMarkUp