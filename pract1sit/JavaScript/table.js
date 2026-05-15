const tableHeaders = {
    id: "ID",
    model: "Модель",
    year: "Год",
    mileage: "Пробег, км",
    status: "Статус",
    driver: "Водитель",
    rating: "Рейтинг",
    trips: "Поездки",
    fuel: "Топливо",
    class: "Класс",
    plate: "Номер",
    service: "Последнее ТО"
};

const createTable = (tableData, idTable) => {
    const table = document.getElementById(idTable);

    if (!tableData || tableData.length === 0) {
        clearTable(idTable);

        const header = Object.keys(tableHeaders);
        const headerRow = createHeaderRow(header);

        table.append(headerRow);

        return;
    }

    clearTable(idTable);

    const header = Object.keys(tableHeaders);
    const headerRow = createHeaderRow(header);

    table.append(headerRow);

    const bodyRows = createBodyRows(tableData);

    table.append(bodyRows);
};

const createHeaderRow = (headers) => {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    tr.setAttribute("bgcolor", "#f8f8f8");

    headers.forEach(header => {
        const th = document.createElement('th');

        th.innerHTML = tableHeaders[header];
        th.dataset.field = header;

        tr.append(th);
    });

    thead.append(tr);

    return thead;
};

const createBodyRows = (tableData) => {
    const tbody = document.createElement('tbody');

    tableData.forEach(item => {
        const tr = document.createElement('tr');

        Object.keys(tableHeaders).forEach(key => {
            const td = document.createElement('td');

            td.innerHTML = item[key];

            tr.append(td);
        });

        tbody.append(tr);
    });

    return tbody;
};

const clearTable = (idTable) => {
    const table = document.getElementById(idTable);

    table.innerHTML = "";
};