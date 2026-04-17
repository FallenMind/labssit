document.addEventListener("DOMContentLoaded", function () {
    const svg = d3.select("svg");
    const form = document.getElementById("setting");
    const animateBtn = document.getElementById("animateBtn");
    const clearBtn = document.getElementById("clearBtn");

    function createLissajousPath() {
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        const centerX = width / 2;
        const centerY = height / 2;

        const scaleX = width / 3;
        const scaleY = height / 3;

        const step = 0.02;
        let data = [];

        for (let t = Math.PI/2; t <= Math.PI * 2; t += step) {
            data.push({
                x: centerX + scaleX * Math.sin(t + Math.PI / 2),
                y: centerY + scaleY * Math.sin(2 * t)
            });
        }

        for (let t = 0; t <= Math.PI/2; t += step) {
            data.push({
                x: centerX + scaleX * Math.sin(t + Math.PI / 2),
                y: centerY + scaleY * Math.sin(2 * t)
            });
        }

        return data;
    }

    function drawPath() {
        const dataPoints = createLissajousPath();

        const line = d3.line()
            .x(d => d.x)
            .y(d => d.y);

        return svg.append("path")
            .attr("d", line(dataPoints))
            .attr("stroke", "none")
            .attr("fill", "none");
    }

    function moveAndTransformAlong(path, angleStart, angleEnd, scaleStart, scaleEnd) {
        const length = path.getTotalLength();

        return function () {
            return function (t) {
                const point = path.getPointAtLength(t * length);
                const angle = angleStart + (angleEnd - angleStart) * t;
                const scale = scaleStart + (scaleEnd - scaleStart) * t;
                return `translate(${point.x}, ${point.y}) rotate(${angle}) scale(${scale})`;
            };
        };
    }

    function runAnimation() {
        svg.selectAll("*").remove();

        const duration = +form.duration.value;
        const scaleStart = +form.scaleStart.value;
        const scaleEnd = +form.scaleEnd.value;
        const angleStart = +form.angleStart.value;
        const angleEnd = +form.angleEnd.value;

        let pict = drawStar(svg);
        let path = drawPath();

        pict.transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .attrTween("transform", moveAndTransformAlong(path.node(), angleStart, angleEnd, scaleStart, scaleEnd));
    }

    animateBtn.addEventListener("click", runAnimation);

    clearBtn.addEventListener("click", function () {
        svg.selectAll("*").remove();
    });
});