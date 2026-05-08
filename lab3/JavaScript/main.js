document.addEventListener("DOMContentLoaded", function() {
    const dataForm = document.forms.setting;
    const errorEl = document.getElementById("errorOY");
    const buildBtn = document.getElementById("buildBtn");

    showTable("build", buildings);
    drawGraph(buildings, dataForm);

    buildBtn.addEventListener("click", function() {
        const isMax = dataForm.max.checked;
        const isMin = dataForm.min.checked;

        // сбрасываем ошибку
        errorEl.classList.add("hidden");
        dataForm.max.parentElement.classList.remove("error-input");
        dataForm.min.parentElement.classList.remove("error-input");

        // проверка
        if (!isMax && !isMin) {
            errorEl.classList.remove("hidden");
            dataForm.max.parentElement.classList.add("error-input");
            dataForm.min.parentElement.classList.add("error-input");
            return;
        }

        drawGraph(buildings, dataForm);
    });

    const button = document.getElementById("toggleTable");

    button.addEventListener("click", function() {
        if (button.textContent === "Скрыть таблицу") {
            d3.select("#build").selectAll("tr").remove();
            button.textContent = "Показать таблицу";
        } else {
            showTable("build", buildings);
            button.textContent = "Скрыть таблицу";
        }
    });
});