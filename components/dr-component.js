const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

export function grid(g, x, y) {
    g.attr("stroke", "#d6cad9")
        .call(g => {
            const xLines = g.selectAll(".x")
                .data(x.ticks(15));
            
            xLines.enter().append("line")
                .attr("class", "x")
                .attr("y2", 1000)
                .merge(xLines)
                .attr("x1", d => 0.5 + x(d))
                .attr("x2", d => 0.5 + x(d));
            
            xLines.exit().remove();
        })
        .call(g => {
            const yLines = g.selectAll(".y")
                .data(y.ticks(15));
            
            yLines.enter().append("line")
                .attr("class", "y")
                .attr("x2", 1000)
                .merge(yLines)
                .attr("y1", d => 0.5 + y(d))
                .attr("y2", d => 0.5 + y(d));
            
            yLines.exit().remove();
        });

    return g;
}


class DRComponent extends D3Component {

    initialize(node, props) {
        this.width = node.getBoundingClientRect().width;
        this.height = this.width;
        //this.height = window.innerHeight;

        var x = d3.scaleLinear()
            .domain([0, 1.0])
            .range([0, this.width])
        var y = d3.scaleLinear()
            .domain([0, 1.0])
            .range([0, this.height])

        const canvas = d3.select(node).append('svg').attr('class', 'canvas');
        
        canvas.attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .style('width', '100%')
            .style('height', 'auto')
            .style('overflow', 'visible')
            .style('cursor', 'crosshair')
        
        canvas.append('svg').attr('class', 'grid_container');
        canvas.append('g').attr('class', 'circle_container');

        const gGrid = canvas.select('.grid_container').append("g").attr('class', 'grid');
        grid(gGrid, x, y);

        /*canvas.on('click', function() {
            console.log('clicked');
        })*/

        var i_ = 0;

        d3.csv('/data/resnet/000/lvl4.csv', function(d, i) {

            if (+d.vis === 1) {
                d.xt = +d.xpost;
                d.yt = +d.ypost;
                d.xp = +d.xposp;
                d.yp = +d.yposp;
                d.pred = +d.pred;
                d.target = +d.target;
                d.idx = i_;
                d.ogi = +d.ogi;
                i_ += 1;
            }

        }).then(function(data) {

            var s = canvas.select('.circle_container').selectAll()
                    .data(data)
                    .enter()
                    .append('g')
                    .attr('class', 'circle_group')
                    .attr("id", function (d) { return "circle_group" +  d.idx; })
                    .attr("transform", function(d) {
                        return "translate(" + getRndInteger(20, 480)  + "," + getRndInteger(20, 480)  + ")";
                    })
                    .attr('target', function(d){ return d.target;})
                    .attr('pred', function(d){ return d.pred;})
                    .attr('selected', 0);

        });

    }

}

module.exports = DRComponent;