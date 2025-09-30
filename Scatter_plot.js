// Scatter_plot.js
d3.csv("Ex5/Ex5_TV_energy.csv", d3.autoType).then(data => {
    const margin = {top: 40, right: 40, bottom: 60, left: 80};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#scatterPlot")
        .attr("width", width + margin.left + margin.right + 150) // extra space for legend
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Color scale for screen_tech
    const screenTypes = [...new Set(data.map(d => d.screen_tech))];
    const color = d3.scaleOrdinal()
        .domain(screenTypes)
        .range(d3.schemeCategory10);

    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.star2))
        .range([0, width]);
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.energy_consumpt))
        .range([height, 0]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    svg.append("g")
        .call(d3.axisLeft(y));

    // Axis labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Star Rating");
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Energy Consumption (kWh)");

    // Points colored by screen_tech
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.star2))
        .attr("cy", d => y(d.energy_consumpt))
        .attr("r", 4)
        .attr("fill", d => color(d.screen_tech))
        .attr("opacity", 0.7);

    // Legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 30}, 0)`);

    screenTypes.forEach((type, i) => {
        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", i * 25)
            .attr("r", 7)
            .attr("fill", color(type));

        legend.append("text")
            .attr("x", 18)
            .attr("y", i * 25 + 5)
            .text(type)
            .attr("font-size", "14px")
            .attr("alignment-baseline", "middle");
    });
});