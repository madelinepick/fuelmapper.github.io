$(function(){

  d3Chart = {
    container: d3.select(".chart")
                .append("svg")
                .attr("width", objectForD3.width)
                .attr("height", 400)
                .style("display", "inline")
                .style("margin-left", "40px")
                .style("margin-top", "40px")
                .style("border-bottom", "1px solid white")
                .style("border-left", "1px solid white"),
    triChartFn: triChart,
    circlesFn: circles
  };

  function triChart ( newPoints ) {
    var dataPoints = newPoints

    var graph = d3Chart.container.selectAll("polyline").data(dataPoints).enter().append("polyline");
    var graphAtts = graph.attr("x", function(d) { return d.x_axis;})
                          .attr("y", function(d) { return d.y_axis;})
                          .transition()
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
                          .attr("r", "5")
                          .attr("fill", "white");
    var cap = d3Chart.container.selectAll("text").data(newCircles).enter().append("text");
    var capAtts = cap.attr("x", function(d) { return d.x_axis;})
                        .attr("y", function(d) { return d.y_axis;})
                        .attr("class", "info")
                        .attr("fill", "white")
                        .text(1200 - (function(d) { return d.y_axis;}));
    }
});
