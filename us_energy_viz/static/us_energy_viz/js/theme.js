"use strict";
var header = jQuery('.main_header'),
    footer = jQuery('.main_footer'),
    main_wrapper = jQuery('.main_wrapper'),
    site_wrapper = jQuery('.site_wrapper'),
    nav = jQuery('nav.main_nav'),
    menu = nav.find('ul.menu'),
    html = jQuery('html'),
    body = jQuery('body'),
    myWindow = jQuery(window),
    is_masonry = jQuery('.is_masonry'),
    pp_block = jQuery('.pp_block'),
    fl_container = jQuery('.fl-container'),
    header_rp = jQuery('.header_right_part'),
    header_lp = jQuery('.header_left_part'),
    header_rp_wrapper = jQuery('.header_rp_wrapper'),
    header_lp_wrapper = jQuery('.header_lp_wrapper'),
    prImg = [],
    body_wrapper = jQuery('.body_wrapper');

jQuery(document).ready(function($) {
    if (jQuery('.sticky_menu_on').length > 0) {
        if (html.find('.header_holder').length > 0) {} else {
            header.after("<div class='header_holder'></div>");
        }
    }
    if (jQuery('.fadeOnLoad').length > 0) {
        setTimeout("jQuery('.fadeOnLoad').animate({'opacity' : '1'}, 500)", 500);
    }

    header_height_update();

    //Main and Mobile Menu
    if (header.length > 0) {
        header.append('<div class="mobile_menu_wrapper"><ul class="mobile_menu container"/></div>');
        jQuery('.mobile_menu').html(nav.find('ul.menu').html());
        jQuery('.mobile_menu_wrapper').hide();
        jQuery('.mobile_menu_toggler').on('click', function() {
            jQuery('.mobile_menu_wrapper').slideToggle(300);
            jQuery('.main_header').toggleClass('opened');
        });
    }

    //Header Search
    jQuery('.search_toggler').on('click', function() {
        jQuery('.main_header').toggleClass('show_search');
        jQuery(this).find('i').toggleClass('fa-search');
        jQuery(this).find('i').toggleClass('fa-times');
    });

    //Likes
    jQuery('.gallery_likes_add').on('click', function() {
        var gallery_likes_this = jQuery(this);
        if (!jQuery.cookie(gallery_likes_this.attr('data-modify') + gallery_likes_this.attr('data-attachid'))) {
            jQuery.post(gt3_ajaxurl, {
                action: 'add_like_attachment',
                attach_id: jQuery(this).attr('data-attachid')
            }, function(response) {
                jQuery.cookie(gallery_likes_this.attr('data-modify') + gallery_likes_this.attr('data-attachid'), 'true', { expires: 7, path: '/' });
                gallery_likes_this.addClass('already_liked');
                gallery_likes_this.find('i').removeClass('fa-heart-o').addClass('fa-heart');
                gallery_likes_this.find('span').text(response);
            });
        }
    });

    //Grid Gallery
    if (jQuery('.gallery_grid_module').length > 0) {
        var gt3_setPad = jQuery('.gallery_grid_module').attr('data-setpad');
        jQuery('.gallery_grid_module').css({ 'margin-top': '-' + gt3_setPad, 'margin-left': '-' + gt3_setPad });

        jQuery('.gallery_grid_content').each(function() {
            var gt3_setPad = jQuery(this).attr('data-setpad');
            jQuery(this).css({ 'padding-left': gt3_setPad, 'padding-top': gt3_setPad });
        });

        jQuery('.gallery_grid_item').each(function() {
            jQuery(this).css('width', jQuery(this).attr('data-item-width') + '%');
        });
    }

    //gt3 columns
    if (jQuery('.gt3_columns_wrapper').length > 0) {
        var i_start = 1;
        var i_end = jQuery('.gt3_columns_wrapper').length;
        while (i_start <= i_end) {
            i_start++;
            var current_obj = jQuery('.gt3_columns_wrapper').first();
            var gt3_col1_html = current_obj.children('tbody').children('tr').children('.gt3_row_column1').html();
            var gt3_col2_html = current_obj.children('tbody').children('tr').children('.gt3_row_column2').html();
            current_obj.after('<div class="gt3_row_wrapper"><div class="gt3_row_col1">' + gt3_col1_html + '</div><div class="gt3_row_col2">' + gt3_col2_html + '</div></div>');
            current_obj.remove();
        }
    }

    //gt3 quote
    if (jQuery('.gt3_quote_content').length > 0) {
        jQuery('.gt3_quote_content').each(function() {
            jQuery(this).prepend('<span class="quote_holder"></span>');
        });
    }

    //gt3_stat_count
    if (jQuery('.gt3_stat_count').length > 0) {
        setTimeout("run_gt3_counter()", 500);
    }

    //Accordion
    jQuery('.gt3_shortcode_accordion_item_title').on('click', function() {
        if (!jQuery(this).hasClass('state-active')) {
            jQuery(this).parents('.gt3_accordion_wrapper').find('.gt3_shortcode_accordion_item_body').slideUp(300);
            jQuery(this).next('.gt3_shortcode_accordion_item_body').slideToggle(300);
            jQuery(this).parents('.gt3_accordion_wrapper').find('.state-active').removeClass('state-active');
            jQuery(this).addClass('state-active');
        }
    });
    jQuery('.gt3_shortcode_accordion_item_title.expanded_yes').each(function(index) {
        jQuery(this).next('.gt3_shortcode_accordion_item_body').slideDown(300);
        jQuery(this).addClass('state-active');
    });

    //toggles
    jQuery('.cmd_filter_title').on('click', function() {
        if (!jQuery(this).hasClass('state-active')) {
            //jQuery(this).parents('.gt3_accordion_wrapper').find('.gt3_shortcode_accordion_item_body').slideUp(300);
            jQuery(this).next('.cmd_filter_item_body').slideToggle(300);
            //jQuery(this).parents('.gt3_accordion_wrapper').find('.state-active').removeClass('state-active');
            jQuery(this).addClass('state-active');
        }else{
            //jQuery(this).parents('.gt3_accordion_wrapper').find('.gt3_shortcode_accordion_item_body').slideUp(300);
            jQuery(this).next('.cmd_filter_item_body').slideToggle(300);
            //jQuery(this).parents('.gt3_accordion_wrapper').find('.state-active').removeClass('state-active');
            jQuery(this).removeClass('state-active');
        }
    });
    jQuery('.cmd_filter_title.expanded_yes').each(function(index) {
        jQuery(this).next('.cmd_filter_item_body').slideDown(300);
        jQuery(this).addClass('state-active');
    });

    var $panel_group_collapse = $('.panel-group .collapse');
    $panel_group_collapse.on("show.bs.collapse", function(e) {
        $(this).closest(".panel-group").find("[href='#" + $(this).attr("id") + "']").addClass("active");
    });
    $panel_group_collapse.on("hide.bs.collapse", function(e) {
        $(this).closest(".panel-group").find("[href='#" + $(this).attr("id") + "']").removeClass("active");
    });

    if (jQuery('.global_count_wrapper').length > 0) {
        jQuery('.global_count_wrapper').removeClass('loading');
    }

    // P R E L O A D E R //
    if (jQuery('.preloader').length > 0) {
        //setTimeout("jQuery('.preloader').addClass('start_preloader')",500); //DEBUG ANIMATION
        if (jQuery('.fs_preloader').length > 0) {
            setTimeout('preImg(fsImg)', 300);
        } else {
            jQuery('.img2preload').each(function() {
                prImg.push(jQuery(this).attr('src'));
            });
            jQuery('.block2preload').each(function() {
                prImg.push(jQuery(this).attr('data-src'));
            });
            setTimeout('preImg(prImg)', 300);
        }
    }

    //Striped BG
    if (jQuery('.module_blog_stripes').length > 0) {
        jQuery('.blog_post_preview').each(function() {
            var setImg = jQuery(this).find('img').attr('src');
            jQuery(this).find('.preview_stripe_image').css('background-image', 'url(' + setImg + ')');
            jQuery(this).find('img').remove();
        });
    }

});

