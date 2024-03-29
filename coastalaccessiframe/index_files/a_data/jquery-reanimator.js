/*
 * Reanimator - animate a series of images as someone scrolls past
 * Greg Allensworth, GreenInfo Network gin@greeninfo.org
 */
;( function($, window, document) {
    "use strict";

    var pluginName = "reanimator";
    var defaults = {
        "debug": false,
        "above": 0,
        "below": 0,
        "scroll": true,
        "click": false,
        "mouse": false
    };

    function Plugin (element, options) {
        this.element   = element;
        this.options   = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name     = pluginName;
        this.init();
    }

    $.extend( Plugin.prototype, {
        init: function() {
            var $element = $(this.element);
            var options = this.options;

            // options: load from the data-reanimator-XXX attributes
            if ($element.attr('data-reanimator-above'))  options.above  = parseInt( $element.attr('data-reanimator-above') );
            if ($element.attr('data-reanimator-below'))  options.below  = parseInt( $element.attr('data-reanimator-below') );
            if ($element.attr('data-reanimator-debug'))  options.debug  = $element.attr('data-reanimator-debug')  == "true";
            if ($element.attr('data-reanimator-scroll')) options.scroll = $element.attr('data-reanimator-scroll') == "true";
            if ($element.attr('data-reanimator-mouse'))  options.mouse  = $element.attr('data-reanimator-mouse')  == "true";
            if ($element.attr('data-reanimator-click'))  options.click  = $element.attr('data-reanimator-click')  == "true";

            // add CSS class; this will add inline-block so the DIVs only take the space they need
            $element.addClass('jquery-reanimator-div');

            // hide all frames except the first frame, and keep a reference to the image list since we use it later
            var $images = $element.find('img');
            $images.not(':eq(0)').hide();

            // if we're debugging, and the above or below are non-zero, then draw the hitboxes on screen
            if (options.debug && (options.above || options.below)) {
                var left   = $element.offset().left;
                var top    = $element.offset().top - options.above;
                var height = $element.height() + options.above + options.below;
                var width  = $element.width();
                $('<div></div>').addClass('jquery-reanimator-debug-hitbox').height(height).width(width).appendTo('body').offset({ left:left, top:top });
            }

            // if we're debugging, draw the centerline on the screen
            if (options.debug) {
                $('<div></div>').addClass('jquery-reanimator-debug-midline').appendTo('body');
            }

            // add scrolling listener relative to our parent
            if (options.scroll) {
                $(window).scroll(function () {
                    var midline    = ( $(window).scrollTop() + 0.5 * $(window).height());
                    var mytop      = $element.offset().top - options.above;
                    var mybottom   = $element.offset().top + $element.height() + options.below;
                    var touches    = midline >= mytop && midline <= mybottom;
                    if (options.debug) console.log({ 'midline': midline, 'mytop': mytop, 'mybottom': mybottom, 'touches': touches });

                    // if it's not touching the midline then there's nothing to do
                    if (! touches) return;

                    // hide images except for the one corresponding to out current position
                    var percentage = (midline - mytop) / (mybottom - mytop);
                    if      (percentage <   0) percentage =   0;
                    else if (percentage > 100) percentage = 100;
                    var index = Math.round(percentage * ($images.length - 1 ));
                    if (options.debug) console.log({ 'scrollpercent': percentage, 'imageindex': index });
                    $images.hide().eq(index).show();
                });
            }

            // add a mousemove handler so one can scroll the animation manually with their mouse
            if (options.mouse) {
                $element.mousemove(function () {
                    var $current = $images.filter(':visible');
                    var $next    = $current.next();
                    if (! $next.length) $next = $images.first(); // last one = go to first
                    $images.hide();
                    $next.show();
                });
            }

            // add a click handler so one can click to cycle through the animation
            // this one actually cycles; if they click on the last frame, back to start
            if (options.click) {
                $element.click(function () {
                    var $current = $images.filter(':visible');
                    var $next    = $current.next();
                    if (! $next.length) $next = $images.first(); // last one = go to first
                    $images.hide();
                    $next.show();
                });
            }
        }
    } );

    // A really lightweight plugin wrapper around the constructor, preventing against multiple instantiations
    $.fn[ pluginName ] = function(options) {
        return this.each( function() {
            if ( !$.data(this, "plugin_" + pluginName) ) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options) );
            }
        } );
    };
} )( jQuery, window, document );
