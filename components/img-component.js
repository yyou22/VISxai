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
            .style('height', '270px') // Increased height to accommodate text below images
            .attr('class', 'instance_view');

        // Define dimensions
        const width = 600;
        const height = 300;
        const imageSize = 200; // Adjusted for two images side by side

        // Create a div for image container
        const imageContainer = container.append('div')
            .style('display', 'flex')
            .style('justify-content', 'space-around')
            .style('align-items', 'center')
            .style('width', '100%')
            .style('height', '80%'); // Adjusted height to leave space for text

        // Append first image using <img> tag
        const firstImageDiv = imageContainer.append('div')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('align-items', 'center');

        firstImageDiv.append('img')
            .attr('class', 'noise_img')
            .attr('id', 'noise_img1')
            .attr('src', "static/images/question_.gif")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .style('border-radius', '10px')
            .style('box-shadow', '0px 3px 2px #27082a47')
            .style('border', '10px solid #a5a4a3')
            .style('outline', '2px solid #505050'); // Add a thin darker gray outline

        firstImageDiv.append('div')
            .style('margin-top', '10px')
            .style('font-family', 'Arial, sans-serif')
            .style('font-size', '16px')
            .style('text-align', 'center')
            .text('ResNet');

        // Append second image using <img> tag
        const secondImageDiv = imageContainer.append('div')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('align-items', 'center');

        secondImageDiv.append('img')
            .attr('class', 'noise_img')
            .attr('id', 'noise_img2')
            .attr('src', "static/images/question_.gif")
            .attr('width', imageSize)
            .attr('height', imageSize)
            .style('border-radius', '10px')
            .style('box-shadow', '0px 3px 2px #27082a47')
            .style('border', '10px solid #a5a4a3')
            .style('outline', '2px solid #505050'); // Add a thin darker gray outline

        secondImageDiv.append('div')
            .style('margin-top', '10px')
            .style('font-family', 'Arial, sans-serif')
            .style('font-size', '16px')
            .style('text-align', 'center')
            .text('ResNet-34★');

        // Event listener for updating images
        eventEmitter.on('imageSelected', (imageId) => {

            d3.select('#noise_img1')
                .attr('src', `https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/FGSM/001/${imageId}/noise.png`);

            d3.select('#noise_img2')
                .attr('src', `https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/FGSM_trades/001/${imageId}/noise.png`);

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
