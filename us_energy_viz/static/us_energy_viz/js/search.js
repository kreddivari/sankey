var options = {
    valueNames: ['name', 'folder', 'path', 'frameRate', 'number_of_frames', 'timestamp', 'number_of_errors',
        'aperture', 'binning', 'color', 'distance', 'exposure', 'date', 'description', 'lens', 'imageSize',
        'frameTimes'
    ],
    page: 12,
    pagination: true,
};

var listCompleteFunction = function(){

    var promises = [];

    for(var i = 0; i < video_list.visibleItems.length; i++){
        var jq = $(video_list.visibleItems[i].elm).find('img.img2preload');
        jq[0].src = jq.attr('data-src');
        var promise = new $.Deferred();
        jq.attr('data-i', i);//A trick to enable the element to "remember" which promise is associated with it. Might change in the future
        jq[0].onload = function(){
            promises[+$(this).attr('data-i')].resolve();
        }
        promises.push(promise);

    }

    //See https://stackoverflow.com/a/20688889
    $.when.apply(undefined, promises)
        .done(function(){
            //console.log("Masonary init here");
            if ($('.preloader').length == 0) {
                $('<div class="preloader"><div class="preloader_content"><span>LOADING</span><div class="preloader_line"><div class="preloader_line_bar1"></div><div class="preloader_line_bar2"></div></div></div></div>').insertBefore("footer");
            }
            masonary_init();
            downloadAjax();//Note: Based on index.html, if the user is logged in this will call `download.js` which will
                           //turn the download links into AJAX requests. If they are not logged in, this will call
                           //`download_dummy.js` which will simply
        });
};

var video_list = new List('container', options);

$("#txtSearch").on('input', function(){
    //Causes a search to occur .5 seconds after that search box is changed, provided it remains unchanged after these .5 seconds
    //If it is changed, no search occurs as a result of this instantiation of this function - but because this is an on-change
    //another search will be caused by that instantiation of this function.

    //This fixes the problem whereby typing in new letters caused the search to run, which caused the loading screen to pop
    //and persist for a little bit (because loading these gifs inherently takes some time).

    //Basically, this is designed so that the search only occurs when the user intends for it.

    var currentVal = $(this).val();

    setTimeout(function(){
        var newVal = $("#txtSearch").val();
        if(currentVal == newVal)
            video_list.search(newVal);
    }, 500);

});

video_list.on('searchComplete', function(){
    var searchVal = $("input.search").val();
    Cookies.set("searchVal", searchVal);
    listCompleteFunction();
});

video_list.on('filterComplete', listCompleteFunction);


