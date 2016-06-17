(function($) {
    var viewportWidth = $(window).width();
    if (viewportWidth < 481){
        //alert(viewportWidth);
        $('.home-page #header').css({
            "background-position":"0 43px"
            });   
        $('.home-page #header #logo a img').attr("src","/wp-content/uploads/2012/05/BNLogo_nomotto_rust_960.png");
        }
})(jQuery);