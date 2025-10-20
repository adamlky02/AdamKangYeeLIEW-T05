// Scatter_plot.js
d3.csv("Ex5/Ex5_TV_energy.csv", d3.autoType).then(data => {
    const margin = {top: 40, right: 40, bottom: 60, left: 80};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#scatterPlot")
        .attr("width", width + margin.left + margin.right + 150)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const screenTypes = [...new Set(data.map(d => d.screen_tech))];
    const color = d3.scaleOrdinal()
        .domain(screenTypes)
        .range(d3.schemeCategory10);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.star2))
        .range([0, width]);
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.energy_consumpt))
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    svg.append("g")
        .call(d3.axisLeft(y));

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

    // `Scatter_plot.js` — insert after the `append("g").attr("transform", ...)` line (svg is the group)
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "600")
        .text("Energy consumption vs Star rating");


    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "donut-tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("display", "none");

    // Points with tooltip
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.star2))
        .attr("cy", d => y(d.energy_consumpt))
        .attr("r", 4)
        .attr("fill", d => color(d.screen_tech))
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            tooltip.style("display", "block")
                .html(
                    `<strong>${d.screen_tech}</strong><br>
                    Star Rating: ${d.star2}<br>
                    Energy: ${d.energy_consumpt} kWh<br>
                    Date: ${d.date ? d.date : "N/A"}`
                );
            d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
            d3.select(this).attr("stroke", null);
        });

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



