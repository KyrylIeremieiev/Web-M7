class App{
    jsonFile
    constructor(jsonFile){
        this.jsonFile = jsonFile;
        this.readJson();
    }

    readJson(){
        fetch(this.jsonFile).then(
            (responce) => {
            return responce.json()
        }).then((data) =>{
            this.data = data
            this.HtmlCreator()
            this.ObjectCreator()
        });
    }

    HtmlCreator(){
        this.html = new CreateHtml();
        this.buttons = new CreateButtons();
    }

    ObjectCreator(){
        this.valueCounter = new ValueCounter(this.data,this.buttons.htmlScoreButtonArr, this.buttons.htmlScoreButtonsWrapArr);

        this.transition = new Transition(this.html.questions.VraagNummer, this.html.questions.VraagBewering, 
        this.html.questions.navButtonForward, this.html.questions.navButtonBackward, 
        this.buttons.htmlScoreButtonsWrapArr, this.data, this.html.questions.progressBar);

        /*this works because the html is already created, if you were to use document.getElementById() before initializing app,
        the variable will be the element with that id as of time. Meaning that it selects the nothing, because the element with id is not created yet.
        This is done after init, it can be used because the element selection is done after the element is created.*/
        this.tie = new TieTogether(document.getElementById("js--infoSection"), document.getElementById("js--vragen"), 
        document.getElementById("js--resultSection"), document.getElementById("js--startBtn"));
    }
}


class Transition{
    htmlNomering;
    htmlElementTxt;    
    htmlElementForward;
    htmlElementBackward
    data;
    currentProgress;
    progressBar;
    currentPage;
    GoBack;
    GoForward;
    constructor(htmlNomering, htmlElementTxt, htmlElementForward, htmlElementBackward,htmlScoreButtonsWrap, data, progressBar){
        this.htmlNomering = htmlNomering;
        this.htmlElementTxt = htmlElementTxt;
        this.htmlElementForward = htmlElementForward;
        this.htmlElementBackward = htmlElementBackward;
        this.htmlScoreButtonsWrap = htmlScoreButtonsWrap;
        this.data = data;

        this.currentProgress = 0;
        this.progressBar = progressBar;
        this.progressBar.style.width = 0

        this.currentPage = 0;
        this.Question = Object.keys(this.data[0].question);

        this.Render();
        this.htmlElementForward.onclick = this.ButtonClickedForward;
        this.htmlElementBackward.onclick = this.ButtonClickedBackward;
    }

    ButtonClickedForward = () =>{
        if(this.currentPage < this.Question.length-1){
            this.currentPage += 1;

            this.GoBack=false;
            this.GoForward=true;

            this.progressBar.style.width = this.currentProgress + 100 / this.Question.length + "%";
            this.currentProgress = this.currentProgress + 100 / this.Question.length;

            this.Render();
            app.valueCounter.AssignValue(this.currentPage);
        }
        else{
            app.tie.GoToEnd();
        }
    }

    ButtonClickedBackward = () =>{
        if(this.currentPage > 0){
            this.currentPage -= 1;
            
            this.GoBack=true;
            this.GoForward=false;

            this.progressBar.style.width = this.currentProgress - 100 / this.Question.length + "%";
            this.currentProgress = this.currentProgress - 100 / this.Question.length;

            this.Render();
            app.valueCounter.ReverseValueCases(this.currentPage)
        }
    }

    Render(){
        this.htmlElementTxt.innerText = this.Question[this.currentPage];
        this.htmlNomering.innerText = "Vraag: " + parseInt(this.currentPage + 1);
        
        if(this.GoBack == true){
            this.htmlScoreButtonsWrap[this.currentPage].style.display = "grid"
            this.htmlScoreButtonsWrap[this.currentPage+1].style.display = "none"
        }
        else if(this.GoForward == true){
            this.htmlScoreButtonsWrap[this.currentPage].style.display = "grid"
            this.htmlScoreButtonsWrap[this.currentPage-1].style.display = "none"
        }
        else{
            this.htmlScoreButtonsWrap[this.currentPage].style.display = "grid"
        }

    }
    

}


