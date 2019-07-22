const RegisterPost = async () => {
    const ema = document.getElementById('singup_email').value;
    const use = document.getElementById('singup_username').value;
    const pas = document.getElementById('singup_password').value;

    var http = new XMLHttpRequest();
    var url = '/users/register';
    var params = 'email=' + ema + '&password=' + pas + '&username=' + use;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(params);
};

const LoginPost = async () => {
    const use = document.getElementById('signin_username').value;
    const pas = document.getElementById('signin_password').value;

    var http = new XMLHttpRequest();
    var url = '/users/login';
    var params = 'password=' + pas + '&username=' + use;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(params);
}