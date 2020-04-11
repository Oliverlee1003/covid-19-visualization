Deployed on https://covid-19-vis.netlify.com/
If line chart and treemap are not in the same line, Please zoom out a little bit (command ➕ - ) or increase the width of browser.

# project_nameless

## Scalability
N/A | Items | #levels for ordinal/categorical attr | #levels for ordinal categorical attr2
--- | --- | --- | ---
Map | Hundreds of regions, can be more as long as they can be shown on map| Country/Region,Province/State| Lat, Lon,#of confirmed cases, #of death, #of recovery
Line |Three lines, can be more as long as they are not messy on the graph|Date|Number of cases, Type of case
Treemap |Hundreds of boxes, can be more as long as they can be shown on map |Continents，Country/Region|#of confirmed cases

## Map
### Why map? 
We chose the map because it helps to visualize the geographical perspectives of the coronavirus. 
### Why circle size instead of color? 
There’s definitely a trade off between using bubble size or color on a region to represent the quantity of coronavirus confirmed cases, deaths, recovery cases. Color encoding will for sure makes the map cleaner. However, compared to a sized-circle, it does not show the quantity very clearly. If we use red with different levels of saturation to represent the number of cases, it is visually hard to compare medium red and super red. While by using circles, users can distinguish them very well. 
### Interaction between world map and selected country map. 
For world map, we aim to let users to view the situation of coronavirus world widely,while in country map, we aim to let users to view the situation of coronarius of a specific country.
### Interaction between date-slider. 
We aim to let users be able to see the trend of coronavirus spreadness. Via the ‘Play’ button, we can give users the ability to view the animation of how coronavirus spread worldwidely and how coronavris spead inside a country. Roughly we can see that while China is more stable about the number of confirmed cases, there’s an obvious outbreak/increase in Europe and America.

### Data Processing:
In order to show the data only in a specific country, I filtered out all the data by its country. Thus, if we select a country, only circle/cases in the targeted country will show up. 
The raw data has a different encoding of date as columns names. 
For example, usually we have yyyy/mm/dd or mm/dd/yyyy. However, in the data, we have mm/dd/yy (1/22/20 instead of 1/22/2020). To deal with it, I change the way how we convert date into mm/dd/yy format. 

### How has my visualization goals changed?
Not much yet. 

### Does your visualization enable the tasks you set out to facilitate or successfully communicate the story you want to tell?
Yes. 


## Treemap
The code base is from here: https://www.d3-graph-gallery.com/graph/treemap_basic.html

This code base only shows how to make a basic static treemap with csv file dataset. I used it as a start point to create a treemap template, such as how to use d3.treemap, create a root and use root.leaves(). The tooltip section is from the answer key of barchart on programming assignment 2. The rest code changes are made by myself.

We use treemap to show the distribution perspectives of the coronavirus cases (could be confirmed, death or recovery) including both worldwise and within each continent. There are three data files which contain the data for confirmed cases, death cases and recovery cases of coronavirus. The processed data for treemap added a new column: continents. In this case, the users are able to check the distribution of the coronavirus in each of the continents.

The Country/Region is encoded to the area, and with a tooltip shows the country name and the number of the cases (haven’t add tooltip yet). The Continents column has 7 levels, including 6 continents and empty value for Cruise Ship and Holy See. The value of the continent is encoded in color hue. The rest columns are the number of the cases for each day start on 2020-01-22.

I added the color hue encoding for the continents type, and decided to support the date selection bar and type of cases of the coronavirus. The interactions are the same as planned. There are 195 countries in the world, and most of the countries has at least a few confirmed cases of coronavirus. Therefore, it is very hard to display all the countries with confirmed coronavirus cases on a single virtualization. The continent selection bar provides a way for users to check the countries that are seriously affected by coronavirus for each of the continents. For the worldwise selection, I grouped countries according to the continents which reduces the number of boxes to 7. The date selection bar provides an opportunity for users to check the distribution change both worldwise and within each continent.

## Line Chart
We used a line chart to show the trend of the corona virus spreading. The chart contains three lines with different colors, which represent confirmed case, recovery case and death case. The data processing for the linechart is that turning date from attribute to data.
Then get a sum of confirm/death/recovery cases to better construct the chart. I will further process the data for different countries or continents.  
Currently all the 4 attributes in the linechart.csv is Ordinal. The Cardinality of Date is from 2020/1/22 to 2020/3/19. The Cardinality of the three type of cases is that from 0 to 242708.

