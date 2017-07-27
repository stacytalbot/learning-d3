var d3 = require('d3');

d3.json("/json/marine-dot-infographic.json", function(error, json) {

  var data = json,
      total = data.length;

  // variables
  var radius = 10,
      dotMargin = 5,
      dotsPerRow = 5,
      margin = 40,
      areaWidth = radius*2*dotsPerRow + margin*2,
      width = areaWidth*total + margin,
      height = 300;

  var svg = d3.select("#marine-dot-infographic")
        .append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("viewport", width + "x" + height)
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("transform-origin", "bottom left");

  var infographic = svg.append("g")
        .attr("width", width)
        .attr("height", height - margin*2)
        .attr("class", "infographic")
        .attr("transform", "translate(" + margin + ", " + -margin + ")");

  var area = infographic.selectAll("area")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "area")
        .attr("transform", function(d, i){ return "translate(" + (areaWidth*i) + ", " + height + ")"; });

  //area year
  area.append("text")
    .text(function(d){ return d.year; })
    .attr("class", "area__year")
    .attr("transform", "translate(" + (areaWidth/2) + ", 0)")
    .attr("text-anchor", "middle");

  //area title
  area.append("text")
    .text(function(d){ return d.title; })
    .attr("class", "area__title")
    .attr("transform", function(d, i){ return "translate(" + (areaWidth/2) + ", -20)"; })
    .attr("text-anchor", "middle");

  var terrestrial = area.append("g")
        .datum(function(d){ return d.areas.terrestrial})
        .attr("class", "terrestrial");

  terrestrial.selectAll("circle")
    .data((d, i) => d3.range(d.full).map(j => [i, j]))
    .enter()
    .append("circle")
    .attr("cx", function(d, i){ return (radius*2+dotMargin) * (i%5); })
    .attr("cy", function(d, i){ return (radius*2+dotMargin) * (-Math.floor(i/dotsPerRow)); })
    .attr("r", radius)
    .attr("fill", "#34f07e");

  var marine = area.append("g")
        .datum(function(d){ return d.areas.marine})
        .attr("class", "marine");

  marine.selectAll("circle")
    .data((d, i) => d3.range(d.full).map(j => [i, j]))
    .enter()
    .append("circle")
    .attr("cx", function(d, i){ return (radius*2+dotMargin) * (i%5); })
    .attr("cy", function(d, i){ return (radius*2+dotMargin) * (-Math.floor(i/dotsPerRow)); })
    .attr("r", radius)
    .attr("fill", "#1fb3d3");
});