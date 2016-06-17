(function($){
  window.tnt_directions = function(){
    var coordinates = $(this).coordinates();
  
    if(!coordinates){
      return;
    }

    var a = jQuery("<a></a>").
      attr("href", "http://embed.transitandtrails.org/embed/plan/location?arrive=true&lat=" + coordinates.latitude + "&lng=" + coordinates.longitude).
      attr("class", "fancybox iframe {width:380,height:540}");

    a.fancybox({ 
      hideOnContentClick:false,
      hideOnOverlayClick:false,
      autoScale:false
    }).trigger("click");

    return false;
  }

  $.fn.coordinates = function(){
    var latitude = $(this).attr("data-latitude");
    var longitude = $(this).attr("data-longitude");
   
    if(latitude && longitude){
      return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    }else{
      return false;
    }
  }

  $(function(){
    $("body").on("click", ".tnt-directions", function(){
      return tnt_directions.bind(this)();
    });
  });
})(jQuery);
