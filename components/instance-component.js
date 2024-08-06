const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class InstanceComponent extends D3Component {
    initialize(node, props) {
        const container = d3.select(node).style('position', 'relative');

        // Define dimensions
        const width = 300;
        const height = 200;
        const imageSize = 100;
        const lineLength = 100; // Make the horizontal parts longer

        // Create SVG container
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Append top image
        svg.append('image')
            .attr('xlink:href', "https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/img_data/0/img.png")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .attr('x', 0)
            .attr('y', (height / 2) - imageSize - 10);

        // Append bottom image
        svg.append('image')
            .attr('xlink:href', "https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/img_data/0/img.png")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .attr('x', 0)
            .attr('y', (height / 2) + 10);

        // Append moving dotted lines
        const lineData = [
            { x: imageSize, y: (height / 2) - imageSize / 2 - 10, direction: 'down' },
            { x: imageSize, y: (height / 2) + imageSize / 2 + 10, direction: 'up' }
        ];

        lineData.forEach((line, index) => {
            const pathData = line.direction === 'down' ?
                `M${line.x},${line.y} H${line.x + lineLength} V${height / 2}` :
                `M${line.x},${line.y} H${line.x + lineLength} V${height / 2}`;

            const path = svg.append('path')
                .attr('d', pathData)
                .attr('stroke', 'grey')
                .attr('stroke-width', 4) // Make the lines thicker
                .attr('stroke-dasharray', '5,5')
                .attr('fill', 'none')
                .attr('class', 'dotted-line');

            path
                .attr('stroke-dasharray', '5,5')
                .attr('stroke-dashoffset', 0)
                .style('animation', 'dash 0.5s linear infinite'); // Make the animation faster
            
            if (index === 1) {
                // Append a circle with a plus sign at the meeting point
                svg.append('circle')
                    .attr('cx', line.x + lineLength)
                    .attr('cy', height / 2)
                    .attr('r', 10)
                    .attr('fill', 'white')
                    .attr('stroke', 'grey')
                    .attr('stroke-width', 2);

                svg.append('line')
                    .attr('x1', line.x + lineLength - 5)
                    .attr('y1', height / 2)
                    .attr('x2', line.x + lineLength + 5)
                    .attr('y2', height / 2)
                    .attr('stroke', 'grey')
                    .attr('stroke-width', 2);

                svg.append('line')
                    .attr('x1', line.x + lineLength)
                    .attr('y1', height / 2 - 5)
                    .attr('x2', line.x + lineLength)
                    .attr('y2', height / 2 + 5)
                    .attr('stroke', 'grey')
                    .attr('stroke-width', 2);
            }
        });

        // Add the CSS animation style
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            @keyframes dash {
                to {
                    stroke-dashoffset: -10;
                }
            }
            .dotted-line {
                animation: dash 0.5s linear infinite; // Make the animation faster
            }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    update(props) {
    }
}

module.exports = InstanceComponent;
