const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

var k = 1.0;
const stroke_color = "#554F5D";
const stroke_width = 1.5;
var x2, y2;

let intervalIDs = [];  // Store interval IDs globally
let map_ = ['#f48382', '#f8bd61', '#ece137', '#c3c580', '#82a69a', '#80b2c5', '#8088c5', '#a380c5', '#c77bab', '#AB907F'];
let label_ = ['Airplane', 'Automobile', 'Bird', 'Cat', 'Deer', 'Dog', 'Frog', 'Horse', 'Ship', 'Truck']
let width_;
let container, canvas;

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function animateOnceWithIncreasingDelay(g) {
    g.each(function(d, i) {
        if (i % 3 === 0) {  // Apply animation only to every third element
            const element = d3.select(this);
            const delay_ = (i/3) * 50; // Incremental delay for each element

            element.select('.dot').transition()
                .delay(delay_)
                .duration(500)
                .attr("r", 10.7 / k * width_ / 500)
                .transition()
                .duration(500)
                .attr("r", 7 / k * width_ / 500);

            element.select('.arc').transition()
                .delay(delay_)
                .duration(500)
                .attr('d', drawArc(10 * width_ / 500, k))
                .transition()
                .duration(500)
                .attr('d', drawArc(6.3 * width_ / 500, k));
        }
    });
}

export function hoverCir(g){

    g.select('.dot').transition("mousehover")
        .duration(60)
        .attr("r", 15 / k * width_ / 500)

    g.select('.arc').transition("mousehover")
        .duration(60)
        .attr('d', drawArc(14.3 * width_ / 500, k));

}

export function unhoverCir(g){

    g.select('.dot').transition("mousehover")
        .duration(60)
        .attr("r", 7 / k * width_ / 500)

    g.select('.arc').transition("mousehover")
        .duration(60)
        .attr('d', drawArc(6.3 * width_ / 500, k));

}

export function drawArc(r_, k) {
    var drawArc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(r_ / k)
                    .startAngle(0.5)
                    .endAngle(0.5 + Math.PI);
    return drawArc;
}

function RadiusChange(g) {
    g.each(function(d) {
        const element = d3.select(this);
        if (!d.initialDelay) {
            d.initialDelay = Math.random() * 15000; // Initial random delay
        }
        const delay_ = d.initialDelay;

        element.select('.dot').transition()
            .delay(delay_)
            .duration(3000)
            .attr("r", 10.7 / k * width_ / 500)
            .transition()
            .duration(3000)
            .attr("r", 7 / k * width_ / 500)
            .on('end', function() {
                loopRadiusChange(element);
            });

        element.select('.arc').transition()
            .delay(delay_)
            .duration(3000)
            .attr('d', drawArc(10 * width_ / 500, k))
            .transition()
            .duration(3000)
            .attr('d', drawArc(6.3 * width_ / 500, k))
            .on('end', function() {
                loopRadiusChange(element);
            });
    });
}

function loopRadiusChange(element) {
    element.select('.dot').transition()
        .duration(3000)
        .attr("r", 10.7 / k * width_ / 500)
        .transition()
        .duration(3000)
        .attr("r", 7 / k * width_ / 500)
        .on('end', function() {
            loopRadiusChange(element);
        });

    element.select('.arc').transition()
        .duration(3000)
        .attr('d', drawArc(10 * width_ / 500, k))
        .transition()
        .duration(3000)
        .attr('d', drawArc(6.3 * width_ / 500, k))
        .on('end', function() {
            loopRadiusChange(element);
        });
}

function stopAnimation() {
    d3.selectAll('.circle_group').selectAll('.dot, .arc').interrupt();
}

// Function to clear all intervals when needed
function stopAllMovements() {
    intervalIDs.forEach(clearInterval);
    intervalIDs = [];  // Clear the interval IDs array
}

let tooltip;

export function textbox(d, i){

    const tooltipNode = tooltip.node();
    const tooltipRect = tooltipNode.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    tooltip.html("Instance #" + String(i) + " <br>Label: " + label_[d.target] + " <br>Pred.: " + label_[d.pred] + " ")
            .style("left", (d3.mouse(container.node())[0] - tooltipWidth/2  + "px"))
            .style("top", (d3.mouse(container.node())[1] - tooltipHeight - 20 + "px"))
            .style("opacity", 1)

}

