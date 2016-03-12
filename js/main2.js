$(function(){
  var defaultdata = [
  [0,1800],[2.3,1200],[3.3,1450],[3.5,1125],[4.3,1375],[4.5,1050],[5.3,1300],[5.5,975],[6.3,1225],[6.5,900],[7.3,1150],[7.5,825],[8.3,1075],[8.5,750],[9.3,1000],[9.5,675],[10.3,925],[10.5,600],[11.3,850],[11.5,525]
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
                      r: 2
                    });
var lineplot = canvas.append("polyline")
                    .attr({
                      points: defaultline,
                      fill: "none",
                      stroke: "black"
                    });


  $(".fuelForm").on("submit", function(){
    $(".chartrow").show();
    $('html, body').animate({
        scrollTop: $("#mychart").offset().top
    }, 1000);
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
    if((information.stored+200*(information.totaltime-1))-information.totalcals >= 0){
      eat = 200
    }
    if((information.stored+200*(information.totaltime-1))-information.totalcals < 0 && (information.stored+250*(information.totaltime-1))-information.totalcals >= 0){
      eat = 250
    }
    if((information.stored+250*(information.totaltime-1))-information.totalcals < 0 && (information.stored+300*(information.totaltime-1))-information.totalcals >= 0){
      eat = 300
    }
    if((information.stored+300*(information.totaltime-1))-information.totalcals < 0 && (information.stored+350*(information.totaltime-1))-information.totalcals >= 0){
      eat = 350
    }
    if((information.stored+350*(information.totaltime-1))-information.totalcals < 0 && (information.stored+400*(information.totaltime-1))-information.totalcals >= 0){
      eat = 400
    }

    var circlePoints = [];
    circlePoints[0]=[0,information.stored];
    circlePoints[1]=[(2.4*(information.swimpace/60)),(information.stored-information.swimburn*2.4*(information.swimpace/60))];
    circlePoints[2]=[(2.4*(information.swimpace/60))+0.2, circlePoints[1][1]+eat];

    for (var i = 1; i <= information.runbiketime+1; i++) {
      circlePoints[(i)*2+1] = [(2.4*(information.swimpace/60)+(i)*1), (circlePoints[1][1]-(i)*information.runbikeburn+(i)*eat) ]
      circlePoints[(i)*2+2] = [(2.4*(information.swimpace/60)+(i)*1+0.2), (circlePoints[1][1]-(i)*information.runbikeburn+(i+1)*eat)]
    }

    var neww = $(window).width()*0.75,
        newh = w/2,
        newpadding = 40,
        newxScale = d3.scale.linear()
                          .domain([0, d3.max(circlePoints, function(d){return d[0];})])
                          .range([0, neww-newpadding]),
        newyScale = d3.scale.linear()
                          .domain([0, d3.max(circlePoints, function(d){return d[1];})])
                          .range([newh-newpadding, 0]),
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

        for (var i = 0; i < circlePoints.length; i++) {
          insidearray = [0,0];
          insidearray[0] = newxScale(circlePoints[i][0])+newpadding;
          insidearray[1] = newyScale(circlePoints[i][1]);
          linePoints.push(insidearray);
          }
        for (var i = 0; i < linePoints.length; i++) {
          linePoints[i] = linePoints[i].join(",")
        }
        linePoints = linePoints.join(" ");

    canvas.transition()
          .delay(1000)
          .duration(2000)
          .ease("linear")
          .attr({
            height: newh+"px",
            width: neww+"px"
          });
    d3.selectAll("circle")
          .remove();
    canvas.selectAll("circle")
          .data(circlePoints)
          .enter()
          .append("circle")
          .transition()
          .delay(3500)
          .duration(2000)
          .ease("linear")
          .attr({
            cx: function(d){return newxScale(d[0])+newpadding;},
            cy: function(d){return newyScale(d[1]);},
            r: 5
          });

    canvas.selectAll("polyline")
          .transition()
          .delay(1500)
          .duration(2000)
          .ease("linear")
          .attr({
            points: linePoints,
          });
    xaxis.transition()
          .delay(1000)
          .duration(2000)
          .ease("linear")
          .attr("transform", "translate("+newpadding+","+(newh-newpadding)+")")
          .call(newxAxis);
    yaxis.transition()
          .delay(1000)
          .duration(2000)
          .ease("linear")
          .attr("transform", "translate("+newpadding+",0)")
          .call(newyAxis);

    var chartHTML = '<section class="formrow"><div class="colL"><h3 class="infostyle">My Numbers</h3><ul><h5>Total time</h5><li class="here">Your Ironman will take <strong>'+Math.round(information.totaltime)+'+</strong> hours (not inlcuding transitions).</li><h5>Burn rates</h5><li class="here">You burn <strong>'+Math.round(information.swimburn*2)+'</strong> calories per hour while swimming,  <strong>'+Math.round(information.bikeburn*2)+'</strong> calories per hour while biking, and <strong>'+Math.round(information.runburn*2)+'</strong> calories per hour while running.</li><h5>Optimal Calorie Intake</h5><li class="here">Based on your caloric burn rates and the total time of your Ironman, your ideal calorie intake is <strong>'+eat+'</strong> calories per hour. This is the rate at which you should fuel to avoid bonking during the race and relying completely on fat calories.</li></ul></div><div class="colR"><h3 class="infostyle">What is this graph saying?</h3><ul><h5 class="title1">Carbohydrate Calories&nbsp;&nbsp;<i class="fa fa-angle-down fa-lg"></i></h5><li class="list1">First off, this graph is only showing immediately available carbohydrate calories, not calories stored as fat. Your body fuels endurance races from both sources, but you can continue to take in usable carbohydrates during a race, while you rely on existing fat sources.</li><h5 class="title2">Stored glycogen&nbsp;&nbsp;<i class="fa fa-angle-down fa-lg"></i></h5><li class="list2">You will start off with an amount of stored glycogen based on your weight. Your stored glycogen is '+information.stored +' calories.</li><h5 class="title3">Burn rate&nbsp;&nbsp;<i class="fa fa-angle-down fa-lg"></i></h5><li class="list3">Each dip in the graph represent the carbohydrate calories you burn per hour, roughly half of your total calories burned. You burn '+Math.round(information.swimburn*2)+' calories per hour while swimming, '+Math.round(information.runburn*2)+' calories per hour while running and '+Math.round(information.bikeburn*2)+' calories per hour while biking.</li><h5 class="title4">Fueling&nbsp;&nbsp;<i class="fa fa-angle-down fa-lg"></i></h5><li class="list4">Each increase in the graph is from eating during the race. Our model seeks to find your optimal calorie intake based on eating just enough to make sure you do not run out of carbohydrate calories by the end of the race. This graph is showing your optimal calorie intake, '+eat+' calories per hour</li></ul></div></section>';

    $(".chartInfo").append(chartHTML);

    function closeOpen(){
      $(".list1").css({"display": "none"});
      $(".list2").css({"display": "none"});
      $(".list3").css({"display": "none"});
      $(".list4").css({"display": "none"});
      $(".list5").css({"display": "none"});
    }

    $( ".title1" ).on('click', function(){
      closeOpen();
      $(".list1").slideToggle( "slow")
    });
    $( ".title2" ).on('click', function(){
      closeOpen();
      $(".list2").slideToggle( "slow")
    });
    $( ".title3" ).on('click', function(){
      closeOpen();
      $(".list3").slideToggle( "slow")
    });
    $( ".title4" ).on('click', function(){
      closeOpen();
      $(".list4").slideToggle( "slow")
    });
    $( ".title5" ).on('click', function(){
      closeOpen();
      $(".list5").slideToggle( "slow")
    });

    var fuelArray = [];
    information.chocolate === "chocolate" ? fuelArray.push("<div class='fuel chocolate'><a target='_blank' href='http://www.honeystinger.com/index.php/organic-stinger-waffles/chocolate-organic-stinger-waffle.html'><img src='http://ecx.images-amazon.com/images/I/61pS2DKL8wL._SY355_.jpg'></a><p class='caption'>160 calories<br>Organic<br>Energy from Honey</p></div>", "<div class='fuel chocolate'><a target='_blank' href='http://www.clifbar.com/products/clif-bar/clifbar/chocolate-chip'><img src='http://www.tennisexpress.com/prodimages/35095-DEFAULT-l.jpg'></a><p class='caption'>250 calories<br>10g protein<br>Organic oats</p></div>" ) : null

    information.berry === "berry" ? fuelArray.push("<div class='fuel berry'><a target='_blank' href='http://www.clifbar.com/products/Athlete-Series/shot-bloks'><img src='http://ep.yimg.com/ay/trisports/clif-shot-bloks-44.jpg'></a><p class='caption'>200 calories<br>95% organic<br>50mg caffeine</p></div>", "<div class='fuel berry'><a target='_blank' href='http://www.niagaracycle.com/categories/osmo-nutrition-active-hydration-for-men-blackberry?gclid=CPaW2s62p8sCFQiqaQodUWQDxQ'><img src='https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRF2j2q-Mj2-olW3e6ognHTsZo59-YCe9zOq5XZc0ZNwdNPcn-m-g'></a><p class='caption'>35 calories per 8 oz.<br>160 mg sodium<br>Maximize fluid absorption</p></div>") : null

    information.citrus === "citrus" ? fuelArray.push("<div class='fuel citrus'><a target='_blank' href='http://www.honeystinger.com/orange-blossom.html'><img src='http://images.mec.ca/fluid/customers/c822/5036-528/generated/5036-528_NOC02_view1_1000x1000.jpg'></a><p class='caption'>160 calories<br>Organic<br>Energy from Honey</p></div>", "<div class='fuel citrus'><a target='_blank' href='https://guenergy.com/shop/energy-gel'><img src='http://www.bhphotovideo.com/images/images1000x1000/gu_energy_labs_gu_123043_gu_energy_gel_24_pack_1174362.jpg'></a><p class='caption'>100 calories<br>55mg sodium<br>20mg caffeine</p></div>") : null

    information.coffee === "coffee" ? fuelArray.push("<div class='fuel coffee'><a target='_blank' href='https://guenergy.com/shop/energy-gel'><img src='http://www.bhphotovideo.com/images/images1000x1000/gu_energy_labs_gu_123050_gu_energy_gel_24_pack_1174367.jpg'></a><p class='caption'>100 calories<br>60mg sodium<br>40mg caffeine</p></div>", "<div class='fuel coffee'><a target='_blank' href='https://pickybars.com/product/smooth-caffeinator-10-pack/'><img src='https://thefeed.com/assets/Smooth-Caffeinator-400x400.jpg'></a><p class='caption'>200 calories<br>7g protein<br>Energy from dates</p></div>") : null

    information.lemonlime === "lemon" ? fuelArray.push("<div class='fuel lemonlime'><a target='_blank' href='http://www.skratchlabs.com/products/exercise-hydration-mix?variant=864288073'><img src='http://cdn.shopify.com/s/files/1/0121/9362/products/XLLB1000_silver_web.jpg?v=1444841410'></a><p class='caption'>80 calories per 16oz.<br>360mg sodium<br>Only real fruit flavor</p></div>", "<div class='fuel lemonlime'><a target='_blank' href='http://www.sportbeans.com/products/lemon_lime_sport_beans.aspx'><img src='http://www.sportbeans.com/assets/images/productImages/lime_package.png'></a><p class='caption'>100 calories<br>Vitamins C and B<br>Natural flavors</p></div>") : null

    information.fruit === "fruit" ? fuelArray.push("<div class='fuel fruit'><a target='_blank' href='http://www.gatorade.com/products/g-series/energy-chews'><img src='http://scene7.targetimg1.com/is/image/Target/14652295?wid=480&hei=480'></a><p class='caption'>100 calories<br>24g carbohydrates<br>20% vitamin B6</p></div>", "<div class='fuel fruit'><a target='_blank' href='https://nuun.com/shop/nuun-active/'><img src='http://www.gcbparts.com/assets/images/hawley/FOOD0911.jpg'></a><p class='caption'>10 calories<br>Stay hydrated<br>Not for fueling</p></div>") : null

    information.caramel === "caramel" ? fuelArray.push("<div class='fuel caramel'><a target='_blank' href='http://www.honeystinger.com/index.php/organic-stinger-waffles/organic-caramel-waffle.html'><img src='http://ecx.images-amazon.com/images/I/91w4%2BttyHyL._SY355_.jpg'></a><p class='caption'>160 calories<br>95% organic<br>Energy from honey</p></div>", "<div class='fuel caramel'><a target='_blank' href='https://www.powerbar.eu/en/products/protein-plus-30-vanilla-caramel-crisp'><img src='http://www.swimcyclerun.com/user/products/large/Powerbar/ProteinPlus_55g_Caramel-Vanilla-Crisp.jpg'></a><p class='caption'>190 calories<br>17.3g protein<br>Protein from casein, whey, and soy</p></div>") : null

    information.nuts === "nuts" ? fuelArray.push("<div class='fuel nuts'><a target='_blank' href='https://pickybars.com/product/laurens-mega-nuts-10-pack/'><img src='http://cdn.campsaver.com/media/catalog/product/cache/1/image/900x900/9df78eab33525d08d6e5fb8d27136e95/m/n/mn_boneyard-1200_899_1200.jpg'></a><p class='caption'>200 calories<br>Gluten and GMO free<br>Energy from dates</p></div>", "<div class='fuel nuts'><a target='_blank' href='http://www.clifbar.com/products/clif-bar/clifbar/crunchy-peanut-butter'><img src='http://www.snackwarehouse.com/common/images/products/main/snack-clif-bar-crunchy-peanut-butter.jpg'></a><p class='caption'>260 calories<br>11g protein<br>Organic oats</p></div>") : null

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    };

    shuffle(fuelArray);
    var pickedFuel = fuelArray.splice(0,5);
    var joinedFuel = pickedFuel.join("");
    var prevData = JSON.parse(localStorage.storedData);
    var burnrate = Math.round(prevData.totalburn*2);

    $(".fueltitle").append("<h3 class='middle'>You burn roughly "+burnrate+" calories per hour! Refuel yourself with:</h3>")
    $(".fuelrow").append(joinedFuel);

    $(".fuel").on("mouseenter", function(){
      $(this).find('.caption').css({"visibility": "visible"});
    })
    $(".fuel").on("mouseleave", function(){
      $(this).find('.caption').css({"visibility": "hidden"});
    })
  })

  $(".meaning").on("click", function(){
    $('html, body').animate({
        scrollTop: $("#explain").offset().top
    }, 1000);
  })

  $(".fueladvice").on("click", function(){
    $('html, body').animate({
        scrollTop: $("#fuellist").offset().top
    }, 1000);
  })

  $(".clear").on("click", function(){
    location.reload();
  })

})
