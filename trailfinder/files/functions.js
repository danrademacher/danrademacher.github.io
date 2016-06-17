(function($){
  $.fn.real_val = function(){
    if(this.val() == this.attr("data-sample")){
      return "";
    }else{
      return this.val();
    }
  }

  $(function(){
    $("*[data-sample]").each(function(){
      if($(this).val() == ""){
        $(this).val($(this).attr("data-sample"));
        $(this).addClass("sample");
      }
    }).focus(function(){
      if($(this).val() == $(this).attr("data-sample")){
        $(this).removeClass("sample");
        $(this).val("");
      }
    }).change(function(){
      $(this).removeClass("sample");
    }).blur(function(){
      if($(this).val() == $(this).attr("data-sample")){
        $(this).addClass("sample");
      }else if($(this).val() == ""){
        $(this).val($(this).attr('data-sample'));
        $(this).addClass("sample");
      }
    });
  });
})(jQuery);

function pagingCenter(){
	var container = '.paging';
	var trueWidth = parseInt(jQuery('.size-view', container).width() / 2);

	jQuery('.size-view', container).attr('style', 'margin-left: -' + trueWidth + 'px;');
}
        jQuery(function() {
	pagingCenter();

	jQuery('.top-navigation a').click(function(){
		var trueValue = jQuery(this).index('.top-navigation a');
		
		jQuery(this).parents('.top-navigation').find('a').removeClass('active');
		jQuery(this).addClass('active');

		jQuery(this).parents('.box-simple-navigation').find('.item').removeClass('active');
		jQuery(jQuery(this).parents('.box-simple-navigation').find('.item')[trueValue]).addClass('active');

		return false;
	});

	jQuery('.navigation-view a').click(function(){
		var trueValue = jQuery(this).index('.navigation-view a');
		
		jQuery(this).parents('.navigation-view').find('a').removeClass('active');
		jQuery(this).addClass('active');

		jQuery(this).parents('.box-navigation').find('.item').removeClass('active');
		jQuery(jQuery(this).parents('.box-navigation').find('.item')[trueValue]).addClass('active');

		jQuery('.large-navigation-box').find('.item').removeClass('active');
		jQuery(jQuery('.large-navigation-box').find('.item')[trueValue]).addClass('active');

		return false;
	});

        if(jQuery.fn.jCheckboxes){
          jQuery('input[type="checkbox"]').jCheckboxes();
        }

        if(jQuery.fn.c2Selectbox){
          jQuery('.field-select').c2Selectbox();
        }
});

(function($){
  $.fn.shorten = function(settings) {
    var config = {
      showChars : 100,
      ellipsesText : "...",
      moreText : "more",
      lessText : "less"
    };

    if(this.attr("data-truncate")){
      settings = settings || {};
      settings.showCards = this.attr("data-truncate");
    }

    if (settings) {
      $.extend(config, settings);
    }

    $('.morelink').live('click', function() {
      var $this = $(this);
      if ($this.hasClass('less')) {
        $this.removeClass('less');
        $this.html(config.moreText);
      } else {
        $this.addClass('less');
        $this.html(config.lessText);
      }
      $this.parent().prev().toggle();
      $this.prev().toggle();
      return false;
    });

    return this.each(function() {
      var $this = $(this);

      var content = $this.html();
      if (content.length > config.showChars) {
        var c = content.substr(0, config.showChars);
        var h = content.substr(config.showChars , content.length - config.showChars);
        var html = c + '<span class="moreellipses">' + config.ellipsesText + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="javascript://nop/" class="morelink">' + config.moreText + '</a></span>';
        $this.html(html);
        $(".morecontent span").hide();
      }
    });
  };

  $(function(){
    $("*[data-truncate]").shorten();
  });
  
})(jQuery);

