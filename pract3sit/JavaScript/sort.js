const createSortArr = () => {
    let sortArr = [];

    for (let i = 1; i <= 3; i++) {
        const select = document.getElementById("sort" + i);
        const keySort = select.value;

        if (keySort === "") {
            break;
        }

        const desc = document.getElementById(`order${i}Desc`).checked;

        sortArr.push({
            field: keySort,
            direction: desc
        });
    }

    return sortArr;
};

const getColumnIndexByField = (table, field) => {
    const headers = table.querySelectorAll("th");

    for (let i = 0; i < headers.length; i++) {
        if (headers[i].dataset.field === field) {
            return i;
        }
    }

    return -1;
};

const isNumericField = (field) => {
    return field === "id" ||
           field === "year" ||
           field === "mileage" ||
           field === "rating" ||
           field === "trips";
};

const sortTable = (idTable) => {
    const sortArr = createSortArr();
    const table = document.getElementById(idTable);

    if (sortArr.length === 0) {
        restoreCurrentFilteredTable(idTable);
        return false;
    }

    const tbody = table.querySelector("tbody");

    if (!tbody) {
        return false;
    }

    let rowData = Array.from(tbody.rows);

    rowData.sort((first, second) => {
        for (let { field, direction } of sortArr) {
            const column = getColumnIndexByField(table, field);

            if (column === -1) {
                continue;
            }

            let firstCell = first.cells[column].innerHTML;
            let secondCell = second.cells[column].innerHTML;

            let comparison = 0;

            if (isNumericField(field)) {
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

    tbody.innerHTML = "";

    rowData.forEach(row => {
        tbody.append(row);
    });
};

const resetSort = () => {
    setSortSelects();

    for (let i = 1; i <= 3; i++) {
        document.getElementById("sort" + i).value = "";

       document.getElementById(`order${i}Asc`).checked = true;
    }
};

const restoreCurrentFilteredTable = (idTable) => {
    const filterForm = document.getElementById("fleet-controls-form");

    filterTable(data, idTable, filterForm);
};

const resetSortAndTable = (idTable) => {
    resetSort();
    restoreCurrentFilteredTable(idTable);
};