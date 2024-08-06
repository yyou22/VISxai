const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class InstanceComponent extends D3Component {
    initialize(node, props) {
        const container = d3.select(node).style('position', 'relative').style('width', '300px').style('height', '240px');

        // Define dimensions
        const width = 300;
        const height = 240;
        const imageSize = 100;
        const lineLength = 150; // Make the horizontal parts longer

        // Create SVG container
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0);

        // Append top image using <img> tag
        container.append('img')
            .attr('src', "https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/img_data/0/img.png")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .style('position', 'absolute')
            .style('left', 0)
            .style('top', `${(height / 2) - imageSize - 20}px`) // Adjusted to separate images further
            .style('border-radius', '10px')
            .style('box-shadow', '0px 3px 2px #27082a47')
            .style('border', '10px solid #a5a4a3')
            .style('outline', '2px solid #505050'); // Add a thin darker gray outline

        // Append bottom image using <img> tag
        container.append('img')
            .attr('src', "https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/img_data/0/img.png")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .style('position', 'absolute')
            .style('left', 0)
            .style('top', `${(height / 2) + 20}px`) // Adjusted to separate images further
            .style('border-radius', '10px')
            .style('box-shadow', '0px 3px 2px #27082a47')
            .style('border', '10px solid #a5a4a3')
            .style('outline', '2px solid #505050'); // Add a thin darker gray outline

        // Append moving dotted lines
        const lineData = [
            { x: imageSize, y: (height / 2) - imageSize - 10 + imageSize / 2, direction: 'down' }, // Adjusted
            { x: imageSize, y: (height / 2) + 30 + imageSize / 2, direction: 'up' } // Adjusted
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
                // Append a larger circle with a plus sign at the meeting point
                svg.append('circle')
                    .attr('cx', line.x + lineLength)
                    .attr('cy', height / 2 + 10)
                    .attr('r', 20) // Make the circle larger
                    .attr('fill', '#7f609e') // Purple color
                    .attr('stroke', '#5A2D7A') // Darker purple outline
                    .attr('stroke-width', 2);

                svg.append('line')
                    .attr('x1', line.x + lineLength - 5)
                    .attr('y1', height / 2 + 10)
                    .attr('x2', line.x + lineLength + 5)
                    .attr('y2', height / 2 + 10)
                    .attr('stroke', 'white') // White color for the plus sign
                    .attr('stroke-width', 2);

                svg.append('line')
                    .attr('x1', line.x + lineLength)
                    .attr('y1', height / 2 + 10 - 5)
                    .attr('x2', line.x + lineLength)
                    .attr('y2', height / 2 + 10 + 5)
                    .attr('stroke', 'white') // White color for the plus sign
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
