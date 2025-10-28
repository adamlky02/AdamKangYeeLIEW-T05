// Line-Chart.js
const svg = d3.select('#LineChart');
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 40, right: 40, bottom: 50, left: 60 };
const innerW = width - margin.left - margin.right;
const innerH = height - margin.top - margin.bottom;

const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'd3-tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('background', 'rgba(0,0,0,0.8)')
    .style('color', '#fff')
    .style('padding', '6px 8px')
    .style('border-radius', '4px')
    .style('font-size', '12px')
    .style('display', 'none');

d3.csv('Ex5/Ex5_ARE_Spot_Prices.csv', d => ({
    year: +d.Year,
    Average: d['Average Price (notTas-Snowy)'] === '' ? null : +d['Average Price (notTas-Snowy)']
})).then(raw => {
    const data = raw.sort((a,b) => a.year - b.year);
    const values = data.map(d => ({ year: d.year, value: d.Average })).filter(d => d.value != null);

    const x = d3.scaleLinear()
        .domain(d3.extent(values, d => d.year))
        .range([0, innerW]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(values, d => d.value) * 1.05])
        .range([innerH, 0]);

    const xAxis = d3.axisBottom(x).tickFormat(d3.format('d')).ticks(8);
    const yAxis = d3.axisLeft(y);

    g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(xAxis);

    g.append('g').call(yAxis);

    g.append('text')
        .attr('x', innerW / 2)
        .attr('y', innerH + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Year');

    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerH / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Spot Price ($/MWh)');

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value))
        .defined(d => d.value != null);

    // single average line
    g.append('path')
        .datum(values)
        .attr('fill', 'none')
        .attr('stroke', '#1f77b4')
        .attr('stroke-width', 3)
        .attr('d', line);

    // points with tooltip
    g.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.value))
        .attr('r', 4)
        .attr('fill', '#1f77b4')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.8)
        .on('mouseover', (event, d) => {
            tooltip.style('display', 'block')
                .html(`<strong>Average</strong><br/>Year: ${d.year}<br/>Price: ${d.value}`);
        })
        .on('mousemove', (event) => {
            tooltip.style('left', (event.pageX + 12) + 'px')
                .style('top', (event.pageY - 12) + 'px');
        })
        .on('mouseout', () => tooltip.style('display', 'none'));

    // title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', '600')
        .text('Average Spot Power Price (1998–2024)');
}).catch(err => {
    console.error('Failed to load CSV:', err);
});
