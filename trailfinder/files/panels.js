jQuery(function(){
/*
  jQuery("#map-location").change(function(){
    if(jQuery(this).real_val() != ""){
     jQuery(".county-query").hide(); 
    }else{
     jQuery(".county-query").show(); 
    }
  });
*/

  jQuery(document).bind("map-initializing", function(ev, map){
    // Distance
    // ------------------------------------------------------------------------------
    if(jQuery("div.length input").length > 0){
      var length = window.length || false;


      var length_filter = new FilterControl(jQuery("div.length input"), map, function(marker){
        if(length == false || jQuery(marker).data("marker_data").post_type != "trail"){
          return true;
        }

        try {
          return parseFloat(jQuery(marker).data("marker_data").distance) < parseFloat(length);
        }catch(e){ 
          return false;
        }
      });

      var updateLength = function(length){
        if(!length){
          jQuery("div.length label").html("Length:")
        }else{
          jQuery("div.length label").html("Up to:")
        }

        jQuery("div.length input").val(length || "");
        jQuery("div.length span.value").html(length || "Any");

        if(length <= 0){
          jQuery("div.length span.unit").html("");
          length = false;
        }else if(length == 1){
          jQuery("div.length span.unit").html("mile");
        }else if(length > 1){
          jQuery("div.length span.unit").html("miles");
        }

        jQuery("div.length span.value").html(length || "Any");

        length_filter.apply_filter(true);
      }

      jQuery("div.length").bind("reset", function(){
        length = false;
        updateLength(length);  
      });

      jQuery("div.length a.up").click(function(){
        if(length == false){
          length = 0;
        }

        length += 1;

        updateLength(length);
        return false;
      });

      jQuery("div.length a.down").click(function(){
        length -= 1;

        updateLength(length);
        return false;
      });
    }
 
    // Acreage
    // ------------------------------------------------------------------------------

    if(jQuery("div.acres").length > 0){
      var acres = window.acres || false;

      var acres_filter = new FilterControl(jQuery("div.acres input"), map, function(marker){
        if(acres == false || jQuery(marker).data("marker_data").post_type != "park"){
          return true;
        }

        try {
          return parseInt(jQuery(marker).data("marker_data").acres[0]) < acres;
        }catch(e){ 
          return false;
        }
      });
       
      var updateAcres = function(acres){
        jQuery("div.acres span.value").html(acres || "Any");

        if(acres <= 0){
          jQuery("div.acres span.unit").html("");
          acres = false;
        }else if(acres == 1){
          jQuery("div.acres span.unit").html("acre");
        }else if(acres > 1){
          jQuery("div.acres span.unit").html("acres");
        }

        jQuery("div.acres span.value").html(acres || "Any");

        acres_filter.apply_filter(true);
      }

      jQuery("div.acres a.up").click(function(){
        if(acres == false){
          acres = 0;
        }

        acres += 250;

        if(acres > 10000){
          acres = 0;
        }

        updateAcres(acres);
        return false;
      });

      jQuery("div.acres a.down").click(function(){
        acres -= 250;

        updateAcres(acres);
        return false;
      });
    }

    // Difficulty
    // ------------------------------------------------------------------------------
    if(jQuery("div.difficulty input").length > 0){
      var difficulty = false;

      var difficulty_filter = new FilterControl(jQuery("div.difficulty input"), map, function(marker){
        if(difficulty == false || jQuery(marker).data("marker_data").post_type != "trail"){
          return true;
        }

        try {
          return jQuery(marker).data("marker_data").intensity[0] == difficulty;
        }catch(e){
          return false;
        }
      });

      var updateDifficulty = function(difficulty){
        jQuery("div.difficulty input").val(difficulty || "");
        jQuery("div.difficulty p").html(difficulty || "Any");
        difficulty_filter.apply_filter(true);
      }

      jQuery("div.difficulty").bind("reset", function(){
        updateDifficulty(false);
      });


      jQuery("div.difficulty a.up").click(function(){
        if(difficulty == false){
          difficulty = "Easy";
        }else if(difficulty == "Easy"){
          difficulty = "Moderate";
        }else if(difficulty == "Moderate"){
          difficulty = "Hard";
        }else if(difficulty == "Hard"){
          difficulty = false;
        }

        updateDifficulty(difficulty);
        return false;
      });

      jQuery("div.difficulty a.down").click(function(){
        if(difficulty == "Hard"){
          difficulty = "Moderate";
        }else if(difficulty == "Moderate"){
          difficulty = "Easy";
        }else if(difficulty == "Easy"){
          difficulty = false;
        }else if(difficulty == false){
          difficulty = "Hard";
        }

        updateDifficulty(difficulty);
        return false;
      });
    }

    // Toggler controls
    // ------------------------------------------------------------------------------
    jQuery("input.match").each(function(){
      new MatchFilterControl(jQuery(this), map);
    });

    window.include_filters = [];
    jQuery("input.include").each(function(){
      include_filters.push(new IncludeFilterControl(jQuery(this), map));
    });

    window.activation_filters = [];
    jQuery("input.activation").each(function(){
      activation_filters.push(new ActivationFilterControl(jQuery(this), map));
    });

    // Location geocoding
    // ------------------------------------------------------------------------------

    var distance = 50;

    window.find_location = function(){
      var deferred = jQuery.Deferred();

      if(!distance){
        deferred.resolve(false);
      }else{
        var geocoder = new google.maps.Geocoder();
        var address = jQuery("#map-location").val();

        if(address == jQuery("#map-location").attr("data-sample")){
          setTimeout(function(){ deferred.resolve(false) }, 10);

        }else{
          geocoder.geocode({ 
            address: address
          }, function(results, status){
            if(status == google.maps.GeocoderStatus.OK) {
              var location = results[0].geometry.location;

              deferred.resolve({
                latitude: location.lat(),
                longitude: location.lng(),
                within: distance,
                raw: results
              });
            }else{
              deferred.resolve(false);
            }
          });
        }
      }

      return deferred.promise();
    }

    jQuery("div.distance").bind("reset", function(){
      distance = 50;
      jQuery("div.distance span.value").html(distance);
      jQuery("div.distance span.unit").html("miles");
    });

    jQuery("div.distance a.up").click(function(){
      if(distance == false){
        distance = 50;
      }

      distance += 5;

      jQuery("div.distance span.value").html(distance);

      if(distance == 1){
        jQuery("div.distance span.unit").html("mile");
      }else if(distance > 1){
        jQuery("div.distance span.unit").html("miles");
      }

      return false;
    });

    jQuery("div.distance a.down").click(function(){
      if(distance == false){
          distance = 50;
      }

      distance -= 5;

      if(distance <= 5){
        distance = 5;
      }

      jQuery("div.distance span.value").html(distance);
      return false;
    });
  });
});
