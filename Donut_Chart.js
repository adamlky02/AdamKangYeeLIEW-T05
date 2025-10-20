// Donut_Chart.js
d3.csv("Ex5/Ex5_TV_energy_Allsizes_byScreenType.csv", d3.autoType).then(data => {
    const width = 600, height = 400, margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Group data by Screen_Tech and sum energy consumption
    const totalEnergy = d3.sum(data, d => d["Mean(Labelled energy consumption (kWh/year))"]);
    const chartData = data.map(d => ({
        Screen_Tech: d.Screen_Tech,
        Energy: d["Mean(Labelled energy consumption (kWh/year))"],
        Percent: ((d["Mean(Labelled energy consumption (kWh/year))"] / totalEnergy) * 100).toFixed(1)
    }));

    const svg = d3.select("#donutChart")
        .attr("width", width)
        .attr("height", height);

    const chartGroup = svg.append("g")
        .attr("transform", `translate(${width / 2 - 60},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(chartData.map(d => d.Screen_Tech))
        .range(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.Energy);

    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

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

    const arcs = chartGroup.selectAll("path")
        .data(pie(chartData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.Screen_Tech))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            tooltip.style("display", "block")
                .html(
                    `<strong>${d.data.Screen_Tech}</strong><br>
                    Energy: ${d.data.Energy.toFixed(2)} kWh/year<br>
                    Percentage: ${d.data.Percent}%`
                );
            d3.select(this).attr("opacity", 0.7);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
            d3.select(this).attr("opacity", 1);
        });

    // Add percentage text inside each slice
    chartGroup.selectAll("text")
        .data(pie(chartData))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", "#fff")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text(d => `${d.data.Percent}%`);

    // `Donut_Chart.js` — insert after creating `svg` (before or after `chartGroup`)
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .text("Energy consumption for different screen technologies across all TVs combined");

    // Legend (right side, without percentage)
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 150},${height / 2 - chartData.length * 15})`);

    chartData.forEach((d, i) => {
        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", i * 30)
            .attr("r", 8)
            .attr("fill", color(d.Screen_Tech));
        legend.append("text")
            .attr("x", 18)
            .attr("y", i * 30 + 5)
            .text(d.Screen_Tech)
            .attr("font-size", "15px")
            .attr("alignment-baseline", "middle");
    });
});