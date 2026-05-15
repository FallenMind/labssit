const correspond = {
    id: ["id_min", "id_max"],
    model: "model_contains",
    year: ["year_min", "year_max"],
    mileage: ["mileage_min", "mileage_max"],
    status: "status",
    driver: "driver_contains",
    rating: ["rating_min", "rating_max"],
    trips: ["trips_min", "trips_max"],
    fuel: "fuel",
    class: "class",
    plate: "plate_contains",
    service: ["service_from", "service_to"]
};

const dataFilter = (dataForm) => {
    let dictFilter = {};

    for (const item of dataForm.elements) {
        if (!item.id) {
            continue;
        }

        let valInput = item.value;

        if (item.type === "text") {
            valInput = valInput.toLowerCase().trim();
        }

        if (item.type === "number") {
            if (valInput !== "") {
                valInput = Number(valInput);
            } else if (item.id.includes("_min")) {
                valInput = -Infinity;
            } else if (item.id.includes("_max")) {
                valInput = Infinity;
            }
        }

        if (item.type === "date") {
            if (valInput === "" && item.id.includes("_from")) {
                valInput = "0000-00-00";
            } else if (valInput === "" && item.id.includes("_to")) {
                valInput = "9999-99-99";
            }
        }

        dictFilter[item.id] = valInput;
    }

    return dictFilter;
};

const filterTable = (tableData, idTable, dataForm) => {
    const datafilter = dataFilter(dataForm);

    let tableFilter = tableData.filter(item => {
        let result = true;

        Object.entries(item).forEach(([key, val]) => {
            const filterKey = correspond[key];

            if (!filterKey) {
                return;
            }

            if (typeof val === "string" && Array.isArray(filterKey)) {
                result &&= val >= datafilter[filterKey[0]] &&
                           val <= datafilter[filterKey[1]];
            } else if (typeof val === "string") {
                if (datafilter[filterKey] !== "") {
                    result &&= val.toLowerCase().includes(datafilter[filterKey]);
                }
            } else if (typeof val === "number") {
                result &&= val >= datafilter[filterKey[0]] &&
                           val <= datafilter[filterKey[1]];
            }
        });

        return result;
    });

    currentData = tableFilter;

    clearTable(idTable);

    if (tableFilter.length > 0) {
        createTable(tableFilter, idTable);
    } else {
        const table = document.getElementById(idTable);
        const header = Object.keys(tableHeaders);
        const headerRow = createHeaderRow(header);

        table.append(headerRow);
    }
};

const clearFilter = (idTable, tableData, dataForm) => {
    dataForm.reset();

    currentData = [...tableData];

    clearTable(idTable);
    createTable(tableData, idTable);
};