class ValueCounter{
    constructor(data, htmlScoreButton, htmlScoreButtonsWrap){
        this.data = data;
        this.htmlScoreButton = htmlScoreButton;
        this.htmlScoreButtonsWrap = htmlScoreButtonsWrap;
        this.Value = Object.values(this.data[0].question);
        this.buttonWraps = document.getElementsByClassName("vragen__scoreButtonList");

        this.maxChosen = 0;
        this.TF = 0;
        this.AM = 0;
        this.AU = 0;
        this.ZE = 0;
        this.OC = 0;
        this.DV = 0;
        this.UI = 0;
        this.LS = 0;
    }

    valueCases(){
        switch(this.Value[this.currentPage-1]){
            case "TF":
                this.TF+=parseInt(this.factor);
                console.log(this.TF)
                break;
            case "AM":
                this.AM+=parseInt(this.factor);
                console.log(this.AM)
                break;
            case "AU":
                this.AU+=parseInt(this.factor);
                console.log(this.AU)
                break;
            case "ZE":
                this.ZE+=parseInt(this.factor);
                console.log(this.ZE)
                break;
            case "OC":
                this.OC+=parseInt(this.factor);
                console.log(this.OC)
                break;
            case "DV":
                this.DV+=parseInt(this.factor);
                console.log(this.DV)
                break;
            case "UI":
                this.UI+=parseInt(this.factor);
                console.log(this.UI)
                break;
            case "LS":
                this.LS+=parseInt(this.factor);
                console.log(this.LS)
                break;
        }
        this.Lockout()
        this.resultCheck()
    }

    //this is incase somebody tries to go to previous questions, so that you dont assign value extra
    ReverseValueCases(currentPage){
        this.currentPage = currentPage;
        switch(this.Value[this.currentPage]){
            case "TF":
                this.TF-=parseInt(this.factor);
                break;
            case "AM":
                this.AM-=parseInt(this.factor);
                break;
            case "AU":
                this.AU-=parseInt(this.factor);
                break;
            case "ZE":
                this.ZE-=parseInt(this.factor);
                break;
            case "OC":
                this.OC-=parseInt(this.factor);
                break;
            case "DV":
                this.DV-=parseInt(this.factor);
                break;
            case "UI":
                this.UI-=parseInt(this.factor);
                break;
            case "LS":
                this.LS-=parseInt(this.factor);
                break;
        }
    }

    resultCheck(){
        if(this.currentPage >= 39){
            this.chart = new Charts(           
            this.TF,
            this.AM,
            this.AU,
            this.ZE,
            this.OC,
            this.DV,
            this.UI,
            this.LS)
        }
    }

    AssignValue(currentPage){
        this.InputChecked = 0;
        this.currentPage = currentPage
        this.currentInputButtons = []
        //I have no clue why this works, I have no clue why it has to loop 8 times to log 7 buttons, but it works.
        //this part makes sure that the factor is changed to the value of the button at the time of going to the next question
        for(let i = 0; i < 7; i++){
            this.currentInputButtons.push(this.htmlScoreButton[this.currentPage*7+i-7])
        }

        //anytime you go forward it checks how many 10 value buttons are clicked, and adds +1 for each to this.maxChosen
        for(let y = 0; y < this.htmlScoreButton.length; y++){
            if(this.htmlScoreButton[y].checked && this.htmlScoreButton[y].value == 10){
                this.maxChosen+=1;
            }
        }

        for(let y = 0; y < this.currentInputButtons.length; y++){
            if(this.currentInputButtons[y].checked){
                this.factor = this.currentInputButtons[y].value;
            }
        } 

        //makes sure that the factor is reverted if none are selected
        for(let y = 0; y < this.currentInputButtons.length; y++){
            if(this.currentInputButtons[y].checked == false){
                this.InputChecked += 1;
            }
            //this is the easiest way i could think of. Might clean up the code later
            if(this.InputChecked == 7){
                this.factor = 0
            }
        }
        this.valueCases();
    }


