$(document).ready(() => {
  $('button#submit').click(() => {
    const data = {
      username: $('#inputUsername').val(),
      password: $('#inputPassword').val(),
      remember: 1,
    };
    $.post({
      data,
      url: '/login',
      headers: { contentType: 'application/json', cacheControl: 'no-cache' },
    }).done((res) => {
      if (res.rc === 0) {
        window.location.href = '/';
      } else {
        alert(res.error);
      }
    }).fail((err) => {
      alert(err);
    });
    return false;
  });
});
