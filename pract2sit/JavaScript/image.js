function drawStar(svg) {
    let star = svg.append("g")
        .style("stroke", "black")
        .style("stroke-width", 1.5)
        .style("fill", "white");

    star.append("path")
        .attr("d", "m-97.45,-21.04l74.87,0l23.13,-68.37l23.13,68.37l74.87,0l-60.57,42.26l23.14,68.37l-60.57,-42.26l-60.57,42.26l23.14,-68.37l-60.57,-42.26z");

    star.append("rect")
        .attr("x", -118.5)
        .attr("y", -42.6)
        .attr("width", 48)
        .attr("height", 47);

    star.append("rect")
        .attr("x", -22.5)
        .attr("y", -109.6)
        .attr("width", 48)
        .attr("height", 47);

    star.append("rect")
        .attr("x", 69.5)
        .attr("y", -43.6)
        .attr("width", 48)
        .attr("height", 47);

    star.append("rect")
        .attr("x", -81.5)
        .attr("y", 62.4)
        .attr("width", 48)
        .attr("height", 47);

    star.append("rect")
        .attr("x", 32.5)
        .attr("y", 63.4)
        .attr("width", 48)
        .attr("height", 47);

    return star;
}