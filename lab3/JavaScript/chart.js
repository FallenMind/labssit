// Входные данные:
//   data - исходный массив (например, buildings)
//   key - поле, по которому осуществляется группировка

function createArrGraph(data, key) {  
    const groupObj = d3.group(data, d => d[key]);

    let arrGraph =[];

    for(let entry of groupObj) {
        const minMax = d3.extent(entry[1].map(d => Number(d['Высота'])));
        arrGraph.push({labelX : entry[0], values : minMax});
    }

    return arrGraph;
}

/* добавить новый параметр - данные формы */
function drawGraph(data, dataForm) {
    // значения по оси ОХ    
    const keyX = dataForm.ox.value; // значения по оси OХ из dataForm
        
    // создаем массив для построения графика
    let arrGraph = createArrGraph(data, keyX);

    /* если выбран Год, то отсортировать массив по labelX */
    if (keyX === "Год") {
        arrGraph.sort((a, b) => Number(a.labelX) - Number(b.labelX));
    }

    const svg = d3.select("svg");  
    svg.selectAll('*').remove();

    // создаем словарь с атрибутами области вывода графика
    const attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    }

    // определяем выбранные значения по оси OY
    const showValues = {
        max: dataForm.max.checked,
        min: dataForm.min.checked
    };
       
    // создаем шкалы преобразования и выводим оси
    /* добавить параметр, который указывает какие графики выводить
       минимальные значения, максимальные значения или оба */
    const [scX, scY] = createAxis(svg, arrGraph, attr_area, showValues);
    
    // рисуем график/ графики
    /* добавить параметр, какой именно график рисуем */

    // если выбрана точечная диаграмма
    if (dataForm.chartType.value === "point") {

        /* рисуем график с минимальными значениями, если это необходимо */
        if (showValues.min) {
            createChart(svg, arrGraph, scX, scY, attr_area, "blue", "min");
        }

        /* рисуем график с максимальными значениями, если это необходимо */
        if (showValues.max) {
            createChart(svg, arrGraph, scX, scY, attr_area, "red", "max");
        }
    }

    // если выбрана гистограмма
    if (dataForm.chartType.value === "bar") {
        createHistogram(svg, arrGraph, scX, scY, attr_area, showValues);
    }
}

function createAxis(svg, data, attr_area, showValues){
    // находим интервал значений, которые нужно отложить по оси OY 
    // в зависимости от выбранных пользователем значений (min/max)
    let valuesY = [];

    data.forEach(d => {
        if (showValues.min) {
            valuesY.push(d.values[0]);
        }
        if (showValues.max) {
            valuesY.push(d.values[1]);
        }
    });

    const [min, max] = d3.extent(valuesY);

    // функция интерполяции значений на оси
    // по оси ОХ текстовые значения
    const scaleX = d3.scaleBand()
                    .domain(data.map(d => d.labelX))
                    .range([0, attr_area.width - 2 * attr_area.marginX])
                    .padding(0.2);
                    
    const scaleY = d3.scaleLinear()
                    .domain([300, max * 1.1 ])
                    .range([attr_area.height - 2 * attr_area.marginY, 0]);               
     
     // создание осей
     const axisX = d3.axisBottom(scaleX); // горизонтальная 
     const axisY = d3.axisLeft(scaleY); // вертикальная

     // отрисовка осей в SVG-элементе
     svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, 
                                      ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");
    
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);
        
    return [scaleX, scaleY]
}

function createChart(svg, data, scaleX, scaleY, attr_area, color, typeValue) {
    const index = typeValue === "min" ? 0 : 1;

    svg.selectAll("circle." + typeValue)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", typeValue)
        .attr("cx", d => attr_area.marginX + scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .attr("cy", d => attr_area.marginY + scaleY(d.values[index]))
        .attr("r", 4)
        .style("fill", color);
}

function createHistogram(svg, data, scaleX, scaleY, attr_area, showValues) {
    const selectedValues = [];

    if (showValues.min) {
        selectedValues.push({name: "min", index: 0, color: "blue"});
    }

    if (showValues.max) {
        selectedValues.push({name: "max", index: 1, color: "red"});
    }

    const innerScaleX = d3.scaleBand()
        .domain(selectedValues.map(d => d.name))
        .range([0, scaleX.bandwidth()])
        .padding(0.1);

    selectedValues.forEach(valueInfo => {
        svg.selectAll("rect." + valueInfo.name)
            .data(data)
            .enter()
            .append("rect")
            .attr("class", valueInfo.name)
            .attr("x", d => attr_area.marginX + scaleX(d.labelX) + innerScaleX(valueInfo.name))
            .attr("y", d => attr_area.marginY + scaleY(d.values[valueInfo.index]))
            .attr("width", innerScaleX.bandwidth())
            .attr("height", d => attr_area.height - 2 * attr_area.marginY - scaleY(d.values[valueInfo.index]))
            .style("fill", valueInfo.color);
    });
}