// Bar_Chart.js
d3.csv("Ex5/Ex5_TV_energy_55inchtv_byScreenType.csv", d3.autoType).then(data => {
    const margin = {top: 60, right: 40, bottom: 60, left: 80};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#BarChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scaleBand()
        .domain(data.map(d => d.Screen_Tech))
        .range([0, width])
        .padding(0.3);

    // Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Mean(Labelled energy consumption (kWh/year))"])])
        .nice()
        .range([height, 0]);

    // X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .style('font-weight', '600')
        .text("Energy consumption for different screen technologies for 55inch TVs only)");

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

    // Bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Screen_Tech))
        .attr("y", d => y(d["Mean(Labelled energy consumption (kWh/year))"]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d["Mean(Labelled energy consumption (kWh/year))"]))
        .attr("fill", "#1976d2")
        .on("mouseover", function(event, d) {
            tooltip.style("display", "block")
                .html(
                    `<strong>${d.Screen_Tech}</strong><br>
                    Energy: ${d["Mean(Labelled energy consumption (kWh/year))"].toFixed(2)} kWh/year`
                );
            d3.select(this).attr("fill", "#1565c0");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
            d3.select(this).attr("fill", "#1976d2");
        });

    // X axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .text("Screen Technology");

    // Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -55)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .text("Energy Consumption (kWh/year)");
});