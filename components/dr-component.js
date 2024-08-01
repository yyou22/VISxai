const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

var k = 1.0;
const stroke_color = "#554F5D";
const stroke_width = 1.5;
var x2, y2;

let intervalIDs = [];  // Store interval IDs globally

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function drawArc(r_, k) {
    var drawArc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(r_ / k)
                    .startAngle(0.5)
                    .endAngle(0.5 + Math.PI);
    return drawArc;
}

// Function to clear all intervals when needed
function stopAllMovements() {
    intervalIDs.forEach(clearInterval);
    intervalIDs = [];  // Clear the interval IDs array
}

export function grid(g, x, y, node) {
    var width = node.getBoundingClientRect().width;
    g.attr("stroke", "#d6cad9")
        .call(g => {
            const xLines = g.selectAll(".x")
                .data(x.ticks(15));
            
            xLines.enter().append("line")
                .attr("class", "x")
                .attr("y2", 1000)
                .attr("stroke-width", 1 * width / 500)
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
                .attr("stroke-width", 1 * width / 500)
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
        this.node = node;

        x2 = d3.scaleLinear()
            .domain([0, 1.0])
            .range([50 * this.width / 500, this.width-50  * this.width / 500])
        y2 = d3.scaleLinear()
            .domain([0, 1.0])
            .range([50  * this.width / 500, this.width-50  * this.width / 500])

        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }

        var x = d3.scaleLinear()
            .domain([0, 1.0])
            .range([0, this.width])
        var y = d3.scaleLinear()
            .domain([0, 1.0])
            .range([0, this.height])

            const container = d3.select(node).style('position', 'relative');

            const canvas = container.append('svg').attr('class', 'canvas');
            
            canvas.attr('viewBox', `0 0 ${this.width} ${this.height}`)
                .style('width', '100%')
                .style('height', 'auto')
                .style('overflow', 'visible')
                .style('cursor', 'crosshair');
            
            const imageUrl = 'static/images/panda_noise.gif'; // Replace with the actual image URL
            
            // Append the image to the parent container
            container.append('img')
                .attr('src', imageUrl)
                .attr('class', 'panda_img')
                .style('position', 'absolute')
                .style('top', '0')
                .style('left', '0')
                .style('width', '100%')
                .style('height', 'auto')
                .style('pointer-events', 'none');
            

        var i_ = 0;

        d3.csv('static/data/resnet/000/lvl4.csv', function(d, i) {
            if (+d.vis == 1) {
                d.xt = +d.xpost;
                d.yt = +d.ypost;
                d.xp = +d.xposp;
                d.yp = +d.yposp;
                d.pred = +d.pred;
                d.target = +d.target;
                d.idx = i_;
                d.ogi = +d.ogi;
                i_ += 1;
                return d;
            }
        }).then(function(data) {
            canvas.append('svg').attr('class', 'grid_container');
            canvas.append('g').attr('class', 'circle_container');

            const gGrid = canvas.select('.grid_container').append("g").attr('class', 'grid');
            grid(gGrid, x, y, node);

            var width = node.getBoundingClientRect().width;

            var s = canvas.select('.circle_container').selectAll()
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'circle_group')
                .attr('opacity', 0.5)
                .attr("id", function (d) { return "circle_group" + d.idx; })
                .attr("transform", function(d) {
                    return "translate(" + getRndInteger(70, width - 70) + "," + getRndInteger(70, width - 70) + ")";
                })
                .attr('target', function(d) { return d.target; })
                .attr('pred', function(d) { return d.pred; })
                .attr('selected', 0);

            s.append('circle')
                .attr('class', 'dot')
                .attr('r', 7 / k * width / 500)
                .attr('stroke_', stroke_width * width / 500)
                .attr('strokec_', 'black')
                .attr('stroke-width', stroke_width / k * width / 500)
                .attr('stroke', stroke_color)
                .style("fill", "#6C626F");

            s.append("path")
                .style("fill", "#6C626F")
                .attr('class', 'arc')
                .attr('d', drawArc(6.6 * width / 500, k));

            // Initialize random angle and radius for each s
            s.each(function(d) {
                d.angle = Math.random() * 2 * Math.PI;
                d.radius = 0.5 + Math.random(); // Random radius between 0.5 and 1.5
            });
        });
    }

    update(props) {
        
        //this.width = this.node.getBoundingClientRect().width;
        var width = this.width;

        var canvas = d3.select('.canvas');
        var s = canvas.select('.circle_container').selectAll('.circle_group');
        
        if (props.state !== this.props.state) {
            switch (props.state) {
                case 'abstract':


                    d3.select('.panda_img')
                        .transition()
                        .ease(d3.easeCubicOut)
                        .duration(2000)
                        .style('opacity', 1)
                        .on('end', function() {
                            stopAllMovements();
                        });

                    break;
                case 'beginning':

                    d3.select('.panda_img')
                        .transition()
                        .ease(d3.easeCubicOut)
                        .duration(2000)
                        .style('opacity', 0);

                    /*s.transition()
                        .ease(d3.easeCubicOut)
                        .duration(2000)
                        .attr("transform", function(d) {
                            return "translate(" + getRndInteger(70, width - 70) + "," + getRndInteger(70, width - 70) + ")";
                        })*/

                    // Define moveInCircles within the introduction case
                    function moveInCircles() {
                        var s = d3.select('.circle_container').selectAll('.circle_group');
                        s.each(function(d) {
                            d.angle += 0.05; // Adjust speed of the circular movement
                            const transform = d3.select(this).attr("transform");
                            const match = /translate\(([^,]+),([^,]+)\)/.exec(transform);
                            if (match) {
                                const centerX = parseFloat(match[1]);
                                const centerY = parseFloat(match[2]);
                                const x = centerX + d.radius * Math.cos(d.angle);
                                const y = centerY + d.radius * Math.sin(d.angle);
                                d3.select(this).transition()
                                    .duration(20)
                                    .attr("transform", "translate(" + x + "," + y + ")");
                            }
                        });
                    }

                    // Initialize random angle and radius for each s
                    var s = d3.select('.circle_container').selectAll('.circle_group');
                    s.each(function(d) {
                        d.angle = Math.random() * 2 * Math.PI;
                        d.radius = 0.5 + Math.random(); // Random radius between 0.5 and 1.5
                    });

                    // Set the interval and store the ID in an array
                    const intervalID = setInterval(moveInCircles, 20);
                    intervalIDs.push(intervalID);
                    break;

                case 'dataset':
                    stopAllMovements(); // Stop all current movements
                    console.log('beginning');

                    s.transition()
                        .ease(d3.easeCubicOut)
                        .duration(2000)
                        .attr("transform", function(d) {
                            return "translate(" + x2(d.xt) + "," + y2(d.yt) + ")";
                        });
                    break;

                // Add other cases as needed
            }
        }
    }
}

module.exports = DRComponent;
