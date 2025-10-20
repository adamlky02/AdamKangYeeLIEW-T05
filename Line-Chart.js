// Line-Chart.js
const svg = d3.select("#LineChart");
const width = +svg.attr("width");
const height = +svg.attr("height");
const margin = { top: 30, right: 20, bottom: 40, left: 60 };
const innerW = width - margin.left - margin.right;
const innerH = height - margin.top - margin.bottom;

const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

// tooltip
const tip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("background", "rgba(0,0,0,0.75)")
    .style("color", "#fff")
    .style("padding", "6px 8px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("display", "none");

d3.csv("Ex5/Ex5_ARE_Spot_Prices.csv", d => {
    return {
        year: +d.Year,
        avg: d["Average Price (notTas-Snowy)"] === "" ? NaN : +d["Average Price (notTas-Snowy)"]
    };
}).then(raw => {
    const data = raw.filter(d => !isNaN(d.avg) && !isNaN(d.year)).sort((a,b)=>a.year-b.year);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, innerW]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.avg)]).nice()
        .range([innerH, 0]);

    const xAxis = d3.axisBottom(x).tickFormat(d3.format("d")).ticks(Math.min(data.length, 10));
    const yAxis = d3.axisLeft(y);

    g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(xAxis);

    g.append("g")
        .call(yAxis);

    // axis labels
    g.append("text")
        .attr("x", innerW / 2)
        .attr("y", innerH + margin.bottom - 6)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Year");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerH / 2)
        .attr("y", -margin.left + 14)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Average Price ($ per MWh)");

// In `Line-Chart.js` — add after the `const g = ...` line
    g.append("text")
        .attr("class", "chart-title")
        .attr("x", innerW / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "600")
        .text("Spot power prices (1998–2024");


    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.avg))
        .curve(d3.curveMonotoneX);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#1f77b4")
        .attr("stroke-width", 2.5)
        .attr("d", line);

    // points
    g.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.avg))
        .attr("r", 3.5)
        .attr("fill", "#1f77b4")
        .on("mouseover", (event, d) => {
            tip.style("display", "block")
                .html(`${d.year}<br/>$${d.avg.toFixed(2)}`);
        })
        .on("mousemove", (event) => {
            tip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => tip.style("display", "none"));
});