    Lockout(){
        this.labelLi = document.getElementById("js--tenthBtnLi")
        this.label = document.getElementById("js--tenthBtnLabel")

        if(this.maxChosen == 3){
            this.labelLi.style.border = "#C0C0C0 0.1rem solid"
            this.label.style.color = "#C0C0C0"
            this.initInterval();
        }
        else{
            //this is mandatory, because of the way line 239-244 works
            this.maxChosen = 0
        }
    }

    initInterval(){
        this.TenthBtnBLock()
    }

    TenthBtnBLock(){
        for(let i = 0; i < this.htmlScoreButton.length; i++){
            if (this.htmlScoreButton[i].value == 10){
                this.htmlScoreButton[i].disabled = 'disabled';
                /* 
                for reverance, if you need to turn the input back on
                this.htmlScoreButton[i].removeAttribute("disabled"); 
                */
            }
        }
    }
}


class Charts{
    constructor(tf, am, au, ze, oc, dv, ui, ls){
        this.TF = tf;
        this.AM = am;
        this.AU = au;
        this.ZE = ze;
        this.OC = oc;
        this.DV = dv;
        this.UI = ui;
        this.LS = ls;

        this.CreateChart();
    }

    CreateChart(){
        this.results = document.getElementById("js--results");

         const ctx = document.getElementById('myChart');

         new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['TF', 'AM', 'AU', 'ZE', 'OC', 'DV', 'UI', 'LS'],
                datasets: [{
                    label: '# of Points',
                    data: [this.TF,
                        this.AM,
                        this.AU,
                        this.ZE,
                        this.OC,
                        this.DV,
                        this.UI,
                        this.LS,],
                    borderWidth: 1
                }]
        
            },
            //options: {
            //  scales: {
            //    y: {
            //    beginAtZero: true
            //}
            //}
            //}
        });
    }
}


class TieTogether{
    htmlStartSection
    htmlFormSection
    htmlResultSection

    constructor(htmlStartSection, htmlFormSection, htmlResultSection, htmlStartButton){
        this.htmlStartSection = htmlStartSection;
        this.htmlFormSection = htmlFormSection;
        this.htmlResultSection = htmlResultSection;
        this.htmlStartButton = htmlStartButton;

        //reset display
        this.htmlStartSection.style.display = "flex"
        this.htmlFormSection.style.display = "none"
        this.htmlResultSection.style.display = "none"

        this.htmlStartButton.onclick = this.GoToForm;
    }

    GoToForm = () =>{
        this.htmlStartSection.style.display = "none";
        this.htmlFormSection.style.display = "flex";
    }

    GoToEnd(){
        this.htmlFormSection.style.display = "none";
        this.htmlResultSection.style.display = "flex";
    }
}

class CreateButtons{
    constructor(){
        this.htmlScoreButtonArr = []
        this.htmlScoreButtonsWrapArr = []
        //Breekt de hele website, wil niet meet laden
          for(let i = 0; i < 40; i++){
            this.htmlScoreButtonsWrap = document.createElement("ul");
            this.htmlScoreButtonsWrap.classList.add("vragen__scoreButtonList");

                for(let x = 0; x < 7; x++){
                    this.htmlScoreButton = document.createElement("input");
                    this.htmlScoreButton.setAttribute("type", "radio");
                    this.htmlScoreButton.setAttribute("name", "InputButtonRadio"+i);
                    if(x < 6){
                        this.htmlScoreButton.setAttribute("value", x+1)
                    }
                    else{
                        this.htmlScoreButton.setAttribute("value", 10)
                    }
                    this.htmlScoreButton.classList.add("vragen__scoreButton");
                    this.htmlScoreButton.classList.add("js--scoreButtons");

                    this.htmlScoreLi = document.createElement("li");
                    this.htmlScoreLi.classList.add("vragen__scoreButtonListItem");
                    this.htmlScoreLi.appendChild(this.htmlScoreButton);

                    //makes array of all buttons
                    this.htmlScoreButtonArr.push(this.htmlScoreButton);
                    this.htmlScoreButtonsWrap.appendChild(this.htmlScoreLi);
                }

           
           this.htmlScoreButtonsWrapArr.push(this.htmlScoreButtonsWrap);

           document.getElementById("js--receiver").appendChild(this.htmlScoreButtonsWrap);

        }  
    }
}

