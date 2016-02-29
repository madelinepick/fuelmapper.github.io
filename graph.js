$(function(){

  d3Chart = {
    container: d3.select("body")
                .append("svg")
                .attr("width", 1200)
                .attr("height", 400)
                .style("display", "inline")
                .style("margin-left", "40px").style("margin-top", "40px"),
    triChartFn: triChart,
    circlesFn: circles
  };

  function triChart ( newPoints ) {
    var dataPoints = newPoints

    var graph = d3Chart.container.selectAll("polyline").data(dataPoints).enter().append("polyline");
    var graphAtts = graph.attr("x", function(d) { return d.x_axis;})
                          .attr("y", function(d) { return d.y_axis;})
                          .attr("points", function(d) { return d.points;})
                          .attr("stroke", function(d) { return d.stroke;})
                          .attr("stroke-width", function(d) { return d.strokewidth;})
                          .attr("fill", function(d) { return d.fill;});
  }

  function circles (newCircles){
    var circlePoints = newCircles

    var fuel = d3Chart.container.selectAll("circle").data(circlePoints).enter().append("circle");
    var fuelAtts = fuel.attr("cx", function(d) { return d.x_axis;})
                          .attr("cy", function(d) { return d.y_axis;})
                          .attr("r", function(d) { return d.radius;})
                          .attr("stroke", function(d) { return d.stroke;})
                          .attr("stroke-width", function(d) { return d.strokewidth;})
                          .attr("fill", function(d) { return d.fill;});
    }

  // var fuelPoints = [
  //    { "x_axis": 200, "y_axis": 100, "radius": 10},
  //    { "x_axis": 400, "y_axis": 75, "radius": 10},
  //    { "x_axis": 600, "y_axis": 400, "radius": 10}];
  // var textPoints = [
  //   { "x_axis": 190, "y_axis": 90},
  //   { "x_axis": 390, "y_axis": 65},
  //   { "x_axis": 590, "y_axis": 390}];


});


// container.selectAll("polyline").data(swimPoints).enter().append("polyline");
// var bikeAtts = graph.attr("x", function(d) { return d.x_axis;})
//                       .attr("y", function(d) { return d.y_axis;})
//                       .attr("points", function(dd.points;})
//                       .attr("fill", function(dd.fill;});

// var fuel = container.selectAll("circle").data(fuelPoints).enter().append("circle");
// var fuelAtts = fuel.attr("cx", function(d) { return d.x_axis;})
//                       .attr("cy", function(d) { return d.y_axis;})
//                       .attr("r", function(d) { return d.radius;})
//                       .attr("fill", "rgb(4, 96, 125)");
//
// var captions = container.selectAll("text").data(textPoints).enter().append("text");
// var captionsAtts = captions.attr("x", function(d) { return d.x_axis;})
//                       .attr("y", function(d) { return d.y_axis;})
//                       .text("hello");
