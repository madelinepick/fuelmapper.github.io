$(function(){
//   $( "body" ).ready(function(){
//   d3Chart.swimChartFn([
//     {"x_axis": 0, "y_axis": 0, "points": "0,500 0,0 100,200 100,500", "fill": "rgb(57, 60, 194)"}
//   ]);
// });

  $( "#fuelForm" ).on("submit", function(){
    event.preventDefault();
    d3Chart.triChartFn([
      {"x_axis": 0, "y_axis": 0, "points": "10,400 10,10 100,200 100,400", "stroke": "rgb(79, 47, 252)", "strokewidth": "2","fill": "none"},
      {"x_axis": 100, "y_axis": 0, "points": "100,400 100,200 200,270 300,330 400,350 400,400", "stroke": "rgb(48, 177, 169)", "strokewidth": "2","fill": "none"},
      {"x_axis": 100, "y_axis": 0, "points": "400,400 400,350 500,190 600,190 700,273 800,200 900,160 1000,390 1100,300 1100,400", "stroke":"rgb(171, 146, 23)" , "strokewidth":"2","fill":"none"}
    ]);
    d3Chart.circlesFn([
      {"x_axis": 10, "y_axis": 10, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 100, "y_axis": 200, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 200, "y_axis": 270, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 300, "y_axis": 330, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 400, "y_axis": 350, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 500, "y_axis": 190, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 600, "y_axis": 190, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 700, "y_axis": 273, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 800, "y_axis": 200, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 900, "y_axis": 160, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 1000, "y_axis": 390, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"},
      {"x_axis": 1100, "y_axis": 300, "radius": "5", "stroke": "#333", "strokewidth": "1", "fill": "rgb(44, 49, 51)"}
    ]);


  var serialURL = $( this ).serialize().split("&");

  var information = {};
  for(var i = 0; i < serialURL.length; i++){
  var j = serialURL[i].split("=");
  information[j[0]] = j[1];
  }
//change information
//use race to determine svg width
  var forGraph = {};
  forGraph.width = information.race


//determine starting glycogen by weight
  if ( information.weight > 0 && information.weight<=100 ) { forGraph.stored = 1400}
  if ( information.weight > 100 && information.weight<=120 ) { forGraph.stored = 1500}
  if ( information.weight > 120 && information.weight<=140 ) { forGraph.stored = 1600}
  if ( information.weight > 140 && information.weight<=160 ) { forGraph.stored = 1700}
  if ( information.weight > 160 && information.weight<=180 ) { forGraph.stored = 1800}
  if ( information.weight > 180 && information.weight<=200 ) { forGraph.stored = 1900}
  if ( information.weight > 200 ) { forGraph.stored = 2000}


//burn rate per hour
  if ( information.gender === "f"){
  forGraph.swimburn = ((0.4472*information.hr)-(0.05741*information.weight)+(0.074*information.age)-20.4022)*60/4.184
  }
  if ( information.gender === "m"){
  forGraph.swimburn = ((0.6309*information.hr)-(0.09036*information.weight)+(0.2017*information.age)-55.0969)*60/4.184
  }
  forGraph.runburn = (0.63*information.weight)*(60/information.runpace)
  forGraph.bikeburn = information.weight*information.bikepace*0.256032

//lengths of each portion (in time)
if(information.race === "300px"){
  forGraph.swimtime = 0.5/information.swimpace
  forGraph.biketime = 12.4/information.bikepace
  forGraph.runtime = 3.1/information.runpace
}
if(information.race === "500px"){
  forGraph.swimtime = 0.93/information.swimpace
  forGraph.biketime = 24.8/information.bikepace
  forGraph.runtime = 6.2/information.runpace
}
if(information.race === "800px"){
  forGraph.swimtime = 1.2/information.swimpace
  forGraph.biketime = 56/information.bikepace
  forGraph.runtime = 13.1/information.runpace
}
if(information.race === "1300px"){
  forGraph.swimtime = 2.4/information.swimpace
  forGraph.biketime = 112/information.bikepace
  forGraph.runtime = 26.2/information.runpace
}
  console.log(forGraph)

  })
})
