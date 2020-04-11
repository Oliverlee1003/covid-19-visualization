var timer;

////////////// Load data
Promise.all([
    d3.json('data/world_countries.json'),
    d3.csv('data/confirmed_apr8_for_treemap.csv'),
    d3.csv('data/covid-19-Linechart-Apr8.csv'),
    d3.csv('data/confirmed_apr8.csv'),
    d3.csv('data/death_apr8.csv'),
    d3.csv('data/recovered_apr8.csv'),
    d3.csv('data/stateToLatLon.csv'),
    d3.csv('data/recovered_apr8_for_treemap.csv'),
    d3.csv('data/death_apr8_for_treemap.csv'),
    d3.csv('data/Countries-Continents.csv')
]).then(files => {
    let countries = files[0];
    let confirmed_for_tree = files[1];
    let lineChart_data = files[2];
    let lastestConfirmed = files[3]; // Note that US has too many rows.
    let lastestdeaths  = files[4];   // Note that US has too many rows.
    let lastestrecovered = files[5];  // Note that US has too many rows.
    let stateToLatLon = files[6];
    let recovered_for_treemap = files[7];
    let death_for_treemap = files[8];
    let countryToContinent = files[9]
    console.log(lastestConfirmed);

    // use these data for the different component;

    let worldMap = new WorldMap ({
        parentElement: '#map',
        countries: countries,
        confirmed: lastestConfirmed,
        deaths: lastestdeaths,
        recovered:lastestrecovered,
        stateToLatLon: stateToLatLon,
        whichData: "confirm",
        countryToContinent: countryToContinent
    });


    let treeMap = new TreeMap({
        parentElement: '#tree',
        confirmed: confirmed_for_tree,
        recovered: recovered_for_treemap,
        death: death_for_treemap
    });

    let lineChart = new LineChart({
        parentElement: '#line',
        lineChartData: lineChart_data

    })

    // update on continent UI Widget
    $('#whichContinent').on('change', function() {
		continent = $(this).val();

		treeMap.updateVis(continent);
	});

    // update on type of cases (confirm, death, recovery)  UI Widget
    $('#types').on('change', function() {
        var types = $(this).val();
        // either confirm , death or recovery
        worldMap.updateVis(undefined,undefined,whichdata=types) // undefined will take default parameter
        treeMap.updateDataset(undefined, types)
    });


    //////////////////////////////////////// date slider

    var formatDatetIntoMMDD = d3.timeFormat("%d %b")
    var formatDate = d3.timeFormat("%Y-%m-%d");

    var startDate = new Date("2020-01-23"),
        endDate = new Date("2020-04-09"),
        mar19 = new Date("2020-03-19"),
        mar20 = new Date("2020-03-20")


    var sliderDom = d3.select("#slider-dom")
        .append("svg")
        .attr("width", 1070)
        .attr("height",70);


    var moving = false;
    var currentValue = 0;
    var targetValue = 960;

    var playButton = d3.select("#play-button");

    var x = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, targetValue])
        .clamp(true);

    var slider = sliderDom.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(41, 41)");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() {
                currentValue = d3.event.x;
                update(x.invert(currentValue));
            })
        );

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(14))
        .enter()
        .append("text")
        .attr("x", x)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatDatetIntoMMDD(d); });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    var label = slider.append("text")
        .attr("class", "sliderLabel")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + (-25) + ")")


    currentValue = x(endDate);
    update(endDate);
    // somehow the date shown is one day less
    // initiate date with mar 19

    playButton
        .on("click", function() {
            console.log("clicked")
            lineChart.update();
            var button = d3.select(this);
            if (button.text() == "Pause") {
                moving = false;
                clearInterval(timer);
                // timer = 0;
                button.text("Play");
            } else {
                moving = true;
                timer = setInterval(step, 20);
                button.text("Pause");
            }
            console.log("Slider moving: " + moving);
        })

    function step() {
        update(x.invert(currentValue));
        currentValue = currentValue + (targetValue/151);
        if (currentValue > targetValue) {
            moving = false;
            currentValue = 0;
            clearInterval(timer);
            // timer = 0;
            playButton.text("Play");
            console.log("Slider moving: " + moving);
        }
    }

    function update(h) {
        // update position and text of label according to slider scale
        console.log(formatDate(h))
        handle.attr("cx", x(h));
        label
            .attr("x", x(h))
            .text(formatDate(h));

        var yyyymmddDay = formatDate(h)
        worldMap.updateVis(yyyymmddDay)
        treeMap.updateDataset(yyyymmddDay, undefined);
    }


})

