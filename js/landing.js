$(function(){
  $(".home").on("click", function(){
    $(".rightside1").show();
    $(".rightside2").hide();
  })
  $(".explore").on("click", function(){
    $(".rightside1").hide();
    $(".rightside2").show();
  })
  $(".start").on("click", function(){
    window.location.href = "http://madelinepick.github.io/fuelmapper.github.io/app.html";
  })
})
