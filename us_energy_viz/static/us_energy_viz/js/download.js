
var downloadAjax = function(){

    var downloadLink = '';

    $("#dialog-confirm").dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Download": function(e) {
                $(this).dialog("close");
                if(downloadLink != ''){
                    $.get({
                        url: downloadLink,
                    }).done(function() {
                        $('#download-message').html('<div class="alert alert-success" role="alert"><i class="fa fa-check-circle"></i> <strong>Success!</strong> Your video is downloaded successfully. Please go to your personal globus endpoint to view it.</div>').show();
                    }).fail(function() {
                        $('#download-message').html('<div class="alert alert-danger" role="alert"><i class="fa fa-warning"></i> <strong>Error!</strong> Your download request can\'t be processed this time!</div>').show();
                    }).always(function() {
                        setTimeout(function() {
                            $('#download-message').fadeOut('slow');
                        }, 6000);
                    });

                    e.preventDefault();
                }
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });

    $("a.download").off('click').on('click', function(event){
        $("#dialog-confirm").dialog( "open" );
        downloadLink = $(this).attr('href');
        event.preventDefault();//Do not proceed with click
    });

};

$(document).ready(function(){
    downloadAjax();
});
