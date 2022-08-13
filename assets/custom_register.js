Accentuate(jQuery("#create_customer"), 
  function(data) {
    if(data.status == 'OK') { 
      var login_data = {
        "form_type": "customer_login",
        "customer[email]": jQuery("#email").val(),
        "customer[password]": jQuery("#password").val()
      };
      jQuery.post( "/account/login", login_data)
      .done(function( data ) {
        window.location.replace( '/account' );
      });
    } else {
      // Remove spinner here
      var submit_message = "登録";
      jQuery("button.account__form-submit").attr("disabled", false);
      jQuery("button.account__form-submit").html(submit_message);
      var error_message = "登録失敗しました";
      if ( data.errors.email == 'has already been taken') {
      	error_message = "メールはすでに使用されています";
        jQuery("#email").focus();
        jQuery('#email_error').html(error_message);
      } else if( data.errors.email == 'is invalid') {
        error_message = "メールアドレスのフォーマットが不正です。";
        jQuery("#email").focus();
        jQuery('#email_error').html(error_message);
      } else{
        jQuery("#LastName").focus();
        jQuery('#noti_error').html(error_message);
      }
      
      
      
      console.log(data);
    }
  },
  function() { 
	jQuery('#email_error').html("");
  	jQuery('#confirm_error').html("");
  	jQuery('#noti_error').html("");
  
    if (jQuery("#password").val() != jQuery("#confirm_password").val()) {
      var confirm_password_error_message = "パスワードと確認パスワードが一致しません";
      jQuery('#confirm_error').html(confirm_password_error_message);
      jQuery("#confirm_password").focus();
      return false 
    } else {
        jQuery('#confirm_error').empty();
    }

    // Use spinner here
    var loading_message = "処理中...";
    jQuery("button.account__form-submit").attr("disabled", true);
  	jQuery("button.account__form-submit").html('<i class="fa fa-spinner fa-spin"></i> ' + loading_message);
  }
); 