/*-----------------------------------------------------------------------------------
/*
/* Init JS - To initialize functions in JQuery - onLoad Page
/*
-----------------------------------------------------------------------------------*/

 jQuery(document).ready(function($) {

/*----------------------------------------------------*/
/* FitText Settings
------------------------------------------------------ */

    setTimeout(function() {
	   $('h1.responsive-headline').fitText(1, { minFontSize: '40px', maxFontSize: '90px' });
	 }, 100);
/*----------------------------------------------------*/

/*----------------------------------------------------*/
/* Smooth Scrolling
------------------------------------------------------ */

   $('.smoothscroll').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash,
	    $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = target;
	    });
	});
/*----------------------------------------------------*/

/*----------------------------------------------------*/
/* Highlight the current section in the navigation bar
------------------------------------------------------*/

	var sections = $("section");
	var navigation_links = $("#nav-wrap a");

	sections.waypoint({

      handler: function(event, direction) {

		   var active_section;

			active_section = $(this);
			if (direction === "up") active_section = active_section.prev();

			var active_link = $('#nav-wrap a[href="#' + active_section.attr("id") + '"]');

			navigation_links.parent().removeClass("current");
			
			active_link.parent().addClass("current");

		},
		offset: '35%'

	});
/*----------------------------------------------------*/

/*----------------------------------------------------*/
/*	Make sure that #header-background-image height is
/* equal to the browser height.
------------------------------------------------------ */

   $('header').css({ 'height': $(window).height() });
   $(window).on('resize', function() {

        $('header').css({ 'height': $(window).height() });
        $('body').css({ 'width': $(window).width() })
   });
/*----------------------------------------------------*/

/*----------------------------------------------------*/
/*	Fade In/Out Primary Navigation
------------------------------------------------------*/

   $(window).on('scroll', function() {

		var h = $('header').height();
		var y = $(window).scrollTop();
      var nav = $('#nav-wrap');

	   if ( (y > h*.20) && (y < h) && ($(window).outerWidth() > 768 ) ) {
	      nav.fadeOut('fast');
	   }
      else {
         if (y < h*.20) {
            nav.removeClass('opaque').fadeIn('fast');
         }
         else {
            nav.addClass('opaque').fadeIn('fast');
         }
      }

	});
/*----------------------------------------------------*/

/*----------------------------------------------------*/
/*	Modal Popup
------------------------------------------------------*/

    $('.item-wrap a').magnificPopup({

       type:'inline',
       fixedContentPos: false,
       removalDelay: 200,
       showCloseBtn: false,
       mainClass: 'mfp-fade'

    });

    $(document).on('click', '.popup-modal-dismiss', function (e) {
    		e.preventDefault();
    		$.magnificPopup.close();
    });
/*----------------------------------------------------*/

/*----------------------------------------------------*/
/*	Flexslider
/*----------------------------------------------------*/
   $('.flexslider').flexslider({
      namespace: "flex-",
      controlsContainer: ".flex-container",
      animation: 'slide',
      controlNav: true,
      directionNav: false,
      smoothHeight: true,
      slideshowSpeed: 6000,
      animationSpeed: 500,
      randomize: true,
   });
/*----------------------------------------------------*/

/*----------------------------------------------------*/
/*	Contact Form
------------------------------------------------------*/

   $('form#contactForm button.submit').click(function() {

      $('#image-loader').fadeIn();

      var contactName = $('#contactForm #contactName').val();
      var contactEmail = $('#contactForm #contactEmail').val();
      var contactSubject = $('#contactForm #contactSubject').val();
      var contactMessage = $('#contactForm #contactMessage').val();

      var data = 'contactName=' + contactName + '&contactEmail=' + contactEmail +
               '&contactSubject=' + contactSubject + '&contactMessage=' + contactMessage;

      $.ajax({

	      type: "POST",
	      url: "inc/sendEmail.php",
	      data: data,
	      success: function(msg) {

            // Message was sent
            if (msg == 'OK') {
               $('#image-loader').fadeOut();
               $('#message-warning').hide();
               $('#contactForm').fadeOut();
               $('#message-success').fadeIn();   
            }
            // There was an error
            else {
               $('#image-loader').fadeOut();
               $('#message-warning').html(msg);
	            $('#message-warning').fadeIn();
            }

	      }

      });
      return false;
   });
      
/*----------------------------------------------------*/
/*	Profile picture
------------------------------------------------------*/  
	$(".profilepicture").mouseover(function(){	
		 $(".pulse1").css("-webkit-animation-play-state", "running");  
		 $(".pulse1").css("animation-play-state", "running");  
		
		 $(".pulse2").css("-webkit-animation-play-state", "running");
		 $(".pulse2").css("animation-play-state", "running");  	 
	 })
	 .mouseleave(function() {
		 $(".pulse1").css("-webkit-animation-play-state", "paused");  
		 $(".pulse1").css("animation-play-state", "paused");  
		
		 $(".pulse2").css("-webkit-animation-play-state", "paused");
		 $(".pulse2").css("animation-play-state", "paused");
	  });
/* ================================================== */ 
  
/* GitHubActivity
  ================================================== */ 
	$('#github').hide();
	$('#githubLink').click(function(e) {
	
		e.preventDefault();

		var target = this.hash,
		$target = $(target);
	
		$('html, body').stop().animate({
			'scrollTop': $('#github').offset().top
		}, 900, 'swing', function () {
			window.location.hash = target;
		});
	
		$('#github').fadeIn("slow");
	
	});
	
	GitHubActivity.feed({ username: "cesarnog", selector: "#feed" }); 

/* ================================================== */ 

/* Hour of code banner - fancyBox
  ================================================== */ 
	var hadScrollOnce = false;
	
	$('#dataHourOfCode').click(function(e) {	
		$.fancybox.close(); 		
	});
	
	$(window).on('scroll', function (e){
		if(($(window).scrollTop() >= 1200) && ($(window).scrollTop() <= 1800)){
			if(!hadScrollOnce){
				$(".fancyboxHourOfCode").fancybox({									
					autoScale: true,
					transitionIn	:	'fadeIn',
					transitionOut	:	'fade',
					speedIn		:	2000, 
					speedOut		:	800, 
					overlayShow	:	true,
					content: jQuery('#dataHourOfCode').html()
					
				}).trigger('click');
				hadScrollOnce = true;
				
				setTimeout(function() {
					// Reset to open again after 1 minute
					hadScrollOnce = false;
				}, 60000);					
			}		
		}	
	});
/*------------------------------------------------------*/  
  
});








