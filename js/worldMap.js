class WorldMap {
    constructor(_config) {
        this.config = {
            parentElement: _config.parentElement,
            countries: _config.countries,
            confirmed: _config.confirmed,
            deaths: _config.deaths,
            recovered: _config.recovered,
            stateToLatLon: _config.stateToLatLon,
            whichData: _config.whichData,
            countryToContinent: _config.countryToContinent
        };
        console.log(this.config.whichData);
        this.date = "2020-04-08"
        this.projection = d3.geoRobinson().scale(190).center([0, 12]);

        let date = this.date;
        this.size = d3.scalePow()
            .exponent(1 / 3)
            .domain([0, 500000])
            .range([0, 45])


        this.whichCountry = null;
        this.width = 600;
        this.height = 350;


        let stateMappingLat = new Map();
        let stateMappingLon = new Map();
        this.config.stateToLatLon.forEach(function(d){
            stateMappingLat.set(d["Province/State"], d["Lat"]);
            stateMappingLon.set(d["Province/State"], d["Long"]);
        });

        let countryContinentMap = new Map();
        this.config.countryToContinent.forEach(function(d){
            countryContinentMap.set(d["Country"], d["Continent"]);
        });

        this.countryContinentMap = countryContinentMap;
        // process the data
        // since US has too many rows (too detailed) (the number is more than the twice of rest of the world)
        // group the places in the same province in US, then accumulate cases for all days.
        this.config.confirmed.forEach(function(d){
            if (countryContinentMap.get(d["Country/Region"]) === undefined){
                console.log(d)
            }
            d.continent = countryContinentMap.get(d["Country/Region"])
        });

        this.config.deaths.forEach(function(d){
            if (countryContinentMap.get(d["Country/Region"]) === undefined){
                console.log(d)
            }
            d.continent = countryContinentMap.get(d["Country/Region"])
        });

        var resultConfirmed = [];
        this.config.confirmed.reduce(function(res, value) {
            var pairKey = value["Province/State"] + value["Country/Region"]
            if (!res[pairKey]) {
                res[pairKey] = {
                    "all": "all",
                    "Province/State": value["Province/State"],
                    "continent": value["continent"],
                    "2020-01-22": 0,
                    "2020-01-23": 0,
                    "2020-01-24": 0,
                    "2020-01-25": 0,
                    "2020-01-26": 0,
                    "2020-01-27": 0,
                    "2020-01-28": 0,
                    "2020-01-29": 0,
                    "2020-01-30": 0,
                    "2020-01-31": 0,
                    "2020-02-01": 0,
                    "2020-02-02": 0,
                    "2020-02-03": 0,
                    "2020-02-04": 0,
                    "2020-02-05": 0,
                    "2020-02-06": 0,
                    "2020-02-07": 0,
                    "2020-02-08": 0,
                    "2020-02-09": 0,
                    "2020-02-10": 0,
                    "2020-02-11": 0,
                    "2020-02-12": 0,
                    "2020-02-13": 0,
                    "2020-02-14": 0,
                    "2020-02-15": 0,
                    "2020-02-16": 0,
                    "2020-02-17": 0,
                    "2020-02-18": 0,
                    "2020-02-19": 0,
                    "2020-02-20": 0,
                    "2020-02-21": 0,
                    "2020-02-22": 0,
                    "2020-02-23": 0,
                    "2020-02-24": 0,
                    "2020-02-25": 0,
                    "2020-02-26": 0,
                    "2020-02-27": 0,
                    "2020-02-28": 0,
                    "2020-02-29": 0,
                    "2020-03-01": 0,
                    "2020-03-02": 0,
                    "2020-03-03": 0,
                    "2020-03-04": 0,
                    "2020-03-05": 0,
                    "2020-03-06": 0,
                    "2020-03-07": 0,
                    "2020-03-08": 0,
                    "2020-03-09": 0,
                    "2020-03-10": 0,
                    "2020-03-11": 0,
                    "2020-03-12": 0,
                    "2020-03-13": 0,
                    "2020-03-14": 0,
                    "2020-03-15": 0,
                    "2020-03-16": 0,
                    "2020-03-17": 0,
                    "2020-03-18": 0,
                    "2020-03-19": 0,
                    "2020-03-20": 0,
                    "2020-03-21": 0,
                    "2020-03-22": 0,
                    "2020-03-23": 0,
                    "2020-03-24": 0,
                    "2020-03-25": 0,
                    "2020-03-26": 0,
                    "2020-03-27": 0,
                    "2020-03-28": 0,
                    "2020-03-29": 0,
                    "2020-03-30": 0,
                    "2020-03-31": 0,
                    "2020-04-01": 0,
                    "2020-04-02": 0,
                    "2020-04-03": 0,
                    "2020-04-04": 0,
                    "2020-04-05": 0,
                    "2020-04-06": 0,
                    "2020-04-07": 0,
                    "2020-04-08": 0,
                };
                resultConfirmed.push(res[pairKey])
            }

            var lat, long;
            if (value["Country/Region"] ==="US" && stateMappingLat.get(value["Province/State"])!== undefined){
                lat = stateMappingLat.get(value["Province/State"]);
                long = stateMappingLon.get(value["Province/State"]);
            } else{
                lat = value["Lat"]
                long = value["Long"]
            }

            res[pairKey]["Country/Region"] = value["Country/Region"]
            res[pairKey]["Lat"] = lat;
            res[pairKey]["Long"] = long;
            res[pairKey]["all"] = "all"
            res[pairKey]["continent"] = value["continent"],


            res[pairKey]["2020-01-22"] += +value["2020-01-22"];
            res[pairKey]["2020-01-23"] += +value["2020-01-23"];
            res[pairKey]["2020-01-24"] += +value["2020-01-24"];
            res[pairKey]["2020-01-25"] += +value["2020-01-25"];
            res[pairKey]["2020-01-26"] += +value["2020-01-26"];
            res[pairKey]["2020-01-27"] += +value["2020-01-27"];
            res[pairKey]["2020-01-28"] += +value["2020-01-28"];
            res[pairKey]["2020-01-29"] += +value["2020-01-29"];
            res[pairKey]["2020-01-30"] += +value["2020-01-30"];
            res[pairKey]["2020-01-31"] += +value["2020-01-31"];

            res[pairKey]["2020-02-01"] += +value["2020-02-01"];
            res[pairKey]["2020-02-02"] += +value["2020-02-02"];
            res[pairKey]["2020-02-03"] += +value["2020-02-03"];
            res[pairKey]["2020-02-04"] += +value["2020-02-04"];
            res[pairKey]["2020-02-05"] += +value["2020-02-05"];
            res[pairKey]["2020-02-06"] += +value["2020-02-06"];
            res[pairKey]["2020-02-07"] += +value["2020-02-07"];
            res[pairKey]["2020-02-08"] += +value["2020-02-08"];
            res[pairKey]["2020-02-09"] += +value["2020-02-09"];

            res[pairKey]["2020-02-10"] += +value["2020-02-10"];
            res[pairKey]["2020-02-11"] += +value["2020-02-11"];
            res[pairKey]["2020-02-12"] += +value["2020-02-12"];
            res[pairKey]["2020-02-13"] += +value["2020-02-13"];
            res[pairKey]["2020-02-14"] += +value["2020-02-14"];
            res[pairKey]["2020-02-15"] += +value["2020-02-15"];
            res[pairKey]["2020-02-16"] += +value["2020-02-16"];
            res[pairKey]["2020-02-17"] += +value["2020-02-17"];
            res[pairKey]["2020-02-18"] += +value["2020-02-18"];
            res[pairKey]["2020-02-19"] += +value["2020-02-19"];

            res[pairKey]["2020-02-20"] += +value["2020-02-20"];
            res[pairKey]["2020-02-21"] += +value["2020-02-21"];
            res[pairKey]["2020-02-22"] += +value["2020-02-22"];
            res[pairKey]["2020-02-23"] += +value["2020-02-23"];
            res[pairKey]["2020-02-24"] += +value["2020-02-24"];
            res[pairKey]["2020-02-25"] += +value["2020-02-25"];
            res[pairKey]["2020-02-26"] += +value["2020-02-26"];
            res[pairKey]["2020-02-27"] += +value["2020-02-27"];
            res[pairKey]["2020-02-28"] += +value["2020-02-28"];
            res[pairKey]["2020-02-29"] += +value["2020-02-29"];

            res[pairKey]["2020-03-01"] += +value["2020-03-01"];
            res[pairKey]["2020-03-02"] += +value["2020-03-02"];
            res[pairKey]["2020-03-03"] += +value["2020-03-03"];
            res[pairKey]["2020-03-04"] += +value["2020-03-04"];
            res[pairKey]["2020-03-05"] += +value["2020-03-05"];
            res[pairKey]["2020-03-06"] += +value["2020-03-06"];
            res[pairKey]["2020-03-07"] += +value["2020-03-07"];
            res[pairKey]["2020-03-08"] += +value["2020-03-08"];
            res[pairKey]["2020-03-09"] += +value["2020-03-09"];

            res[pairKey]["2020-03-10"] += +value["2020-03-10"];
            res[pairKey]["2020-03-11"] += +value["2020-03-11"];
            res[pairKey]["2020-03-12"] += +value["2020-03-12"];
            res[pairKey]["2020-03-13"] += +value["2020-03-13"];
            res[pairKey]["2020-03-14"] += +value["2020-03-14"];
            res[pairKey]["2020-03-15"] += +value["2020-03-15"];
            res[pairKey]["2020-03-16"] += +value["2020-03-16"];
            res[pairKey]["2020-03-17"] += +value["2020-03-17"];
            res[pairKey]["2020-03-18"] += +value["2020-03-18"];
            res[pairKey]["2020-03-19"] += +value["2020-03-19"];

            res[pairKey]["2020-03-20"] += +value["2020-03-20"];
            res[pairKey]["2020-03-21"] += +value["2020-03-21"];
            res[pairKey]["2020-03-22"] += +value["2020-03-22"];
            res[pairKey]["2020-03-23"] += +value["2020-03-23"];
            res[pairKey]["2020-03-24"] += +value["2020-03-24"];
            res[pairKey]["2020-03-25"] += +value["2020-03-25"];
            res[pairKey]["2020-03-26"] += +value["2020-03-26"];
            res[pairKey]["2020-03-27"] += +value["2020-03-27"];
            res[pairKey]["2020-03-28"] += +value["2020-03-28"];
            res[pairKey]["2020-03-29"] += +value["2020-03-29"];
            res[pairKey]["2020-03-30"] += +value["2020-03-30"];
            res[pairKey]["2020-03-31"] += +value["2020-03-31"];

            res[pairKey]["2020-04-01"] += +value["2020-04-01"];
            res[pairKey]["2020-04-02"] += +value["2020-04-02"];
            res[pairKey]["2020-04-03"] += +value["2020-04-03"];
            res[pairKey]["2020-04-04"] += +value["2020-04-04"];
            res[pairKey]["2020-04-05"] += +value["2020-04-05"];
            res[pairKey]["2020-04-06"] += +value["2020-04-06"];
            res[pairKey]["2020-04-07"] += +value["2020-04-07"];
            res[pairKey]["2020-04-08"] += +value["2020-04-08"];

            return res;
        }, {});
        this.resultConfirmed = resultConfirmed;
        var resultDeath = [];
        this.config.deaths.reduce(function(res, value) {
            var pairKey = value["Province/State"] + value["Country/Region"]
            if (!res[pairKey]) {
                res[pairKey] = {
                    "Province/State": value["Province/State"],
                    "all" : "all",
                    "continent": value["continent"],
                    "2020-01-22": 0,
                    "2020-01-23": 0,
                    "2020-01-24": 0,
                    "2020-01-25": 0,
                    "2020-01-26": 0,
                    "2020-01-27": 0,
                    "2020-01-28": 0,
                    "2020-01-29": 0,
                    "2020-01-30": 0,
                    "2020-01-31": 0,
                    "2020-02-01": 0,
                    "2020-02-02": 0,
                    "2020-02-03": 0,
                    "2020-02-04": 0,
                    "2020-02-05": 0,
                    "2020-02-06": 0,
                    "2020-02-07": 0,
                    "2020-02-08": 0,
                    "2020-02-09": 0,
                    "2020-02-10": 0,
                    "2020-02-11": 0,
                    "2020-02-12": 0,
                    "2020-02-13": 0,
                    "2020-02-14": 0,
                    "2020-02-15": 0,
                    "2020-02-16": 0,
                    "2020-02-17": 0,
                    "2020-02-18": 0,
                    "2020-02-19": 0,
                    "2020-02-20": 0,
                    "2020-02-21": 0,
                    "2020-02-22": 0,
                    "2020-02-23": 0,
                    "2020-02-24": 0,
                    "2020-02-25": 0,
                    "2020-02-26": 0,
                    "2020-02-27": 0,
                    "2020-02-28": 0,
                    "2020-02-29": 0,
                    "2020-03-01": 0,
                    "2020-03-02": 0,
                    "2020-03-03": 0,
                    "2020-03-04": 0,
                    "2020-03-05": 0,
                    "2020-03-06": 0,
                    "2020-03-07": 0,
                    "2020-03-08": 0,
                    "2020-03-09": 0,
                    "2020-03-10": 0,
                    "2020-03-11": 0,
                    "2020-03-12": 0,
                    "2020-03-13": 0,
                    "2020-03-14": 0,
                    "2020-03-15": 0,
                    "2020-03-16": 0,
                    "2020-03-17": 0,
                    "2020-03-18": 0,
                    "2020-03-19": 0,
                    "2020-03-20": 0,
                    "2020-03-21": 0,
                    "2020-03-22": 0,
                    "2020-03-23": 0,
                    "2020-03-24": 0,
                    "2020-03-25": 0,
                    "2020-03-26": 0,
                    "2020-03-27": 0,
                    "2020-03-28": 0,
                    "2020-03-29": 0,
                    "2020-03-30": 0,
                    "2020-03-31": 0,
                    "2020-04-01": 0,
                    "2020-04-02": 0,
                    "2020-04-03": 0,
                    "2020-04-04": 0,
                    "2020-04-05": 0,
                    "2020-04-06": 0,
                    "2020-04-07": 0,
                    "2020-04-08": 0,
                };
                resultDeath.push(res[pairKey])
            }

            var lat, long;
            if (value["Country/Region"] ==="US" && stateMappingLat.get(value["Province/State"])!== undefined){
                lat = stateMappingLat.get(value["Province/State"]);
                long = stateMappingLon.get(value["Province/State"]);
            } else{
                lat = value["Lat"]
                long = value["Long"]
            }

            res[pairKey]["Country/Region"] = value["Country/Region"]
            res[pairKey]["Lat"] = lat;
            res[pairKey]["Long"] = long;
            res[pairKey]["all"] = "all"
            res[pairKey]["continent"] = value["continent"];
            res[pairKey]["2020-01-22"] += +value["2020-01-22"];
            res[pairKey]["2020-01-23"] += +value["2020-01-23"];
            res[pairKey]["2020-01-24"] += +value["2020-01-24"];
            res[pairKey]["2020-01-25"] += +value["2020-01-25"];
            res[pairKey]["2020-01-26"] += +value["2020-01-26"];
            res[pairKey]["2020-01-27"] += +value["2020-01-27"];
            res[pairKey]["2020-01-28"] += +value["2020-01-28"];
            res[pairKey]["2020-01-29"] += +value["2020-01-29"];
            res[pairKey]["2020-01-30"] += +value["2020-01-30"];
            res[pairKey]["2020-01-31"] += +value["2020-01-31"];

            res[pairKey]["2020-02-01"] += +value["2020-02-01"];
            res[pairKey]["2020-02-02"] += +value["2020-02-02"];
            res[pairKey]["2020-02-03"] += +value["2020-02-03"];
            res[pairKey]["2020-02-04"] += +value["2020-02-04"];
            res[pairKey]["2020-02-05"] += +value["2020-02-05"];
            res[pairKey]["2020-02-06"] += +value["2020-02-06"];
            res[pairKey]["2020-02-07"] += +value["2020-02-07"];
            res[pairKey]["2020-02-08"] += +value["2020-02-08"];
            res[pairKey]["2020-02-09"] += +value["2020-02-09"];

            res[pairKey]["2020-02-10"] += +value["2020-02-10"];
            res[pairKey]["2020-02-11"] += +value["2020-02-11"];
            res[pairKey]["2020-02-12"] += +value["2020-02-12"];
            res[pairKey]["2020-02-13"] += +value["2020-02-13"];
            res[pairKey]["2020-02-14"] += +value["2020-02-14"];
            res[pairKey]["2020-02-15"] += +value["2020-02-15"];
            res[pairKey]["2020-02-16"] += +value["2020-02-16"];
            res[pairKey]["2020-02-17"] += +value["2020-02-17"];
            res[pairKey]["2020-02-18"] += +value["2020-02-18"];
            res[pairKey]["2020-02-19"] += +value["2020-02-19"];

            res[pairKey]["2020-02-20"] += +value["2020-02-20"];
            res[pairKey]["2020-02-21"] += +value["2020-02-21"];
            res[pairKey]["2020-02-22"] += +value["2020-02-22"];
            res[pairKey]["2020-02-23"] += +value["2020-02-23"];
            res[pairKey]["2020-02-24"] += +value["2020-02-24"];
            res[pairKey]["2020-02-25"] += +value["2020-02-25"];
            res[pairKey]["2020-02-26"] += +value["2020-02-26"];
            res[pairKey]["2020-02-27"] += +value["2020-02-27"];
            res[pairKey]["2020-02-28"] += +value["2020-02-28"];
            res[pairKey]["2020-02-29"] += +value["2020-02-29"];

            res[pairKey]["2020-03-01"] += +value["2020-03-01"];
            res[pairKey]["2020-03-02"] += +value["2020-03-02"];
            res[pairKey]["2020-03-03"] += +value["2020-03-03"];
            res[pairKey]["2020-03-04"] += +value["2020-03-04"];
            res[pairKey]["2020-03-05"] += +value["2020-03-05"];
            res[pairKey]["2020-03-06"] += +value["2020-03-06"];
            res[pairKey]["2020-03-07"] += +value["2020-03-07"];
            res[pairKey]["2020-03-08"] += +value["2020-03-08"];
            res[pairKey]["2020-03-09"] += +value["2020-03-09"];

            res[pairKey]["2020-03-10"] += +value["2020-03-10"];
            res[pairKey]["2020-03-11"] += +value["2020-03-11"];
            res[pairKey]["2020-03-12"] += +value["2020-03-12"];
            res[pairKey]["2020-03-13"] += +value["2020-03-13"];
            res[pairKey]["2020-03-14"] += +value["2020-03-14"];
            res[pairKey]["2020-03-15"] += +value["2020-03-15"];
            res[pairKey]["2020-03-16"] += +value["2020-03-16"];
            res[pairKey]["2020-03-17"] += +value["2020-03-17"];
            res[pairKey]["2020-03-18"] += +value["2020-03-18"];
            res[pairKey]["2020-03-19"] += +value["2020-03-19"];

            res[pairKey]["2020-03-20"] += +value["2020-03-20"];
            res[pairKey]["2020-03-21"] += +value["2020-03-21"];
            res[pairKey]["2020-03-22"] += +value["2020-03-22"];
            res[pairKey]["2020-03-23"] += +value["2020-03-23"];
            res[pairKey]["2020-03-24"] += +value["2020-03-24"];
            res[pairKey]["2020-03-25"] += +value["2020-03-25"];
            res[pairKey]["2020-03-26"] += +value["2020-03-26"];
            res[pairKey]["2020-03-27"] += +value["2020-03-27"];
            res[pairKey]["2020-03-28"] += +value["2020-03-28"];
            res[pairKey]["2020-03-29"] += +value["2020-03-29"];
            res[pairKey]["2020-03-30"] += +value["2020-03-30"];
            res[pairKey]["2020-03-31"] += +value["2020-03-31"];

            res[pairKey]["2020-04-01"] += +value["2020-04-01"];
            res[pairKey]["2020-04-02"] += +value["2020-04-02"];
            res[pairKey]["2020-04-03"] += +value["2020-04-03"];
            res[pairKey]["2020-04-04"] += +value["2020-04-04"];
            res[pairKey]["2020-04-05"] += +value["2020-04-05"];
            res[pairKey]["2020-04-06"] += +value["2020-04-06"];
            res[pairKey]["2020-04-07"] += +value["2020-04-07"];
            res[pairKey]["2020-04-08"] += +value["2020-04-08"];

            return res;
        }, {});
        this.resultDeath = resultDeath;

        this.config.recovered.forEach(function(d){
            d.all = "all"
            d.continent = countryContinentMap.get(d["Country/Region"])
        })
        this.resultrecovered = this.config.recovered;
        this.whichData = this.config.whichData;
        this.initVis();
    }


    initVis() {
        let vis = this;
        var width = vis.width;
        var height = vis.height;
        const yCircleHeight = 700;
        let geoCountrydata = vis.config.countries;
        let data = vis.resultConfirmed // as default

        var path = d3.geoPath()
            .projection(vis.projection);

        var svg = d3.select(vis.config.parentElement)
            .append("g")
            .attr('id', 'container')
            .attr('transform','scale(0.55)')
        // 0.55 so that world map roughly takes half space of the width

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", zoomed);

        const zoomBig = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", zoomedBig);

        d3.select("#whichContinent").on("change", centered)
        function centered(d) {
            const continent = this.value;
            resetBig();

            if (continent === "worldwise"){
            }
            else {
                var bound;
                if (continent ==="Asia"){
                    // these numbers are the bound of paths for each continent. Used to zoom in and zoom out
                    bound = [[705.7303988132531, 95.61334316688502], [875.2109269337342, 226.73328746274944]]
                } else if (continent ==="Australia"){
                    bound = [[840.7576819458014, 335.09835621352624], [972.8973062508546, 458.6575741166997]]
                } else if (continent ==="Europe"){
                    bound = [[527.6066489996639, 113.08829628979439], [546.291791644122, 123.58980387431353]]
                } else if (continent ==="Africa"){
                    bound = [[527.8717638946717, 253.21952430514295], [570.6393364343256, 286.536132096246]]
                } else if (continent ==="South America"){
                    bound = [[235.33363334589063, 275.36079140948743], [365.13912190275653, 421.81850079928387]]
                } else {
                    bound = [[-38.56214038577252, 35.468605548498886], [281.0828869830573, 224.03601680961913]]
                }
                const [[x0, y0], [x1, y1]] = bound;

                // zoom the map into that continent
                d3.event.stopPropagation();
                svg.transition().duration(0).call(
                    zoomBig.transform,
                    d3.zoomIdentity
                        .translate(width / 2, height / 2)
                        .scale(1.5)
                        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                    d3.mouse(svg.node())
                );

            }
        }

        // add map
        svg.append('g')
            .attr('class', 'geo-path')
            .selectAll('path')
            .data(geoCountrydata.features)
            .enter().append('path')
            .attr('d', path)
            .on("click", clicked)        // click to highlight the clicked country/region.
                                // need to modify to show the small map side by side.
            .style('fill', 'rgb(181, 181, 181)')
            .style('stroke', 'white')
            .style('opacity', 0.8)
            .style('stroke-width', 0.3);

        svg.call(zoomBig);

        // reset the country map to origin settings
        function reset() {
            svg2.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
            );
            // set transparency to 0 so that it looks like disappeared
            svg2.selectAll('path')
                .attr("fill-opacity", 0)
        }

        // reset the world map to origin settings
        function resetBig() {
            svg.transition().duration(750).call(
                zoomBig.transform,
                d3.zoomIdentity.scale(0.55),
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
            );
        }

        // zoomedBig is the zoom for world map. While zoomed is for country map
        function zoomed() {
            const {transform} = d3.event;
            svg2.attr("transform", transform);
            svg2.attr("stroke-width", 1 / transform.k);
        }

        function zoomedBig() {
            const {transform} = d3.event;
            svg.attr("transform", transform);
            svg.attr("stroke-width", 1 / transform.k);
        }

        // svg2 is for country Map
        var svg2 = d3.select("#countryMap")
            .append("g")
            .attr('id', 'container')
            .attr('transform','scale(0.7)')
        // 0.7 so that world map roughly takes half space of the width

        // country map - it is actually a world map too, it just keep zooming in and out and keep being transparent
        svg2.append('g')
            .attr('class', 'countries')
            .selectAll('path')
            .data(geoCountrydata.features)
            .enter().append('path')
            .attr('d', path)
            .style('fill', 'rgb(181, 181, 181)')
            .style('stroke', 'white')
            .style('opacity', 1)
            .style('stroke-width', 0.3)
            .attr("fill-opacity", 0)

        // when click on a region in world map, the country map update. that's why we use svg2 here
        function clicked(d) {
            console.log(d)
            reset();
            const [[x0, y0], [x1, y1]] = path.bounds(d);
            d3.event.stopPropagation();
            svg2.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(Math.min(8, 0.95 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                d3.mouse(svg.node())
            );
            svg2.selectAll('path')
                .filter(function(d2) {
                    return d2 === d;
                })
                .attr("fill-opacity", 1)

            vis.whichCountry = d.properties.name // to update circles fill
            vis.updateVis(vis.date, d.properties.name)
        }

        var valueExtent = d3.extent(data, function (d) {return +d[vis.date];})
        // find the domain of size

        var size = d3.scalePow()
            .exponent(1 / 3)
            .domain([0, 500000])
            .range([0, 45])
            // d3.scalePow()
            // .exponent(1/3)
            // .domain(valueExtent)
            // .range([ 3, 40])
        // the size in pixel

        // values on legend
        var valuesToShow = [1, 1000, 50000, 500000 ]
        var xCircle = 80
        var xLabel = xCircle + 100;
        var yCircle = yCircleHeight * 0.75;

        /////////////////////////////  legend
        svg
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("circle")
            .attr("cx", xCircle)
            .attr("cy", function (d) {
                return yCircle - size(d)
            })
            .attr("r", function (d) {
                return size(d)
            })
            .style("fill", "none")
            .attr("stroke", "black")

        svg
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("line")
            .attr('x1', function (d) {
                return xCircle + size(d)
            })
            .attr('x2', xLabel)
            .attr('y1', function (d) {
                return yCircle - size(d)
            })
            .attr('y2', function (d) {
                return yCircle - size(d)
            })
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'))

        svg
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("text")
            .attr('x', xLabel)
            .attr('y', function (d) {
                return yCircle - size(d)
            })
            .text(function (d) {
                return (d === 1) ? d + ' case' : d + ' cases'
            })
            .style("font-size", 12)
            .attr('alignment-baseline', 'middle')

        // below are for the effect. From https://bl.ocks.org/tlfrd/af94702a0b13ff7d0a491d5cbc1338f2
        var defs = svg.append("defs");
        var filter = defs.append("filter").attr("id", "gooeyCodeFilter");
        filter.append("feGaussianBlur")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", "10")
            .attr("color-interpolation-filters", "sRGB")
            .attr("result", "blur");
        filter.append("feColorMatrix")
            .attr("class", "blurValues")
            .attr("in", "blur")
            .attr("mode", "matrix")
            .attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -6")
            .attr("result", "gooey");
        filter.append("feBlend")
            .attr("in", "SourceGraphic")
            .attr("in2", "gooey")
            .attr("operator", "atop");

        // default one. Using the lastest one
        vis.updateVis("2020-04-08")
    }

    updateVis(selectedDate = this.date, countryName = null, whichData = this.whichData) {
        let vis = this;
        let data;
        var projection = vis.projection;

        var width = vis.width;
        var height = vis.height;

        if (countryName == null) {
            countryName = vis.whichCountry;
        }

        // dynamically decide color, data
        let circleColor;
        let strokeColor;

        vis.date = selectedDate;
        vis.whichData = whichData;

        if (whichData ==="death"){
            data = this.resultDeath;
            circleColor = "rgb(11, 40, 160)"
            strokeColor = "#030617"
        } else if (whichData ==="recovery"){
            data = this.resultrecovered;
            circleColor = "rgb(105, 183, 52)";
            strokeColor = "#019c07"
        } else {
            data = this.resultConfirmed;
            circleColor = "#C32E1E";
            strokeColor = "#6c0013"
        }

        console.log(data)
        console.log(vis.date)
        var processedCases = getDataWithTopCountryNames(data, vis.date);

        console.log(processedCases)
        this.valueExtent = d3.extent(processedCases, function (d) {
            return +d["population"];
        })

        var rScale = d3.scalePow()
            .exponent(1 / 3)
            .domain([0, 500000])
            .range([0, 45])

        var size = rScale;
        // map the cases for conviences
        processedCases.forEach(function (d, i) {
            if (d.longitude === undefined){
                console.log(d["Province/State"])
            }
            d.radius = rScale(d.population);
            d.x = projection([d.longitude, d.latitude])[0];
            d.y = projection([d.longitude, d.latitude])[1];
        });


/////////////////////////// Country Labels

//Calculate the centers for each country
        console.log(processedCases)
        var centers = getCenters("country", [width * 2, height * 2]);
        centers.forEach(function (d) {
            d.y = d.y - 100 + 40;
            d.x = d.x;
        });

//Wrapper for the country labels
        var worldmap = d3.select("#map")
        var svg = worldmap.select("#container")

        var labelsContinent = svg.selectAll(".labelContinent").data(centersContinent)

        // Add labels for each province with cases value
        // using update pattern
        var centersContinent = getCenters("continent", [width * 2, height * 2]);

        d3.select(".labelWrapperContinent").remove();
        var labelWrapperContinent = svg.append("g")
            .attr("class", "labelWrapperContinent");

        let labelTextContinent = labelWrapperContinent.selectAll('.labelContinent')
            .data(centersContinent);

        let labelTextEnterContinent = labelTextContinent.enter().append('text')
            .attr('class', 'labelContinent')
            .style("opacity", 0)
            .attr("transform", function (d) {
                return "translate(" + (d.x - 15) + ", " + (d.y - 110) + ")";
            })

        labelTextContinent.merge(labelTextEnterContinent)
            .transition()
            .text(d => {
                console.log(d)
                return d.name
            });


        var labels = svg.selectAll(".label").data(centers)

        // Add labels for each province with cases value
        // using update pattern
        d3.select(".labelWrapper").remove();
        var labelWrapper = svg.append("g")
            .attr("class", "labelWrapper");

        let labelText = labelWrapper.selectAll('.label')
            .data(centers);

        let labelTextEnter = labelText.enter().append('text')
            .attr('class', 'label')
            .style("opacity", 0)
            .attr("transform", function (d) {
                return "translate(" + (d.x - 15) + ", " + (d.y - 40) + ")";
            })

        labelText.merge(labelTextEnter)
            .transition()
            .text(d => {
                return d.name
            });


/////////////////////////// Set-up the force //////////////////////////////
        // the reason I use d3v3 here is that d3 v4 v5 does not have function d3.layout.pack().nodes()
        // v4 v5 also does not have force.start force.end
        var force = d3v3.layout.force()
            .gravity(.5)
            .charge(0)
            .on("tick", tick(centers, "country"));

        // force to center all circles
        var centersAll = getCenters("all", [width * 2, height * 2]);
        centersAll.forEach(function (d) {
            d.y = d.y - 100 + 40;
            d.x = d.x;
        });
        var forceAll = d3v3.layout.force()
            .gravity(.5)
            .charge(0)
            .on("tick", tick(centersAll, "all"));

        // force to group circles based on continent
        centersContinent.forEach(function (d) {
            d.y = d.y - 100 + 40;
            d.x = d.x;
        });

        console.log(centersContinent)
        var forceContinent = d3v3.layout.force()
            .gravity(.5)
            .charge(0)
            .on("tick", tick(centersContinent, "continent"));


        var padding = 0;
        var maxRadius = d3v3.max(processedCases, function (d) {
            return d.radius;
        });

        d3.select("#animation")
            .on("click", loop)

        function loop() {
            // disable play button temporarily to avoid conflicts
            document.getElementById("play-button").disabled = true;
            document.getElementById("animation").disabled = true;
            // clusterCountry()
            backToCenter();
            setTimeout(clusterContinent, 4000);
            setTimeout(clusterCountry, 8000);
            setTimeout(placeCircles, 12000);
            setTimeout(enablePlay, 14000);

            function enablePlay() {
                document.getElementById("play-button").disabled = false;
                document.getElementById("animation").disabled = false;
            }
        }

        //Wrapper for the circles
        var cityWrapper = svg.append("g")
            .attr("class", "cityWrapper")
            .style("filter", "url(#gooeyCodeFilter)");


        var coverCirleRadius = 100;
//Circle over all others
        cityWrapper.append("circle")
            .attr("class", "cityCover")
            .attr("r", 0)
            .attr("cx", projection([0, 0])[0])
            .attr("cy", projection([0, 0])[1])
            .style("fill", circleColor)
            .style("opacity", 0);

        ////////////////////////////////   bubble on the map
        // update pattern
        //

        svg.selectAll(".circles").remove();
        var sortedData = data.sort(function (a, b) {
            return +b[vis.date] - +a[vis.date]
        });
        var circles = svg.selectAll(".circles").data(processedCases)
        d3.selectAll(".tooltip2").remove()
        var div = d3.select("body").append("div")
            .attr("class", "tooltip2")
            .style("opacity", 0);

        function showDetails(d) {
            console.log(d)
            var location = d['Country/Region'];
            if (d['Province/State']) {
                location += ', ' + d['Province/State']
            }
            div.transition()
                .duration(200)
                .style("opacity", .7);

            var dateHere = vis.date;
            div.html(
                "location: " + location
                + "<br/>" +
                whichData + " case: " + d[dateHere]
            )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        }

        var circleEnter = circles
            .enter()
            .append("g")
            .attr("class", "circles");

        circleEnter.append("circle")
            .attr("class", "circles")
            .attr("cx", function (d) {
                return vis.projection([+d.Long, +d.Lat])[0]
            })
            .attr("cy", function (d) {
                return vis.projection([+d.Long, +d.Lat])[1]
            })
            .attr("r", function (d) {
                return vis.size(+d[vis.date])
            })
            .style("fill", circleColor)
            .attr("fill-opacity", 0.65)
            .style("stroke", strokeColor)
            .on("mouseover", function (d) {
                showDetails(d);
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        circles.select("circle")
            .transition()
            .duration(250)
            .attr("r", function (d) {
                return size(+d[vis.date])
            })
            .style("fill", function (d) {
                return circleColor
            })
            .style("stroke", strokeColor)

        circles.exit().remove();

        ///////////////////////// bubble Circles on country Map
        var countryMap = d3.select("#countryMap")
        var svg2 = countryMap.select("#container")
        svg2.selectAll(".circles").remove();
        var circles2 = svg2.selectAll(".circles").data(sortedData)
        var circleEnter2 = circles2
            .enter()
            .append("g")
            .attr("class", "circles");

        let cr = "Country/Region"

        // the dataset in coronavirus does not perfectly match with country name in geo json
        // todo: keep updating this one
        var countryHash = {
            'USA': "US"
        }

        circleEnter2.append("circle")
            .attr("class", "circle")
            .attr("cx", function (d) {
                return vis.projection([+d.Long, +d.Lat])[0]
            })
            .attr("cy", function (d) {
                return vis.projection([+d.Long, +d.Lat])[1]
            })
            .attr("r", function (d) {
                return vis.size(+d[vis.date])
            })
            .style("fill", circleColor)
            .style("stroke", strokeColor)
            .attr("fill-opacity", function (d) {
                if (d[cr] === "US") {
                }
                if (d[cr] === countryName || d[cr] === countryHash[countryName]) {
                    return 0.65;
                } else {
                    return 0
                }
            })
            .attr("opacity", function (d) {
                if (d[cr] === countryName || d[cr] === countryHash[countryName]) {
                    return 0.65;
                } else {
                    return 0
                }
            })
            .on("mouseover", function (d) {
                showDetails(d);
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        circles2.select("circle")
            .transition()
            .duration(250)
            .attr("r", function (d) {
                return size(+d[vis.date])
            })
            .style("fill", function (d) {
                return circleColor
            })
            .style("stroke", strokeColor)

        circles2.exit().remove();


        // this function will make make group country by its cases.
        // if the case is small, the country is 'others'
        function getDataWithTopCountryNames(data, date) {
            var countries = {}
            var newArraySeries = [];
            data.forEach(
                function (e) {
                    if (!countries[e["Country/Region"]]) {
                        countries[e["Country/Region"]] = 0
                    }
                    countries[e["Country/Region"]] += +e[date]
                }
            )
            for (var country in countries) {
                newArraySeries.push({country: country, data: countries[country]})
            }

            const sorted = newArraySeries.sort(function (a, b) {
                return b["data"] - a["data"];
            });


            const limitOf12 = newArraySeries[12]["data"];
            console.log(limitOf12)
            var result = []
            data.forEach(function (d, i) {
                var country;
                if (countries[d["Country/Region"]] < limitOf12) {
                    country = "others"
                } else {
                    country = d["Country/Region"]
                }
                let oneRow = d;
                oneRow["city"] = d["Province/State"];
                oneRow["country"] = country;
                oneRow["population"] = d[date];
                oneRow["latitude"] = d.Lat;
                oneRow["longitude"] = d.Long;

                result.push(oneRow)

            })

            return result
        }

/////////////////////////// Innovative views  ///////////////////////////////


    //Move the each location from the center to their actual circles
        function placeCircles() {

            //Stop the force layout
            force.stop();

            // shrink Circles
            d3v3.selectAll(".cityCover")
                .transition().duration(5000)
                .attr("r", 0);

            // Put the circles in their geo location
            d3v3.selectAll(".circles")
                .transition("move").duration(2000)
                .delay(function (d, i) {
                    return i * 2;
                })
                .attr("r", function (d) {
                    return d.radius = rScale(d.population);
                })
                .attr("cx", function (d) {
                    return d.x = projection([d.longitude, d.latitude])[0];
                })
                .attr("cy", function (d) {
                    return d.y = projection([d.longitude, d.latitude])[1];
                })

            d3v3.selectAll(".circles")
                .transition("dim").duration(1000).delay(2000)
                .style("opacity", 0.8);

            //hide the labels
            d3.selectAll(".label")
                .transition().duration(1500)
                .style("opacity", 0);

            d3.selectAll(".labelContinent")
                .transition().duration(500)
                .style("opacity", 0);

            //Show map
            d3.selectAll(".geo-path")
                .transition().duration(200)
                .style("fill-opacity", 0.8);

        }

        function clusterContinent() {
            forceAll.stop();
            ///Start force again
            forceContinent.start();

            //Show the labels
            d3.selectAll(".labelContinent")
                .transition().duration(200)
                .style("opacity", 1);

            d3v3.selectAll(".cityCover")
                .transition().duration(1000)
                .attr("r", 0);
        }

        ////////////////////////////// Cluster all the circles based on the country
        function clusterCountry() {
            forceContinent.stop();

            ///Start force again
            force.start();

            d3.selectAll(".labelContinent")
                .transition().duration(200)
                .style("opacity", 0);

            //Show the labels
            d3.selectAll(".label")
                .transition().duration(200)
                .style("opacity", 1);

            d3v3.selectAll(".cityCover")
                .transition().duration(1000)
                .attr("r", 0);
        }

        ////////////////////////////// //Move the circles back to the center
        function backToCenter() {
            // Show map
            d3.selectAll(".geo-path")
                .style("fill-opacity", 0.5);

            d3.selectAll(".circles")
                .style("opacity", 1)

            // Hide labels
            d3.selectAll(".label")
                .transition().duration(500)
                .style("opacity", 0);


            //Make the cover cirlce to its true size again
            // d3.selectAll(".cityCover")
            //     .transition().duration(800).delay(0)
            //     .attr("r", coverCirleRadius)
            //     .style("opacity", 1);

            // forceContinent.start()
            forceAll.start()

            // //Move the circles to the 0,0 coordinate
            // d3.selectAll(".circles")
            //     .transition()
            //     .duration(200).delay(function (d, i) {
            //     return i * 2;
            // })
            //     .attr("cx", projection([0, 0])[0])
            //     .attr("cy", projection([0, 0])[1])

        }

//Radial layout
        function getCenters(vname, size) {
            var centers = [],
                mapping,
                flags = [];
            for (var i = 0; i < processedCases.length; i++) {
                if (flags[processedCases[i][vname]]) continue;
                flags[processedCases[i][vname]] = true;
                centers.push({name: processedCases[i][vname], value: 1});
            }
            mapping = d3v3.layout.pack()
                .sort(function (d) {
                    return d[vname];
                })
                .size(size);
            mapping.nodes({children: centers});

            return centers;
        }


        ///////////////////below helpers are cited from "https://bl.ocks.org/mbostock/7881887"
//Radial lay-out
        function tick(centers, varname) {
            var foci = {};
            for (var i = 0; i < centers.length; i++) {
                foci[centers[i].name] = centers[i];
            }

            return function (e) {
                for (var i = 0; i < processedCases.length; i++) {
                    var o = processedCases[i];
                    var f = foci[o[varname]];
                    o.y += (f.y - o.y) * e.alpha;
                    o.x += (f.x - o.x) * e.alpha;
                }

                d3.selectAll(".circles")
                    .each(collide(.5))
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });

            }
        }

        function collide(alpha) {
            var quadtree = d3v3.geom.quadtree(processedCases);
            return function (d) {
                var r = d.radius + maxRadius + padding,
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function (quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius + padding;
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
        }

    }


}