class CreateHtml{
    constructor(){
        this.header = new CreateHeader();
        this.info = new CreateInfo();
        this.questions = new CreateQuestion();
    }
}


class CreateHeader{
    constructor(){
        this.createHeader()
    }


    // How it looks in Html
    /*  <header class="banner">
            <figure class="banner__logo">
                <img src="img/site-logo-2.png" alt="" class="banner__logoImage">
            </figure>
        </header> */


    createHeader(){
        this.HeaderLogo = document.createElement("img");
        this.HeaderLogo.setAttribute("src", "img/site-logo-2.png");
        this.HeaderLogo.setAttribute("alt", "De logo van Doesburg-Coaching");
        this.HeaderLogo.setAttribute("class", "banner__logoImage");

        this.HeaderFigure = document.createElement("figure");
        this.HeaderFigure.setAttribute("class", "banner__logo");
        
        //Figure appends Logo
        this.HeaderFigure.appendChild(this.HeaderLogo);

        this.HeaderBanner = document.createElement("header");
        this.HeaderBanner.setAttribute("class","banner")
        
        //Header appends Figure, body appends header
        this.HeaderBanner.appendChild(this.HeaderFigure);
        document.getElementsByTagName("body")[0].appendChild(this.HeaderBanner);
    }
}

class CreateInfo{
    constructor(){
        this.createInfo();
    }

/*  <section class="info" id="js--infoSection">
        <article class="info__textWrapper">
            <h2 class="info__text">
                Je zal zomenteen de Vragenlijst van Loopbaanankers (Schein)
                maken waaruit je zal zien welke loopbaananker het beste bij jou past Start hieronder de test
            </h2>
            <h2 class="info__text">
                Hier komt informatie te staan over de test Hier komt informatie te
                staan over de test Hier komt informatie te staan over de test
            </h2>
            <h2 class="info__text">
                Hier komt informatie te staan over de test Hier komt informatie te
                staan over de test Hier komt informatie te staan over de test
            </h2>
        </article>
        <button class="info__startButton" id="js--startBtn">Start de Test</button>
    </section>  */

    createInfo(){
        console.log("yep")
        this.FirstInfoText = document.createElement("h2");
        this.FirstInfoText.setAttribute("class", "info__text");
        this.FirstInfoText.innerText = "Je zal zomenteen de Vragenlijst van Loopbaanankers (Schein) maken waaruit je zal zien welke loopbaananker het beste bij jou past Start hieronder de test"

        this.SecondInfoText = document.createElement("h2");
        this.SecondInfoText.setAttribute("class", "info__text");
        this.SecondInfoText.innerText = "Hier komt informatie te staan over de test Hier komt informatie te staan over de test Hier komt informatie te staan over de test"
        
        this.ThirdInfoText = document.createElement("h2");
        this.ThirdInfoText.setAttribute("class", "info__text");
        this.ThirdInfoText.innerText = "Hier komt informatie te staan over de test Hier komt informatie te staan over de test Hier komt informatie te staan over de test"

        this.InfoArticle = document.createElement("article");
        this.InfoArticle.setAttribute("class", "info__textWrapper");

        //info article appends first, second and third info text
        this.InfoArticle.appendChild(this.FirstInfoText);
        this.InfoArticle.appendChild(this.SecondInfoText);
        this.InfoArticle.appendChild(this.ThirdInfoText);

        this.InfoButton = document.createElement("button");
        this.InfoButton.setAttribute("class", "info__startButton")
        this.InfoButton.setAttribute("id", "js--startBtn")
        this.InfoButton.innerText = "Start de test!"

        this.InfoSection = document.createElement("section");
        this.InfoSection.setAttribute("class", "info")
        this.InfoSection.setAttribute("id", "js--infoSection")

        //Section append article and button
        this.InfoSection.appendChild(this.InfoArticle);
        this.InfoSection.appendChild(this.InfoButton);

        //Body append Section
        document.getElementsByTagName("body")[0].appendChild(this.InfoSection);
    }
}

