const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');
import * as d3HB from "d3-hexbin";
import eventEmitter from './eventEmitter';

var k = 1.0;
const stroke_color = "#554F5D";
const stroke_width = 1.5;
var x1, y1, x2, y2;

let intervalIDs = [];  // Store interval IDs globally
let map_ = ['#f48382', '#f8bd61', '#ece137', '#c3c580', '#82a69a', '#80b2c5', '#8088c5', '#a380c5', '#c77bab', '#AB907F'];
let label_ = ['Airplane', 'Automobile', 'Bird', 'Cat', 'Deer', 'Dog', 'Frog', 'Horse', 'Ship', 'Truck']
let width_;
let container, canvas;
let cur_perturb = '000';

const perturb_files = ['000', '001', '002', '003'];
let max_radius;

export function InitiCanHexbin() {

    max_radius = 10 * width_ / 500;

    for (let i = 0; i < 4; i++) {

        var filename = '/static/data/resnet/' + perturb_files[i] + '/lvl4.csv'
    
        d3.csv(filename, function(d) {
    
          d.x = +d.xpost
          d.y = +d.ypost
          d.pred = +d.pred
          return d;
    
        }).then(function(data) {
    
            initiateHexbin(data, i);
    
        })
    }

}

function changeContour(num) {

    canvas.selectAll('.cur_contour')
        .filter(function() { 
            return d3.select(this).style('opacity') == 1 && d3.select(this).attr('id') != 'cur_contour' + String(num); 
        })
        .transition()
        .duration(360)
        .style("opacity", 0)

    canvas.select('#cur_contour' + String(num))
        .transition()
        .duration(360)
        .style("opacity", 1)

}

function initiateHexbin(data, i) {

    x1 = d3.scaleLinear()
            .domain([0, 1.0])
            .range([0, 500])
    y1 = d3.scaleLinear()
        .domain([0, 1.0])
        .range([0, 500])

    var inputForHexbinFun = []
    data.forEach(function(d) {
        var p = [x2(d.x), y2(d.y)]
        p.pred = d.pred;
        inputForHexbinFun.push(p)
    })

    var hexbin = d3HB.hexbin()
            .radius(max_radius)
            .extent([[0, 0], [500, 500]])

    var hex_data = hexbin(inputForHexbinFun)
        .map( d => ((d.pred = find_frequent(d)), d))

    let contour_container = canvas.select('.hexbin_container').append('g').attr('class', 'contour_container');

    var bin_container = contour_container.append("g").attr('class', 'cur_contour').attr('id', 'cur_contour' + String(i));

    bin_container.style("opacity", 0);

    // Plot the hexbins
    bin_container.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width_)
        .attr("height", width_)

    bin_container.append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll("path")
        .data( hex_data )
        .enter().append("path")
        .attr("r", function(d) {
            return d.pred;
        })
        .attr("d", function(d) {
            return hexbin.hexagon(radius(d.length));
        })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        //.attr("fill", function(d) { return color(d.length); })
        .attr("fill", function(d) { return map_[d.pred];})
        .attr("stroke", "black")
        .attr("stroke-width", "0.1")
        .attr("opacity", 0.4)
        //.attr("opacity", function(d) { return op(d.length); })
}

function radius(val) {
    if (val > max_radius) {
        return max_radius;
    }
    return val;
}

