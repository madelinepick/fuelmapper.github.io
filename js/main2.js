$(function(){
  var defaultdata = [
  [10,20],[20,90],[30,50],[40,33],[50,95],[60,12],[70,44],[80,67],[90,21],[100,88]
];
var w = $(window).width()*0.75,
    h = w/2,
    padding = 30,
    xScale = d3.scale.linear()
                      .domain([0, d3.max(defaultdata, function(d){return d[0];})])
                      .range([0, w-padding]),
    yScale = d3.scale.linear()
                      .domain([0, d3.max(defaultdata, function(d){return d[1];})])
                      .range([h-padding, 0]),
    xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(6),
    yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5)

var canvas  = d3.select(".chart")
                .append("svg")
                .attr({
                  height: h+"px",
                  width: w+"px"
                })
var xaxis = canvas.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate("+padding+","+(h-padding)+")")
                  .call(xAxis);
var yaxis = canvas.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate("+padding+",0)")
                  .call(yAxis);

var scatter = canvas.selectAll("circle")
                    .data(defaultdata)
                    .enter()
                    .append("circle")
                    .attr({
                      cx: function(d){return xScale(d[0])+padding;},
                      cy: function(d){return yScale(d[1]);},
                      r: 5
                    });

  $(".fuelForm").on("submit", function(){
    $("html, body").animate({ scrollTop: "550px" });
    $(".chartrow").show();
    event.preventDefault();
    var newData = [
      [10,50],[20,60],[30,40],[40,21],[50,93],[60,95],[70,65],[80,32],[90,17],[100,83]
    ];
    canvas.selectAll("circle")
          .data(newData)
          .transition()
          .delay(1000)
          .duration(2000)
          .ease("linear")
          .attr({
            cx: function(d){return xScale(d[0])+padding;},
            cy: function(d){return yScale(d[1]);},
            r: 5
    })
  })
})
