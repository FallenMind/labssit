function createArrGraph(data, keyX, keyY) {
    const groupObj = d3.group(data, d => d[keyX]);

    let arrGraph = [];

    for (let entry of groupObj) {
        const values = entry[1].map(d => Number(d[keyY]));
        const minMax = d3.extent(values);

        arrGraph.push({
            labelX: entry[0],
            values: minMax
        });
    }

    return arrGraph;
}

function drawGraph(data, dataForm) {
    const keyX = dataForm.x.value;

    const checkedY = dataForm.querySelector('input[name="y[]"]:checked');

    if (!checkedY) {
        d3.select("svg").selectAll("*").remove();
        return;
    }

    const keyY = checkedY.value;

    let arrGraph = createArrGraph(data, keyX, keyY);

    if (keyX === "year" || keyX === "id") {
        arrGraph.sort((a, b) => Number(a.labelX) - Number(b.labelX));
    }

    const svg = d3.select("svg");
    svg.selectAll("*").remove();

    const attr_area = {
        width: parseFloat(svg.style("width")),
        height: parseFloat(svg.style("height")),
        marginX: 50,
        marginY: 50
    };

    const showValues = {
        min: dataForm.min.checked,
        max: dataForm.max.checked
    };

    const [scX, scY] = createAxis(svg, arrGraph, attr_area, showValues);

    if (dataForm.chartType.value === "point") {
    if (showValues.min) {
        createChart(svg, arrGraph, scX, scY, attr_area, "blue", "min");
    }

    if (showValues.max) {
        createChart(svg, arrGraph, scX, scY, attr_area, "red", "max");
    }
    }

    if (dataForm.chartType.value === "bar") {
        createHistogram(svg, arrGraph, scX, scY, attr_area, showValues);
    }

    if (dataForm.chartType.value === "line") {
        if (showValues.min) {
            createLineChart(svg, arrGraph, scX, scY, attr_area, "blue", "min");
        }

        if (showValues.max) {
            createLineChart(svg, arrGraph, scX, scY, attr_area, "red", "max");
        }
    }
}

function createAxis(svg, data, attr_area, showValues) {
    let valuesY = [];

    data.forEach(d => {
        if (showValues.min) {
            valuesY.push(d.values[0]);
        }

        if (showValues.max) {
            valuesY.push(d.values[1]);
        }
    });

    if (valuesY.length === 0) {
        return [null, null];
    }

    const [min, max] = d3.extent(valuesY);

    const scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX])
        .padding(0.2);

    const scaleY = d3.scaleLinear()
        .domain([min * 0.9, max * 1.1])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    const axisX = d3.axisBottom(scaleX);
    const axisY = d3.axisLeft(scaleY);

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);

    return [scaleX, scaleY];
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
        selectedValues.push({ name: "min", index: 0, color: "blue" });
    }

    if (showValues.max) {
        selectedValues.push({ name: "max", index: 1, color: "red" });
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

function createLineChart(svg, data, scaleX, scaleY, attr_area, color, typeValue) {
    const index = typeValue === "min" ? 0 : 1;

    const line = d3.line()
        .x(d => attr_area.marginX + scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .y(d => attr_area.marginY + scaleY(d.values[index]));

    svg.append("path")
        .datum(data)
        .attr("class", typeValue)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line);
}