function find_frequent(d) {
    
    var count = {}

    d.forEach(function(d) {

        if (!count[d.pred]) {
            count[d.pred] = 1;
        }
        else {
            count[d.pred]++;
        }

    })

    const result = Object.entries(count).reduce((a, b) => a[1] > b[1] ? a : b)[0]

    return result;
}

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

        /*window.addEventListener('click' , (e) => {
            const target = e.target//.className; 
            console.log(target);
        })*/

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

            // Append the image to the container
            container.append('img')
                .attr('src', "https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/img_data/0/img.png")
                .attr('class', 'img_thumbnail');
            
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
                d.og_pred = +d.pred;
                return d;
            }
        }).then(function(data) {

            var width = node.getBoundingClientRect().width;
            width_ = width;

            canvas.append('svg').attr('class', 'grid_container');
            canvas.append('g').attr('class', 'hexbin_container').attr('visibility', 'hidden');
            canvas.append('g').attr('class', 'circle_container');

            InitiCanHexbin();


            //the cursor
            const img = canvas.append('image')
                .attr('class', 'cursor')
                .attr('xlink:href', 'static/images/cursor.png')
                .attr('width', 100 * width_ / 500) // Adjust the size as needed
                .attr('height', 100 * width_ / 500)
                .style('opacity', 0)
                .style('visibility', 'hidden'); // Adjust the size as needed

            const radius = 25; // Radius of the circular motion
            let angle = 0; // Initial angle

            function moveInCircles_() {
                angle += 0.03; // Slower speed of the circular movement
                const x = width_ - radius + radius * Math.cos(angle) - 120  * width_ / 500; // Adjusted for bottom right
                const y = width_ - radius + radius * Math.sin(angle) - 120  * width_ / 500; // Adjusted for bottom right
                img.attr('x', x).attr('y', y);
                requestAnimationFrame(moveInCircles_);
            }

            moveInCircles_();

            const gGrid = canvas.select('.grid_container').append("g").attr('class', 'grid');
            grid(gGrid, x, y, node);

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

        //console.log(props.perturb);
        
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

                    d3.select('.cursor')
                        .style('visibility', 'visible')
                        .transition()
                        .duration(2000)
                        .style('opacity', 1);

                    canvas.selectAll('.circle_group')
                        .on("mouseover", function(d, i) {
                            hoverCir(d3.select(this));
                            textbox(d, i);

                            if (d3.select('.cursor').style('visibility') !== 'hidden') {
                                d3.select('.cursor')
                                    .transition()
                                    .duration(1000)
                                    .style('opacity', 0)
                                    .on('end', function() {
                                        d3.select('.cursor')
                                            .style('visibility', 'hidden');
                                    });
                            }

                            d3.select('.img_thumbnail')
                                .interrupt()
                                .style('visibility', 'visible')
                                .style('opacity', 1)
                                .attr('src', function() {
                                    if (cur_perturb === '000') {
                                        return "https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/img_data/" + d.ogi + "/img.png";
                                    }
                                    return "https://raw.githubusercontent.com/yyou22/VISxAI24_imagebase/main/FGSM/" + cur_perturb  + "/" + d.ogi + "/img.png";
                                })
                        })
                        .on("mousemove", function(d, i) {
                            textbox(d, i);
                        })
                        .on("mouseout", function(d, i) {
                            unhoverCir(d3.select(this));
                            remove_textbox();
                            d3.select('.img_thumbnail')
                                .transition()
                                .delay(500)
                                .duration(1000)
                                .style('opacity', 0)
                                .on('end', function() {
                                    d3.select(this)
                                    .style('visibility', 'hidden')
                                })
                        })
                        .on("click", function(d, i) {
                            const imageSuccess = eventEmitter.emit('imageSelected', d.ogi);
                            //console.log(success);
                            const tableSuccess = eventEmitter.emit('circleGroupClicked', {
                                groundTruthLabel: label_[d.target], 
                                originalPrediction: label_[d3.select(this).attr('pred')],
                                currentPrediction: label_[d.pred],
                            });
                            console.log(tableSuccess);
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


                    d3.select('.hexbin_container').attr('visibility', 'visible');

                    canvas.select('#cur_contour0')
                        .transition()
                        .duration(500)
                        .style('opacity', 0);

                    break;

                case "data points":

                    stopAllMovements();
                    stopAnimation();

                    canvas.select('#cur_contour0')
                        .transition()
                        .duration(1500)
                        .style('opacity', 1);

                    canvas.selectAll('.cur_contour')
                        .filter(function() { 
                            return d3.select(this).style('opacity') == 1 && d3.select(this).attr('id') != 'cur_contour0'; 
                        })
                        .transition()
                        .duration(1500)
                        .style("opacity", 0)

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

                        canvas.selectAll('.circle_group')
                            .data(data)
                            .enter();

                        s.transition()
                            .ease(d3.easeCubicOut)
                            .duration(1500)
                            .attr("transform", function(d) {
                                return "translate(" + x2(d.xt) + "," + y2(d.yt) + ")";
                            })
                            .on('end', function() {
                                animateOnceWithIncreasingDelay(d3.selectAll('.circle_group'));
                            })

                    });

            }
        }
        else if (props.state === 'slider' && props.perturb !== this.props.perturb) {
            
            //console.log(props.perturb);

            let contour_num = 0;

            // Set cur_perturb based on props.perturb
            if (props.perturb === 0) {
                cur_perturb = '000';
                contour_num = 0;
            } else if (props.perturb === 0.01) {
                cur_perturb = '001';
                contour_num = 1;
            } else if (props.perturb === 0.02) {
                cur_perturb = '002';
                contour_num = 2;
            } else if (props.perturb === 0.03) {
                cur_perturb = '003';
                contour_num = 3;
            } else {
                // Handle other values or default case if needed
                cur_perturb = '000'; 
                contour_num = 0;
            }

            var i_ = 0;

            canvas.selectAll('.circle_group')
                .select('.dot')
                .interrupt()
                .attr("r", 7 / k * width_ / 500);
            
            canvas.selectAll('.circle_group')
                .select('.arc')
                .interrupt()
                .attr('d', drawArc(6.3 * width_ / 500, k));

            d3.csv('static/data/resnet/' + cur_perturb + '/lvl4.csv', function(d, i) {
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

                changeContour(contour_num);

                canvas.selectAll('.circle_group')
                        .data(data)
                        .enter();

                canvas.selectAll('.arc')
                        .data(data)
                        .enter();

                canvas.selectAll('.circle_group')
                        .transition()
                        .ease(d3.easeSin)
                        .duration(600)
                        .attr("transform", function(d) {
                            return "translate(" + x2(d.xt) + "," + y2(d.yt) + ")";
                        })

                canvas.selectAll('.arc')
                    .transition()
                    .ease(d3.easeSin)
                    .duration(800)
                    .style("fill", function(d) {
                        return map_[d.pred];
                    })

            });

        }
    }
}

module.exports = DRComponent;
