import {uCluster} from "./_u-cluster";
var d3 = require('d3');

if(document.getElementById("radial-network")) {

var diameter = 700,
    radius = diameter / 2,
    innerRadius = radius - 200;

var cluster = uCluster()
    .size([360, innerRadius]);

var line = d3.radialLine()
    .curve(d3.curveBundle.beta(1))
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

var svg = d3.select("#radial-network").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var link = svg.append("g").selectAll(".link"),
    node = svg.append("g").selectAll(".node");

d3.json("/json/radial-network.json", function(error, classes) {
  if (error) throw error;

  var clusterNodes = cluster(classes);

  var filter = "";
  //var filter = "pink";

  var links = packageImports(clusterNodes, filter);
  var totalLinks = links.length;

  var colour = d3.scaleSequential(d3.interpolateCool)
    .domain([0, totalLinks]);

  link = link
  .data(links)
  .enter().append("path")
    .each(function(d) { 
      d.source = d[0], d.target = d[d.length - 1];
    })
    .attr("stroke", function(d,i){ return colour(i); })
    .attr("class", "link")
    .attr("d", line);

  node = node
    .data(clusterNodes)
    .enter().append("text")
      .attr("class", "node")
      .attr("dy", "0.31em")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .text(function(d) { return d.name; });
});

// Return a list of imports for the given array of nodes.
function packageImports(nodes, filter) {
  var map = {},
      imports = [],
      filterName = '';

  filter ? filterName = filter : filterName = false;

  console.log(filterName);

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.name] = d;
  });

  // For each import, construct a link from the source to target node.
  if(filterName){
    nodes.forEach(function(d) {
      if (d.name == filterName && d.imports) {
        d.imports.forEach(function(i) {
          var path = [];

          path.push(map[d.name]);
          path.push(map[i]);

          imports.push(path);
        });
      }
    });
  } else {
    nodes.forEach(function(d) {
      if (d.imports) {
        d.imports.forEach(function(i) {
          var path = [];

          path.push(map[d.name]);
          path.push(map[i]);

          imports.push(path);
        });
      }
    });
  }

  console.log(imports);

  return imports;
}

}