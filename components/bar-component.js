const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class BarComponent extends D3Component {
    initialize(node, props) {
        const container = d3.select(node).style('position', 'relative');
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const fixedHeight = 200; // Set a fixed height for the chart
        const maxWidth = 400; // Set a maximum width for the chart

        const svg = container.append('svg')
            .attr('class', 'bar_container')
            .style('display', 'block')
            .style('margin', '0 auto'); // Center the SVG horizontally

        // Add a tooltip div. Ensure it's hidden by default.
        const tooltip = container.append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '5px')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('opacity', 0); // Hidden by default

        const data = [
            { label: 'Accuracy', value: 93 },
            { label: 'Robustness', value: 93 }
        ];

        const updateDimensions = () => {
            const containerWidth = Math.min(node.getBoundingClientRect().width - margin.left - margin.right, maxWidth);

            svg.attr('viewBox', `0 0 ${containerWidth + margin.left + margin.right} ${fixedHeight + margin.top + margin.bottom}`)
                .attr('width', containerWidth + margin.left + margin.right)
                .attr('height', fixedHeight + margin.top + margin.bottom);

            const x = d3.scaleBand()
                .domain(data.map(d => d.label))
                .range([0, containerWidth])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, 100])
                .range([fixedHeight, 0]);

            svg.selectAll('*').remove();

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const barWidth = x.bandwidth() / 1.5;
            const offset = (x.bandwidth() - barWidth) / 2;

            g.selectAll('.bar_')
                .data(data)
                .enter().append('rect')
                .attr('class', 'bar_')
                .attr('x', d => x(d.label) + offset)  // Adjust the position by the offset
                .attr('y', d => y(d.value))
                .attr('width', barWidth)  // Use the new narrower width
                .attr('height', d => fixedHeight - y(d.value))
                .attr('fill', '#D45A9A')
                .attr('stroke', '#AFA4B4')
                .attr('stroke-width', '2px') // Add gray outline
                .on('mouseover', function(d) {
                    d3.select(this).attr('fill', '#a896b9'); // Change color on hover
                    
                    tooltip.style('opacity', 1) // Show tooltip
                        .html(`${d.label}: ${d.value}%`)
                        .style('left', d3.mouse(container.node())[0] + 'px')
                        .style('top', d3.mouse(container.node())[1] + 'px');
                })
                .on('mousemove', function(d) {
                    tooltip.style('opacity', 1) // Show tooltip
                        .html(`${d.label}: ${d.value}%`)
                        .style('left', d3.mouse(container.node())[0] + 10 + 'px')
                        .style('top', d3.mouse(container.node())[1] + 10 + 'px');
                })
                .on('mouseout', function(d) {
                    d3.select(this).attr('fill', '#D45A9A'); // Revert color
                    tooltip.style('opacity', 0); // Hide tooltip
                });

            g.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0,${fixedHeight})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .style("font-size", "16px");

            g.select('.x-axis path')
                .attr('stroke', '#AFA4B4')
                .attr('stroke-width', '5px');

            g.selectAll('.x-axis .tick line')
                .attr('stroke', '#AFA4B4')
                .attr('stroke-width', '5px');

            g.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(y).tickValues([0, 20, 40, 60, 80, 100]).tickFormat(d => d + '%'))
                .style("font-size", "16px");

            g.select('.y-axis path')
                .attr('stroke', '#AFA4B4')
                .attr('stroke-width', '5px');

            g.selectAll('.y-axis .tick line')
                .attr('stroke', '#AFA4B4')
                .attr('stroke-width', '5px');
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
    }
}

module.exports = BarComponent;