var filter_function = function(item){

    var returnMe = true;//Rather than returning false immediately, we use this to that all of the cookies can be set

    var values = item.values();

    var acceptable_categories = $("#category-list").find("input:checked").map(
        function(){
            return $(this).val().toLowerCase();
        }
    ).get();

    Cookies.set("acceptable_categories", JSON.stringify(acceptable_categories));

    if(acceptable_categories.length){//Some categories are checked
        if(acceptable_categories.indexOf(values.folder.toLowerCase()) < 0)//Not found
            returnMe = false;//See note above
    }

    var acceptable_frame_rates = $("#frame-rate-list").find("input:checked").map(
        function(){
            return $(this).val().toLowerCase();//The toLowerCase isn't needed here, but I will keep it for consistency.
        }
    ).get();

    Cookies.set("acceptable_frame_rates", JSON.stringify(acceptable_frame_rates));

    if(acceptable_frame_rates.length){
        if(acceptable_frame_rates.indexOf((+values.frameRate).toString()) < 0)
            returnMe = false;//See note above
    }

    var acceptable_apertures = $("#aperture-list").find("input:checked").map(
        function(){
            return $(this).val().toLowerCase();
        }
    ).get();

    Cookies.set("acceptable_apertures", JSON.stringify(acceptable_apertures));

    if(acceptable_apertures.length){
        if(acceptable_apertures.indexOf(values.aperture.toLowerCase()) < 0)
            returnMe = false;//See note above
    }

    var acceptable_binnings = $("#binning-list").find("input:checked").map(
        function(){
            return $(this).val().toLowerCase();
        }
    ).get();

    Cookies.set("acceptable_binnings", JSON.stringify(acceptable_binnings));

    if(acceptable_binnings.length){
        if(acceptable_binnings.indexOf(values.binning.toLowerCase()) < 0)
            returnMe = false;//See note above
    }

    var acceptable_lenses = $("#lens-list").find("input:checked").map(
        function(){
            return $(this).val();
        }
    ).get();

    Cookies.set("acceptable_lenses", JSON.stringify(acceptable_lenses))

    if(acceptable_lenses.length){
        if(acceptable_lenses.indexOf(values.lens) < 0)
        returnMe = false;
    }

    var acceptable_imageSizes= $("#imageSize-list").find("input:checked").map(
        function(){
            return $(this).val();
        }
    ).get();

    Cookies.set("acceptable_imageSizes", JSON.stringify(acceptable_imageSizes))

    if(acceptable_imageSizes.length){
        if(acceptable_imageSizes.indexOf(values.imageSize) < 0)
        returnMe = false;
    }

    if($("#timestamp_required").prop('checked')){
        Cookies.set("timestamp_required", "true");
        if(values.timestamp != "timestamp")
            returnMe = false;//See note above
    }
    else
        Cookies.set("timestamp_required", undefined);//Setting to false yields the string "false" which isn't helpful

    if($("#color_required").prop('checked')){
        Cookies.set("color_required", "true");
        if(values.color != "color")
            returnMe = false;//See note above
    }
    else
        Cookies.set("color_required", undefined);

    if($("#frameTimes_required").prop('checked')){
        Cookies.set("frameTimes_required", "true");
        if(values.frameTimes != "frameTimes")
            returnMe = false;//See note above
    }
    else
        Cookies.set("frameTimes_required", undefined);


    var number_of_frames_values = $("#number-of-frames-slider").slider('values');
    Cookies.set("number_of_frames_values", JSON.stringify(number_of_frames_values));

    var number_of_frames_min = $("#number-of-frames-slider").slider('option', 'min');//Initial min
    var number_of_frames_max = $("#number-of-frames-slider").slider('option', 'max');

    if(number_of_frames_values[0] != number_of_frames_min || number_of_frames_values[1] != number_of_frames_max){//Slider moved
        if(values.number_of_frames < number_of_frames_values[0] || values.number_of_frames > number_of_frames_values[1])
            returnMe = false;//See note above
    }

    var number_of_errors_values = $("#number-of-errors-slider").slider('values');
    Cookies.set("number_of_errors_values", JSON.stringify(number_of_errors_values));

    var number_of_errors_min = $("#number-of-errors-slider").slider('option', 'min');//Initial min
    var number_of_errors_max = $("#number-of-errors-slider").slider('option', 'max');

    if(number_of_errors_values[0] != number_of_errors_min || number_of_errors_values[1] != number_of_errors_max){//Slider moved
        if(values.number_of_errors < number_of_errors_values[0] || values.number_of_errors > number_of_errors_values[1])
            returnMe = false;//See note above
    }

    var distance_values = $("#distance-slider").slider('values');
    Cookies.set("distance_values", JSON.stringify(distance_values));

    var distance_min = $("#distance-slider").slider('option', 'min');//Initial min
    var distance_max = $("#distance-slider").slider('option', 'max');

    if(distance_values[0] != distance_min || distance_values[1] != distance_max){//Slider moved
        if(values.distance < distance_values[0] || values.distance > distance_values[1])
            returnMe = false;//See note above
    }

    var date_values = $("#slider-range").slider('values');
    Cookies.set("date_values", JSON.stringify(date_values));

    var date_min = $("#slider-range").slider('option', 'min');
    var date_max = $("#slider-range").slider('option', 'max');

    if(date_values[0] != date_min || date_values[1] != date_max){
        if((new Date(values.date) < new Date(date_values[0] * 1000)) || (new Date(values.date * 1000) > new Date(date_values[1] * 1000)))
            returnMe = false;//See note above
    }

    return returnMe;
}

var change_function = function(){
    video_list.filter(filter_function);
};

$(".filter").on('change', change_function).on('slidechange', change_function);

