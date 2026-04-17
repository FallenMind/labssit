document.addEventListener("DOMContentLoaded", function () {
    const svg = d3.select("svg");

    const form = document.getElementById("setting");
    const drawBtn = document.getElementById("drawBtn");
    const clearBtn = document.getElementById("clearBtn");
    const animateBtn = document.getElementById("animateBtn");

    const animationToggle = document.getElementById("animationToggle");
    const pathToggle = document.getElementById("pathToggle");
    const pathToggleLabel = document.getElementById("pathToggleLabel");

    const animFields = document.querySelectorAll(".anim-field");

    const positionBlock = document.getElementById("positionBlock");
    const pathBlock = document.getElementById("pathBlock");
    const scaleBlock = document.getElementById("scaleBlock");
    const rotateBlock = document.getElementById("rotateBlock");

    const getEase = (value) => {
        if (value === "elastic") return d3.easeElastic;
        if (value === "bounce") return d3.easeBounce;
        return d3.easeLinear;
    };

    const drawStatic = () => {
        svg.selectAll("*").remove();

        let pict = drawSmile(svg);

        pict.attr("transform", `translate(${form.cx.value}, ${form.cy.value}) rotate(${form.angle.value}) scale(${form.sx.value}, ${form.sy.value})`);
    };

    const runAnimation = (dataForm) => {
        svg.selectAll("*").remove();

        let pict = drawSmile(svg);

        if (!dataForm.pathToggle.checked) {
            pict.attr("transform", `translate(${dataForm.cx.value}, ${dataForm.cy.value}) rotate(${dataForm.angle.value}) scale(${dataForm.sx.value}, ${dataForm.sy.value})`)
                .transition()
                .duration(6000)
                .ease(getEase(dataForm.animationType.value))
                .attr("transform", `translate(${dataForm.cx_finish.value}, ${dataForm.cy_finish.value}) rotate(${dataForm.angle_finish.value}) scale(${dataForm.sx_finish.value}, ${dataForm.sy_finish.value})`);
        } else {
            let path = drawPath(dataForm.pathType.value);

            pict.transition()
                .duration(6000)
                .ease(getEase(dataForm.animationType.value))
                .attrTween("transform", translateAlong(path.node()));
        }
    };

    const updatePathMode = () => {
        if (animationToggle.checked && pathToggle.checked) {
            positionBlock.style.display = "none";
            pathBlock.style.display = "block";
            scaleBlock.style.display = "none";
            rotateBlock.style.display = "none";
        } else {
            positionBlock.style.display = "block";
            pathBlock.style.display = "none";
            scaleBlock.style.display = "block";
            rotateBlock.style.display = "block";
        }
    };

    const updateFormMode = () => {
        const isAnimation = animationToggle.checked;

        animFields.forEach(el => {
            el.style.display = isAnimation ? "" : "none";
        });

        pathToggleLabel.style.display = isAnimation ? "" : "none";

        if (!isAnimation) {
            pathToggle.checked = false;
        }

        drawBtn.style.display = isAnimation ? "none" : "";

        updatePathMode();
    };

    drawBtn.addEventListener("click", drawStatic);
    animateBtn.addEventListener("click", () => runAnimation(form));
    clearBtn.addEventListener("click", () => svg.selectAll("*").remove());

    animationToggle.addEventListener("change", updateFormMode);
    pathToggle.addEventListener("change", updatePathMode);

    updateFormMode();
});