class CreateQuestion{
    constructor(){
        this.createQuestion();
    }
    
    //this is how the html should look like
  /*<section class="vragen" id="js--vragen">
        <div class="vragen__vraagNummerWrapper">
            <p class="vragen__vraagNummer" id="js--beweringNomering">Vraag 1:</p>
        </div>

        <h1 class="vragen__vraag" id="js--bewering">Ik droom ervan zo goed te zijn in wat ik doe dat er voortdurend
            om mijn deskundige advies wordt gevraagd
        </h1>

        <div class="vragen__labelWrapper">
            <label class="vragen__label">Niet zo zeer</label>
            <label class="vragen__label">Heel erg</label>
        </div>

        <ul class="vragen__scoreList">
            <li class="vragen__scoreListItem">
                <label for="InputFirstRadio" class="vragen__scoreListP">1</label>
            </li>
            <li class="vragen__scoreListItem">
                <label for="InputSecondRadio" class="vragen__scoreListP">2</label>
            </li>
            <li class="vragen__scoreListItem">
                <label for="InputThirdRadio" class="vragen__scoreListP">3</label>
            </li>
            <li class="vragen__scoreListItem">
                <label for="InputForthRadio" class="vragen__scoreListP">4</label>
            </li>
            <li class="vragen__scoreListItem">
                <label for="InputFifthRadio" class="vragen__scoreListP">5</label>
            </li>
            <li class="vragen__scoreListItem">
                <label for="InputSixthRadio" class="vragen__scoreListP">6</label>
            </li>
            <li class="vragen__scoreListItem" id="js--tenthBtnLi">
                <label for="InputTenthRadio" class="vragen__scoreListP" id="js--tenthBtnLabel">10</label>
            </li>
        </ul>

        <div id="js--receiver" style="height: 100%; width: 100%;"></div>

        <div class="vragen__navButtons">
            <button class="vragen__navButton" id="js--backward"> &lt; </button>
            <button class="vragen__navButton" id="js--forward"> &gt; </button>
        </div>

        <div class="vragen__progBar">
            <div class="vragen__progBarFill" id="js--progressBar"></div>
        </div>

        <p class="vragen__info">Je mag op 3 vragen die van jou het meest van toepassing zijn 10 punten geven</p>
    </section> */

