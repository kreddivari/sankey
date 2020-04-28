(function($) {
    "use strict";

    var RCC = {};

    /* ---------------------------------------------------------------------- */
    /* -------------------------- Declare Variables ------------------------- */
    /* ---------------------------------------------------------------------- */
    var $document = $(document);
    var $document_body = $(document.body);
    var $window = $(window);
    var $html = $('html');
    var $body = $('body');


    RCC.isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (RCC.isMobile.Android() || RCC.isMobile.BlackBerry() || RCC.isMobile.iOS() || RCC.isMobile.Opera() || RCC.isMobile.Windows());
        }
    };

    RCC.isRTL = {
        check: function() {
            if ($("html").attr("dir") == "rtl") {
                return true;
            } else {
                return false;
            }
        }
    };

    RCC.urlParameter = {
        get: function(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        }
    };


    RCC.initialize = {

        init: function() {
            //RCC.initialize.TM_wow();
        },

        /* ---------------------------------------------------------------------- */
        /* ------------------------------ preloader  ---------------------------- */
        /* ---------------------------------------------------------------------- */
        TM_preLoaderClickDisable: function() {
            var $preloader = $('#preloader');
            $preloader.children('#disable-preloader').on('click', function(e) {
                $preloader.fadeOut();
                return false;
            });
        },

        TM_preLoaderOnLoad: function() {
            var $preloader = $('#preloader');
            $preloader.delay(200).fadeOut('slow');
        },


        /* ---------------------------------------------------------------------- */
        /* ------------------------------- Platform detect  --------------------- */
        /* ---------------------------------------------------------------------- */
        TM_platformDetect: function() {
            if (RCC.isMobile.any()) {
                $html.addClass("mobile");
            } else {
                $html.addClass("no-mobile");
            }
        },


        /* ---------------------------------------------------------------------- */
        /* ------------------------------ Hash Forwarding  ---------------------- */
        /* ---------------------------------------------------------------------- */
        TM_hashForwarding: function() {
            if (window.location.hash) {
                var hash_offset = $(window.location.hash).offset().top;
                $("html, body").animate({
                    scrollTop: hash_offset
                });
            }
        },


        /* ---------------------------------------------------------------------- */
        /* -------------------------- Background Parallax ----------------------- */
        /* ---------------------------------------------------------------------- */
        TM_parallaxBgInit: function() {
            if (!RCC.isMobile.any()) {
                $.stellar({
                    horizontalScrolling: false,
                    responsive: true,
                });
            } else {
                $('.parallax').addClass("mobile-parallax");
            }
        },



        /* ---------------------------------------------------------------------- */
        /* ---------------------------- Wow initialize  ------------------------- */
        /* ---------------------------------------------------------------------- */
        TM_wow: function() {
            var wow = new WOW({
                mobile: false // trigger animations on mobile devices (default is true)
            });
            wow.init();
        },

    };


    /* ---------------------------------------------------------------------- */
    /* ---------- document ready, window load, scroll and resize ------------ */
    /* ---------------------------------------------------------------------- */
    //document ready
    RCC.documentOnReady = {
        init: function() {
            RCC.initialize.init();
            RCC.header.init();
            RCC.slider.init();
            RCC.widget.init();
            RCC.windowOnscroll.init();
            $.stellar('refresh');
        }
    };

    //window on load
    RCC.windowOnLoad = {
        init: function() {
            var t = setTimeout(function() {
                RCC.initialize.TM_wow();
                //RCC.widget.TM_twittie();
                RCC.initialize.TM_preLoaderOnLoad();
                //RCC.initialize.TM_hashForwarding();
                RCC.initialize.TM_parallaxBgInit();
            }, 0);
            $window.trigger("scroll");
            $window.trigger("resize");
        }
    };

    //window on scroll
    RCC.windowOnscroll = {
        init: function() {
            $window.on('scroll', function() {
                RCC.header.TM_scroolToTop();
                RCC.header.TM_activateMenuItemOnReach();
                RCC.header.TM_topnavAnimate();
            });
        }
    };

    //window on resize
    RCC.windowOnResize = {
        init: function() {
            var t = setTimeout(function() {
                RCC.initialize.TM_equalHeightDivs();
                RCC.initialize.TM_resizeFullscreen();
                $.stellar('refresh');
            }, 400);
        }
    };


    /* ---------------------------------------------------------------------- */
    /* ---------------------------- Call Functions -------------------------- */
    /* ---------------------------------------------------------------------- */
    $document.ready(
        RCC.documentOnReady.init
    );
    $window.load(
        RCC.windowOnLoad.init
    );
    $window.on('resize',
        RCC.windowOnResize.init
    );

    //call function before document ready
    RCC.initialize.TM_preLoaderClickDisable();

})(jQuery);