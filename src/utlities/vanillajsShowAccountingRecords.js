function vanillajsShowAccountingRecords(records) {

    let periods = [...new Set(records.map(item => item.period))];

    return `<table class="table table-striped table-bordered table-hover">
<thead>
    <tr>
        <th scope="col"></th>
        <th scope="col">Period</th>
        <th scope="col">D</th>
        <th scope="col">К</th>
        <th scope="col">Sum</th>
        <th scope="col">Type</th>                  
    </tr>
</thead>
<tbody>
    ${periods.map(period => {
        return Array.isArray(records) && records.filter(record => record.period === period)
            .map((row, rowIndex) => {
                return `<tr>
                <th scope="row">${rowIndex + 1}</th>
                <td><small>${row?.period}</td>
                <td><small>${row?.d}</td>
                <td><small>${row?.k}</td>
                <td><small>${row?.sum}</td>
                <td><small>${!!row?.type ? row.type : ""}</td>
               </tr>`
            })
            .join("")
    }).join("")}
</tbody>
</table>`
}

export default vanillajsShowAccountingRecords