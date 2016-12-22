/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {

	var $ = jQuery;
	var $body = $('body');

	var MOBILE_BREAKPOINT = 767;
	//TO-DO: evaluate for better way to only run on desktop
	if ($(window).width() >= MOBILE_BREAKPOINT) {
		$(window).scroll(function() {
		  if ($(document).scrollTop() > 50) {
		    $body.addClass('header-short');
		  } else {
		    $body.removeClass('header-short');
		  }
		});
	}

	$('#main-menu-hamburger').click(function(e) {
		e.preventDefault();
		$body.toggleClass('main-navigation-open');

	});

	$('.menu-column h2').click(function(e) {
		if ($(window).width() >= MOBILE_BREAKPOINT) {
			return false;
		}

		var $menuColumn = $(e.currentTarget).parent();

		$menuColumn.toggleClass('expanded');

	});

	$('#search-icon').click(function(e) {
		e.preventDefault();
		$body.addClass('search-overlay-open');
		$('.search-field').focus();
	});

	$('.close-search').click(function(e) {
		e.preventDefault();
		$('.expanded-search').removeClass('expanded-search');
		$body.removeClass('search-overlay-open');
	});


	$('#search-select-topic').click(function(e) {

		var $selectWrapper = $(e.currentTarget).parent();
		//console.log($menuColumn.parent());
		$selectWrapper.toggleClass('expanded-search');

	});

	$('#get-involved-button').click(function(e) {
		e.preventDefault();
		$body.addClass('show-get-involved');
	});

	$('#close-get-involved').click(function(e) {
		e.preventDefault();
		$body.removeClass('show-get-involved');
	});

	$('#mobile-get-involved-button').click(function(e) {
		e.preventDefault();
		$('.main-navigation').addClass('show-mobile-get-involved');
	});

	$('#close-mobile-get-involved').click(function(e) {
		e.preventDefault();
		$('.main-navigation').removeClass('show-mobile-get-involved');
	});

    $('.toggle-mobile-nav-education').on('click', function(e){
        e.preventDefault();
        $('.mobile-nav-education .nav').toggleClass('collapse');
    });

    // copies the sidebar navigation into the mobile nav
    // then initiates the dropdown functionality
    // set the title attribute of the mobile nav div to change the label
    $.renderMobileNav = function() {
        if($('.side-nav').length === 0) {
            return;
        }

        var title = $('.sidebar').attr('title');
        if(! title) title = 'More';
        var sidebarNav = '<ul>' + $('ul.side-nav').html() + '</ul>';
        $('.responsive-columns').before('<div class="mobile-nav mobile-only">' +
                '<div class="dropdown collapse">' +
                '<a class="toggle-dropdown" href="#">' +
                '<span>+</span>' +
                '<h3>' + title + '</h3>' +
                '</a>' +
                sidebarNav +
                '</div><!-- /.mobile-nav -->'
        );

        $('.toggle-dropdown').on('click', function(e){
            e.preventDefault();
            $('.mobile-nav .dropdown ul').slideToggle();
        });
    };

    $.renderMobileNav();



	//COMMENTING OUT UNDERSCORES THEME JAVASCRIPT, MAY REVISIT THIS
	///////////////////////////////////////////////////////////////
	// var container, button, menu, links, subMenus, i, len;

	// container = document.getElementById( 'site-navigation' );
	// if ( ! container ) {
	// 	return;
	// }

	// button = container.getElementsByTagName( 'button' )[0];
	// if ( 'undefined' === typeof button ) {
	// 	return;
	// }

	// menu = container.getElementsByTagName( 'ul' )[0];

	// // Hide menu toggle button if menu is empty and return early.
	// if ( 'undefined' === typeof menu ) {
	// 	button.style.display = 'none';
	// 	return;
	// }

	// menu.setAttribute( 'aria-expanded', 'false' );
	// if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
	// 	menu.className += ' nav-menu';
	// }

	// button.onclick = function() {
	// 	if ( -1 !== container.className.indexOf( 'toggled' ) ) {
	// 		container.className = container.className.replace( ' toggled', '' );
	// 		button.setAttribute( 'aria-expanded', 'false' );
	// 		menu.setAttribute( 'aria-expanded', 'false' );
	// 	} else {
	// 		container.className += ' toggled';
	// 		button.setAttribute( 'aria-expanded', 'true' );
	// 		menu.setAttribute( 'aria-expanded', 'true' );
	// 	}
	// };

	// // Get all the link elements within the menu.
	// links    = menu.getElementsByTagName( 'a' );
	// subMenus = menu.getElementsByTagName( 'ul' );

	// // Set menu items with submenus to aria-haspopup="true".
	// for ( i = 0, len = subMenus.length; i < len; i++ ) {
	// 	subMenus[i].parentNode.setAttribute( 'aria-haspopup', 'true' );
	// }

	// // Each time a menu link is focused or blurred, toggle focus.
	// for ( i = 0, len = links.length; i < len; i++ ) {
	// 	links[i].addEventListener( 'focus', toggleFocus, true );
	// 	links[i].addEventListener( 'blur', toggleFocus, true );
	// }

	// /**
	//  * Sets or removes .focus class on an element.
	//  */
	// function toggleFocus() {
	// 	var self = this;

	// 	// Move up through the ancestors of the current link until we hit .nav-menu.
	// 	while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

	// 		// On li elements toggle the class .focus.
	// 		if ( 'li' === self.tagName.toLowerCase() ) {
	// 			if ( -1 !== self.className.indexOf( 'focus' ) ) {
	// 				self.className = self.className.replace( ' focus', '' );
	// 			} else {
	// 				self.className += ' focus';
	// 			}
	// 		}

	// 		self = self.parentElement;
	// 	}
	// }

	// /**
	//  * Toggles `focus` class to allow submenu access on tablets.
	//  */
	// ( function( container ) {
	// 	var touchStartFn, i,
	// 		parentLink = container.querySelectorAll( '.menu-item-has-children > a, .page_item_has_children > a' );

	// 	if ( 'ontouchstart' in window ) {
	// 		touchStartFn = function( e ) {
	// 			var menuItem = this.parentNode, i;

	// 			if ( ! menuItem.classList.contains( 'focus' ) ) {
	// 				e.preventDefault();
	// 				for ( i = 0; i < menuItem.parentNode.children.length; ++i ) {
	// 					if ( menuItem === menuItem.parentNode.children[i] ) {
	// 						continue;
	// 					}
	// 					menuItem.parentNode.children[i].classList.remove( 'focus' );
	// 				}
	// 				menuItem.classList.add( 'focus' );
	// 			} else {
	// 				menuItem.classList.remove( 'focus' );
	// 			}
	// 		};

	// 		for ( i = 0; i < parentLink.length; ++i ) {
	// 			parentLink[i].addEventListener( 'touchstart', touchStartFn, false );
	// 		}
	// 	}
	// }( container ) );
} )();
