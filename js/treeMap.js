class TreeMap {
    constructor(_config) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 600,
            confirmed: _config.confirmed,
            death: _config.death,
            recovered: _config.recovered,
            margin: {top: 10, right: 110, bottom: 10, left: 10},
        };
        this.initVis();
    }

    initVis() {
        let vis = this;
        let countries =['Asia', 'North America', 'Australia', 'Europe', 'Africa', 'South America', 'Other']

console.log('inside');

        vis.innerWidth =  vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.innerHeight = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg.append('g')
            .attr('transform', 'translate(' + vis.config.margin.left + ',' + vis.config.margin.top + ')');

        // lengend 
        vis.lengend = vis.svg.append('g');
        
        vis.lengend 
            .selectAll("legenddot")
            .data(countries)
            .enter()
            .append("rect")
                .attr("x", 700)
                .attr("y", function(d,i){ return 420 + i*(25)}) // 420 is where the first rect appears
                .attr("width", 20)
                .attr("height", 20)
                .attr('alignment-baseline', 'middle')
                .style('fill',function(d) {
                    if (d === 'Asia') {
                        return '#ff4d4d';
                    }
                    else if (d === 'Europe') {
                        return '#66cc66';
                    }
                    else if (d === 'North America') {
                        return '#ff7733';
                    }
                    else if (d === 'Australia') {
                        return '#cc9966';
                    }
                    else if (d === 'Africa') {
                        return '#3399ff';
                    }
                    else if (d === 'South America' ) {
                        return '#884dff';
                    }
                    else {
                        return '#8585ad';
                    }});

        // Add one dot in the legend for each name.
        vis.lengend.selectAll("legendlabel")
        .data(countries)
        .enter()
        .append("text")
            .attr("x", 725)
            .attr("y", function(d,i){ return 430 + i*(25)})
            .style("fill", 'black')
            .style('font-size', '12px')
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");
    
        vis.selectContinent = 'worldwise';
        vis.selectType = 'confirm';
        vis.selectDate = '2020-04-08';
        vis.updateDataset(vis.selectDate, vis.selectType);

    }

    updateDataset(selectDate, selectType) {
        let vis = this;
        console.log(selectDate);
        console.log(selectType);

        if (selectDate != undefined) {
            vis.selectDate = selectDate;
        }
        if (selectType != undefined) {
            vis.selectType = selectType;
        }
       
        // variable will use in data processing
        let dataset = {};
        let countryset = {};
        let continents_count = {};
        let clean_dataset =[];
        let clean_dataset_for_continents =[];

        if (vis.selectType === 'confirm') {
            vis.selectDataType = vis.config.confirmed;
        }
        else if (vis.selectType === 'death') {
            vis.selectDataType = vis.config.death;
        }
        else {
            vis.selectDataType = vis.config.recovered;
        }

        vis.selectDataType.forEach(d => {
            let country;
            let cases = +d[vis.selectDate];
            let continents =  d['Continents'];
         

            // processing the data
           country  = d['Country/Region'];
       
            if (dataset[country] == null) {
                    dataset[country] = cases;
                    countryset[country] = continents;      
            }
            else {
                    dataset[country] += cases;    
            }
            if (continents_count[continents] == null) {
                continents_count[continents] = cases;
            }
            else {
                continents_count[continents] += cases;
            }
        })

        //process dataset as countries
        for (var key in dataset) {
            var record = {};
            var value = dataset[key];
            record = {
                country: key,
                NumOfCase: value,
                continents: countryset[key]
            }
            clean_dataset.push(record);
        }

        //process dataset as continents
        for (var key in continents_count) {
            var record = {};
            var value = continents_count[key];
            record = {
                continents: key,
                NumOfCase: value,
            }
            clean_dataset_for_continents.push(record);
        }
   
        vis.country_data = clean_dataset;
        vis.continent_data = clean_dataset_for_continents;

        vis.updateVis(vis.selectContinent);
    }

    updateVis(selectContinent) {
        let vis = this;
        vis.selectContinent = selectContinent;

        function filterCriteria(d) {
                return d.continents === selectContinent;
         }
        if ( vis.selectContinent === 'worldwise') {
            vis.filteredData = vis.continent_data;
        }
        else {
            vis.filteredData = vis.country_data.filter(filterCriteria);
        }

        var nest = d3.nest()
            .key(function(d){return d.continents; })
            .key(function(d) { return d.country; })
            .key(function(d) { return d.NumOfCase; })
	    .entries(vis.filteredData);

        nest = {
            key: 'root',
            values: nest
        };

        vis.root = d3.hierarchy(nest, function(d) {
            return d.values;
        });

        let treemap = d3.treemap()
            .size([vis.innerWidth, vis.innerHeight])
            .padding(0.1);

        vis.root
            .sum(d => +d.NumOfCase)
            .sort(function(a, b) {return +b.value - +a.value;});
        
        treemap(vis.root);

        vis.render();
    }

    render() {
        let vis = this;

        vis.chart.selectAll('rect')
            .data(vis.root.leaves())
            .join('rect').transition()
            .attr('x', d=>d.x0 + 'px')
            .attr('y', d=>d.y0 + 'px')
            .attr('width', d=>d.x1 - d.x0 + 'px')
            .attr('height', d=>d.y1 - d.y0 + 'px')
            .style('stroke', 'black')
            .style("opacity", "0.7")
            .style('fill',function(d) {
                //TODO: maybe add color to represent the number of each country in the selected continent
                if (d.data.continents === 'Asia') {
                    return '#ff4d4d';
                }
                else if (d.data.continents === 'Europe') {
                    return '#66cc66';
                }
                else if (d.data.continents === 'North America') {
                    return '#ff7733';
                }
                else if (d.data.continents === 'Australia') {
                    return '#cc9966';
                }
                else if (d.data.continents === 'Africa') {
                    return '#3399ff';
                }
                else if (d.data.continents === 'South America') {
                    return '#884dff';
                }
                else {
                    return '#8585ad';
                }});
        
        // handle the tooltip
        vis.chart.selectAll('rect')
                .on('mouseover', d => {
                    d3.select('#tooltip')
                      .style("left", (d3.event.pageX + 10) + 'px')		
                      .style("top", (d3.event.pageY - 20) + 'px')
                      .style("display", "inline-block")
                      .html(d.data.country ? d.data.country + "<br>" + vis.selectType + " cases: " + d.data.NumOfCase :  d.data.continents + "<br>" + vis.selectType + " cases: " + d.data.NumOfCase)	
                })					
                .on('mouseout', d => {		
                   d3.select('#tooltip')
                     .style("display", "none")
                });

        // handle the display label
        vis.chart.selectAll('text')
        .data(vis.root.leaves())
        .join('text').transition()
            .attr('x', d=> d.x0+5)
            .attr('y', d=> d.y0+15)
            .text(vis.selectContinent === 'worldwise' ? d=>d.data.continents : function(d, i) {
              //  console.log(i, d.data.country);
              let width = d.x1 - d.x0;
                if (width >= 50) {
                    return d.data.country;
                }
            })
            .style('font-size', '10px')
            .style('fill','white');
        

        }
}