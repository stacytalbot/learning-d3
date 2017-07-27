var d3 = require('d3');

if(document.getElementById("marine-multi-line-chart-fancy")) {

  // variables
  var width = 420,
      height = 200,
      margin = 40;

  //chart functions
  var parseTime = d3.timeParse("%d/%m/%Y");

  var x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      color = d3.scaleSequential(d3.interpolateCool);

  var line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d){ return x(d.date); })
      .y(function(d){ return y(d.quantity); });

  //chart generation
  d3.tsv("/data/marine-multi-line-chart.tsv", type, function(error, data) {
    if (error) throw error;

    var animals = data.columns.slice(1).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return { date: d.date, quantity: d[id] };
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
      d3.min(animals, function(c) { return d3.min(c.values, function(d) { return d.quantity; }); }),
      d3.max(animals, function(c) { return d3.max(c.values, function(d) { return d.quantity; }); })
    ]);

    color.domain(animals.map(function(d, i) { return i; }));

    //build chart
    var svg = d3.select("#marine-multi-line-chart-fancy")
      .append("svg")
      .attr("viewBox", "0 0 " + (width+100) + " " + (height+100))
      .attr("viewport", (width+100) + "x" + (height+100))
      .attr("preserveAspectRatio", "xMidYMid")
      .attr("width", "100%")
      .attr("height", "100%")

    var chart = svg.append("g")
      .attr("width", width - margin)
      .attr("height", height - margin)
      .attr("transform", "translate(" + margin + ", " + margin + ")")

    chart.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .text("Date")
      .attr("class", "label")
      .attr("transform", "translate(" + width/2 + ", 30)");

    chart.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .text("Quantity")
      .attr("class", "label")
      .attr("transform", "rotate(-90) translate(" + -height/2 + ", -30)");
    
    var animal = chart.selectAll(".animal")
      .data(animals)
      .enter().append("g")
      .attr("class", "animal");

    animal.append("path")
      .attr("class", "multi-line")
      .attr("id", function(d){ return d.id; })
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d, i) { return color(i); });

    animal.append("text")
      .datum(function(d) { return { id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + (x(d.value.date) + 5) + "," + y(d.value.quantity) + ")"; })
      .attr("class", "line-label")
      .style("fill", function(d, i) { return color(i); })
      .text(function(d) { return d.id; });
  });

  function type(d, _, columns) {
    var count = 0;

    d.date = parseTime(d.date);
    
    for (var i = 1, n = columns.length, c; i < n; ++i) {
      d[c = columns[i]] = +d[c];
      count++;
    }

    d.count = count;

    return d;
  }
}