The line encoded the number of cases. Color(hue) encodes the different types of the three cases. Line charts can better show the trend of the spread, and viewers can see when the outbreak might happen(spread fastest). Different colors can distinguish three types of cases. By comparing recovery cases and confirmed cases, viewers can understand how many people have recovered.  Color is connected to the dropdown selection on the top of the webpage. When selecting a type of case, the opacity of that line will change to 1, which can highlight the line we are currently looking at. This is also linked to Map and treemap(tbd)

There will be a tooltip for hover effect. When the mouse hovers on the line chart, there will be a vertical line moving along the mouse and show the detail number of cases. This can help viewers compare the numbers on different dates and get the specific number of a date easily.

## Project Management & Team Assemssment
### Oliver
Features | Planned Hours | Actual Hours
--- | --- | --- 
Static World Map by topo json, Static Button to choose the attribute  (confirmed cases, death, recovery), Static Date Bar, Static hmtl page layout  | 5 | 5
Link Map with Date-slider |2 | 3
Tooltip shows the number of confirmed cases when hover |2 | 2
Click to show the country map(eventually achieved by zoomed in a dummy world map) |2 | 3
Add Legend |1 | 1
Add bubble circles in country map and world map, filter out only circles in targeted country in country map |5 | 4
Add animation for play/pause |3 | 2
Fix the layout of world map and country map so they sit on the same line |1 | 3
Documentation |0 | 3
Total |21 | 27

### Erin
Features | Planned Hours | Actual Hours
--- | --- | --- 
Static treemap graph with legend | 2 | 8
Tooltip shows the number of suspended and confirmed cases when hover | 2 | 4
Link treemap with Map and Lines (options) | 2 | 0
Static selection to choose the view | 6 | 2
Dynamic treemap according to the continents and user chooses | 6 | 4
Documentation | 0 | 4
Total | 18 | 22.5

### Bob
Features | Planned Hours | Actual Hours
--- | --- | --- 
Static multi-Line Chart | 3 | 5
Add color and details of the line chart | 3 | 4
Link the line chart with dropdown type selection | 3 | 4
Link the line to the Date selection and Play button(current in progress) Will commit when its done | 6 | 7
Documentation | 1 | 2.5
Total | 18 | 22.5

## Contributions Breakdown:
* Briefly describe which team member worked on which tasks and their responsibilities. Did everyone contribute equally? 
* Oliver: visualization of map (world map and country map). Interaction associated with date-slider. Implemented date-slider and play-pause animation. Implemented basic html main page layout. Filter out data by their country/region columns. 
* Erin: visualization of the treemap, and interaction associated with this graph. Also the data processing for the dataset used by treemap.
* Bob: Visualization of the line chart, and linked the line to the dropdown selection. And the data processing for the current line chart dataset.

## Team Process:

* Team has a clear vision of the problem(s) 
Good 
We need to not only take care of our own proportion but keep updating with teammate’s portions of work as well. 

* Team is properly organized to complete task and cooperates well 
Excellent
We divided out work very well and there’s very a few merge conflicts

* Team managed time wisely
Excellent
Each of us spent decent amount of time

* Team acquired needed knowledge base
Good
Thanks to the previous programming assignments, we all have a decent knoledge base. However, there’s still a space for improvement. 

* Efforts communicated well within group
Excellent
Everytime When we want to change anything that might potentially affect other people’s work, we will inform other teammates. 

## Link to Data Source
https://github.com/CSSEGISandData/COVID-19

## Screenshot
Please check the jpg files in the root directory

World Map and Country Map
![image](https://media.github.students.cs.ubc.ca/user/499/files/46078e00-713f-11ea-9038-233cd554eee5)

Line Chart
![image](https://media.github.students.cs.ubc.ca/user/499/files/47d15180-713f-11ea-91df-56845ddccc33)

Tree Map
![image](https://media.github.students.cs.ubc.ca/user/499/files/4a33ab80-713f-11ea-981d-66ade379086f)
This is the Line Chart Highlighting when different case is selected
![til](/screenshot/linechart.gif)

Below are the animation when 'Play' button is clicked.
README.md
![til](/screenshot/mapPlay.gif)
![til](/screenshot/treemapPlay.gif)
