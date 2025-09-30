// Donut_Chart.js
d3.csv("Ex5/Ex5_TV_energy_Allsizes_byScreenType.csv", d3.autoType).then(data => {
    const width = 400, height = 400, margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("#donutChart")
        .attr("width", width + 200) // extra space for legend
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Color scale
    const screenTypes = data.map(d => d.Screen_Tech);
    const color = d3.scaleOrdinal()
        .domain(screenTypes)
        .range(d3.schemeCategory10);

    // Pie generator
    const pie = d3.pie()
        .value(d => d["Mean(Labelled energy consumption (kWh/year))"]);

    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

    // Draw donut
    svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.Screen_Tech))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${radius + 40},${-radius})`);

    screenTypes.forEach((type, i) => {
        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", i * 30)
            .attr("r", 8)
            .attr("fill", color(type));
        legend.append("text")
            .attr("x", 18)
            .attr("y", i * 30 + 5)
            .text(type)
            .attr("font-size", "15px")
            .attr("alignment-baseline", "middle");
    });
});