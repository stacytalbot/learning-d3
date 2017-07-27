var d3 = require('d3');

// variables
var width = 420,
    height = 200,
    barHeight = 20;

//chart generation
d3.json("/json/marine-bar-chart.json", function(error, json) {
  if (error) throw error;

  var data = json;

  var totalData = data.length;

  var colour = d3.scaleSequential(d3.interpolateCool)
    .domain([0, totalData]);

  var scale = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([0, width]);

  var chart = d3.selectAll(".marine-bar-chart, .marine-bar-chart-animation")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("viewport",  width + "x" + height)
    .attr("preserveAspectRatio", "xMidYMid");

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; })
    .style('fill', function(d, i) { return colour(i); })

  bar.append("rect")
      .attr("width", scale)
      .attr("height", barHeight - 1)
});