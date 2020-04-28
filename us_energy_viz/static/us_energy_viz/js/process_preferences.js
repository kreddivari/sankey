$(document).ready(function(){

    $("#update_notification_preferences_form").submit(function(e){
        var form_btn = $(this).find('input[type="submit"]');
        var form_result_div = '#form-result';
        $(form_result_div).remove();
        var form_btn_old_msg = form_btn.val();
        form_btn.val(form_btn.prop('disabled', true).data("loading-text"));

        var submitTo = $(this).attr('action');

        $.post({
            url: submitTo,
            data: $(this).serialize(),
        }).done(function() {
            form_btn.before('<div id="form-result" class="alert alert-success" role="alert"><i class="fa fa-check-circle"></i> <strong>Success!</strong> Your email notification settings for Globus Transfer is saved successfully.</div>');
        }).fail(function() {
            form_btn.before('<div id="form-result" class="alert alert-danger" role="alert"><i class="fa fa-warning"></i> <strong>Error!</strong> Your email notification settings for Globus Transfer can\'t be saved!</div>');
        }).always(function() {
            //$(form_result_div).html(".").fadeIn('slow');
            setTimeout(function() {
                    $(form_result_div).fadeOut('slow');
                    form_btn.val(form_btn_old_msg).prop('disabled', false);
                }, 6000);
        });

       e.preventDefault();

    });

    $("#process_extra_files_preferences_form").submit(function(e){
        var form_btn = $(this).find('input[type="submit"]');
        var form_result_div = '#form-result';
        $(form_result_div).remove();
        var form_btn_old_msg = form_btn.val();
        form_btn.val(form_btn.prop('disabled', true).data("loading-text"));

        var submitTo = $(this).attr('action');

        $.post({
            url: submitTo,
            data: $(this).serialize(),
        }).done(function() {
            form_btn.before('<div id="form-result" class="alert alert-success" role="alert"><i class="fa fa-check-circle"></i> <strong>Success!</strong> Your metadata notification settings for Globus Transfer is saved successfully.</div>');
        }).fail(function() {
            form_btn.before('<div id="form-result" class="alert alert-danger" role="alert"><i class="fa fa-warning"></i> <strong>Error!</strong> Your metadata notification settings for Globus Transfer can\'t be saved!</div>');
        }).always(function() {
            //$(form_result_div).html(".").fadeIn('slow');
            setTimeout(function() {
                    $(form_result_div).fadeOut('slow');
                    form_btn.val(form_btn_old_msg).prop('disabled', false);
                }, 6000);
        });

       e.preventDefault();

    });

});
