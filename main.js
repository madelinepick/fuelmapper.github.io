$(function(){

  $( "#fuelForm" ).on("submit", function(){
    $("html, body").animate({ scrollTop: "550px" });

    event.preventDefault();

  var serialURL = $( this ).serialize().split("&");

  var information = {};
  for(var i = 0; i < serialURL.length; i++){
  var j = serialURL[i].split("=");
  information[j[0]] = j[1];
  }
//change information
  var forGraph = {};
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
  forGraph.swimburn = ((0.4472*information.hr)-(0.05741*information.weight)+(0.074*information.age)-20.4022)*30/4.184
  }
  if ( information.gender === "m"){
  forGraph.swimburn = ((0.6309*information.hr)-(0.09036*information.weight)+(0.2017*information.age)-55.0969)*30/4.184
  }
  if ( information.gender === "o"){
  forGraph.swimburn = ((0.6309*information.hr)-(0.09036*information.weight)+(0.2017*information.age)-55.0969)*30/4.184
  }
  forGraph.runburn = (0.63*information.weight)*(60/information.runpace)*0.5
  forGraph.bikeburn = information.weight*information.bikepace*0.256032*0.5
//average bike and run for easier data
  forGraph.groundburn = (forGraph.bikeburn+forGraph.runburn)/2.5
  console.log(forGraph.swimburn)
forGraph.totaltime = Math.ceil(((information.swimpace/60)*2.4)+(112/information.bikepace)+(16/information.runpace))

//get points for graph
var usefulArray=[{"x_axis": 0, "y_axis": 0, "points": "", "stroke": "rgb(79, 47, 252)", "strokewidth": "2","fill": "none"},
{"x_axis": 0, "y_axis": 0, "points": "", "stroke": "rgb(48, 177, 169)", "strokewidth": "2","fill": "none"}];
var swimData = '';
swimData = "0,"+(400-forGraph.stored*0.19047).toString()+" "+((information.swimpace/60)*2.4*55.88).toString()+","+(400-(forGraph.stored*0.19047)+(forGraph.swimburn*2.4*0.19047)).toString()+" "+((information.swimpace/60)*2.4*55.88).toString()+","+(400-(forGraph.stored*0.19047)+(forGraph.swimburn*2.4*0.19047)-225*0.19047).toString()

usefulArray[0].points = swimData;
var bikeData = ((information.swimpace/60)*2.4*55.88).toString()+","+(400-(forGraph.stored*0.19047)+(forGraph.swimburn*2.4*0.19047)-225*0.19047).toString()+" ";

var minusSwim = forGraph.totaltime - (information.swimpace/60)*2.4
if(information.swimpace != 0){
for (var i = 1; i <= minusSwim+1; i++) {
  if(i < minusSwim+1){
  bikeData +=  (((information.swimpace/60)*2.4*55.88)+i*55.88).toString()+","+(400-(forGraph.stored*0.19047)+(forGraph.swimburn*2.4*0.19047)-i*225*0.19047+i*(forGraph.groundburn*0.19407)).toString()+" "+(((information.swimpace/60)*2.4*55.88)+i*55.88).toString()+","+(400-(forGraph.stored*0.19047)+(forGraph.swimburn*2.4*0.19047)-(i+1)*225*0.19047+i*(forGraph.groundburn*0.19407)).toString()+" ";
    } else{
  bikeData +=  (((information.swimpace/60)*2.4*55.88)+i*55.88).toString()+","+(400-(forGraph.stored*0.19047)+(forGraph.swimburn*2.4*0.19047)-i*225*0.19047+i*(forGraph.groundburn*0.19407)).toString()
    }
  }
}
var fancyWidth = forGraph.totaltime*55.88;
// bikeData += fancyWidth+","+400
usefulArray[1].points = bikeData;

var swimDataP = swimData.split(' ').join(',');
var swimDataP = swimDataP.split(',')

var bikeDataP = bikeData.split(' ').join(',');
var bikeDataP = bikeDataP.split(',')

console.log(bikeDataP[5])

var inputCircles = [
  {"x_axis": swimDataP[2], "y_axis": swimDataP[3], "words": "Hello"},
  {"x_axis": swimDataP[4], "y_axis": swimDataP[5], "words": "Hello"},
  {"x_axis": swimDataP[6], "y_axis": swimDataP[7], "words": "Hello"},
]

for (var i = 1; i <= bikeDataP.length/2; i++) {
  inputCircles[i+2] = {"x_axis": bikeDataP[i*2], "y_axis": bikeDataP[i*2+1], "words": "Hello"}
}

console.log(swimDataP)

d3Chart = {
  container: d3.select(".chart")
              .append("svg")
              .attr("width", fancyWidth)
              .attr("height", 400)
              .style("display", "inline")
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
                        .attr("stroke", "white")
                        .attr("stroke-width", function(d) { return d.strokewidth;})
                        .attr("fill", "none")
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




//make graph
d3Chart.triChartFn(usefulArray);
d3Chart.circlesFn(inputCircles);

//chart information
$(".chartInfo").append('<h4>What is this graph saying?</h4><ul><h5 class="title1">Glycogen Calories</h5><li class="list1">First off, this graph is only showing immediately available glycogen calories, not calories stored in fat or muscle. Your body fuels endurance races from both sources.</li><h5 class="title2">Stored glycogen</h5><li class="list2">You will start off with an amount of stored glycogen based on your weight. Your stored glycogen is X</li><h5 class="title3">Burn rate</h5><li class="list3">Each dip in the graph represent the glycogen calories you burn per hour, roughly half of your total calories burned. You burn x while swimming and x while biking and running.</li><h5 class="title4">Fueling</h5><li class="list4">For our model, we used a standard 250 cals/hr fueling plan.</li><h5 class="title5">My line goes off the graph!</h5><li class="list5">If your line dips below the bottom of the chart, this means your body would be relying on fat calories to finish the race since 250 cals per hour was not able to replace you loss. Our advice is to up your calorie per hour intake (more than 250) if you see this happening in the graph.</li></ul>')

$( ".title1" ).on('click', function(){
  $(".list1").slideToggle( "slow")
});
$( ".title2" ).on('click', function(){
  $(".list2").slideToggle( "slow")
});
$( ".title3" ).on('click', function(){
  $(".list3").slideToggle( "slow")
});
$( ".title4" ).on('click', function(){
  $(".list4").slideToggle( "slow")
});
$( ".title5" ).on('click', function(){
  $(".list5").slideToggle( "slow")
});

// Fuel Choices
var fuelArray = [];
information.chocolate === "chocolate" ? fuelArray.push("<div class='fuel chocolate'><img src='http://ecx.images-amazon.com/images/I/61pS2DKL8wL._SY355_.jpg'><p class='caption'>Some interesting stuff</p></div>", "<div class='fuel chocolate'><img src='http://www.tennisexpress.com/prodimages/35095-DEFAULT-l.jpg'><p class='caption'>Some interesting stuff</p></div>" ) : null

information.berry === "berry" ? fuelArray.push("<div class='fuel berry'><img src='http://ep.yimg.com/ay/trisports/clif-shot-bloks-44.jpg'><p class='caption'>Some interesting stuff</p></div>", "<div class='fuel berry'><img src='https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRF2j2q-Mj2-olW3e6ognHTsZo59-YCe9zOq5XZc0ZNwdNPcn-m-g'><p class='caption'>Some interesting stuff</p></div>") : null

information.citrus === "citrus" ? fuelArray.push("<div class='fuel citrus'><img src='http://images.mec.ca/fluid/customers/c822/5036-528/generated/5036-528_NOC02_view1_1000x1000.jpg'><p class='caption'>Some interesting stuff</p></div>", "<div class='fuel citrus'><img src='http://www.bhphotovideo.com/images/images1000x1000/gu_energy_labs_gu_123043_gu_energy_gel_24_pack_1174362.jpg'><p class='caption'>Some interesting stuff</p></div>") : null

information.coffee === "coffee" ? fuelArray.push("<div class='fuel coffee'><img src='http://www.bhphotovideo.com/images/images1000x1000/gu_energy_labs_gu_123050_gu_energy_gel_24_pack_1174367.jpg'><p class='caption'>Some interesting stuff</p></div>", "<div class='fuel coffee'><img src='https://thefeed.com/assets/Smooth-Caffeinator-400x400.jpg'><p class='caption'>Some interesting stuff</p></div>") : null

information.lemonline === "lemonline" ? fuelArray.push("<div class='fuel lemonlime'><img src='http://cdn.shopify.com/s/files/1/0121/9362/products/XLLB1000_silver_web.jpg?v=1444841410'><p class='caption'>Some interesting stuff</p></div>", "<div class='fuel lemonlime'><img src='http://www.sportbeans.com/assets/images/productImages/lime_package.png'><p class='caption'>Some interesting stuff</p></div>") : null

information.fruit === "fruit" ? fuelArray.push("<div class='fuel fruit'><img src='http://www.hydrationdepot.com/images/P/41vbXmHsYVL.jpg'><p class='caption'>Some interesting stuff</p></div>", "<div class='fuel fruit'><img src='http://www.gcbparts.com/assets/images/hawley/FOOD0911.jpg'><p class='caption'>Some interesting stuff</p></div>") : null

information.caramel === "caramel" ? fuelArray.push("<div class='fuel caramel'><img src='http://ecx.images-amazon.com/images/I/91w4%2BttyHyL._SY355_.jpg'><p class='caption'>Some interesting stuff</p></div>", "<div class='fuel caramel'><img src='http://www.swimcyclerun.com/user/products/large/Powerbar/ProteinPlus_55g_Caramel-Vanilla-Crisp.jpg'><p class='caption'>Some interesting stuff</p></div>") : null

information.nuts === "nuts" ? fuelArray.push("<div class='fuel nuts'><img src='http://cdn.campsaver.com/media/catalog/product/cache/1/image/900x900/9df78eab33525d08d6e5fb8d27136e95/m/n/mn_boneyard-1200_899_1200.jpg'><p class='caption'>Some interesting stuff</p></div>", "<div class='fuel nuts'><img src='http://www.snackwarehouse.com/common/images/products/main/snack-clif-bar-crunchy-peanut-butter.jpg'><p class='caption'>Some interesting stuff</p></div>") : null

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

shuffle(fuelArray);
var pickedFuel = fuelArray.splice(0,5);
var joinedFuel = pickedFuel.join("");


$(".titlerow").append("<h2>Good Fuel Choices for you:</h2>")
$(".foodrow").append(joinedFuel);

$(".fuel").on("mouseenter", function(){
  $(this).find('.caption').css({"visibility": "visible"});
})
$(".fuel").on("mouseleave", function(){
  $(this).find('.caption').css({"visibility": "hidden"});
})
$("text").on("mouseenter", function(){
  $(this).css({"opacity": "1"});
})
$("text").on("mouseleave", function(){
  $(this).css({"opacity": "0"});
})


  })
})
