const createSortArr = (data) => {
    let sortArr = [];
    const sortSelects = data.getElementsByTagName('select');

    for (const item of sortSelects) {
        const keySort = item.value;

        if (keySort == 0) {
            break;
        }

        const desc = document.getElementById(item.id + 'Desc').checked;

        sortArr.push({
            column: keySort - 1,
            direction: desc
        });
    }

    return sortArr;
};

const isNumericColumn = (columnIndex, table) => {
    const headerText = table.rows[0].cells[columnIndex].innerHTML;
    return headerText === "Год" || headerText === "Высота";
};

const sortTable = (idTable, formData) => {
    const sortArr = createSortArr(formData);
    const table = document.getElementById(idTable);

    if (sortArr.length === 0) {
        restoreCurrentFilteredTable(idTable);
        return false;
    }

    let rowData = Array.from(table.rows);
    const headerRow = rowData.shift();

    rowData.sort((first, second) => {
        for (let { column, direction } of sortArr) {
            let firstCell = first.cells[column].innerHTML;
            let secondCell = second.cells[column].innerHTML;
            let comparison = 0;

            if (isNumericColumn(column, table)) {
                firstCell = Number(firstCell);
                secondCell = Number(secondCell);
                comparison = firstCell - secondCell;
            } else {
                comparison = firstCell.localeCompare(secondCell);
            }

            if (comparison !== 0) {
                return direction ? -comparison : comparison;
            }
        }

        return 0;
    });

    clearTable(idTable);
    table.append(headerRow);

    let tbody = document.createElement('tbody');
    rowData.forEach(item => {
        tbody.append(item);
    });

    table.append(tbody);
};

const resetSort = (sortForm) => {
    setSortSelects(buildings[0], sortForm);
    sortForm.reset();
    document.getElementById('fieldsSecond').disabled = true;
    document.getElementById('fieldsSecondDesc').disabled = true;
    document.getElementById('fieldsSecondDesc').checked = false;
};

const restoreCurrentFilteredTable = (idTable) => {
    const filterForm = document.getElementById("filter");
    const datafilter = dataFilter(filterForm);

    let tableFilter = buildings.filter(item => {
        let result = true;

        Object.entries(item).forEach(([key, val]) => {
            if (typeof val === "string") {
                result &&= val.toLowerCase().includes(datafilter[correspond[key]]);
            } else if (typeof val === "number") {
                result &&= val >= datafilter[correspond[key][0]] &&
                           val <= datafilter[correspond[key][1]];
            }
        });

        return result;
    });

    clearTable(idTable);

    if (tableFilter.length > 0) {
        createTable(tableFilter, idTable);
    } else {
        const table = document.getElementById(idTable);
        const header = Object.keys(buildings[0]);
        const headerRow = createHeaderRow(header);
        table.append(headerRow);
    }
};

const resetSortAndTable = (idTable, sortForm) => {
    resetSort(sortForm);
    restoreCurrentFilteredTable(idTable);
};