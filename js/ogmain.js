$(function(){
  $( "#fuelForm" ).on("submit", function(){
    $("html, body").animate({ scrollTop: "620px" });
    $(".containing").css({"display": "flex"});
    $(".white").show();
    $(".top").show();
    $("button").css({"display": "inline"});
    event.preventDefault();

    var serialURL = $( this ).serialize().split("&");

    var information = {};
    for(var i = 0; i < serialURL.length; i++){
    var j = serialURL[i].split("=");
    information[j[0]] = j[1];
    }

    var forGraph = {};
    if ( information.weight > 0 && information.weight<=100 ) { forGraph.stored = 1400}
    if ( information.weight > 100 && information.weight<=120 ) { forGraph.stored = 1500}
    if ( information.weight > 120 && information.weight<=140 ) { forGraph.stored = 1600}
    if ( information.weight > 140 && information.weight<=160 ) { forGraph.stored = 1700}
    if ( information.weight > 160 && information.weight<=180 ) { forGraph.stored = 1800}
    if ( information.weight > 180 && information.weight<=200 ) { forGraph.stored = 1900}
    if ( information.weight > 200 ) { forGraph.stored = 2000}

    if ( information.gender === "f"){
    forGraph.swimburn = ((0.4472*information.hr)-(0.05741*information.weight)+(0.074*information.age)-20.4022)*30/4.184
    }
    if ( information.gender === "m"){
    forGraph.swimburn = ((0.6309*information.hr)-(0.09036*information.weight)+(0.2017*information.age)-55.0969)*30/4.184
    }
    if ( information.gender === "o"){
    forGraph.swimburn = ((0.6309*information.hr)-(0.09036*information.weight)+(0.2017*information.age)-55.0969)*30/4.184
    }

    forGraph.runburn = (0.75*information.weight)*information.runpace*0.5
    forGraph.bikeburn = information.weight*information.bikepace*0.256032*0.5
    forGraph.groundburn = (forGraph.bikeburn+forGraph.runburn)/2
    forGraph.totalburn = (forGraph.bikeburn+forGraph.runburn+forGraph.swimburn)/3
    forGraph.totaltime = Math.ceil(((information.swimpace/60)*2.4)+(112/information.bikepace)+(16/information.runpace))
    localStorage.storedData = JSON.stringify(forGraph);

    var usefulArray=[{"x_axis": 0, "y_axis": 0, "points": "", "stroke": "rgb(79, 47, 252)", "strokewidth": "2","fill": "none"},
    {"x_axis": 0, "y_axis": 0, "points": "", "stroke": "rgb(48, 177, 169)", "strokewidth": "2","fill": "none"}];

    var swimData = '';
    swimData = "0,"+(400-forGraph.stored*0.2).toString()+" "+((information.swimpace/60)*2.4*55.88).toString()+","+(400-(forGraph.stored*0.2)+(forGraph.swimburn*2.4*0.2)).toString()+" "+((information.swimpace/60)*2.4*55.88).toString()+","+(400-(forGraph.stored*0.2)+(forGraph.swimburn*2.4*0.2)-250*0.2).toString()

    usefulArray[0].points = swimData;
    var bikeData = ((information.swimpace/60)*2.4*55.88).toString()+","+(400-(forGraph.stored*0.2)+(forGraph.swimburn*2.4*0.2)-250*0.2).toString()+" ";

    var minusSwim = forGraph.totaltime - (information.swimpace/60)*2.4
    if(information.swimpace != 0){
    for (var i = 1; i <= minusSwim+1; i++) {
      if(i < minusSwim+1){
      bikeData +=  (((information.swimpace/60)*2.4*55.88)+i*55.88).toString()+","+(400-(forGraph.stored*0.2)+(forGraph.swimburn*2.4*0.2)-i*250*0.2+i*(forGraph.groundburn*0.2)).toString()+" "+(((information.swimpace/60)*2.4*55.88)+i*55.88).toString()+","+(400-(forGraph.stored*0.2)+(forGraph.swimburn*2.4*0.2)-(i+1)*250*0.2+i*(forGraph.groundburn*0.2)).toString()+" ";
        } else{
      bikeData +=  (((information.swimpace/60)*2.4*55.88)+i*55.88).toString()+","+(400-(forGraph.stored*0.2)+(forGraph.swimburn*2.4*0.2)-i*250*0.2+i*(forGraph.groundburn*0.2)).toString()
        }
      }
    }
    var fancyWidth = forGraph.totaltime*55.88;

    usefulArray[1].points = bikeData;

    var swimDataP = swimData.split(' ').join(',');
    var swimDataP = swimDataP.split(',')
    var bikeDataP = bikeData.split(' ').join(',');
    var bikeDataP = bikeDataP.split(',')

    var inputCircles = [
      {"x_axis": "0", "y_axis": (400-forGraph.stored*0.2).toString()},
      {"x_axis": swimDataP[2], "y_axis": swimDataP[3]},
      {"x_axis": swimDataP[4], "y_axis": swimDataP[5]},
      {"x_axis": swimDataP[6], "y_axis": swimDataP[7]},
    ]

    for (var i = 1; i < bikeDataP.length/2-1; i++) {
      inputCircles[i+2] = {"x_axis": bikeDataP[i*2], "y_axis": bikeDataP[i*2+1]}
    }

    d3Chart = {
      container: d3.select(".chart")
                  .append("svg")
                  .attr("width", fancyWidth)
                  .attr("height", 400)
                  .style("display", "inline")
                  .style("border", "1px solid rgb(68, 137, 217)"),
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
                            .attr("stroke", "#333")
                            .attr("stroke-width", function(d) { return d.strokewidth;})
                            .attr("fill", "none")
    }

    function circles (newCircles){
      var circlePoints = newCircles;
      var edge = Number(d3Chart.container.attr("width"));
      var fuel = d3Chart.container.selectAll("circle").data(circlePoints).enter().append("circle");
      var fuelAtts = fuel.attr("cx", function(d) { return d.x_axis;})
                            .attr("cy", function(d) { return d.y_axis;})
                            .attr("r", "10")
                            .attr("fill", "#ee596b")
      var showtotal = d3Chart.container.append("text")
                                      .attr("x", parseInt(edge-250))
                                      .attr("y", "30")
                                      .text("Your total time is "+forGraph.totaltime+"+ hours")
      }

    d3Chart.triChartFn(usefulArray);
    d3Chart.circlesFn(inputCircles);

    var chartHTML = '<h3 class="infostyle">What is this graph saying?</h3><ul><h5 class="title1">Carbohydrate Calories&nbsp;&nbsp;<i class="fa fa-angle-down fa-lg"></i></h5><li class="list1">First off, this graph is only showing immediately available carbohydrate calories, not calories stored as fat. Your body fuels endurance races from both sources, but you can continue to take in usable carbohydrates during a race, while you rely on existing fat sources.</li><h5 class="title2">Stored glycogen&nbsp;&nbsp;<i class="fa fa-angle-down fa-lg"></i></h5><li class="list2">You will start off with an amount of stored glycogen based on your weight. Your stored glycogen is '+forGraph.stored +' calories.</li><h5 class="title3">Burn rate&nbsp;&nbsp;<i class="fa fa-angle-down fa-lg"></i></h5><li class="list3">Each dip in the graph represent the carbohydrate calories you burn per hour, roughly half of your total calories burned. You burn '+Math.round(forGraph.swimburn*2)+' calories per hour while swimming, '+Math.round(forGraph.runburn*2)+' calories per hour while running and '+Math.round(forGraph.bikeburn*2)+' calories per hour while biking.</li><h5 class="title4">Fueling&nbsp;&nbsp;<i class="fa fa-angle-down fa-lg"></i></h5><li class="list4">For our model, we used a standard 250 cals/hr fueling plan, which is why the graph shows a flat increase every hour.</li><h5 class="title5">My line goes off the chart!&nbsp;&nbsp;<i class="fa fa-angle-down fa-lg"></i></h5><li class="list5">If your line dips below the bottom of the chart, this means your body would be relying on fat calories to finish the race since 250 cals per hour was not able to replace what you burned. Our advice is to up your calorie per hour intake (more than 250) if you see this happening in the graph.</li></ul>';

    $(".chartInfo").append(chartHTML)

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
    }

    shuffle(fuelArray);
    var pickedFuel = fuelArray.splice(0,5);
    var joinedFuel = pickedFuel.join("");
    var prevData = JSON.parse(localStorage.storedData);
    var burnrate = Math.round(prevData.totalburn*2);

    $(".top").append("<h5 class='little'>Hover over the data points to view your available calories</h5>")
    $(".titlerow").append("<h3 class='middle'>You burn roughly "+burnrate+" calories per hour! Refuel yourself with:</h3>")
    $(".foodrow").append(joinedFuel);

    $(".fuel").on("mouseenter", function(){
      $(this).find('.caption').css({"visibility": "visible"});
    })
    $(".fuel").on("mouseleave", function(){
      $(this).find('.caption').css({"visibility": "hidden"});
    })

    $("circle").on("mouseenter", function(){
      var circleX = "Hour "+Math.round(Number($(this).attr("cx"))/55.88);
      var circlyY = ": "+Math.round(2000-Number($(this).attr("cy"))*5)+" calories";
      var circlespot = circleX+circlyY;
      var edge = Number(d3Chart.container.attr("width"));
      console.log(circleX);
      console.log(circlyY);
      var box = d3Chart.container.append("rect")
      var boxAtts = box.attr("x", parseInt(edge-270))
                        .attr("y", "40")
                        .attr("fill", "rgb(68, 137, 217)")
                        .attr("width", "300px")
                        .attr("height", "50px")
      var cap = d3Chart.container.append("text");
      var capAtts = cap.attr("x", parseInt(edge-250))
                          .attr("y", "70")
                          .attr("class", "info")
                          .attr("fill", "white")
                          .text(circlespot);
    })

    $("circle").on("mouseleave", function(){
      $(".info").remove();
      $("rect").remove();

    })
  })

  $(".clear").on("click", function(){
    location.reload();
  })
  $(".fueladvice").on("click", function(){
    $("html, body").animate({ scrollTop: "1400px" });
  })
})
