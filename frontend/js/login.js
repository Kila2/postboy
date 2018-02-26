$(document).ready(function () {
    let callback;
    let json;
    $("button#submit").click(function () {
      let data = {
        username: $('#inputUsername').val(),
        password: $('#inputPassword').val(),
        remember: 1
      };
      $.post({
        data: data,
        url: '/login',
        headers: {contentType: 'application/json', cacheControl: 'no-cache'}
      }).done(function (res) {
        if (res.rc === 0) {
          window.location.href = "/";
        }
        else {
          alert(res.error);
        }
      }).fail(function (err) {
        alert(err)
      })
      return false;
    });
  });