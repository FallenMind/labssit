const createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
};

const setSortSelect = (arr, sortSelect) => {
    sortSelect.append(createOption('Нет', 0));

    arr.forEach((item, index) => {
        sortSelect.append(createOption(item, index + 1));
    });
};

const setSortSelects = (data, dataForm) => {
    const head = Object.keys(data);
    const allSelect = dataForm.getElementsByTagName('select');

    for (const item of allSelect) {
        item.innerHTML = "";
        setSortSelect(head, item);
    }

    allSelect[1].disabled = true;
    document.getElementById('fieldsSecondDesc').disabled = true;
};

const changeNextSelect = (curSelect, nextSelectId) => {
    let nextSelect = document.getElementById(nextSelectId);
    nextSelect.disabled = false;
    nextSelect.innerHTML = curSelect.innerHTML;

    if (curSelect.value != 0) {
        nextSelect.remove(curSelect.value);
        nextSelect.selectedIndex = 0;
        document.getElementById(nextSelectId + 'Desc').disabled = false;
    } else {
        nextSelect.disabled = true;
        nextSelect.selectedIndex = 0;
        document.getElementById(nextSelectId + 'Desc').checked = false;
        document.getElementById(nextSelectId + 'Desc').disabled = true;
    }
};

document.addEventListener("DOMContentLoaded", function () {
    createTable(buildings, "list");

    const filterForm = document.getElementById("filter");
    const sortForm = document.getElementById("sort");

    const findButton = document.getElementById("findButton");
    const clearButton = document.getElementById("clearButton");
    const sortButton = document.getElementById("sortButton");
    const resetSortButton = document.getElementById("resetSortButton");

    const fieldsFirst = document.getElementById("fieldsFirst");

    setSortSelects(buildings[0], sortForm);

    fieldsFirst.addEventListener("change", function () {
        changeNextSelect(this, "fieldsSecond");
    });

    findButton.addEventListener("click", function () {
        resetSort(sortForm);
        filterTable(buildings, "list", filterForm);
    });

    clearButton.addEventListener("click", function () {
        clearFilter("list", buildings, filterForm);
        resetSort(sortForm);
    });

    sortButton.addEventListener("click", function () {
        sortTable("list", sortForm);
    });

    resetSortButton.addEventListener("click", function () {
        resetSortAndTable("list", sortForm);
    });
});