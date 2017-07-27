var d3 = require('d3');

if(document.getElementById("marine-multi-line-chart-fancy-2")) {

  // variables
  var width = 480,
      height = 280,
      margin = 40;

  var chartWidth = width - (2*margin),
      chartHeight = height - (2*margin);


  //chart functions
  var parseTime = d3.timeParse("%d/%m/%Y");

  var x = d3.scaleTime().range([0, chartWidth]),
      y = d3.scaleLinear().range([chartHeight, 0]),
      color = d3.scaleSequential(d3.interpolateCool);

  var line = d3.line()
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
    var svg = d3.select("#marine-multi-line-chart-fancy-2")
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("viewport", width + "x" + height)
      .attr("preserveAspectRatio", "xMidYMid")
      .attr("width", "100%")
      .attr("height", "100%")

    var chart = svg.append("g")
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .attr("transform", "translate(" + margin + ", " + margin + ")")

    chart.append("g")
      .attr("transform", "translate(0, " + chartHeight + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .text("Date")
      .attr("class", "label")
      .attr("transform", "translate(" + chartWidth/2 + ", 30)");

    chart.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .text("Quantity")
      .attr("class", "label")
      .attr("transform", "rotate(-90) translate(" + -chartHeight/2 + ", -30)");
    
    var animal = chart.selectAll(".animal")
      .data(animals)
      .enter().append("g")
      .attr("class", "animal");

    animal.append("path")
      .attr("class", "multi-line")
      .attr("id", function(d){ return d.id + '-2'; })
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d, i) { return color(i); });

    var key = svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(180," + margin + ")");

    var keyItem = key.selectAll("key-item")
      .data(animals)
      .enter().append("g")
      .attr("class", "key-item")
      
    keyItem.append("rect")
      .attr("width", "12px")
      .attr("height", "2px")
      .attr("transform", function(d, i) { return "translate(0, " + i*16 + ")"; })
      .attr("fill", function(d, i) { return color(i); });

    keyItem.append("text")
      .datum(function(d) { return { id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d, i){ return "translate(16, " + (4 + i*16) +")"; })
      .attr("class", "line-label")
      .attr("id", function(d){ return d.id + '-2-label'; })
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