import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

const ChartDraw = (props) => {
    const chartRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    // задаем отступы в svg-элементе
    const margin = {
        top: 10,
        bottom: 60,
        left: 40,
        right: 10
    };

    // вычисляем ширину и высоту области для вывода графиков
    const boundsWidth = width - margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

    // собираем только те значения OY, которые выбрал пользователь
    const valuesY = useMemo(() => {
        let values = [];

        props.data.forEach(d => {
            if (props.showMin) {
                values.push(d.values[0]);
            }
            if (props.showMax) {
                values.push(d.values[1]);
            }
        });

        return values;
    }, [props.data, props.showMin, props.showMax]);

    const [min, max] = d3.extent(valuesY);

    // формируем шкалы для осей
    const scaleX = useMemo(() => {
        return d3
            .scaleBand()
            .domain(props.data.map(d => d.labelX))
            .range([0, boundsWidth])
            .padding(0.2);
    }, [props.data, boundsWidth]);

    const scaleY = useMemo(() => {
        return d3
            .scaleLinear()
            .domain([Math.min(300, min * 0.85), max * 1.1])
            .range([boundsHeight, 0]);
    }, [boundsHeight, min, max]);

    // заносим в состояния ширину и высоту svg-элемента
    useEffect(() => {
        const svg = d3.select(chartRef.current);
        setWidth(parseFloat(svg.style("width")));
        setHeight(parseFloat(svg.style("height")));
    }, []);

    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        if (!props.showMin && !props.showMax) {
            return;
        }

        // выводим прямоугольник
        svg
            .append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", boundsWidth)
            .attr("height", boundsHeight)
            .style("fill", "lightgrey");

        // рисуем оси
        const xAxis = d3.axisBottom(scaleX);
        svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-30)");

        const yAxis = d3.axisLeft(scaleY);
        svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);

        if (props.chartType === "point") {
            createPointChart(svg, props.data, scaleX, scaleY, margin, props.showMin, props.showMax);
        }

        if (props.chartType === "bar") {
            createHistogram(svg, props.data, scaleX, scaleY, margin, boundsHeight, props.showMin, props.showMax);
        }

    }, [scaleX, scaleY, props.data, props.showMin, props.showMax, props.chartType, boundsWidth, boundsHeight, height]);

    return (
        <svg ref={chartRef}> </svg>
    );
};

const createPointChart = (svg, data, scaleX, scaleY, margin, showMin, showMax) => {
    if (showMin) {
        svg
            .selectAll("circle.min")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "min")
            .attr("r", 5)
            .attr("cx", d => margin.left + scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => margin.top + scaleY(d.values[0]))
            .style("fill", "blue");
    }

    if (showMax) {
        svg
            .selectAll("circle.max")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "max")
            .attr("r", 5)
            .attr("cx", d => margin.left + scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => margin.top + scaleY(d.values[1]))
            .style("fill", "red");
    }
};

const createHistogram = (svg, data, scaleX, scaleY, margin, boundsHeight, showMin, showMax) => {
    const selectedValues = [];

    if (showMin) {
        selectedValues.push({ name: "min", index: 0, color: "blue" });
    }

    if (showMax) {
        selectedValues.push({ name: "max", index: 1, color: "red" });
    }

    const innerScaleX = d3
        .scaleBand()
        .domain(selectedValues.map(d => d.name))
        .range([0, scaleX.bandwidth()])
        .padding(0.1);

    selectedValues.forEach(valueInfo => {
        svg
            .selectAll("rect." + valueInfo.name)
            .data(data)
            .enter()
            .append("rect")
            .attr("class", valueInfo.name)
            .attr("x", d => margin.left + scaleX(d.labelX) + innerScaleX(valueInfo.name))
            .attr("y", d => margin.top + scaleY(d.values[valueInfo.index]))
            .attr("width", innerScaleX.bandwidth())
            .attr("height", d => boundsHeight - scaleY(d.values[valueInfo.index]))
            .style("fill", valueInfo.color);
    });
};

export default ChartDraw;
