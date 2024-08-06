const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');
import eventEmitter from './eventEmitter';

let cur_perturb = 0;

class ImgComponent extends D3Component {
    initialize(node, props) {
        const container = d3.select(node)
            .style('position', 'relative')
            .style('width', '600px')
            .style('height', '240px')
            .attr('class', 'instance_view');

        // Define dimensions
        const width = 600;
        const height = 240;
        const imageSize = 200; // Adjusted for two images side by side

        // Create a div for image container
        const imageContainer = container.append('div')
            .style('display', 'flex')
            .style('justify-content', 'space-around')
            .style('align-items', 'center')
            .style('width', '100%')
            .style('height', '100%');

        // Append first image using <img> tag
        imageContainer.append('img')
            .attr('class', 'noise_img')
            .attr('id', 'noise_img1')
            .attr('src', "static/images/question_.gif")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .style('border-radius', '10px')
            .style('box-shadow', '0px 3px 2px #27082a47')
            .style('border', '10px solid #a5a4a3')
            .style('outline', '2px solid #505050'); // Add a thin darker gray outline

        // Append second image using <img> tag
        imageContainer.append('img')
            .attr('class', 'noise_img')
            .attr('id', 'noise_img2')
            .attr('src', "static/images/question_.gif")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .style('border-radius', '10px')
            .style('box-shadow', '0px 3px 2px #27082a47')
            .style('border', '10px solid #a5a4a3')
            .style('outline', '2px solid #505050'); // Add a thin darker gray outline

        // Event listener for updating images
        eventEmitter.on('imageSelected', (imageId) => {
            let perturb_file;

            if (cur_perturb === 0) {
                perturb_file = '000';
            } else if (cur_perturb === 0.01) {
                perturb_file = '001';
            } else if (cur_perturb === 0.02) {
                perturb_file = '002';
            } else if (cur_perturb === 0.03) {
                perturb_file = '003';
            } else {
                // Handle other values or default case if needed
                perturb_file = '000';
            }

            d3.select('#noise_img1')
                    .attr('src', `https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/FGSM/001/${imageId}/noise.png`);
        });
    }

    update(props) {
        // Handle any updates if necessary
        if (props.perturb !== this.props.perturb) {
            cur_perturb = props.perturb;
        }

    }
}

module.exports = ImgComponent;
