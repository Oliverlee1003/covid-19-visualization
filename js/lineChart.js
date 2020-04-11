class LineChart {

    constructor(_config) {
        this.config = {
            parentElement: _config.parentElement,
            lineChartData: _config.lineChartData
        };
        this.confirmed = false;
        this.death = false;
        this.recovered = false;

        this.initVis();
    }


    initVis() {
        let vis = this;

        vis.config.lineChartData.forEach(d => {
            d.date = new Date(d.date);
            d.confirmed = parseInt(d.confirmed);
            d.death = parseInt(d.death);
            d.recovered = parseInt(d.recovered);
        });
        vis.svg = d3.select(vis.config.parentElement).append('svg');
        console.log(vis.config.lineChartData);
        vis.title = 'COVID-19 Cases';


        vis.margin = {
            top: 50,
            right: 80,
            bottom: 100,
            left: 100
        },
            vis.width = 700 - vis.margin.left - vis.margin.right,
            vis.height = 800 - vis.margin.top - vis.margin.bottom;


        vis.x = d3.time.scale()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.color = d3.scale.category10();

        const xAxis = d3.axisBottom(vis.x)
            .tickSize(-vis.height)
            .tickPadding(15);

        const yAxis = d3.axisLeft(vis.y)
            .tickSize(-vis.width)
            .tickPadding(10);

         vis.line = d3.line()
            .curve(d3.curveBasis)
            .x(function (d) {
                return vis.x(d.date);
            })
            .y(function (d) {
                return vis.y(d.cases);
            });


        vis.svg
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        vis.color.domain(d3.keys(vis.config.lineChartData[0]).filter(function (key) {
            return key !== "date";
        }));


        vis.types = vis.color.domain().map(function (name) {
            return {
                name: name,
                values: vis.config.lineChartData.map(function (d) {
                    return {
                        date: d.date,
                        cases: +d[name]
                    };
                })
            };
        });


        vis.x.domain(d3.extent(vis.config.lineChartData, function (d) {
            return d.date;
        }));

        vis.y.domain([
            d3.min(vis.types, function (c) {
                return d3.min(c.values, function (v) {
                    return v.cases;
                });
            }),
            d3.max(vis.types, function (c) {
                return d3.max(c.values, function (v) {
                    return v.cases;
                });
            })
        ]);

        vis.legend = vis.svg.selectAll("legend")
            .data(vis.types)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', "translate(80,80)");

        vis.legend.append('rect')
            .attr('x', vis.width)
            .attr('y', function (d, i) {
                return i * 20;
            })
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', function (d) {
                console.log(d);
                return vis.color(d.name);
            });

        vis.legend.append('text')
            .attr('x', vis.width + 12)
            .attr('y', function (d, i) {
                return (i * 20) + 9;
            })
            .text(function (d) {

                return d.name;
            })
            .style('fill', function (d) {
                console.log(d);
                return vis.color(d.name);
            });


        vis.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(80,700)")
            .call(xAxis);

        vis.svg.append("g")
            .attr("class", "y axis")
            .attr('transform', "translate(80,50)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("cases ");
        vis.render();
    }
    update(){
        let vis = this;
        vis.city.select('path')
            .remove();
        this.initVis();
    }
    render(){
        let vis = this;
         vis.city = vis.svg.selectAll(".city")
            .data(vis.types)
            .enter().append("g")
            .attr("class", "city")
            .attr('transform',"translate(80,50)");

        vis.city.append("path")
            .attr("class", "line")
            .attr("d", function(d) {
                return vis.line(d.values);
            })
            .attr('fill', 'none')
            .style("stroke", function(d) {
                return vis.color(d.name);
            });
        let totalLength = vis.city.select("path").node().getTotalLength();
        let transitionPath = d3.transition()
            .duration(8000);
        vis.city.select("path")
            .attr("stroke-dashoffset", totalLength)
            .attr("stroke-dasharray", totalLength)
            .transition(transitionPath)
            .attr("stroke-dashoffset", 0);

        vis.city.append("text")
            .datum(function(d) {
                return {
                    name: d.name,
                    value: d.values[d.values.length - 1]
                };
            })
            .attr("transform", function(d) {
                return "translate(" + vis.x(d.value.date) + "," + vis.y(d.value.cases) + ")";
            })
            .attr("x", 3)
            .attr("dy", ".35em");

        var mouseG = vis.svg.append("g")
            .attr("class", "mouse-over-effects")
            .attr('transform',"translate(80,50)");

        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        var lines = document.getElementsByClassName('line');

        var mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(vis.types)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line");

        mousePerLine.append("circle")
            .attr("r", 5)
            .style("stroke", function(d) {
                return vis.color(d.name);
            })
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        mousePerLine.append("text")
            .attr("transform", "translate(10,3)");

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', vis.width) // can't catch mouse events on a g element
            .attr('height', vis.height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function() { // on mouse out hide line, circles and text
                d3.select(".mouse-line")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "0");
            })
            .on('mouseover', function() { // on mouse in show line, circles and text
                d3.select(".mouse-line")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "1");
            })
            .on('mousemove', function() { // mouse moving over canvas
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                    .attr("d", function() {
                        var d = "M" + mouse[0] + "," + vis.height;
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    });

                d3.selectAll(".mouse-per-line")
                    .attr("transform", function(d, i) {
                        var xDate = vis.x.invert(mouse[0]),
                            bisect = d3.bisector(function(d) { return d.date; }).right;
                        var idx = bisect(d.values, xDate);

                        var beginning = 0,
                            end = lines[i].getTotalLength(),
                            target = null;

                        while (true){
                            target = Math.floor((beginning + end) / 2);
                            var pos = lines[i].getPointAtLength(target);
                            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                break;
                            }
                            if (pos.x > mouse[0])      end = target;
                            else if (pos.x < mouse[0]) beginning = target;
                            else break; //position found
                        }

                        d3.select(this).select('text')
                            .text(vis.y.invert(pos.y).toFixed(0))
                            .attr("y", function (d) {
                                if (mouse[0] < 236) {
                                    if (d.name == "confirmed") {
                                        return mouse[0]/10 -30;
                                    } else if (d.name == "recovered") {
                                        return mouse[0]/25 -15;
                                    } else return 0;
                                }
                                else return 0;
                            })
                            .attr('fill', function (d) {
                                return vis.color(d.name);
                            });

                        return "translate(" + mouse[0] + "," + pos.y +")";
                    });


            });

    }


}
