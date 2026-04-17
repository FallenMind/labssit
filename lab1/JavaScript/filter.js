const correspond = {
    "Название": "structure",
    "Тип": "category",
    "Страна": "country",
    "Город": "city",
    "Год": ["yearFrom", "yearTo"],
    "Высота": ["heightFrom", "heightTo"]
};

const dataFilter = (dataForm) => {
    let dictFilter = {};

    for (const item of dataForm.elements) {
        if (!item.id) {
            continue;
        }

        let valInput = item.value;

        if (item.type === "text") {
            valInput = valInput.toLowerCase();
        }

        if (item.type === "number") {
            if (valInput !== "") {
                valInput = Number(valInput);
            } else if (item.id.includes("From")) {
                valInput = -Infinity;
            } else if (item.id.includes("To")) {
                valInput = Infinity;
            }
        }

        dictFilter[item.id] = valInput;
    }

    return dictFilter;
};

const filterTable = (data, idTable, dataForm) => {
    const datafilter = dataFilter(dataForm);

    let tableFilter = data.filter(item => {
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
        const header = Object.keys(data[0]);
        const headerRow = createHeaderRow(header);
        table.append(headerRow);
    }
};

const clearFilter = (idTable, data, dataForm) => {
    dataForm.reset();
    clearTable(idTable);
    createTable(data, idTable);
};