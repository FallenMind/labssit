import { useState } from "react";
import * as d3 from "d3";
import ChartDraw from './ChartDraw.js';

const Chart = (props) => {
    const [ox, setOx] = useState("Страна");
    const [showMax, setShowMax] = useState(true);
    const [showMin, setShowMin] = useState(false);
    const [chartType, setChartType] = useState("point");
    const [error, setError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.target;
        const isMax = form["max"].checked;
        const isMin = form["min"].checked;
        
        setOx(form["ox"].value);
        setShowMax(isMax);
        setShowMin(isMin);
        setChartType(form["chartType"].value);

        if (!isMax && !isMin) {
            setError(true);
            return;
        }
        setError(false);
    };

    const createArrGraph = (data, key) => {
        const groupObj = d3.group(data, d => d[key]);
        let arrGraph = [];

        for (let entry of groupObj) {
            const minMax = d3.extent(entry[1].map(d => Number(d['Высота'])));
            arrGraph.push({ labelX: entry[0], values: minMax });
        }

        if (key === "Год") {
            arrGraph.sort((a, b) => Number(a.labelX) - Number(b.labelX));
        }

        return arrGraph;
    };

    return (
        <>
            <h4>Визуализация</h4>

            <form onSubmit={handleSubmit}>
                <p>Значение по оси OX:</p>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="ox"
                            value="Страна"
                            defaultChecked={ox === "Страна"}
                        />
                        Страна
                    </label>
                    <br />

                    <label>
                        <input
                            type="radio"
                            name="ox"
                            value="Год"
                            defaultChecked={ox === "Год"}
                        />
                        Год
                    </label>
                </div>

                <p>Значение по оси OY:</p>
                <div>
                    <label className={error ? "error-input" : ""}>
                        <input
                            type="checkbox"
                            name="max"
                            defaultChecked={showMax}
                        />
                        Максимальная высота
                    </label>
                    <br />

                    <label className={error ? "error-input" : ""}>
                        <input
                            type="checkbox"
                            name="min"
                            defaultChecked={showMin}
                        />
                        Минимальная высота
                    </label>
                </div>

                {error &&
                    <p className="error">Выберите хотя бы одно значение по оси OY</p>
                }

                <p>
                    Тип диаграммы:{" "}
                    <select name="chartType" defaultValue={chartType}>
                        <option value="point">Точечная диаграмма</option>
                        <option value="bar">Гистограмма</option>
                    </select>
                </p>

                <p>
                    <button type="submit">Построить</button>
                </p>
            </form>

            <ChartDraw
                data={createArrGraph(props.data, ox)}
                showMax={showMax}
                showMin={showMin}
                chartType={chartType}
            />
        </>
    );
};

export default Chart;