    createQuestion(){
        this.VraagNummer = document.createElement("p");
        this.VraagNummer.setAttribute("class", "vragen__vraagNummer");
        this.VraagNummer.setAttribute("id", "js--beweringNomering")
        this.VraagNummer.innerText = "Vraag: 1"

        this.VraagNummerWrapper = document.createElement("div");
        this.VraagNummerWrapper.setAttribute("class", "vragen__vraagNummerWrapper");

        //Div append p
        this.VraagNummerWrapper.appendChild(this.VraagNummer);

        //this is stand alone element who doesnt have a child and whos only parent is the section
        this.VraagBewering = document.createElement("h1");
        this.VraagBewering.setAttribute("class", "vragen__vraag");
        this.VraagBewering.setAttribute("id", "js--bewering");
        this.VraagBewering.innerText = "Ik droom ervan zo goed te zijn in wat ik doe dat er voortdurend om mijn deskundige advies wordt gevraagd";

        this.VraagNietZeerLabel = document.createElement("label");
        this.VraagNietZeerLabel.setAttribute("class", "vragen__label");
        this.VraagNietZeerLabel.innerText = "Niet zo zeer";

        this.VraagErgZeerLabel = document.createElement("label");
        this.VraagErgZeerLabel.setAttribute("class", "vragen__label");
        this.VraagErgZeerLabel.innerText = "Heel erg";

        this.VraagLabelWrapper = document.createElement("div");
        this.VraagLabelWrapper.setAttribute("class", "vragen__labelWrapper")

        //div append label
        this.VraagLabelWrapper.appendChild(this.VraagNietZeerLabel);
        this.VraagLabelWrapper.appendChild(this.VraagErgZeerLabel);

        //create li(label)
        this.VraagScoreList = document.createElement("ul");
        this.VraagScoreList.setAttribute("class", "vragen__scoreList");

        for(let i = 0; i < 6; i++){
            this.VraagLabel = document.createElement("label");
            this.VraagLabel.setAttribute("class", "vragen__scoreListP");
            this.VraagLabel.innerText = i+1;
            this.VraagLi = document.createElement("li");
            this.VraagLi.setAttribute("class", "vragen__scoreListItem");
            this.VraagLi.appendChild(this.VraagLabel);
            
            this.VraagScoreList.appendChild(this.VraagLi)
        }

        this.VraagTenLabel = document.createElement("label");
        this.VraagTenLabel.setAttribute("class", "vragen__scoreListP");
        this.VraagTenLabel.setAttribute("id", "js--tenthBtnLabel")
        this.VraagTenLabel.innerText = "10"
        this.VraagTenLi = document.createElement("li");
        this.VraagTenLi.setAttribute("class", "vragen__scoreListItem");
        this.VraagTenLi.setAttribute("id", "js--tenthBtnLi")
        this.VraagTenLi.appendChild(this.VraagTenLabel);

        this.VraagScoreList.appendChild(this.VraagTenLi);

        //receiver
        this.receiver = document.createElement("div");
        this.receiver.setAttribute("id", "js--receiver");
        this.receiver.style.width = "100%";
        this.receiver.style.height = "100%";

        //forward backward buttons
        this.navButtonBackward = document.createElement("button");
        this.navButtonBackward.setAttribute("class", "vragen__navButton");
        this.navButtonBackward.setAttribute("id", "js--backward")
        this.navButtonBackward.innerText = "<"

        this.navButtonForward = document.createElement("button");
        this.navButtonForward.setAttribute("class", "vragen__navButton");
        this.navButtonForward.setAttribute("id", "js--forward");
        this.navButtonForward.innerText = ">"

        this.navButtons = document.createElement("div");
        this.navButtons.setAttribute("class", "vragen__navButtons");
        this.navButtons.appendChild(this.navButtonBackward);
        this.navButtons.appendChild(this.navButtonForward);

        //progressbar
        this.progressBar = document.createElement("div");
        this.progressBar.setAttribute("class", "vragen__progBarFill");
        this.progressBar.setAttribute("id", "js--progressBar");

        this.progressBarWrap = document.createElement("div");
        this.progressBarWrap.setAttribute("class", "vragen__progBar");
        //progress bar wrap append progress bar
        this.progressBarWrap.appendChild(this.progressBar)

        //info
        this.VraagInfo = document.createElement("p");
        this.VraagInfo.setAttribute("class", "vragen__info")
        this.VraagInfo.innerText = "Je mag op 3 vragen die van jou het meest van toepassing zijn 10 punten geven";

        this.VraagSection = document.createElement("section");
        this.VraagSection.setAttribute("class", "vragen")
        this.VraagSection.setAttribute("id", "js--vragen")

        //vragen section append everything above
        this.VraagSection.appendChild(this.VraagNummerWrapper);
        this.VraagSection.appendChild(this.VraagBewering);
        this.VraagSection.appendChild(this.VraagLabelWrapper);
        this.VraagSection.appendChild(this.VraagScoreList);
        this.VraagSection.appendChild(this.receiver);
        this.VraagSection.appendChild(this.navButtons);
        this.VraagSection.appendChild(this.progressBarWrap);
        this.VraagSection.appendChild(this.VraagInfo);
        
        document.getElementsByTagName("body")[0].appendChild(this.VraagSection);
    }

}

let app = new App("/js/loopbaanAnkers.json");