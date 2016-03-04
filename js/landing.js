$(function(){
  $(".here").on("click", function(){
    $("html, body").animate({ scrollTop: "550px" });
  })
  $(".why").on("click", function(){
    $("html, body").animate({ scrollTop: "1200px" });
  })
  $(".start").on("click", function(){
    window.location.href = "http://madelinepick.github.io/fuelmapper.github.io/app.html";
  })
})
