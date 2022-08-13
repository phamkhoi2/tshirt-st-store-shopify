Accentuate(jQuery("#myaccount_edit"), 
  function(data) {
    if(data.status == 'OK') { 
      window.location.replace( '/account' );
    } else {
      var submit_message = "登録";
      jQuery("button.account__form-submit").attr("disabled", false);
      jQuery("button.account__form-submit").html(submit_message);
      
      var email_error_message = "更新失敗しました。";
      jQuery('#myaccount_error').html(email_error_message);
      console.log(data);
    }
  },
  function() { 
    var loading_message = "処理中...";
  	jQuery("button.account__form-submit").attr("disabled", true);
  	jQuery("button.account__form-submit").html('<i class="fa fa-spinner fa-spin"></i> ' + loading_message);
  }
); 