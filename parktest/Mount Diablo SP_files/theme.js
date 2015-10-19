/*
Name: 			Core Initializer
Written by: 	Crivos - (http://www.crivos.com)
Version: 		2.0
*/

(function () {

    "use strict";

    var Core = {

        initialized: false,

        initialize: function () {

            if (this.initialized) return;
            this.initialized = true;

            this.build();
            this.events();

        },

        build: function () {

            // Adds browser version on html class.
            $.browserSelector();

            // Adds window smooth scroll on chrome.
            if ($("html").hasClass("chrome")) {
                $.smoothScroll();
            }

            // Scroll to Top Button.
            $.scrollToTop();

            // Animations
            this.animations();

            // Word Rotate
            this.wordRotate();

            // Featured Boxes
            this.featuredBoxes();

            // Flexslider
            this.flexSlider();

            // Tooltips
            $("a[rel=tooltip]").tooltip();

            // Sort
            this.sort();

            // Toggle
            this.toggle();

            // Twitter
            this.latestTweets();

            // Flickr Feed
            this.flickrFeed();

            // Lightbox
            this.lightbox();

            // Parallax
            this.parallax();

        },

        events: function () {

            // Window Resize
            $(window).on("resize", function () {
                var timer = window.setTimeout(function () {
                    window.clearTimeout(timer);

                    // Flexslider
                    Core.flexSlider();

                    // Featured Boxes
                    Core.featuredBoxes();

                }, 50);
            });

            // Anchors Position
            $("a[data-hash]").on("click", function (e) {

                e.preventDefault();
                var header = $("body header:first"),
					headerHeight = header.height(),
					target = $(this).attr("href"),
					$this = $(this);

                if ($(window).width() > 991) {
                    $("html,body").animate({ scrollTop: $(target).offset().top - (headerHeight + 50) }, 600, "easeOutQuad");
                } else {
                    $("html,body").animate({ scrollTop: $(target).offset().top - 30 }, 600, "easeOutQuad");
                }

                return false;

            });

        },

        animations: function () {

            // Animation Appear
            $("[data-appear-animation]").each(function () {

                var $this = $(this);

                $this.addClass("appear-animation");

                if (!$("html").hasClass("no-csstransitions") && $(window).width() > 767) {

                    $this.appear(function () {

                        var delay = ($this.attr("data-appear-animation-delay") ? $this.attr("data-appear-animation-delay") : 1);

                        if (delay > 1) $this.css("animation-delay", delay + "ms");
                        $this.addClass($this.attr("data-appear-animation"));

                        setTimeout(function () {
                            $this.addClass("appear-animation-visible");
                        }, delay);

                    }, { accX: 0, accY: -150 });

                } else {

                    $this.addClass("appear-animation-visible");

                }

            });

            // Animation Progress Bars
            $("[data-appear-progress-animation]").each(function () {

                var $this = $(this);

                $this.appear(function () {

                    var delay = ($this.attr("data-appear-animation-delay") ? $this.attr("data-appear-animation-delay") : 1);

                    if (delay > 1) $this.css("animation-delay", delay + "ms");
                    $this.addClass($this.attr("data-appear-animation"));

                    setTimeout(function () {

                        $this.animate({
                            width: $this.attr("data-appear-progress-animation")
                        }, 1500, "easeOutQuad", function () {
                            $this.find(".progress-bar-tooltip").animate({
                                opacity: 1
                            }, 500, "easeOutQuad");
                        });

                    }, delay);

                }, { accX: 0, accY: -50 });

            });

            // Count To
            $(".counters [data-to]").each(function () {

                var $this = $(this);

                $this.appear(function () {

                    $this.countTo({});

                }, { accX: 0, accY: -150 });

            });

            /* Circular Bars - Knob */
            if (typeof ($.fn.knob) != "undefined") {
                $(".knob").knob({});
            }

        },

        wordRotate: function () {

            $(".word-rotate").each(function () {

                var $this = $(this),
					itemsWrapper = $(this).find(".word-rotate-items"),
					items = itemsWrapper.find("> span"),
					firstItem = items.eq(0),
					firstItemClone = firstItem.clone(),
					maxWidth = 0,
					itemHeight = 0,
					currentItem = 1,
					currentTop = 0;

                items.each(function () {
                    if ($(this).width() > maxWidth) {
                        maxWidth = $(this).width();
                    }
                });

                itemHeight = firstItem.height();

                itemsWrapper.append(firstItemClone);

                $this
					.width(maxWidth)
					.height(itemHeight)
					.addClass("active");

                setInterval(function () {

                    currentTop = (currentItem * itemHeight);

                    itemsWrapper.animate({
                        top: -(currentTop) + "px"
                    }, 300, "easeOutQuad", function () {

                        currentItem++;

                        if (currentItem > items.length) {

                            itemsWrapper.css("top", 0);
                            currentItem = 1;

                        }

                    });

                }, 2000);

            });

        },

        featuredBoxes: function () {

            $("div.featured-box").css("height", "auto");

            $("div.featured-boxes").each(function () {

                var wrapper = $(this);
                var minBoxHeight = 0;

                $("div.featured-box", wrapper).each(function () {
                    if ($(this).height() > minBoxHeight)
                        minBoxHeight = $(this).height();
                });

                $("div.featured-box", wrapper).height(minBoxHeight);

            });

        },

        flexSlider: function (options) {

            $("div.flexslider").each(function () {

                var slider = $(this);

                var defaults = {
                    animationLoop: false,
                    controlNav: true,
                    directionNav: true
                }

                var config = $.extend({}, defaults, options, slider.data("plugin-options"));

                // Initialize Slider
                slider.flexslider(config).addClass("flexslider-init");

                if (config.controlNav)
                    slider.addClass("flexslider-control-nav");

                if (config.directionNav)
                    slider.addClass("flexslider-direction-nav");

            });

        },

        sort: function () {

            $("ul.sort-source").each(function () {

                var source = $(this);
                var destination = $("ul.sort-destination[data-sort-id=" + $(this).attr("data-sort-id") + "]");

                if (destination.get(0)) {

                    var minParagraphHeight = 0;
                    var paragraphs = $("span.thumb-info-caption p", destination);

                    paragraphs.each(function () {
                        if ($(this).height() > minParagraphHeight)
                            minParagraphHeight = ($(this).height() + 10);
                    });

                    paragraphs.height(minParagraphHeight);

                    $(window).load(function () {

                        destination.isotope({
                            itemSelector: "li",
                            layoutMode: 'sloppyMasonry'
                        });

                        source.find("a").click(function (e) {

                            e.preventDefault();

                            var $this = $(this),
								filter = $this.parent().attr("data-option-value");

                            source.find("li.active").removeClass("active");
                            $this.parent().addClass("active");

                            destination.isotope({
                                filter: filter
                            });

                            self.location = "#" + filter.replace(".", "");

                            return false;

                        });

                        $(window).bind("hashchange", function (e) {

                            var hashFilter = "." + location.hash.replace("#", ""),
								hash = (hashFilter == "." || hashFilter == ".*" ? "*" : hashFilter);

                            source.find("li.active").removeClass("active");
                            source.find("li[data-option-value='" + hash + "']").addClass("active");

                            destination.isotope({
                                filter: hash
                            });

                        });

                        var hashFilter = "." + (location.hash.replace("#", "") || "*");

                        var initFilterEl = source.find("li[data-option-value='" + hashFilter + "'] a");

                        if (initFilterEl.get(0)) {
                            source.find("li[data-option-value='" + hashFilter + "'] a").click();
                        } else {
                            source.find("li:first-child a").click();
                        }

                    });

                }

            });

        },

        toggle: function () {

            var $this = this,
				previewParClosedHeight = 25;

            $("section.toggle > label").prepend($("<i />").addClass("icon icon-plus"));
            $("section.toggle > label").prepend($("<i />").addClass("icon icon-minus"));
            $("section.toggle.active > p").addClass("preview-active");
            $("section.toggle.active > div.toggle-content").slideDown(350, function () { });

            $("section.toggle > label").click(function (e) {

                var parentSection = $(this).parent(),
					parentWrapper = $(this).parents("div.toogle"),
					previewPar = false,
					isAccordion = parentWrapper.hasClass("toogle-accordion");

                if (isAccordion && typeof (e.originalEvent) != "undefined") {
                    parentWrapper.find("section.toggle.active > label").trigger("click");
                }

                parentSection.toggleClass("active");

                // Preview Paragraph
                if (parentSection.find("> p").get(0)) {

                    previewPar = parentSection.find("> p");
                    var previewParCurrentHeight = previewPar.css("height");
                    previewPar.css("height", "auto");
                    var previewParAnimateHeight = previewPar.css("height");
                    previewPar.css("height", previewParCurrentHeight);

                }

                // Content
                var toggleContent = parentSection.find("> div.toggle-content");

                if (parentSection.hasClass("active")) {

                    $(previewPar).animate({
                        height: previewParAnimateHeight
                    }, 350, function () {
                        $(this).addClass("preview-active");
                    });

                    toggleContent.slideDown(350, function () { });

                } else {

                    $(previewPar).animate({
                        height: previewParClosedHeight
                    }, 350, function () {
                        $(this).removeClass("preview-active");
                    });

                    toggleContent.slideUp(350, function () { });

                }

            });

        },

        lightbox: function (options) {

            if (typeof ($.magnificPopup) == "undefined") {
                return false;
            }

            // Internationalization of Lightbox
            $.extend(true, $.magnificPopup.defaults, {
                tClose: 'Close (Esc)', // Alt text on close button
                tLoading: 'Loading...', // Text that is displayed during loading. Can contain %curr% and %total% keys
                gallery: {
                    tPrev: 'Previous (Left arrow key)', // Alt text on left arrow
                    tNext: 'Next (Right arrow key)', // Alt text on right arrow
                    tCounter: '%curr% of %total%' // Markup for "1 of 7" counter
                },
                image: {
                    tError: '<a href="%url%">The image</a> could not be loaded.' // Error message when image could not be loaded
                },
                ajax: {
                    tError: '<a href="%url%">The content</a> could not be loaded.' // Error message when ajax request failed
                }
            });

            $(".lightbox").each(function () {

                var el = $(this);

                var config, defaults = {}
                if (el.data("plugin-options"))
                    config = $.extend({}, defaults, options, el.data("plugin-options"));

                $(this).magnificPopup(config);

            });

        },

        flickrFeed: function (options) {

            $("ul.flickr-feed").each(function () {

                var el = $(this);

                var defaults = {
                    limit: 6,
                    qstrings: {
                        id: ''
                    },
                    itemTemplate: '<li><a href="{{image_b}}"><span class="thumbnail"><img alt="{{title}}" src="{{image_s}}" /></span></a></li>'
                }

                var config = $.extend({}, defaults, options, el.data("plugin-options"));

                el.jflickrfeed(config, function (data) {

                    el.magnificPopup({
                        delegate: "a",
                        type: "image",
                        gallery: {
                            enabled: true,
                            navigateByImgClick: true,
                            preload: [0, 1]
                        },
                        zoom: {
                            enabled: true,
                            duration: 300,
                            opener: function (element) {
                                return element.find('img');
                            }
                        }
                    });

                });


            });

        },

        parallax: function () {

            if (typeof ($.stellar) == "undefined") {
                return false;
            }

            $(window).load(function () {

                if ($(".parallax").get(0)) {
                    if (!Modernizr.touch) {
                        $(window).stellar({
                            responsive: true,
                            scrollProperty: 'scroll',
                            parallaxElements: false,
                            horizontalScrolling: false,
                            horizontalOffset: 0,
                            verticalOffset: 0
                        });
                    } else {
                        $(".parallax").addClass("disabled");
                    }
                }
            });

        },

        latestTweets: function () {

            var wrapper = $("#tweet"),
				accountId = wrapper.data("account-id");

            if (wrapper.get(0) && accountId != "") {
                getTwitters("tweet", {
                    id: accountId,
                    count: 1
                });

                wrapper.before($("<a />").addClass("twitter-account").html("@" + accountId).attr("href", "http://www.twitter.com/" + accountId).attr("target", "_blank"));

            }

        }

    };

    Core.initialize();

    $(window).load(function () {

    });

})();


