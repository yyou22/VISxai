const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class DRComponent extends D3Component {

    initialize(node, props) {
        this.width = node.getBoundingClientRect().width;
        this.height = window.innerHeight;

        const svg = this.svg = d3.select(node).append('svg').attr('class', 'canvas');
        svg.attr('viewBox', `0 0 ${this.width} ${this.height}`)
        .style('width', '100%')
        .style('height', 'auto')
        .style('overflow', 'visible')
        .style('cursor', 'crosshair')
        .style('box-shadow', '0px 0px 10000px transparent')
    }

}

module.exports = DRComponent;