export function remove_textbox(){
    tooltip.style("opacity", 0);
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

        //FIXME
        /*window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }*/

        var x = d3.scaleLinear()
            .domain([0, 1.0])
            .range([0, this.width])
        var y = d3.scaleLinear()
            .domain([0, 1.0])
            .range([0, this.height])

            container = d3.select(node).style('position', 'relative');

            canvas = container.append('svg').attr('class', 'canvas');

            tooltip = container.append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)
                        .attr("id", "textbox")
                        .style("background-color", "white")
                        .style("position", "absolute")
                        .style("border", "solid")
                        .style("border-width", "1.5px")
                        .style("border-radius", "5px")
                        .style("border-color", "#a5a4a3")
                        .style("padding", "5px")
                        .style("font-family", "Courier")
                        .style("font-size", "15px")
                        .style("pointer-events", "none"); 
            
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
            width_ = width;

            var s = canvas.select('.circle_container').selectAll()
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'circle_group')
                .attr('opacity', 0.5)
                .attr("id", function (d) { return "circle_group" + d.idx; })
                /*.attr("transform", function(d) {
                    return "translate(" + getRndInteger(70, width - 70) + "," + getRndInteger(70, width - 70) + ")";
                })*/
                .attr("transform", function(d) {
                    return "translate(" + width/2 + "," + width/2 + ")";
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
                .attr('d', drawArc(6.3 * width / 500, k));

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

                    stopAllMovements();
                    stopAnimation();

                    s.transition()
                        .ease(d3.easeBackIn)
                        .duration(function() {
                            return getRndInteger(450, 700); 
                        })
                        .attr("transform", function(d) {
                            return "translate(" + width/2 + "," + width/2 + ")";
                        })
                        .attr('opacity', 0);


                    d3.select('.panda_img')
                        .transition()
                        .ease(d3.easeCubicOut)
                        .duration(2000)
                        .style('opacity', 1)
                        .style('filter', 'blur(0px)');

                    break;
                case 'beginning':

                    stopAllMovements();

                    d3.select('.panda_img')
                        .transition()
                        .ease(d3.easeCubicOut)
                        .duration(4000)
                        .style('opacity', 0)
                        .style('filter', 'blur(50px)');              

                    s.transition()
                        .ease(d3.easeBackOut)
                        .duration(function() {
                            return getRndInteger(450, 700); 
                        })
                        .attr("transform", function(d) {
                            return "translate(" + getRndInteger(70, width - 70) + "," + getRndInteger(70, width - 70) + ")";
                        })
                        //.attr('opacity', 0.5)
                        .on('end', function(d, i) {
                            if (i == s.size() - 1) {
                                intervalIDs.push(setInterval(moveInCircles, 20));
                                RadiusChange(d3.selectAll('.circle_group'));
                            }
                        });

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

                    s.select('.dot')
                        .transition('color_change')
                        .ease(d3.easeCubicOut)
                        .duration(100)
                        .style("fill", "#6C626F");
                    
                    s.select('.arc')
                        .transition('color_change')
                        .ease(d3.easeCubicOut)
                        .duration(100)
                        .style("fill", "#6C626F");

                    s.transition('opacity_change')
                        .ease(d3.easeCubicOut)
                        .duration(100)
                        .attr('opacity', 0.5);

                    canvas.selectAll('.circle_group')
                        .on("mouseover", null)
                        .on('mousemove', null)
                        .on("mouseout", null);

                    //intervalIDs.push(setInterval(moveInCircles, 20));
                    break;

                case 'dataset':
                    
                    stopAnimation();

                    canvas.selectAll('.circle_group')
                        .on("mouseover", function(d, i) {
                            hoverCir(d3.select(this));
                            textbox(d, i);
                        })
                        .on("mousemove", function(d, i) {
                            textbox(d, i);
                        })
                        .on("mouseout", function(d, i) {
                            unhoverCir(d3.select(this));
                            remove_textbox();
                        })

                    s.transition('opacity_change')
                        .ease(d3.easeCubicOut)
                        .duration(1500)
                        .attr('opacity', 1);
                    
                    s.select('.dot')
                        .transition()
                        .ease(d3.easeCubicOut)
                        .duration(500)
                        .style("fill", function(d) {
                            return map_[d.target];
                        })
                        .attr('r', 7 / k * width / 500);

                    s.select('.arc')
                        .transition()
                        .ease(d3.easeCubicOut)
                        .duration(500)
                        .style("fill", function(d) {
                            return map_[d.pred];
                        })
                        .attr('d', drawArc(6.3 * width / 500, k));

                    break;

                case "data points":

                    stopAllMovements();

                    s.transition()
                        .ease(d3.easeCubicOut)
                        .duration(1500)
                        .attr("transform", function(d) {
                            return "translate(" + x2(d.xt) + "," + y2(d.yt) + ")";
                        })
                        .on('end', function() {
                            animateOnceWithIncreasingDelay(d3.selectAll('.circle_group'));
                        })


            }
        }
    }
}

module.exports = DRComponent;