// Revolution Slider - Might not need this....
(function (theme, $) {

    theme = theme || {};

    var instanceName = '__revolution';

    var PluginRevolutionSlider = function ($el, opts) {
        return this.initialize($el, opts);
    };

    PluginRevolutionSlider.defaults = {
        dottedOverlay: 'none',
        delay: 9000,
        startwidth: 1170,
        startheight: 500,
        hideThumbs: 200,

        thumbWidth: 100,
        thumbHeight: 50,
        thumbAmount: 3,

        navigationType: 'none',
        navigationArrows: 'solo',
        navigationStyle: 'round',

        touchenabled: 'on',
        onHoverStop: 'on',

        swipe_velocity: 0.7,
        swipe_min_touches: 1,
        swipe_max_touches: 1,
        drag_block_vertical: false,

        keyboardNavigation: 'on',

        navigationHAlign: 'center',
        navigationVAlign: 'bottom',
        navigationHOffset: 0,
        navigationVOffset: 20,

        soloArrowLeftHalign: 'left',
        soloArrowLeftValign: 'center',
        soloArrowLeftHOffset: 20,
        soloArrowLeftVOffset: 0,

        soloArrowRightHalign: 'right',
        soloArrowRightValign: 'center',
        soloArrowRightHOffset: 20,
        soloArrowRightVOffset: 0,

        shadow: 0,
        fullWidth: 'on',
        fullScreen: 'off',

        spinner: 'spinner0',

        stopLoop: 'off',
        stopAfterLoops: -1,
        stopAtSlide: -1,

        shuffle: 'off',

        autoHeight: 'off',
        forceFullWidth: 'off',

        hideThumbsOnMobile: 'off',
        hideNavDelayOnMobile: 1500,
        hideBulletsOnMobile: 'off',
        hideArrowsOnMobile: 'off',
        hideThumbsUnderResolution: 0,

        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        startWithSlide: 0
    };

    PluginRevolutionSlider.prototype = {
        initialize: function ($el, opts) {
            if ($el.data(instanceName)) {
                return this;
            }

            this.$el = $el;

            this
				.setData()
				.setOptions(opts)
				.build();

            return this;
        },

        setData: function () {
            this.$el.data(instanceName, this);

            return this;
        },

        setOptions: function (opts) {
            this.options = $.extend(true, {}, PluginRevolutionSlider.defaults, opts, {
                wrapper: this.$el
            });

            return this;
        },

        build: function () {
            if (!($.isFunction($.fn.revolution))) {
                return this;
            }

            this.options.wrapper.revolution(this.options);

            return this;
        }
    };

    // expose to scope
    $.extend(theme, {
        PluginRevolutionSlider: PluginRevolutionSlider
    });

    // jquery plugin
    $.fn.themePluginRevolutionSlider = function (opts) {
        return this.map(function () {
            var $this = $(this);

            if ($this.data(instanceName)) {
                return $this.data(instanceName);
            } else {
                return new PluginRevolutionSlider($this, opts);
            }

        });
    }

}).apply(this, [window.theme, jQuery]);

