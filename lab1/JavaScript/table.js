const createTable = (data, idTable) => {
    const table = document.getElementById(idTable);
    if (!data || data.length === 0) {
        return;
    }
    const header = Object.keys(data[0]);
    const headerRow = createHeaderRow(header);
    table.append(headerRow);
    const bodyRows = createBodyRows(data);
    table.append(bodyRows);
};

const createHeaderRow = (headers) => {
    const tr = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerHTML = header;
        tr.append(th);
    });

    return tr;
};

const createBodyRows = (data) => {
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const tr = document.createElement('tr');
        for (const key in item) {
            const td = document.createElement('td');
            td.innerHTML = item[key];
            tr.append(td);
        }
        tbody.append(tr);
    });
    return tbody;
};

const clearTable = (idTable) => {
    const table = document.getElementById(idTable);
    table.innerHTML = "";
};