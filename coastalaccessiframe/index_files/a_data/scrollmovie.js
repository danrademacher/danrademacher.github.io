/*
 * scrollmovie.js
 * custom-crafted scrolling-movie thing
 * Greg Allensworth, GreenInfo Network gin@greeninfo.org
 */
;( function($, window, document) {
    "use strict";

    var pluginName = "scrollmovie";
    var defaults = {
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

            // add our utility classes
            $element.addClass('scrollmovie');
            var $imageframe = $element.children('div').first().addClass('scrollmovie-slides');

            // show only the first image for now
            var $images = $imageframe.children('img');
            $images.hide().first().show();

            // make sure the image animation frame, never exceeds our own width
            // this works around some problems of a fixed-position @ 100% image, being 100% of the width of the window instead of its container
            function resizeSections() {    
                var width = $element.width();
                $imageframe.css({ 'max-width':width+'px' });
            }
            $(window).resize(resizeSections);
            resizeSections();

            // scrolling behavior to animate the animation, or if we've exceeded the range, to hide it
            var $sections = $element.find('section');
            $(window).scroll(function () {
                var centerline = $(window).scrollTop() + 0.5 * $(window).height();

                var story_height = $element.height();
                var story_top    = $element.offset().top;
                var story_bottom = story_top + story_height;

                if (centerline >= story_top && centerline <= story_bottom) {
                    // in focus; force sections to full-screen height, show/hide the appropriate animation for our progress
                    var percentage = 1 - ((story_bottom - centerline) / story_height);
                    var imageframe = Math.round( ($images.length - 1) * percentage);
                    $element.addClass('scrollmovie-focused');
                    $images.hide().eq(imageframe).show();

                    var height = $(window).height() * 1;
                    $sections.not(':last').height(height);
                }
                else {
                    // out of focus; back to first image, let sections not force full-screen height
                    $element.removeClass('scrollmovie-focused');
                    $images.hide().first().show();
                    $sections.height(height);
                }
            });
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
