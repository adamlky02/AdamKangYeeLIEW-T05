// Donut_Chart.js
d3.csv("Ex5/Ex5_TV_energy_Allsizes_byScreenType.csv", d3.autoType).then(data => {
    const width = 600, height = 400, margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Group data by Screen_Tech and sum energy consumption
    const energyByTech = d3.rollup(
        data,
        v => d3.sum(v, d => d["Mean(Labelled energy consumption (kWh/year))"]),
        d => d.Screen_Tech
    );
    const chartData = Array.from(energyByTech, ([Screen_Tech, Energy]) => ({ Screen_Tech, Energy }));

    const svg = d3.select("#donutChart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(chartData.map(d => d.Screen_Tech))
        .range(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.Energy);

    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

    svg.selectAll("path")
        .data(pie(chartData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.Screen_Tech))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);

    // Legend
    const legend = svg.append("g")
        .attr("transform", `translate(${radius + 40 - width / 2},${-radius})`);

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