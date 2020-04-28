var options = {
    valueNames: [
        'name', 'folder', 'description', 'at',
    ],
    page: 6,
    pagination: true,
};

var listCompleteFunction = function(){

    var promises = [];

    for(var i = 0; i < download_list.visibleItems.length; i++){
        var jq = $(download_list.visibleItems[i].elm).find('img.img2preload');
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
            if ($('.preloader').length == 0) {
                $('<div class="preloader"><div class="preloader_content"><span>LOADING</span><div class="preloader_line"><div class="preloader_line_bar1"></div><div class="preloader_line_bar2"></div></div></div></div>').insertBefore("footer");
            }
            masonary_init();
        });
};


var download_list = new List('downloadcontainer', options);

download_list.on('searchComplete', function(){
    listCompleteFunction();
});

download_list.on('sortComplete', function(){
    listCompleteFunction();
});

$(document).ready(function(){
    if(typeof listCompleteFunction != "undefined")
        listCompleteFunction();
});

