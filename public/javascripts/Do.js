var commands = {
    GH: function (param) {
        GameHandlebars(param);
    },
    QH: function (param) {
        QuestionHandlebars(param);
    }
}
function GameHandlebars(data) {

    var source =
        "<div class=\"container players-content\">" +
        "<div class=\"players-top\">" +
        "    {{pin}} " +
        "</div>" +
        "    <div class=\"players-bottom\">" +
        "    {{#each players}}" +
        "    <div>{{this.name}}</div>" +
        "    {{/each}}" +
        " </div>" +
        "</div>" +
        "<div class=\"container-fluid players-start\">" +
        "    <div class=\"players-number\">" +
        "        {{num}} <br> Players" +
        "    </div>" +
        "    <div class=\"button-start\">" +
        "        <button class=\"btn-start\" type=\"button\" onclick=\"emit()\">Start</button>" +
        "    </div>" +
        "</div>";
    var template = Handlebars.compile(source);
    var html = template(data);
    document.getElementById("Content").innerHTML = html;
}

function QuestionHandlebars(data) {
    var source =
        "<div class=\"container answer-contet\">" +
        "<div class=\"answer-top\">" +
        "  <div class=\"answer-image\">" +
        "    <img src=\"images/thumb-1920-943148.jpg\" alt=\"\">" +
        "  </div>" +
        "  <div class=\"answer-question\">" +
        "    {{question}}" +
        "    <div class=\"triangle\">" +
        "    </div>" +
        "  </div>" +
        "</div>" +
        "<div class=\"progressbar\">" +
        "</div>" +
        "</div>" +
        "<div class=\"answer-bottom\">" +
        "<div class=\"container answer-bottom-in\">" +
        "  <div class=\"row\">" +
        "    <div class=\"col-md-6\">" +
        "      <div class=\"answer-1\">" +
        "        {{answer1}}" +
        "      </div>" +
        "    </div>" +
        "    <div class=\"col-md-6\">" +
        "      <div class=\"answer-2\">" +
        "        {{answer2}}" +
        "      </div>" +
        "    </div>" +
        "    <div class=\"col-md-6\">" +
        "      <div class=\"answer-3\">" +
        "        {{answer3}}" +
        "      </div>" +
        "    </div>" +
        "    <div class=\"col-md-6\">" +
        "      <div class=\"answer-4\">" +
        "        {{answer4}}" +
        "      </div>" +
        "    </div>" +
        "  </div>" +
        "</div>" +
        "</div>";
    var template = Handlebars.compile(source);
    var html = template(data);
    document.getElementById("Content").innerHTML = html;
}