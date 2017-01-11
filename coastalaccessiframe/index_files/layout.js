/**
 * File layout.js.
 */
( function() {

    var $ = jQuery;
    var $body = $('body');
    //check if Firefox
    var isNotChrome = !window.chrome;



    $.scaleSidebar = function() {
        //Check if not chrome
        // console.log('This is not chrome:', isNotChrome);
        var mq = window.matchMedia('(max-width: 1040px)');
        var sidebar = $('.responsive-sidebar-layout .sidebar-content-wrapper');
        var main = ($('.responsive-sidebar-layout .main-content-wrapper section:first-child').length > 0) ? $('.responsive-sidebar-layout .main-content-wrapper section:first-child') : $('.responsive-sidebar-layout .main-content-wrapper');
        // first reset the heights
        sidebar.css('height','auto');
        main.css('height','auto');

        // dont resize on single columns
        if(!sidebar.is(':visible')) {
            return;
        }

        //FIREFOX NEEDS THE OUTER HEIGHT TO CALCULATE CORRECTLY
        var sidebarHeight = isChrome ? sidebar.outerHeight() : sidebar.height();
        var mainHeight = isChrome ? main.outerHeight() : main.height();
        var sidebarPadding = sidebar.css('padding').replace("px", "") * 2;
        var mainPadding = main.css('padding').replace("px", "") * 2;

        if(mq.matches){
            sidebar.css('height', 'auto');
        } else {
            if(sidebarHeight > mainHeight) {
                main.css('height', (sidebarHeight + sidebarPadding) + 'px');
            } else {
                sidebar.css('height', (mainHeight + mainPadding) + 'px');
            }
        }
    };

    $(window).resize(function() {
        $.scaleSidebar();
    });


    if($('.single-jobs')){
        var mq = window.matchMedia('(max-width: 1040px)');
        $(window).resize(function(){
            if(mq.matches){
                $('.single-jobs .sidebar-content-wrapper').css('height', 'auto');
            } else {
                $.scaleSidebar();
            }
        });
    }

    $.scaleSidebar();

    // basic plugin to pull content up
    $.fn.pullContent = function(height) {
        if(height === 0) {
            positioning = 'static';
        } else {
            positioning = 'relative';
            height = 0-height;
        }
        $(this).css({position: positioning, top: height +'px'});
    };

    // enable a data-pull attribute
    // example: <div class="main-content" data-pull="50">...</div>
    $('[data-pull]').each(function(){
        var height = $(this).data('pull');
        $(this).pullContent(height);
    });

    // $(window).on('load', function(){
    //     $(window).resize(function(){
    //         var articleMain = $('.single-article .main-content');
    //         var articleSidebarSection = $('.single-article .sidebar-content section:first-child');
    //         var eventMain = $('.single-event .main-content');
    //         var articleFeatureImageHeight = $('.single-article .masthead-main-image img').height();
    //         var eventFeatureImageHeight = $('.single-event .masthead-main-image img').height();
    //         var mq = window.matchMedia('(max-width: 1040px)');

    //         var pull = (mq.matches) ? 0 : 520 - articleFeatureImageHeight;
    //         var pullEvent = (mq.matches) ? 0 : 520 - eventFeatureImageHeight;

    //         // articleMain.pullContent(pull);
    //         // eventMain.pullContent(pullEvent);

    //     }).resize();
    // });


    var $video = $(".video-wrapper iframe");

    $video.data('aspectRatio', $video.height() / $video.width())
        // and remove the hard coded width/height
        .removeAttr('height')
        .removeAttr('width');

    // The element that is fluid width
    $fluidEl = $(".video-wrapper").parent();

    // When the window is resized
    $(window).resize(function() {

        var newWidth = $fluidEl.width();

        $video.width(newWidth)
                .height(newWidth * $video.data('aspectRatio'));
    }).resize();

    //Buggy "way too large image" fix
    $.imageWidthFix = function() {
        $('.content-wrapper figure').css('width', 'auto');
    };

    $.imageWidthFix();

    $(document).ready(function(){
        //fixes iframes in content wrapper from exceeding content width
        var $iFrameInContentWrapper = $('.content-wrapper iframe');
        if($iFrameInContentWrapper){
            $iFrameInContentWrapper.attr('width', '100%');
        }

        // CALLS FOCUS TO SEARCH FIELD
        $('.search-form input[name=s]').focus();

        //WRAPS BUTTONS IN CONTENT WRAPPER WITH FLEX-CENTER
        $('.content-wrapper .btn.btn-blue').wrap('<div class="flex-center"></div>');
    });

    $.objectfitCompatibility = function () {
        if( !Modernizr.objectfit ){
            var objFitContainer = $('.masthead-main-image');
            var imgUrl = objFitContainer.find('img').prop('src');

            if(imgUrl) {
                console.log('imgUrl');
                objFitContainer
                    .css('backgroundImage', 'url('+imgUrl+')')
                    .addClass('compatObjFit');
            }
        }
    };

    $.objectfitCompatibility();



} )();
