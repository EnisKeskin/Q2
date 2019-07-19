const addQuiz = async () => {
    const e_loca = document.getElementById('quiz_location');
    const loca = e_loca.options[e_loca.selectedIndex].value;
    const e_visi = document.getElementById('quiz_visibility');
    const visi = e_visi.options[e_visi.selectedIndex].value;
    const e_lang = document.getElementById('quiz_language');
    const lang = e_lang.options[e_lang.selectedIndex].value;

    const titl = document.getElementById('quiz_title').value;
    const desc = document.getElementById('quiz_desc').value;
    const img_name = document.getElementById('quiz_img').name;

    var http = new XMLHttpRequest();
    var url = '/quiz';
    var params = 'location=' + loca + '&title=' + titl + '&description=' + desc + '&language=' + lang + '&img=' + img_name;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(params);
}