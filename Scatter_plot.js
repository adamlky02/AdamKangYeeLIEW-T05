// Scatter_plot.js
d3.csv("Ex5/Ex5_TV_energy.csv", d3.autoType).then(data => {
    const margin = {top: 40, right: 40, bottom: 60, left: 80};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#scatterPlot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

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

    // Points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.star2))
        .attr("cy", d => y(d.energy_consumpt))
        .attr("r", 4)
        .attr("fill", "#1976d2")
        .attr("opacity", 0.7);
});
