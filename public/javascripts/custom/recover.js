$(document).ready(function(){
  $('#forgot-password').on('click', function () {
    var form = $("#authorise");
    $.post('/resetPassword', $(form).serialize(), function(res) {
      console.log("got back", res);
      if (res.ourfault) {
        return $('#error').show();
      }

      res.errors.forEach(function(error){
        var invalid = $('<small class="error">Required field</small>');
        $('[name="'+error+'"').after(invalid);
      });

    });
  });
});
