$(function(){
  var defaultdata = [
  [0,1800],[1.5,1200],[1.7,1450],[2.5,1125],[2.7,1375],[3.5,1050],[3.7,1300],[4.5,975],[4.7,1225],[5.5,900],[5.7,1150],[6.5,825],[6.7,1075],[7.5,750],[7.7,1000],[8.5,675],[8.7,925]
  ];
var w = $(window).width()*0.75,
    h = w/2,
    padding = 40,
    xScale = d3.scale.linear()
                      .domain([0, d3.max(defaultdata, function(d){return d[0];})])
                      .range([0, w-padding]),
    yScale = d3.scale.linear()
                      .domain([0, d3.max(defaultdata, function(d){return d[1];})])
                      .range([h-padding, 0]),
    xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(8)
                  .outerTickSize(0),
    yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(6)
                  .outerTickSize(0);

var defaultline = [];
for (var i = 0; i < defaultdata.length; i++) {
  insidearray = [0,0];
  insidearray[0] = xScale(defaultdata[i][0])+padding;
  insidearray[1] = yScale(defaultdata[i][1]);
  defaultline.push(insidearray);
  }
for (var i = 0; i < defaultline.length; i++) {
  defaultline[i] = defaultline[i].join(",")
}
defaultline = defaultline.join(" ");

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
var lineplot = canvas.append("polyline")
                    .attr({
                      points: defaultline,
                      fill: "none",
                      stroke: "black"
                    });


  $(".fuelForm").on("submit", function(){
    $("html, body").animate({ scrollTop: "550px" });
    $(".chartrow").show();
    event.preventDefault();

    var serialURL = $(this).serialize().split("&");

    var information = {};
    for(var i = 0; i < serialURL.length; i++){
    var j = serialURL[i].split("=");
    information[j[0]] = j[1];
    }

    if ( information.weight > 0 && information.weight<=100 ) { information.stored = 1400}
    if ( information.weight > 100 && information.weight<=120 ) { information.stored = 1500}
    if ( information.weight > 120 && information.weight<=140 ) { information.stored = 1600}
    if ( information.weight > 140 && information.weight<=160 ) { information.stored = 1700}
    if ( information.weight > 160 && information.weight<=180 ) { information.stored = 1800}
    if ( information.weight > 180 && information.weight<=200 ) { information.stored = 1900}
    if ( information.weight > 200 ) { information.stored = 2000}

    if ( information.gender === "f"){
    information.swimburn = ((0.4472*information.hr)-(0.05741*information.weight)+(0.074*information.age)-20.4022)*30/4.184
    }
    if ( information.gender === "m"){
    information.swimburn = ((0.6309*information.hr)-(0.09036*information.weight)+(0.2017*information.age)-55.0969)*30/4.184
    }
    if ( information.gender === "o"){
    information.swimburn = ((0.6309*information.hr)-(0.09036*information.weight)+(0.2017*information.age)-55.0969)*30/4.184
    }

    information.runburn = (0.75*information.weight)*information.runpace*0.5;
    information.bikeburn = information.weight*information.bikepace*0.256032*0.5;
    information.runbikeburn = (information.bikeburn+information.runburn)/2;
    information.totalburn = (information.bikeburn+information.runburn+information.swimburn)/3;
    information.totaltime = Math.ceil(((information.swimpace/60)*2.4)+(112/information.bikepace)+(16/information.runpace));
    information.runbiketime = information.totaltime - (2.4*information.swimpace/60);
    information.totalcals = ((2.4*information.swimpace/60)*information.swimburn)+(112/information.bikepace*information.bikeburn)+(26.2/information.runpace*information.runburn);
    localStorage.storedData = JSON.stringify(information);

    var eat = 0;
    if((information.stored+200*(information.totaltime+1))-information.totalcals >= 0){
      eat = 200
    }
    if((information.stored+200*(information.totaltime+1))-information.totalcals < 0 && (information.stored+250*(information.totaltime+1))-information.totalcals >= 0){
      eat = 250
    }
    if((information.stored+250*(information.totaltime+1))-information.totalcals < 0 && (information.stored+300*(information.totaltime+1))-information.totalcals >= 0){
      eat = 300
    }
    if((information.stored+300*(information.totaltime+1))-information.totalcals < 0 && (information.stored+350*(information.totaltime+1))-information.totalcals >= 0){
      eat = 350
    }
    if((information.stored+350*(information.totaltime+1))-information.totalcals < 0 && (information.stored+400*(information.totaltime+1))-information.totalcals >= 0){
      eat = 400
    }

    console.log(information.totalcals);
    console.log(information.stored);
    console.log(information.totaltime);
    console.log(eat);
    var circlePoints = [];
    circlePoints[0]=[0,information.stored];
    circlePoints[1]=[(2.4*(information.swimpace/60)),(information.stored-information.swimburn*2.4*(information.swimpace/60))];
    circlePoints[2]=[(2.4*(information.swimpace/60))+0.2, circlePoints[1][1]+eat];
    console.log(circlePoints);

    for (var i = 1; i <= information.runbiketime; i++) {
      circlePoints[(i)*2+1] = [(2.4*(information.swimpace/60)+(i)*1), (circlePoints[1][1]-(i)*information.runbikeburn+(i)*eat) ]
      circlePoints[(i)*2+2] = [(2.4*(information.swimpace/60)+(i)*1+0.2), (circlePoints[1][1]-(i)*information.runbikeburn+(i+1)*eat)]
    }

    var neww = $(window).width()*0.75,
        newh = w/2,
        padding = 40,
        newxScale = d3.scale.linear()
                          .domain([0, d3.max(circlePoints, function(d){return d[0];})])
                          .range([0, neww-padding]),
        newyScale = d3.scale.linear()
                          .domain([0, d3.max(circlePoints, function(d){return d[1];})])
                          .range([newh-padding, 0]),
        newxAxis = d3.svg.axis()
                      .scale(newxScale)
                      .orient("bottom")
                      .ticks(8)
                      .outerTickSize(0),
        newyAxis = d3.svg.axis()
                      .scale(newyScale)
                      .orient("left")
                      .ticks(6)
                      .outerTickSize(0);

        var linePoints = [];

        // the points aren't right??
        // for (var i = 0; i < circlePoints.length; i++) {
        //   insidearray = [0,0];
        //   insidearray[0] = newxScale(circlePoints[i][0])+padding;
        //   insidearray[1] = newyScale(circlePoints[i][1]);
        //   linePoints.push(insidearray);
        //   }
        // for (var i = 0; i < linePoints.length; i++) {
        //   linePoints[i] = linePoints[i].join(",")
        // }
        // linePoints = linePoints.join(" ");

    canvas.transition()
          .delay(1000)
          .duration(2000)
          .ease("linear")
          .attr({
            height: newh+"px",
            width: neww+"px"
          });
    xaxis.transition()
          .delay(1000)
          .duration(2000)
          .ease("linear")
          .attr("transform", "translate("+padding+","+(newh-padding)+")")
          .call(newxAxis);
    yaxis.transition()
          .delay(1000)
          .duration(2000)
          .ease("linear")
          .attr("transform", "translate("+padding+",0)")
          .call(newyAxis);

    canvas.selectAll("circle")
          .data(circlePoints)
          .transition()
          .delay(1000)
          .duration(2000)
          .ease("linear")
          .attr({
            cx: function(d){return xScale(d[0])+padding;},
            cy: function(d){return yScale(d[1]);},
            r: 5
          });
    canvas.selectAll("polyline")
          .transition()
          .delay(1000)
          .duration(2000)
          .ease("linear")
          .attr({
            points: linePoints,
          });
  })
})