function preImg(imgArray) {
    if (imgArray.length > 0) {
        var perStep = 100 / imgArray.length,
            percent = 0,
            cur_step = 1,
            line1 = jQuery('.preloader_line_bar1'),
            line2 = jQuery('.preloader_line_bar2');
        for (var i = 0; i < imgArray.length; i++) {

            (function(img, src) {
                img.onload = function() {
                    percent = (cur_step * perStep) / 2;
                    line1.css('width', percent + '%');
                    line2.css('width', percent + '%');
                    if (percent >= 50) {
                        removePreloader();
                    }
                    cur_step++;
                };
                img.src = src;
            }(new Image(), imgArray[i]));
        }
    } else {
        setTimeout("removePreloader()", 500);
    }
}

function removePreloader() {
    //setTimeout("jQuery('.preloader').addClass('removePreloader'); header_height_update();", 450);
    setTimeout("jQuery('.preloader').addClass('removePreloader')", 450);
    setTimeout("jQuery('.preloader').addClass('openPreloader')", 750);
    setTimeout("jQuery('.preloader').remove()", 1300);
    if (jQuery('.fs_gallery_trigger').length > 0) {
        setTimeout("run_fs_slider()", 750);
    }
    if (jQuery('.gt3_ribbon_gallery').length > 0) {
        setTimeout("gt3_ribbon_setup()", 750);
    }
}

