$(document).ready(function(){
  $('#forgot-password').on('click', function () {
    var form = $("#authorise");
    $.post('/resetPassword', $(form).serialize(), function(res) {
      if (res.ourfault) {
        return $('#error').show();
      }

      if (res.errors) {
        res.errors.forEach(function(error){
          if ($('#'+error+'-error').length == 0) {
            var invalid = $('<small class="error" id="'+error+'-error">Required field</small>');
            $('[name="'+error+'"').after(invalid);
          }
        });
      }

      if (res.success) {
        var success = $('<div class="row"><div class="large-12 columns"><div data-alert class="alert-box success radius">'+res.success+'</div></div></div>');
        $('.panel').before(success);
      }

    });
  });
});
