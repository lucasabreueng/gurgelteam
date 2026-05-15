(function ($) {
    "use strict";
	
	var $window = $(window); 
	var $body = $('body'); 

	/* Preloader Effect */
	$window.on('load', function(){
		$(".preloader").fadeOut(600);
	});

	/* Sticky Header */
	if ($('.active-sticky-header').length) {
		function setHeaderHeight() {
			$('header.main-header').css('height', $('header .header-sticky').outerHeight());
		}

		$window.on('resize', setHeaderHeight);
		$window.on('load', setHeaderHeight);

		$window.on('scroll', function () {
			var fromTop = $(window).scrollTop();
			setHeaderHeight();
			$('header .header-sticky').toggleClass('active', fromTop > 32);
			$('header .header-sticky').removeClass('hide');
		});
		setHeaderHeight();
		$window.trigger('scroll');
	}	
	
	/* Slick Menu JS */
	if ($('#menu').length) {
		$('#menu').slicknav({
			label : '',
			prependTo : '.responsive-menu'
		});
	}

	if($("a[href='#top']").length){
		$(document).on("click", "a[href='#top']", function() {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return false;
		});
	}

	/* Hero Slider Layout JS */
	if ($('.hero-slider-layout .swiper').length) {
		const hero_slider_layout = new Swiper('.hero-slider-layout .swiper', {
			effect: 'fade',
			slidesPerView : 1,
			speed: 1000,
			spaceBetween: 0,
			loop: true,
			autoplay: {
				delay: 4000,
			},
			pagination: {
				el: '.hero-pagination',
				clickable: true,
			},
		});
	}

	/* Company Slider Box JS */
	if ($('.company-slider-box').length) {
		const company_slider_box = new Swiper('.company-slider-box .swiper', {
			slidesPerView : 2,
			speed: 2000,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			breakpoints: {
				768:{
				  	slidesPerView: 4,
				},
				991:{
				  	slidesPerView: 6,
				}
			}
		});
	}

	/* testimonial Slider JS */
	if ($('.testimonial-slider').length) {
		const testimonial_slider = new Swiper('.testimonial-slider .swiper', {
			slidesPerView : 1,
			speed: 1000,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.testimonial-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: '.testimonial-button-next',
				prevEl: '.testimonial-button-prev',
			},
			breakpoints: {
				768:{
					slidesPerView: 2,
				},
				991:{
					slidesPerView: 2,
				}
			}
		});
	}

	/* Skill Bar */
	if ($('.skills-progress-bar').length) {
		$('.skills-progress-bar').waypoint(function() {
			$('.skillbar').each(function() {
				$(this).find('.count-bar').animate({
				width:$(this).attr('data-percent')
				},2000);
			});
		},{
			offset: '70%'
		});
	}

	/* Youtube Background Video JS */
	if ($('#herovideo').length) {
		var myPlayer = $("#herovideo").YTPlayer();
	}

	/* Init Counter */
	if ($('.counter').length) {
		$('.counter').counterUp({ delay: 6, time: 1500 });
	}

	/* Image Reveal Animation */
	if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, 1, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1, {
                xPercent: 100,
                scale: 1,
                delay: -1,
                ease: Power2.out
            });
        });
    }

	/* Text Effect Animation Start */
	if($('.text-effect').length) {
		var textheading = $(".text-effect");

		if(textheading.length == 0) return; gsap.registerPlugin(SplitText); textheading.each(function(index, el) {
			
			el.split = new SplitText(el, { 
				type: "lines,words,chars",
				linesClass: "split-line"
			});
			
			if( $(el).hasClass('text-effect') ){
				gsap.set(el.split.chars, {
					opacity: .3,
					x: "-7",
				});
			}
			el.anim = gsap.to(el.split.chars, {
				scrollTrigger: {
					trigger: el,
					start: "top 92%",
					end: "top 60%",
					markers: false,
					scrub: 1,
				},

				x: "0",
				y: "0",
				opacity: 1,
				duration: .7,
				stagger: 0.2,
			});
			
		});
	}
	/* Text Effect Animation End */

	/* Parallaxie js */
	var $parallaxie = $('.parallaxie');
	if($parallaxie.length && ($window.width() > 991))
	{
		if ($window.width() > 768) {
			$parallaxie.parallaxie({
				speed: 0.55,
				offset: 0,
			});
		}
	}

	/* Zoom Gallery screenshot */
	if ($('.gallery-items').length) {
		$('.gallery-items').magnificPopup({
			delegate: 'a',
			type: 'image',
			closeOnContentClick: false,
			closeBtnInside: false,
			mainClass: 'mfp-with-zoom',
			image: {
				verticalFit: true,
			},
			gallery: {
				enabled: true
			},
			zoom: {
				enabled: true,
				duration: 300, // don't foget to change the duration also in CSS
				opener: function(element) {
				  return element.find('img');
				}
			}
		});
	}

	/* Contact form validation */
	if ($('#contactForm').length) {
	var $contactform = $("#contactForm");
	$contactform.validator({focus: false}).on("submit", function (event) {
		if (!event.isDefaultPrevented()) {
			event.preventDefault();
			submitForm();
		}
	});

	function submitForm(){
		/* Ajax call to submit form */
		$.ajax({
			type: "POST",
			url: "form-process.php",
			data: $contactform.serialize(),
			success : function(text){
				if (text === "success"){
					formSuccess();
				} else {
					submitMSG(false,text);
				}
			}
		});
	}

	function formSuccess(){
		$contactform[0].reset();
		submitMSG(true, "Message Sent Successfully!")
	}

	function submitMSG(valid, msg){
		if(valid){
			var msgClasses = "h4 text-success";
		} else {
			var msgClasses = "h4 text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	}
	/* Contact form validation end */

	/* Animated Wow Js */	
	new WOW().init();

	/* Popup Video */
	if ($('.popup-video').length) {
		$('.popup-video').magnificPopup({
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: true
		});
	}

	/* Our Pricing Tab JS Start  */
	if ($('.our-pricing-box').length) {
		$('.our-pricing-toggle-btn').on('click', function (e) {
			e.preventDefault();
			var target = $(this).data('pricing-tab');
			var guideId = target.replace('pricing-', 'pricing-guide-');
			$('.our-pricing-toggle-btn').removeClass('active').attr('aria-selected', 'false');
			$(this).addClass('active').attr('aria-selected', 'true');
			$('.pricing-tab-item').addClass('d-none');
			$('#' + target).removeClass('d-none');
			$('.pricing-guide-panel').addClass('d-none');
			$('#' + guideId).removeClass('d-none');
		});
	}
	/* Our Pricing Tab JS End  */

	/* Theme toggle (light / dark) */
	function updateThemeToggleUi() {
		var dark = document.documentElement.getAttribute('data-color-mode') === 'dark';
		var $btn = $('#themeToggle');
		if (!$btn.length) {
			return;
		}
		$btn.attr('aria-pressed', dark ? 'true' : 'false');
		$btn.find('.theme-icon-moon').toggleClass('d-none', dark);
		$btn.find('.theme-icon-sun').toggleClass('d-none', !dark);
	}

	$(function () {
		updateThemeToggleUi();
	});

	$window.on('load', function () {
		updateThemeToggleUi();
	});

	$(document).on('click', '#themeToggle', function () {
		var cur = document.documentElement.getAttribute('data-color-mode') === 'dark' ? 'dark' : 'light';
		var next = cur === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-color-mode', next);
		try {
			localStorage.setItem('theme-preference', next);
		} catch (e) {}
		updateThemeToggleUi();
	});

})(jQuery);