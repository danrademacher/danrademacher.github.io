/* Add here all your JS customizations */
$(document).ready(function () {
    $("#parkGallery").magnificPopup({
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


$(document).ready(function () {
    $('ul li a[href^="#"]').on('click', function(e) {
        e.preventDefault();

        var target = this.hash;
        $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing');
    });
});

