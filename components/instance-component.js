const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

import eventEmitter from './eventEmitter';

let cur_perturb = 0;

class InstanceComponent extends D3Component {
    initialize(node, props) {
        const container = d3.select(node).style('position', 'relative').style('width', '500px').style('height', '300px').attr('class', 'instance_view');

        // Define dimensions
        const width = 500;
        const height = 240;
        const imageSize = 100;
        const lineLength = 150; // Make the horizontal parts longer

        // Create SVG container
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('position', 'relative')
            .style('top', 0)
            .style('left', 0);

        // Append top image using <img> tag
        container.append('img')
            .attr('class', 'instance_img')
            .attr('id', 'instance_img1')
            .attr('src', "static/images/panda_.gif")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .style('position', 'absolute')
            .style('left', 0)
            .style('top', `${(height / 2) - imageSize - 20}px`) // Adjusted to separate images further
            .style('border-radius', '10px')
            .style('box-shadow', '0px 3px 2px #27082a47')
            .style('border', '10px solid #a5a4a3')
            .style('outline', '2px solid #505050'); // Add a thin darker gray outline

        // Add text label for the top image
        container.append('text')
            .text('original image')
            .style('position', 'absolute')
            .style('left', '22px')
            .style('top', `${(height / 2)}px`)
            .style('font-size', '12px')
            .style('color', 'black');

        // Append bottom image using <img> tag
        container.append('img')
            .attr('class', 'instance_img')
            .attr('id', 'instance_img2')
            .attr('src', "static/images/question_.gif")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .style('position', 'absolute')
            .style('left', 0)
            .style('top', `${(height / 2) + 20}px`) // Adjusted to separate images further
            .style('border-radius', '10px')
            .style('box-shadow', '0px 3px 2px #27082a47')
            .style('border', '10px solid #a5a4a3')
            .style('outline', '2px solid #505050'); // Add a thin darker gray outline

        // Add text label for the bottom image
        container.append('text')
            .attr('class', 'noise_text')
            .text('noise × 0.00')
            .style('position', 'absolute')
            .style('left', '22px')
            .style('top', `${(height / 2) + 142}px`)
            .style('font-size', '12px')
            .style('color', 'black');

        // Append moving dotted lines
        const lineData = [
            { x: imageSize, y: (height / 2) - imageSize - 20 + imageSize / 2, direction: 'down' }, // Adjusted
            { x: imageSize, y: (height / 2) + 20 + imageSize / 2, direction: 'up' } // Adjusted
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

                // Append another horizontal dotted line coming out of the plus sign
                svg.append('path')
                    .attr('d', `M${line.x + lineLength},${height / 2} H${line.x + lineLength + lineLength}`)
                    .attr('stroke', 'grey')
                    .attr('stroke-width', 4)
                    .attr('stroke-dasharray', '5,5')
                    .attr('fill', 'none')
                    .attr('class', 'dotted-line')
                    .style('animation', 'dash 0.5s linear infinite');

                // Append a larger circle with a plus sign at the meeting point
                svg.append('circle')
                    .attr('cx', line.x + lineLength)
                    .attr('cy', height / 2)
                    .attr('r', 20) // Make the circle larger
                    .attr('fill', '#7f609e') // Purple color
                    .attr('stroke', '#5A2D7A') // Darker purple outline
                    .attr('stroke-width', 2);

                svg.append('line')
                    .attr('x1', line.x + lineLength - 5)
                    .attr('y1', height / 2)
                    .attr('x2', line.x + lineLength + 5)
                    .attr('y2', height / 2)
                    .attr('stroke', 'white') // White color for the plus sign
                    .attr('stroke-width', 2);

                svg.append('line')
                    .attr('x1', line.x + lineLength)
                    .attr('y1', height / 2 - 5)
                    .attr('x2', line.x + lineLength)
                    .attr('y2', height / 2 + 5)
                    .attr('stroke', 'white') // White color for the plus sign
                    .attr('stroke-width', 2);
            }
        });

        // Append another image at the end of the new horizontal line
        container.append('img')
            .attr('class', 'instance_img')
            .attr('id', 'instance_img3')
            .attr('src', "static/images/panda_noise.gif")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .style('position', 'absolute')
            .style('left', `${imageSize + lineLength * 2 - imageSize / 2}px`) // Adjusted for the middle point
            .style('top', `${(height / 2) - imageSize / 2 - 10}px`)
            .style('border-radius', '10px')
            .style('box-shadow', '0px 3px 2px #27082a47')
            .style('border', '10px solid #a5a4a3')
            .style('outline', '2px solid #505050'); // Add a thin darker gray outline

        // Add text label for the third image
        container.append('text')
            .text('adversarial image')
            .style('position', 'absolute')
            .style('left', `${imageSize + lineLength * 2 - imageSize / 2 + 10}px`)
            .style('top', `${(height / 2) + 60}px`)
            .style('font-size', '12px')
            .style('color', 'black');

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

        eventEmitter.on('imageSelected', (imageId) => {
            // Define the perturbation file based on the current perturbation value
            const perturb_file = cur_perturb === 0 ? '000' : (cur_perturb * 100).toString().padStart(3, '0');
        
            // Update the noise text
            container
                .select('.noise_text')
                .text('noise × ' + Number(cur_perturb).toFixed(2));
        
            // Update the image sources
            const images = [
                { selector: '#instance_img1', src: `https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/img_data/${imageId}/img.png` },
                { selector: '#instance_img2', src: cur_perturb === 0 ? "static/images/question_.gif" : `https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/FGSM/001/${imageId}/noise.png` },
                { selector: '#instance_img3', src: cur_perturb === 0 ? `https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/img_data/${imageId}/img.png` : `https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/FGSM/${perturb_file}/${imageId}/img.png` }
            ];
        
            // Apply the new sources to the images
            images.forEach(image => {
                d3.select(image.selector).attr('src', image.src);
            });
        });
        
    }

    update(props) {

        if (props.perturb !== this.props.perturb) {
            cur_perturb = props.perturb;
        }

    }
}

module.exports = InstanceComponent;
