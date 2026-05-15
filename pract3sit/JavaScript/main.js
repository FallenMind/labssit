let currentData = [];

const createOption = (text, value) => {
    const option = document.createElement("option");

    option.text = text;
    option.value = value;

    return option;
};

const fieldNames = {
    id: "ID",
    model: "Модель",
    year: "Год",
    mileage: "Пробег",
    status: "Статус",
    driver: "Водитель",
    rating: "Рейтинг",
    trips: "Поездки",
    fuel: "Топливо",
    class: "Класс",
    plate: "Номер",
    service: "Последнее ТО"
};

const setSortSelect = (select) => {
    select.innerHTML = "";

    select.append(createOption("— не выбрано —", ""));

    Object.entries(fieldNames).forEach(([key, value]) => {
        select.append(createOption(value, key));
    });
};

const setSortSelects = () => {
    setSortSelect(document.getElementById("sort1"));
    setSortSelect(document.getElementById("sort2"));
    setSortSelect(document.getElementById("sort3"));

    document.getElementById("sort2").disabled = true;
    document.getElementById("sort3").disabled = true;

    disableOrder(2);
    disableOrder(3);
};

const disableOrder = (number) => {
    document.querySelectorAll(`input[name="order${number}"]`).forEach(input => {
        input.disabled = true;
        input.checked = input.value === "asc";
    });
};

const enableOrder = (number) => {
    document.querySelectorAll(`input[name="order${number}"]`).forEach(input => {
        input.disabled = false;
    });
};

const updateSortSelectOptions = () => {
    const sort1 = document.getElementById("sort1");
    const sort2 = document.getElementById("sort2");
    const sort3 = document.getElementById("sort3");

    const selected1 = sort1.value;
    const selected2 = sort2.value;

    const old2 = sort2.value;
    const old3 = sort3.value;

    setSortSelect(sort2);
    setSortSelect(sort3);

    if (selected1 !== "") {
        const optionInSort2 = sort2.querySelector(`option[value="${selected1}"]`);

        if (optionInSort2) {
            optionInSort2.remove();
        }

        sort2.disabled = false;
        enableOrder(2);
        sort2.value = old2;
    } else {
        sort2.disabled = true;
        sort2.value = "";
        disableOrder(2);

        sort3.disabled = true;
        sort3.value = "";
        disableOrder(3);

        return;
    }

    if (sort2.value !== "") {
        const option1InSort3 = sort3.querySelector(`option[value="${selected1}"]`);
        const option2InSort3 = sort3.querySelector(`option[value="${selected2}"]`);

        if (option1InSort3) {
            option1InSort3.remove();
        }

        if (option2InSort3) {
            option2InSort3.remove();
        }

        sort3.disabled = false;
        enableOrder(3);
        sort3.value = old3;
    } else {
        sort3.disabled = true;
        sort3.value = "";
        disableOrder(3);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const tableId = "fleet-table";

    const controlsForm = document.getElementById("fleet-controls-form");

    const filterButton = document.getElementById("filter-button");
    const clearButton = document.getElementById("reset-filters-button");

    const sortButton = document.getElementById("sort-button");
    const resetSortButton = document.getElementById("reset-sort-button");

    const chartButton = document.getElementById("chart-button");
    const yCheckboxes = document.querySelectorAll('input[name="y[]"]');
    const sort1 = document.getElementById("sort1");
    const sort2 = document.getElementById("sort2");
    const minCheckbox = document.getElementById("min");
    const maxCheckbox = document.getElementById("max");

    const yError = document.getElementById("y-error");

    const minmaxControls = document.getElementById("minmax-controls");

    currentData = [...data];

    createTable(currentData, tableId);

    setSortSelects();
    const validateMinMax = () => {
    const valid = minCheckbox.checked || maxCheckbox.checked;

        if (valid) {
            yError.classList.add("hidden");
            minmaxControls.classList.remove("error-input");
        } else {
            yError.classList.remove("hidden");
            minmaxControls.classList.add("error-input");
        }

    return valid;
    };
    yCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", function () {

        if (!this.checked) {
            this.checked = true;
            return;
        }

        yCheckboxes.forEach(otherCheckbox => {
            if (otherCheckbox !== this) {
                otherCheckbox.checked = false;
            }
        });

    });
    });
    sort1.addEventListener("change", function () {
        updateSortSelectOptions();
    });

    sort2.addEventListener("change", function () {
        updateSortSelectOptions();
    });

    filterButton.addEventListener("click", function () {
        resetSort();

        filterTable(data, tableId, controlsForm);
    });

    clearButton.addEventListener("click", function () {
    clearFilter(tableId, data, controlsForm);

    resetSort();
    });

    sortButton.addEventListener("click", function () {
        sortTable(tableId);
    });

    resetSortButton.addEventListener("click", function () {
        resetSortAndTable(tableId);
    });

    chartButton.addEventListener("click", function () {
        if (!validateMinMax()) {
            return;
        }
        drawGraph(currentData, controlsForm);
    });
    minCheckbox.addEventListener("change", validateMinMax);
    maxCheckbox.addEventListener("change", validateMinMax);
});
