var commands = {
    GH: function (param) {
        GameHandlebars(param);
    },
    QH: function (param) {
        QuestionHandlebars(param);
    },
    SH: function (param) {
        StatisticsHandlebars(param);
    },
    SBH: function (param) {
        ScoreBoardHandlebars(param);
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
    var source = ""
        + "<div class=\"container answer-contet\">"
        + "    <div class=\"answer-top\">"
        + "        <div class=\"answer-top-in\">"
        + "            <div class=\"answer-image\">"
        + "            </div>"
        + "            <div class=\"answer-question\">"
        + "                {{question}}"
        + "                <div class=\"triangle\">"
        + "                </div>"
        + "            </div>"
        + "        </div>"
        + "        <div class=\"progressbar\">"
        + "        </div>"
        + "    </div>"
        + "    <div class=\"answer-bottom\">"
        + "       <div class=\"container answer-bottom-in\">"
        + "            <div class=\"row\">"
        + "                <div class=\"col-md-6\" class=\"col-md-6\">"
        + "                    <button type=\"submit\" class=\"answer-1\" onclick=\"answer(0)\">{{answer1}}</button>"
        + "                </div>"
        + "                <div class=\"col-md-6\" class=\"col-md-6\">"
        + "                    <button type=\"submit\" class=\"answer-2\" onclick=\"answer(1)\">{{answer2}}</button>"
        + "                </div>"
        + "                <div class=\"col-md-6\">"
        + "                    <button type=\"submit\" class=\"answer-3\" onclick=\"answer(2)\">{{answer3}}</button>"
        + "                </div>"
        + "                <div class=\"col-md-6\">"
        + "                    <button type=\"submit\" class=\"answer-4\" onclick=\"answer(3)\">{{answer4}}</button>"
        + "                </div>"
        + "            </div>"
        + "        </div>"
        + "    </div>"
        + "</div>";
    var template = Handlebars.compile(source);
    var html = template(data);
    document.getElementById("Content").innerHTML = html;
}

function StatisticsHandlebars(data) {
    var source =
        `<div class="container answer-contet">
    <div class="answer-top">
        <div class="statistics" style="display:flex;">
            <div style="display:flex;" class="statistics-item">
                <span class="statistics-item-label">{{count.[0]}}</span>
                <div class="statistics-item-fill statistics-item-fill-1" style="height: {{percent.[0]}}%"></div>
            </div>
            <div class="statistics-item">
                <span class="statistics-item-label">{{count.[1]}}</span>
                <div class="statistics-item-fill statistics-item-fill-2" style="height: {{percent.[1]}}%;"></div>
            </div>
            <div class="statistics-item">
                <span class="statistics-item-label">{{count.[2]}}</span>
                <div class="statistics-item-fill statistics-item-fill-3" style="height: {{percent.[2]}}%"></div>
            </div>
            <div class="statistics-item">
                <span class="statistics-item-label">{{count.[3]}}</span>
                <div class="statistics-item-fill statistics-item-fill-4" style="height: {{percent.[3]}}%;"></div>
            </div>
        </div>
        <div class="progressbar">
        </div>
    </div>
    <div class="answer-bottom">
        <div class="container answer-bottom-in">
            <div class="row">
                <div class="col-md-6">
                    <button type="button" style="background:{{color.[0]}}" class="answer-1"> {{answer.[0]}}</button>
                </div>
                <div class="col-md-6">
                    <button type="button" style="background:{{color.[1]}}" class="answer-2">{{answer.[1]}}</button>
                </div>
                <div class="col-md-6">
                    <button type="button" style="background:{{color.[2]}}" class="answer-3">{{answer.[2]}}</button>
                </div>
                <div class="col-md-6">
                    <button type="button" style="background:{{color.[3]}}" class="answer-4">{{answer.[3]}}</button>
                </div>
            </div>
        </div>
    </div>
</div>`;
    var template = Handlebars.compile(source);
    var html = template(data);
    document.getElementById("Content").innerHTML = html;
}

function AnswerHandlebars(data) {
    var source = ``;
    var template = Handlebars.compile(source);
    var html = template(data);
    document.getElementById("Content").innerHTML = html;
}

function ScoreBoardHandlebars(data) {
    var source =
        `<div class="capsule">
    <div class="score-title">
        <h1 class="h1 h1-score">Scoreboard</h1>
    </div>
    <div class="container score-content">
        <div class="score-block-1st">
            <span> {{first.name}} </span> <span> {{first.point}} </span>
            <img src="images/user-icon/medal.png" class="img-medal" alt="">
            <div class="block-1st">
            </div>
        </div>
        {{#each results}}
        <div class="score-block">
            <span> {{this.name}} </span> <span> {{this.point}} </span>
        </div>
        {{/each}}
    </div>
</div>`;
    var template = Handlebars.compile(source);
    var html = template(data);
    document.getElementById("Content").innerHTML = html;
}