var setFromCookie = function(){
    /*
    Some inelegant javascript to persist filtering settings within the session using cookies. In particular, it allows
    the user to return to the same filtering settings after logging in (either through the button or by requesting a
    download). Some code above does the same for searching.
    */

    var searchVal = Cookies.get('searchVal');
    if(searchVal){
        $("input.search").val(searchVal);
        video_list.search(searchVal);
    }

    var acceptable_categories = Cookies.get('acceptable_categories');
    if(acceptable_categories){
        var acceptable_categories_as_json = JSON.parse(acceptable_categories);
        $("#category-list").find('input').each(function(){
            var lc_val = $(this).val().toLowerCase();
            if(acceptable_categories_as_json.indexOf(lc_val) >= 0)
                $(this).prop('checked', true);
            else
                $(this).prop('checked', false);
        });
    }

    var acceptable_frame_rates = Cookies.get('acceptable_frame_rates');
    if(acceptable_frame_rates){
        var acceptable_frame_rates_as_json = JSON.parse(acceptable_frame_rates);
        $("#frame-rate-list").find('input').each(function(){
            var lc_val = $(this).val().toLowerCase();
            if(acceptable_frame_rates_as_json.indexOf(lc_val) >= 0)
                $(this).prop('checked', true);
            else
                $(this).prop('checked', false);
        });
    }

    var acceptable_apertures = Cookies.get('acceptable_apertures');
    if(acceptable_apertures){
        var acceptable_apertures_as_json = JSON.parse(acceptable_apertures);
        $("#aperture-list").find('input').each(function(){
            var lc_val = $(this).val().toLowerCase();
            if(acceptable_apertures_as_json.indexOf(lc_val) >= 0)
                $(this).prop('checked', true);
            else
                $(this).prop('checked', false);
        });
    }

    var acceptable_binnings = Cookies.get('acceptable_binnings');
    if(acceptable_binnings){
        var acceptable_binnings_as_json = JSON.parse(acceptable_binnings);
        $("#binning-list").find('input').each(function(){
            var lc_val = $(this).val().toLowerCase();
            if(acceptable_binnings_as_json.indexOf(lc_val) >= 0)
                $(this).prop('checked', true);
            else
                $(this).prop('checked', false);
        });
    }

    var acceptable_lenses = Cookies.get('acceptable_lenses');
    if(acceptable_lenses){
        var acceptable_lenses_as_json = JSON.parse(acceptable_lenses);
        $("#lens-list").find('input').each(function(){
            var val = $(this).val();
            if(acceptable_lenses_as_json.indexOf(val) >= 0)
                $(this).prop('checked', true);
            else
                $(this).prop('checked', false);
        });
    }

    var acceptable_imageSizes = Cookies.get('acceptable_imageSizes');
    if(acceptable_imageSizes){
        var acceptable_imageSizes_as_json = JSON.parse(acceptable_imageSizes);
        $("#imageSize-list").find('input').each(function(){
            var val = $(this).val();
            if(acceptable_imageSizes_as_json.indexOf(val) >= 0)
                $(this).prop('checked', true);
            else
                $(this).prop('checked', false);
        });
    }

    var timestamp_required = Cookies.get('timestamp_required');
    if(timestamp_required)
        $("#timestamp_required").prop('checked', true);
    else
        $("#timestamp_required").prop('checked', false);

    var color_required = Cookies.get('color_required');
    if(color_required)
        $("#color_required").prop('checked', true);
    else
        $("#color_required").prop('checked', false);

    var frameTimes_required = Cookies.get('frameTimes_required');
    if(frameTimes_required)
        $("#frameTimes_required").prop('checked', true);
    else
        $("#frameTimes_required").prop('checked', false);


    var number_of_frames_values = Cookies.get('number_of_frames_values');
    var number_of_errors_values = Cookies.get('number_of_errors_values');
    var distance_values = Cookies.get('distance_values');
    var date_values = Cookies.get('date_values');

    if(number_of_frames_values){
        var number_of_frames_values_as_json = JSON.parse(number_of_frames_values);
        $("#number-of-frames-slider").slider('values', number_of_frames_values_as_json);//See note below
    }


    if(number_of_errors_values){
        var number_of_errors_values_as_json = JSON.parse(number_of_errors_values);
        $("#number-of-errors-slider").slider('values', number_of_errors_values_as_json);//See note below
    }

    if(distance_values){
        var distance_values_as_json = JSON.parse(distance_values);
        $("#distance-slider").slider('values', distance_values_as_json);//See note below
    }

    if(date_values){
        var date_values_as_json = JSON.parse(date_values);
        $("#slider-range").slider('values', date_values_as_json);//See note below
    }

    video_list.filter(filter_function);//NOTE: This call is probably not necessary, because setting the values for the
    //slider will trigger a slidechange event which will in turn trigger a filter_function event.

};

$(document).ready(function(){
    setFromCookie();
});