// Sticky Menu
(function (theme, $) {

    theme = theme || {};

    var initialized = false;

    $.extend(theme, {

        StickyMenu: {

            defaults: {
                wrapper: $('#header'),
                stickyEnabled: true,
                stickyEnableOnBoxed: true,
                stickyEnableOnMobile: false,
                menuAfterHeader: false,
                logoPaddingTop: 28,
                logoSmallWidth: 82,
                logoSmallHeight: 40
            },

            initialize: function ($wrapper, opts) {
                if (initialized) {
                    return this;
                }

                initialized = true;
                this.$wrapper = ($wrapper || this.defaults.wrapper);

                this
					.setOptions(opts)
					.build()
					.events();

                return this;
            },

            setOptions: function (opts) {
                this.options = $.extend(true, {}, this.defaults, opts, this.$wrapper.data('plugin-options'));

                return this;
            },

            build: function () {
                if (!this.options.stickyEnableOnBoxed && $('body').hasClass('boxed') || !this.options.stickyEnabled) {
                    return false;
                }

                var self = this,
					$body = $('body'),
					$header = self.$wrapper,
					$headerContainer = $header.parent(),
					$headerNavItems = $header.find('ul.nav-main > li > a'),
					$logoWrapper = $header.find('.logo'),
					$logo = $logoWrapper.find('img'),
					logoWidth = $logo.attr('width'),
					logoHeight = $logo.attr('height'),
					logoPaddingTop = parseInt($logo.attr('data-sticky-padding') ? $logo.attr('data-sticky-padding') : self.options.logoPaddingTop),
					logoSmallWidth = parseInt($logo.attr('data-sticky-width') ? $logo.attr('data-sticky-width') : self.options.logoSmallWidth),
					logoSmallHeight = parseInt($logo.attr('data-sticky-height') ? $logo.attr('data-sticky-height') : self.options.logoSmallHeight),
					headerHeight = $header.height();

                if (this.options.menuAfterHeader) {
                    $headerContainer.css('min-height', $header.height());
                }

                $(window).afterResize(function () {
                    $headerContainer.css('min-height', $header.height());
                });

                self.checkStickyMenu = function () {

                    if ((!self.options.stickyEnableOnBoxed && $body.hasClass('boxed')) || ($(window).width() < 991 && !self.options.stickyEnableOnMobile)) {
                        self.stickyMenuDeactivate();
                        $header.removeClass('fixed')
                        return false;
                    }

                    // Menu After Header
                    if (!this.options.menuAfterHeader) {

                        if ($(window).scrollTop() > ((headerHeight - 15) - logoSmallHeight)) {
                            self.stickyMenuActivate();
                        } else {
                            self.stickyMenuDeactivate();
                        }

                    } else {

                        if ($(window).scrollTop() > $headerContainer.offset().top) {
                            $header.addClass('fixed');
                        } else {
                            $header.removeClass('fixed');
                        }

                    }

                }

                self.stickyMenuActivate = function () {

                    if ($body.hasClass('sticky-menu-active')) {
                        return false;
                    }

                    $logo.stop(true, true);

                    $body.addClass('sticky-menu-active').removeClass('sticky-menu-deactive').css('padding-top', headerHeight);

                    // Flat Menu Items
                    if ($header.hasClass('flat-menu')) {
                        $headerNavItems.addClass('sticky-menu-active');
                    }

                    $logoWrapper.addClass('logo-sticky-active');

                    $logo.animate({
                        width: logoSmallWidth,
                        height: logoSmallHeight,
                        top: logoPaddingTop + 'px'
                    }, 200, function () {
                        $.event.trigger({
                            type: "stickyMenu.active"
                        });
                    });

                }

                self.stickyMenuDeactivate = function () {

                    if ($body.hasClass('sticky-menu-active')) {

                        $body.removeClass('sticky-menu-active').addClass('sticky-menu-deactive').css('padding-top', 0);

                        // Flat Menu Items
                        if ($header.hasClass('flat-menu')) {
                            $headerNavItems.removeClass('sticky-menu-active');
                        }

                        $logoWrapper.removeClass('logo-sticky-active');

                        $logo.animate({
                            width: logoWidth,
                            height: logoHeight,
                            top: '0px'
                        }, 200, function () {
                            $.event.trigger({
                                type: "stickyMenu.deactive"
                            });
                        });

                    }

                }

                $body.addClass('sticky-menu-deactive');

                self.checkStickyMenu();

                return this;
            },

            events: function () {
                var self = this;

                $(window).on('scroll resize', function () {
                    self.checkStickyMenu();
                });
            }

        }

    });

}).apply(this, [window.theme, jQuery]);