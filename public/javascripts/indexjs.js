const EnterGame = async () => {
    const pin = document.getElementById('index_pin').value;

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