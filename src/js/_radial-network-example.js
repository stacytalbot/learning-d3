//import {tCluster} from "./_t-cluster";

var d3 = require('d3');

if(document.getElementById("radial-network-example")) {

var diameter = 1000,
    radius = diameter / 2,
    innerRadius = radius - 250;

var cluster = d3.cluster()
    .size([360, innerRadius]);

var line = d3.radialLine()
    .curve(d3.curveBundle.beta(0.1))
    .radius(function(d) { 
      
      return d.y; 
    })
    .angle(function(d) { 
      
      return d.x / 180 * Math.PI; 
    });

var svg = d3.select("#radial-network-example").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewPort", diameter + "x" + diameter)
    .attr("viewBox", "0 0 " + diameter + " " + diameter)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var link = svg.append("g").selectAll(".link"),
    node = svg.append("g").selectAll(".node");

//d3.json("/json/example.json", function(error, classes) {
// d3.json("/json/example2.json", function(error, classes) {
d3.json("/json/biodiversity.json", function(error, classes) {
  if (error) throw error;
  
  var root = packageHierarchy(classes)
      .sum(function(d) { return d.size; });

  cluster(root);

  var links = packageImports(root.leaves());
  var totalLinks = links.length;

  var colour = d3.scaleSequential(d3.interpolateCool)
    .domain([0,totalLinks]);

  link = link
    .data(links)
    .enter().append("path")
      .each(function(d) { 
        d.source = d[0], d.target = d[d.length - 1]; 
      })
      .attr("class", "link")
      .attr("stroke", function(d,i){ return colour(i); })
      .attr("d", line);
  
  node = node
    .data(root.leaves())
    .enter().append("text")
      .attr("class", "node")
      .attr("dy", "0.31em")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .text(function(d) { return d.data.key; });
});

// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  classes.forEach(function(d) {
    find(d.name, d);
  });

  return d3.hierarchy(map[""]);
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.data.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.data.imports) d.data.imports.forEach(function(i) {
      imports.push(map[d.data.name].path(map[i]));
    });
  });

  return imports;
}
}