jQuery(window).on('resize', function() {
    header_height_update();
});

jQuery(window).on('load', function() {
    header_height_update();
});

function run_gt3_counter() {
    jQuery('.gt3_stat_count').each(function() {
        jQuery(this).attr('data-count', jQuery(this).text()).text('0');
    });
    if (jQuery(window).width() > 760) {
        jQuery('.gt3_counter_wrapper').each(function() {
            if (jQuery(this).offset().top < jQuery(window).height()) {
                if (!jQuery(this).hasClass('done')) {
                    var set_count = jQuery(this).find('.gt3_stat_count').attr('data-count');
                    jQuery(this).find('.gt3_stat_temp').stop().animate({ width: set_count }, {
                        duration: 3000,
                        step: function(now) {
                            var data = Math.floor(now);
                            jQuery(this).parents('.gt3_counter_wrapper').find('.gt3_stat_count').html(data);
                        }
                    });
                    jQuery(this).addClass('done');
                }
            } else {
                jQuery(this).waypoint(function() {
                    if (!jQuery(this).hasClass('done')) {
                        var set_count = jQuery(this).find('.gt3_stat_count').attr('data-count');
                        jQuery(this).find('.gt3_stat_temp').stop().animate({ width: set_count }, {
                            duration: 3000,
                            step: function(now) {
                                var data = Math.floor(now);
                                jQuery(this).parents('.gt3_counter_wrapper').find('.gt3_stat_count').html(data);
                            }
                        });
                        jQuery(this).addClass('done');
                    }
                }, { offset: 'bottom-in-view' });
            }
        });
    } else {
        jQuery('.gt3_counter_wrapper').each(function() {
            var set_count = jQuery(this).find('.gt3_stat_count').attr('data-count');
            jQuery(this).find('.gt3_stat_temp').animate({ width: set_count }, {
                duration: 3000,
                step: function(now) {
                    var data = Math.floor(now);
                    jQuery(this).parents('.gt3_counter_wrapper').find('.gt3_stat_count').html(data);
                }
            });
            jQuery(this).find('.stat_count');
        }, { offset: 'bottom-in-view' });
    }
}

function header_height_update() {
    if (jQuery('.sticky_menu_on').length > 0) {
        html.find('.header_holder').height(header.height());
    }
}

function masonary_init() {
    if (is_masonry.length > 0) {
        var $grid = is_masonry;

        prImg= [];
        jQuery('.img2preload').each(function() {
            prImg.push(jQuery(this).attr('src'));
        });
        setTimeout('preImg(prImg)', 100);

        $grid.imagesLoaded({ background: true })
            .always( function( instance ) {
                //console.log('all images loaded');
            })
            .done( function( instance ) {
                //console.log('all images successfully loaded');

                //$grid.masonry().masonry('destroy');

                var masonry = $grid.data('masonry');
                if (masonry !== undefined) {
                    $grid.masonry('destroy');
                }

                var items = $grid.masonry({
                    itemSelector : '.grid_blog_element',
                    percentPosition: true,
                    fitWidth: true,
                    horizontalOrder: true,
                }).masonry('reloadItems');

                var elems = $grid.masonry('getItemElements');

                if (elems.length == 0){
                    //alert('No video found!');
                    $("#no-video-found").show();
                }else{
                    $("#no-video-found").hide();
                    var videoGIFs = new freezeframe({'selector': '.img2preload', 'overlay': true}).freeze();
                }

                header_height_update();
            })
            .fail( function() {
                console.log('all images loaded, at least one is broken');
            })
            .progress( function( instance, image ) {
                //console.log($(image.img).hasClass('ff-image-ready'));
                if (!$(image.img).hasClass('ff-image-ready')) {
                    $(image.img).addClass('ff-image-ready');
                }
                //var result = image.isLoaded ? 'loaded' : 'broken';
                //console.log( 'image is ' + result + ' for ' + image.img.src );
            });
    }
}

function particleBody_init() {
    $("#particles-js").length && window.particlesJS && particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#6b6b6b"
            },
            "shape": {
                "type": "edge",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 4
                },
                "image": {
                    "src": "img/github.svg",
                    "width": 100,
                    "height": 100
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 4,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#c8c8c8",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 3,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    })
}

function animateList() {
    jQuery('.loading:first').removeClass('loading').animate({
        'z-index': '15'
    }, 200, function() {
        animateList();

        if (is_masonry.length > 0) {
            is_masonry.masonry();
        }
    });
};