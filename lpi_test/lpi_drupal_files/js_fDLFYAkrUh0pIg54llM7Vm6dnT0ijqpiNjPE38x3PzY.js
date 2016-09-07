(function ($) {

  Drupal.behaviors.sidebar_blurb_positioning = {
    attach: function (context, settings) {

      // Go through all the containers with the sidebar class - This only happens once
      var delta = 1;
      var footnote_delta = 1;
      $('.field-name-body .lpi-sidebar-chunk').each(function () {
        $(this).attr('lpi-sidebar-chunk-delta', delta);

        if ($(this).hasClass('footnote-text')) {
          $('<lpi-sidebar-chunk-marker lpi-sidebar-chunk-delta="' + delta + '" class="footnote">(<span class="number">' + pad(footnote_delta, 2) + '</span>)</lpi-sidebar-chunk-marker>').insertBefore($(this));
        } else {
          $('<lpi-sidebar-chunk-marker lpi-sidebar-chunk-delta="' + delta + '" />').insertBefore($(this));
        }

        delta++;
        footnote_delta++;
      });

      // Position the chunks in the right sidebar.  This needs to happen on load and when
      // the viewport changes size. We position based upon the marker element in the body
      var chunkRealm = 'left';

      $(window).resize(function () {
        setChunkPostion();
      });
      $(document).ready(function () {
        setChunkPostion();
        setTimeout(setChunkPostion, 500); // do twice incase images are still pending
      });

      function setChunkPostion() {
        var delta = 0;
        var position = 0;
        var window_width = $(window).width();

        // Only if we're in a two-column layout do we care about absolute positioning
        if (window_width >= 991) {

          // Move the chunk to the right sidebar but only if it hasn't already been added
          if (chunkRealm == 'left') {
            var delta = 1;
            var footnote_delta = 1;
            $('.content-left lpi-sidebar-chunk-marker').each(function () {
              if ($('.content-left .lpi-sidebar-chunk[lpi-sidebar-chunk-delta="' + delta + '"]').hasClass('footnote-text')) {
                var footnoteText = $('.content-left .lpi-sidebar-chunk[lpi-sidebar-chunk-delta="' + delta + '"]');
                $('<aside class="footnote-wrapper" lpi-sidebar-chunk-delta="' + delta + '"><div class="footnote-number">' + pad(footnote_delta, 2) + '</div><div class="footnote-text lpi-sidebar-chunk" lpi-sidebar-chunk-delta="' + delta + '">' + footnoteText.html() + '</div></aside>').appendTo('.content-right');
                footnoteText.detach();
              } else {
                $('.content-left .lpi-sidebar-chunk[lpi-sidebar-chunk-delta="' + delta + '"]').appendTo('.content-right');
              }
              delta++;
              footnote_delta++;
            });
            chunkRealm = 'right';
          }

          $('.page-body lpi-sidebar-chunk-marker').each(function () {
            var thisMarker = $(this);
            var top = thisMarker.position().top;
            var blocksAboveHeight = 0;
            var marginTop = 0;
            $('.content-right').children().each(function () {

              if (thisMarker.attr('lpi-sidebar-chunk-delta') == $(this).attr('lpi-sidebar-chunk-delta')) {
                marginTop = (top - blocksAboveHeight);

                if (marginTop < 20) {
                  marginTop = 20;
                }

                $(this).css({
                  'margin-top': marginTop + 'px'
                });
              }

              blocksAboveHeight = (blocksAboveHeight + $(this).outerHeight(true));
            });
          })
        }

        // Medium and small screens
        else {
          $('.content-right .lpi-sidebar-chunk').each(function () {
            delta = $(this).attr('lpi-sidebar-chunk-delta');
            $(this).insertAfter($('.page-body lpi-sidebar-chunk-marker[lpi-sidebar-chunk-delta="' + delta + '"]'));
            $(this).css({
              'margin-top': '20px',
              'margin-bottom': '20px'
            });
          });

          $('.content-right .footnote-wrapper').each(function () {
            delta = $(this).attr('lpi-sidebar-chunk-delta');
            $(this).find('.footnote-text').insertAfter($('.page-body lpi-sidebar-chunk-marker[lpi-sidebar-chunk-delta="' + delta + '"]'));
            $(this).detach();
          });

          chunkRealm = 'left';

          // Now that footnotes are inline, lets make the numbers clickable.
          $('lpi-sidebar-chunk-marker.footnote').unbind().click(function () {
            var delta = $(this).attr('lpi-sidebar-chunk-delta');

            $('.content-left .footnote-text').each(function () {
              if ($(this).attr('lpi-sidebar-chunk-delta') == delta) {
                if ($('.content-left .footnote-text[lpi-sidebar-chunk-delta="' + delta + '"]').is(':visible')) {
                  $(this).css('display', 'none');
                } else {
                  $(this).css({
                    'display': 'block',
                    'margin-top': '10px',
                    'margin-bottom': '15px'
                  });
                }
              }
            });
          });
        }
      }

      function pad(str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
      }
    }
  }

  Drupal.behaviors.home_page_mission_read_more = {
    attach: function (context, settings) {
      if ($('body.node-type-home-page .field-name-field-hp-mission').length > 0) {
        $('body.node-type-home-page .field-name-field-hp-mission a.read-more').append('<img src="/sites/all/themes/lpi2016/images/blue-right-arrow-icon.svg" class="inline-text" />');
      }
    }
  }

  Drupal.behaviors.working_on_click = {
    attach: function (context, settings) {
      $('.field-name-field-hp-work-on-fc > .field-items > .field-item').click(function () {
        var url = $(this).find('.field-name-field-link .field-item').html();
        if (url.length) {
          window.location = url;
        }
      });
    }
  }

  Drupal.behaviors.working_on_set_final_row = {
    attach: function (context, settings) {

      if ($('.field-name-field-hp-work-on-fc').length > 0) {
        $('.field-name-field-hp-work-on-fc > .field-items').children().last().closest('.field-item').addClass('end');

        var fieldItems = $('.field-name-field-hp-work-on-fc > .field-items');
        fieldItemCount = fieldItems.children().length;

        //on resize
        $(window).resize(function () {
          setFinalRow();
        });

        //on page load
        $(document).ready(function () {
          setFinalRow();
          //do twice incase images are still pending
          setTimeout(setFinalRow, 500);
        });

        function setFinalRow() {
          var window_width = $(window).width();
          if (window_width >= 991) {
            var size = 'large';
          } else if ((window_width <= 990) && (window_width >= 481)) {
            var size = 'medium';
          } else if (window_width <= 480) {
            var size = 'small';
          }

          // Reset margin-left
          $('.field-name-field-hp-work-on-fc > .field-items > .field-item').each(function () {
            $(this).css('margin-left', '0px');
          });

          // Large
          if (size == 'large') {
            var itemsPerRow = 4;
            var fullRowsOfFour = Math.floor(fieldItemCount / itemsPerRow);
            var remainingFieldItemsCount = fieldItemCount % (fullRowsOfFour * itemsPerRow);

            if (remainingFieldItemsCount == 3) {
              fieldItems.children().eq(fieldItemCount - (remainingFieldItemsCount)).css('margin-left', '12.5%');
            } else if (remainingFieldItemsCount == 2) {
              fieldItems.children().eq(fieldItemCount - (remainingFieldItemsCount)).css('margin-left', '25%');
            } else if (remainingFieldItemsCount == 1) {
              fieldItems.children().eq(fieldItemCount - (remainingFieldItemsCount)).css('margin-left', '37.5%');
            }
          }

          // Medium
          else if (size == 'medium') {
            var itemsPerRow = 2;
            var fullRowsOfFour = Math.floor(fieldItemCount / itemsPerRow);
            var remainingFieldItemsCount = fieldItemCount % (fullRowsOfFour * itemsPerRow);

            if (remainingFieldItemsCount == 1) {
              fieldItems.children().eq(fieldItemCount - (remainingFieldItemsCount)).css('margin-left', '25%');
            }
          }

          // Small
          else if (size == 'small') {
          }
        }
      }
    }
  }

  Drupal.behaviors.node_list_filter = {
    attach: function (context, settings) {
      $('.resource-list-wrapper input[type=radio]').click(function () {
        $(this).closest('form').submit();
      });

      $('.form-item label[for^=edit-topic]').click(function () {
        $(this).closest('.form-item').find('.form-radios').toggle(0, function () {
          if ($(this).closest('form').find('div[id^=edit-topic]').is(':visible')) {
            $(this).closest('form').find('div[id^=edit-product]').hide();
            $(this).closest('form').find('.form-item-product label .up').hide();
            $(this).closest('form').find('.form-item-product label .down').show();
            $(this).closest('.form-item').find('label .down').hide()
            $(this).closest('.form-item').find('label .up').show()
          } else {
            $(this).closest('.form-item').find('label .down').show()
            $(this).closest('.form-item').find('label .up').hide()
          }
        });
      });

      $('.form-item label[for^=edit-product]').click(function () {
        $(this).closest('.form-item').find('.form-radios').toggle(0, function () {
          if ($(this).closest('form').find('div[id^=edit-product').is(':visible')) {
            $(this).closest('form').find('div[id^=edit-topic').hide();
            $(this).closest('form').find('.form-item-topic label .up').hide();
            $(this).closest('form').find('.form-item-topic label .down').show();
            $(this).closest('.form-item').find('label .down').hide()
            $(this).closest('.form-item').find('label .up').show()
          } else {
            $(this).closest('.form-item').find('label .down').show()
            $(this).closest('.form-item').find('label .up').hide()
          }
        });
      });

      $('.form-item label[for^=edit-type]').click(function () {
        $(this).closest('.form-item').find('.form-radios').toggle(0, function () {
          if ($(this).closest('form').find('div[id^=edit-type]').is(':visible')) {
            $(this).closest('form').find('div[id^=edit-topic').hide();
            $(this).closest('.form-item').find('label .down').hide()
            $(this).closest('.form-item').find('label .up').show()
          } else {
            $(this).closest('.form-item').find('label .down').show()
            $(this).closest('.form-item').find('label .up').hide()
          }
        });
      });

      $('.clear-all-filters').click(function () {
        window.location.replace(window.location.pathname);
      });

      if ($('.form-radios').length > 0) {
        $('.form-radios .form-item').each(function () {
          var formItem = $(this);
          if ($(this).find('input.form-radio').attr('checked')) {
            var label = formItem.find('label');
            label.addClass('checked');
            $(this).closest('.filter-wrapper').find('.filters-selected').prepend('<span class="selected-filter">' + label.html() + '</span>');
            $('.clear-all-filters').css('display', 'inline-block');
          }
        });
      }
    }
  }

  Drupal.behaviors.featured_landing = {
    attach: function (context, settings) {

      // Force the first node to be full-width
      var featuredLandingFirst = $('div').find('.featured-landing .field-item:first');
      featuredLandingFirst.find('.column').removeClass('large-4');
      featuredLandingFirst.find('.column').addClass('large-12');
      featuredLandingFirst.find('.column').addClass('first');
    }
  }

  Drupal.behaviors.section_menu = {
    attach: function (context, settings) {

      //on resize
      $(window).resize(function () {
        moveSectionNav();
      });

      //on page load
      $(document).ready(function () {
        moveSectionNav();
        //do twice incase images are still pending
        setTimeout(moveSectionNav, 500);
      });

      function moveSectionNav() {
        var window_width = $(window).width();

        // Move to left
        if (window_width <= 992) {
          if (($('.content-left .section-menu').length == 0) && ($('.content-right .section-menu').length > 0)) {
            $('.content-right .section-menu').css('margin-bottom', '40px');
            $($('.section-menu')[0].outerHTML).insertBefore(".field-name-body");
            $('.content-right .section-menu').detach();
          }
        } else if (($('.content-left .section-menu').length > 0) && ($('.content-right .section-menu').length == 0)) {
          //$('.content-left .section-menu').css('margin-bottom', '0');
          $($('.section-menu')[0].outerHTML).prependTo(".content-right");
          $('.content-left .section-menu').detach();
        }
      }
    }
  }

  Drupal.behaviors.equal_heights = {
    attach: function (context, settings) {

      //on resize
      $(window).resize(function () {
        resizeContent();
      });

      //on page load
      $(document).ready(function () {
        resizeContent();
        //do twice incase images are still pending
        setTimeout(resizeContent, 500);
      });

      function resizeContent() {
        var window_width = $(window).width();

        // Footer Feature
        if ($('.field-name-field-featured').length > 0) {
          if (window_width > 990) {
            text_height = 0;
            $('.field-name-field-featured .text').css("height", "");
            $('.field-name-field-featured .text').each(function () {
              //get height
              var height = $(this).outerHeight();

              if (height > text_height) {
                text_height = height;
              }
            });
            $('.field-name-field-featured .text').css("height", (text_height) + "px");
          } else {
            $('.field-name-field-featured .text').css("height", "auto");
          }
        }

        // Feature Landing
        if ($('.field-name-field-featured-landing').length > 0) {

          if (window_width > 990) {
            text_height = 0;
            $('.field-name-field-featured-landing .large-4 .text').css("height", "");
            $('.field-name-field-featured-landing .large-4 .text').each(function () {
              //get height
              var height = $(this).outerHeight();

              if (height > text_height) {
                text_height = height;
              }
            });
            $('.field-name-field-featured-landing .large-4 .text').css("height", (text_height) + "px");
          } else {
            $('.field-name-field-featured-landing .large-4 .text').css("height", "auto");
          }
        }
      }
    }
  }

  Drupal.behaviors.contact_form = {
    attach: function (context, settings) {
      if ($("label[for='edit-submitted-first-name']").length > 0) {
        $("label[for='edit-submitted-first-name']").html('Name <span class="form-required" title="This field is required.">*</span>');
      }
    }
  }

  Drupal.behaviors.person_org_node = {
    attach: function (context, settings) {
      if ($("body.node-type-person .field-name-field-image").length > 0) {
        $(".meta-citation-wrapper").css('margin-top', '-155px');
      }
      if ($("body.node-type-organization .field-name-field-image").length > 0) {
        $(".meta-citation-wrapper").css('margin-top', '-155px');
      }
    }
  }

  Drupal.behaviors.landing_page_learn_more = {
    attach: function (context, settings) {
      if ($('.summary-wrapper .learn-more').length > 0) {

        // Move
        oldLearnMore = $('.summary-wrapper .learn-more');
        learnMoreHTML = $('.summary-wrapper .learn-more')[0].outerHTML;
        $('.summary-wrapper .field-summary').append(' <span class="learn-more-wrapper">' + learnMoreHTML + ' <span class="fontello up">&#xe80c;</span><span class="fontello down">&#xe809;</span></span>');
        oldLearnMore.detach();

        // Clicky clicky
        $('.summary-wrapper .learn-more-wrapper').click(function () {
          if ($(this).closest('.summary').find('.field-name-body').is(':visible')) {
            $(this).closest('.summary').find('.field-name-body').slideUp();
            $(this).find('.fontello.up').hide();
            $(this).find('.fontello.down').show();
          } else {
            $(this).closest('.summary').find('.field-name-body').slideDown();
            $(this).find('.fontello.up').show();
            $(this).find('.fontello.down').hide();
          }
        });
      }
    }
  }

  Drupal.behaviors.responsive_menu = {
    attach: function (context, settings) {

      if ($('#block-search-form').length > 0) {

        //on resize
        $(window).resize(function () {
          searchFormResponsive();
        });

        //on page load
        $(document).ready(function () {
          searchFormResponsive();
          //do twice incase images are still pending
          setTimeout(searchFormResponsive, 500);
        });

        function searchFormResponsive() {
          var searchButton = '<div class="search-sm-screen-button">Search</div>';

          // Add the search button
          if ((window.matchMedia('(min-width: 481px)').matches) && (window.matchMedia('(max-width: 944px)').matches)) {
            if ($('.search-sm-screen-button').length == 0) {
              $('.menu-toggle').before(searchButton);

              $('.search-sm-screen-button').click(function () {
                $('#header .region-header > #block-search-form').slideToggle(0, function () {

                  // We can always close the menu when interacting with search.
                  $("#block-system-main-menu.menu-open .menu-toggle-opener").click();
                });
              });
            }
          }
          // Remove it
          else {
            if ($('.search-sm-screen-button').length > 0) {
              $('.search-sm-screen-button').detach();
            }
          }

          // Clone the search form into the accordion menu
          if (window.matchMedia('(max-width: 480px)').matches) {
            // Only add if it isn't there
            if ($('.megamenu li.search-form').length == 0) {
              var searchForm = $('#block-search-form')[0].outerHTML;
              $('<li class="search-form">' + searchForm + '</li>').clone().insertBefore('.megamenu > ul > li.first');
              $('.megamenu li.search-form #block-search-form').css({
                'display': 'block',
                'padding': '15px'
              });
            }
            $('.search-form #block-search-form').css('display', 'block');
            $('#header .region-header > #block-search-form').css('display', 'none');

          } else {
            $('.search-form #block-search-form').css('display', 'none');
            $('#header .region-header > #block-search-form').css('display', 'none');
            if (window.matchMedia('(min-width: 945px)').matches) {
              $('#header .region-header > #block-search-form').css('display', 'block');
            }
          }
        }
      }
    }
  }

  Drupal.behaviors.project_responsive = {
    attach: function (context, settings) {
      if (($('body.node-type-project').length > 0)) {
        //on resize
        $(window).resize(function () {
          moveStuff();
        });

        // on dom read
        $(document).ready(function () {
          moveStuff();
        });

        // when all elements are loaded
        $(window).load(function () {
          moveStuff();
        });

        function moveStuff() {
          var window_width = $(window).width();
          if (window_width <= 991) {
            if ($('.content-left #block-lpi-related-topics').length) {
              $('.content-right').append($('.content-left #block-lpi-related-topics'));
            }
          } else {
            if ($('.content-right #block-lpi-related-topics').length) {
              $('.content-left').append($('.content-right #block-lpi-related-topics'));
            }
          }
        }
      }
    }
  }

  Drupal.behaviors.person_org_responsive = {
    attach: function (context, settings) {
      if (($('body.node-type-person').length > 0) || ($('body.node-type-organization').length > 0)) {

        // Clone the headshot where we need it.
        $('.content-right .field-name-field-image').clone().insertBefore('header.person-org-title-subtitle .inner h1.title');
        if ($('.content-left .large-text').length > 0) {
          $('.content-right .field-name-field-image').clone().insertBefore('.content-left .large-text');
        } else {
          $('.content-right .field-name-field-image').clone().insertBefore('.content-left .field-name-body p');
        }

        //on resize
        $(window).resize(function () {
          moveStuff();
        });

        //on page load
        $(document).ready(function () {
          moveStuff();
          //do twice incase images are still pending
          setTimeout(moveStuff, 500);
        });

        function moveStuff() {
          var window_width = $(window).width();

          // Large
          if (window_width >= 991) {
            $('header.person-org-title-subtitle .field-name-field-image').css('display', 'none');
            $('.page-body .field-name-field-image').css('display', 'none');
            $('.content-right .field-name-field-image').css('display', 'block');
            // Medium
          } else if ((window_width < 991) && (window_width > 540)) {
            $('.content-right .field-name-field-image').css('display', 'none');
            $('.page-body .field-name-field-image').css('display', 'none');
            $('header.person-org-title-subtitle .field-name-field-image').css('display', 'block');
            // Small
          } else if (window_width <= 540) {
            $('.content-right .field-name-field-image').css('display', 'none');
            $('header.person-org-title-subtitle .field-name-field-image').css('display', 'none');
            $('.page-body .field-name-field-image').css('display', 'block');
          }

          if (window_width <= 991) {

            if ($('.content-left #block-lpi-products-lpi-products-files').length == 0) {
              if ($('.content-left .large-text').length > 0) {
                $('.content-right #block-lpi-products-lpi-products-files').clone().insertAfter('.content-left .large-text');
              } else {
                $('.content-right #block-lpi-products-lpi-products-files').clone().insertBefore('.content-left .field-name-body');
              }
              $('.content-right #block-lpi-products-lpi-products-files').css('display', 'none');
            }

            if ($('.content-left #block-lpi-products-lpi-products-files').length == 0) {
              if ($('.content-left .large-text').length > 0) {
                $('.content-right #block-lpi-products-lpi-products-files').clone().insertAfter('.content-left .large-text');
              } else {
                $('.content-right #block-lpi-products-lpi-products-files').clone().insertBefore('.content-left .field-name-body');
              }
              $('.content-right #block-lpi-products-lpi-products-files').css('display', 'none');
            }

            if ($('.content-left #block-lpi-related-topics').length == 0) {
              if ($('.content-left .large-text').length > 0) {
                $('.content-right #block-lpi-related-topics').clone().insertAfter('.content-left .large-text');
              } else {
                $('.content-right #block-lpi-related-topics').clone().insertBefore('.content-left .field-name-body');
              }
              $('.content-right #block-lpi-related-topics').css('display', 'none');
              $('.content-left #block-lpi-related-topics').css('margin-bottom', '1em');
            }

            if ($('.content-left #block-contact').length == 0) {
              if ($('.content-left .large-text').length > 0) {
                $('.content-right #block-contact').clone().insertAfter('.content-left .large-text');
              } else {
                $('.content-right #block-contact').clone().insertBefore('.content-left .field-name-body');
              }
              $('.content-right #block-contact').css('display', 'none');
              $('.content-left #block-contact').css('margin-bottom', '1em');
            }
          }

          // Remove it
          else {
            if ($('.content-left #block-contact').length > 0) {
              $('.content-left #block-contact').detach();
              $('.content-right #block-contact').css('display', 'block');
            }
            if ($('.content-left #block-lpi-related-topics').length > 0) {
              $('.content-left #block-lpi-related-topics').detach();
              $('.content-right #block-lpi-related-topics').css('display', 'block');
            }
          }
        }
      }
    }
  }

  // Implemented for interactive map pages so that if nothing is in the right column we
  // get the full width.
  Drupal.behaviors.no_sidebar_empty = {
    attach: function (context, settings) {
      if ($('.tpl--node--no-sidebar--full').length > 0) {
        if ($('.content-right').html().trim().length == 0) {
          $('.content-right').detach();
          $('.content-left').removeClass('large-8').addClass('large-12');
        }
      }
    }
  }

  // Per https://capellic.zendesk.com/agent/tickets/20195
  Drupal.behaviors.move_downloads_summary_empty = {
    attach: function (context, settings) {
      if (($('body.node-type-person').text().trim().length == 0) &&
        ($('body.node-type-organization').text().trim().length == 0) &&
        ($('.summary-and-stuff-row .summary').text().trim().length == 0) &&
        ($('#block-lpi-products-lpi-products-files').length > 0)) {
        $('.key-findings-meta-row > .content-right').prepend($('#block-lpi-products-lpi-products-files'));
        $('#block-lpi-products-lpi-products-files').removeClass('column').removeClass('standard-gutter').removeClass('large-4');
        $('.summary-and-stuff-row').detach();
      } else if ((($('body.node-type-person').text().trim().length > 0) ||
        ($('body.node-type-organization').text().trim().length > 0)) &&
        ($('.summary-and-stuff-row .summary').text().trim().length == 0) &&
        ($('#block-lpi-products-lpi-products-files').length > 0)) {
        console.log('test');
        $('.summary-and-stuff-row').detach();
      }
    }
  }

  Drupal.behaviors.zeroclipboard = {
    attach: function (context, settings) {
      Drupal.zeroClipboard.process('.copy-wrapper', copy);

      function copy() {
        var citation = $.trim($('.citation-text').text());
        return citation;
      }
    }
  }

  Drupal.behaviors.cadet_blurb_sidebar = {
    attach: function (context, settings) {

      $(window).resize(function () {
        setMargin();
      });
      $(document).ready(function () {
        setMargin();
        setTimeout(setMargin, 500); // do twice incase images are still pending
      });

      function setMargin() {
        var window_width = $(window).width();

        if (window_width >= 991 && $('#block-system-main .margin-normal').length > 0) {
          var window_width = $(window).width();

          var margin_px = ($(window).width() - ($('#block-system-main .margin-normal').offset().left + $('#block-system-main .margin-normal').outerWidth()));
          margin_px = parseInt(margin_px);

          var right_col_width = $('.content-right').css('width');
          right_col_width = parseInt(right_col_width);

          var width = margin_px + right_col_width - 20;


          $('.content-right .sidebar-description').css('width', width + 'px');
          $('.content-right .sidebar-description h2').css('max-width', '600px');
          $('.content-right .sidebar-description .body').css('max-width', '600px');

        } else {
          $('.content-left .sidebar-description').css('width', '100%');
          $('.content-left .sidebar-description h2').css('max-width', 'none');
          $('.content-left .sidebar-description .body').css('max-width', 'none');
        }
      }
    }
  }
  Drupal.behaviors.project_node = {
    attach: function (context) {
      if ($('body', context).hasClass('node-type-project')) {
        $('.lpi-project-expander').each(function () {
          var $block = $(this),
            initial = $block.data('initial'),
            $nodes = $block.find('.node');
          if ($nodes.length > initial) {
            var more = $block.data('more').replace('%d', $nodes.length),
              less = $block.data('less');
            var $label = $('<span class="label">').text(more).append($('<span>').addClass('fontello')),
              $expander = $('<a/>').addClass('expand').html($label);
            $expander.click(function (e) {
              e.preventDefault();
              if ($(this).hasClass('expanded')) {
                $block.find('.node:nth-child(1n+' + (initial + 1) + ')').hide();
                $(this).removeClass('expanded');
                $label.text(more).append($('<span>').addClass('fontello'));
              } else {
                $block.find('.node:nth-child(1n+3)').show();
                $(this).addClass('expanded');
                $label.text(less).append($('<span>').addClass('fontello'));
              }
            });
            $block.append($expander);
            $block.find('.node:nth-child(1n+' + (initial + 1) + ')').hide();
          }
        });
      }
    }
  };

})(jQuery);
;
(function ($) {
  Drupal.behaviors.megaMenu = {
    attach: function (context, settings) {
      // See https://github.com/marioloncarek/megamenu-js,
      // which was used as basis for this.

      $(".megamenu > ul").once('toggle').before("<div class=\"menu-toggle\"><a href=\"#\" class=\"menu-toggle-opener menu-mobile\"><span>Menu</span></a></div>");

      $(".megamenu > ul > li > a, .megamenu > ul > li > span").click(function () {

        var topLink = $(this).parent('li');
        // Remove all the styles to start fresh.
        $(".megamenu").find("ul").removeAttr('style');

        // Close all.
        $(".megamenu").find('.submenu-open > ul').hide();
        $(".megamenu").find('.up-arrow').hide();
        $(".megamenu").find('.down-arrow').show();

        // Scroll to top.
        $("html, body").animate({ scrollTop: 0 }, "slow");

          // Close a submenu.
          if (topLink.hasClass('submenu-open')) {
            topLink.children("ul").fadeOut(150);

            topLink.removeClass('submenu-open')
            topLink.find('.down-arrow').show();
            topLink.find('.up-arrow').hide();
          }

          // Open a submenu.
          else {
            $(".megamenu").find('.submenu-open').removeClass('submenu-open');

            topLink.children("ul").fadeIn(150);
            topLink.addClass('submenu-open')
            topLink.find('.down-arrow').hide();
            topLink.find('.up-arrow').show();

            // Set heights so flexbox works.
            var submenuUl = topLink.children('ul');
            flexHeight = submenuUl.actualHeight();
            var window_width = $(window).width();

            // At least tablet width.
            if (window.matchMedia('(min-width: 768px)').matches) {
              submenuUl.css('display', 'flex');

              // Fit everything in 2 flex columns. Add 50px for bonus space.
              submenuUl.height(Math.ceil(flexHeight / 2) + 50);
            }

            // Desktop width.
            if (window.matchMedia('(min-width: 945px)').matches) {

              // Also set the width, position, and padding.
              submenuUl.width(window_width);
              var ulPos = submenuUl.offset();
              var ulPadding = window_width * .08;
              submenuUl.css({left: -Math.abs(ulPos.left), top: 32});
              submenuUl.css("padding-left", ulPadding);
              submenuUl.css("padding-right", ulPadding);

              // Try to find a good height by multiplying the number of
              // <li>s by the height of an li (58px) and add 105px to
              // cover ul spacing and try to never exceed 3 flex columns.
              var itemCount = $(this).parent('li').find('li').length;
              submenuUl.height((itemCount * 58 / 3) + 75);
            }
          }
      });

      // Open or close the mobile / tablet width menu.
      $(".menu-mobile").click(function (e) {
        $(".megamenu > ul").toggleClass('show-on-mobile');
        $("#block-system-main-menu").toggleClass("menu-open");
        e.preventDefault();

        // Close the search form.
        $('#block-search-form').css('display', 'none');
        $('.search-form #block-search-form').css('display', 'block');
      });

      // LPI additions.
      // Add some helper classes and arrows.
      var menuLinks = $('.megamenu > ul');
      menuLinks.addClass("megamenu-level-1").children('li').has("ul").addClass("menuparent")
        .children("ul").addClass("megamenu-level-2").children("li").children('a')
        .addClass('megamenu-link');
        $(".megamenu-level-2").children('li').has('ul').addClass("menuparent")
        .children("ul").addClass("megamenu-level-3");

      $(".megamenu-level-1 > .menuparent > .nolink").once('mega-arrows').append('<span class="fontello down-arrow">&#xe809;</span><span class="fontello up-arrow">&#xe80c;</span>')


      // Wrap the last word in a link in a span containing the right arrow to
      // prevent bad splits.
      $('.megamenu-link').once('mega-arrows').each(function(index, element) {
        var link = $(element), word_array, last_word, first_part;

        word_array = link.html().split(/\s+/);    // Split on spaces.
        last_word = word_array.pop();             // Pop the last word.
        first_part = word_array.join(' ');        // Rejoin the first words together.
        link.once('mega-nowrap').html([first_part, ' <span class="no-wrap">', last_word, '<span class="right-arrow"></span></span>'].join(''));
      });

      // On resize let's close the menu if open.
      $(window).resize(function(){
        // Mobile and tablet.
        $("#block-system-main-menu.menu-open .menu-toggle-opener").click();

        // Desktop. Should only need to close toplevel span.nolink, but
        // Will check for a tags in case menu use changes.
        $(".megamenu > ul > li.submenu-open > span, .megamenu > ul > li.submenu-open > a").click();
      });
    }
  }

  // Custom plugin to calculate height of hidden element.
  // See http://jsbin.com/ihakid/2/edit?html,css,js,output if it still exists.
  $.fn.actualHeight = function(){
    // Find the closest visible parent and get its hidden children.
    var visibleParent = this,
      thisHeight;

    // Set a temporary class on the hidden parent of the element.
    visibleParent.addClass('temp-show');

    // Get the height.
    thisHeight = this.outerHeight();

    // Remove the temporary class.
    visibleParent.removeClass('temp-show');
    return thisHeight;
  };
})(jQuery);

;
