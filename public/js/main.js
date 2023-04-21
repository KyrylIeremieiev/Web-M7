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
        document.getElementById("js--resultSection"), document.getElementById("js--startBtn"), 
        document.getElementById("js--inleveren"), document.getElementById("js--inleveren-back"), document.getElementById("js--inleveren-forward"));
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

        setInterval(() =>{this.Lockout()}, 33); 
    }

    valueCases(){
        switch(this.Value[this.currentPage-1]){
            case "TF":
                this.TF+=parseInt(this.factor);
                break;
            case "AM":
                this.AM+=parseInt(this.factor);
                break;
            case "AU":
                this.AU+=parseInt(this.factor);
                break;
            case "ZE":
                this.ZE+=parseInt(this.factor);
                break;
            case "OC":
                this.OC+=parseInt(this.factor);
                break;
            case "DV":
                this.DV+=parseInt(this.factor);
                break;
            case "UI":
                this.UI+=parseInt(this.factor);
                break;
            case "LS":
                this.LS+=parseInt(this.factor);
                break;
        }
        this.resultCheck()
    }

    //this is incase somebody tries to go to previous questions, so that you dont assign value extra
    ReverseValueCases(currentPage){
        this.PrevInputButtons = [];
        this.PrevPage = currentPage + 1;
        this.test = 0;
        this.btnChecked = 0;
        for(let i = 0; i < 7; i++){
            this.PrevInputButtons.push(this.htmlScoreButton[this.PrevPage*7+i-7])
        }

        for(let y = 0; y < this.PrevInputButtons.length; y++){
            if(this.PrevInputButtons[y].checked){
                this.reverseFactor = this.PrevInputButtons[y].value;
                
            }
            else{
                this.btnChecked+=1
            }
        } 
        if(this.btnChecked == 7){
            this.reverseFactor = 0;
        }


        this.currentPage = currentPage;
        switch(this.Value[this.currentPage]){
            case "TF":
                this.TF-=parseInt(this.reverseFactor);
                break;
            case "AM":
                this.AM-=parseInt(this.reverseFactor);
                break;
            case "AU":
                this.AU-=parseInt(this.reverseFactor);
                break;
            case "ZE":
                this.ZE-=parseInt(this.reverseFactor);
                break;
            case "OC":
                this.OC-=parseInt(this.reverseFactor);
                break;
            case "DV":
                this.DV-=parseInt(this.reverseFactor);
                break;
            case "UI":
                this.UI-=parseInt(this.reverseFactor);
                break;
            case "LS":
                this.LS-=parseInt(this.reverseFactor);
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
        for(let y = 0; y < this.htmlScoreButton.length; y++){
            if(this.htmlScoreButton[y].checked && this.htmlScoreButton[y].value == 10){
                this.maxChosen+=1;
            }
        }
        this.labelLi = document.getElementById("js--tenthBtnLi")
        this.label = document.getElementById("js--tenthBtnLabel")

        if(this.maxChosen == 3){
            this.labelLi.style.border = "#C0C0C0 0.1rem solid";
            this.label.style.color = "#C0C0C0";
            this.TenthBtnBLock()
            //mandatory, because of how the program works it needs to reset
            this.maxChosen = 0;
        }
        else{
            //mandatory, because of how the program works it needs to reset
            this.maxChosen = 0;
            for(let i = 0; i < this.htmlScoreButton.length; i++){
                if (this.htmlScoreButton[i].value == 10){
                    this.htmlScoreButton[i].removeAttribute("disabled");

                    this.labelLi.style.border = "#5a8989 0.1rem solid";
                    this.label.style.color = "#5a8989";
                }
            }

        }
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
        this.TF = tf / 5;
        this.AM = am / 5;
        this.AU = au / 5;
        this.ZE = ze / 5;
        this.OC = oc / 5;
        this.DV = dv / 5;
        this.UI = ui / 5;
        this.LS = ls / 5;

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
    htmlInleveren
    htmlInleverenBack
    htmlInleverenForward

    constructor(htmlStartSection, htmlFormSection, htmlResultSection, htmlStartButton, htmlInleveren, htmlInleverenBack, htmlInleverenForward){
        this.htmlStartSection = htmlStartSection;
        this.htmlFormSection = htmlFormSection;
        this.htmlResultSection = htmlResultSection;
        this.htmlStartButton = htmlStartButton;
        this.htmlInleveren = htmlInleveren;
        this.htmlInleverenBack = htmlInleverenBack;
        this.htmlInleverenForward = htmlInleverenForward;

        //reset display
        this.htmlStartSection.style.display = "flex"
        this.htmlFormSection.style.display = "none"
        this.htmlInleveren.style.display = "none"
        this.htmlResultSection.style.display = "none"

        //onclicks
        this.htmlStartButton.onclick = this.GoToForm;
        this.htmlInleverenBack.onclick = this.GoBackToForm;
        this.htmlInleverenForward.onclick = this.GoToResult;
    }

    GoToForm = () =>{
        this.htmlStartSection.style.display = "none";
        this.htmlFormSection.style.display = "flex";
    }

    GoToEnd(){
        this.htmlFormSection.style.display = "none";
        this.htmlInleveren.style.display = "flex";
    }

    GoBackToForm = () =>{
        this.htmlInleveren.style.display = "none"
        this.htmlFormSection.style.display = "flex"
    }

    GoToResult = () =>{
        this.htmlInleveren.style.display = "none"
        this.htmlResultSection.style.display = "flex"
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
        this.inleveren = new CreateInleveren();
        this.results = new CreateResult();
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
        this.FirstInfoText = document.createElement("h2");
        this.FirstInfoText.setAttribute("class", "info__text");
        this.FirstInfoText.innerText = "Je zal zomenteen de Vragenlijst van Loopbaanankers (Schein) maken waaruit je zal zien welke loopbaananker het beste bij jou past Start hieronder de test."

        this.SecondInfoText = document.createElement("h2");
        this.SecondInfoText.setAttribute("class", "info__text");
        this.SecondInfoText.innerText = "U krijgt zometeen een bewering te zien, die bewering kunt u 1-6 punten geven. 1 betekent: past helemaal niet bij mij. 6 betekent: past precies bij mij."
        
        this.ThirdInfoText = document.createElement("h2");
        this.ThirdInfoText.setAttribute("class", "info__text");
        this.ThirdInfoText.innerText = "Drie beweringen kunt u 10 punten geven. Als u een bewering 10 punten geeft zegt u dat de bewering extra bij u past. Dit formulier bestaat uit 40 beweringen en zal weergeven welke loopbaan-ankers het meest bij u passen."

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

class CreateInleveren{
    constructor(){
        this.createInleveren();
    }

/*  <section class="vragen__finishButtonWrapper">
        <h2 class="vragen__vraag" id="">Je bent helemaal klaar!</h2>
        <button class="info__startButton vragen__finishButton">Ga terug</button>
        <button class="info__startButton vragen__finishButton vragen__finishButton--right">Inleveren</button>
    </section> */

    createInleveren(){
        this.inleverenTitle = document.createElement("h2")
        this.inleverenTitle.setAttribute("class", "inleveren__titel");
        this.inleverenTitle.innerText = "Je bent helemaal klaar!";

        this.inleverenButtonGoBack = document.createElement("button");
        this.inleverenButtonGoBack.classList.add("info__startButton");
        this.inleverenButtonGoBack.classList.add("vragen__finishButton");
        this.inleverenButtonGoBack.setAttribute("id", "js--inleveren-back")
        this.inleverenButtonGoBack.innerText = "Ga terug!";

        this.inleverenButtonGoForward = document.createElement("button");
        this.inleverenButtonGoForward.classList.add("info__startButton");
        this.inleverenButtonGoForward.classList.add("vragen__finishButton");
        this.inleverenButtonGoForward.classList.add("vragen__finishButton--right");
        this.inleverenButtonGoForward.setAttribute("id", "js--inleveren-forward")

        this.inleverenButtonGoForward.innerText = 'Inleveren';

        this.inleverenSection = document.createElement("section");
        this.inleverenSection.setAttribute("class", "inleveren");
        this.inleverenSection.setAttribute("id", "js--inleveren")
        //Section append buttons and h2
        this.inleverenSection.appendChild(this.inleverenTitle);
        this.inleverenSection.appendChild(this.inleverenButtonGoBack);
        this.inleverenSection.appendChild(this.inleverenButtonGoForward);


        document.getElementsByTagName("body")[0].appendChild(this.inleverenSection);
    }
}

class CreateResult{
    constructor(){
        this.createResult();
    }
//  example of html
/*  <section class="results" id="js--resultSection">
        <figure class="results__chart">
            <canvas id="myChart"></canvas>
        </figure>
        <h2 class="results__infoText">
            Hieronder staan korte omschrijvingen van de ankers die je kan lezen.
            Kijk wat jij hiervan herkent.

        </h2>
        <article class="results__explanation">
            <h2 class="results__explanationTitle">
                Technisch/functioneel (TF)
            </h2>
            <p class="results__explanationText">
                Mensen met dit anker kenmerken zich door hun kennis, vaardigheden
                of "ambachtelijkheid" op een bepaald gebied. Zij zoeken voortdurend naar
                nieuwe uitdagingen op hun specifieke vakgebied, zodat zij zich voortdurend kunnen
                ontwikkelen naar een hoger niveau. Zij ontlenen hun identiteit aan het uitoefenen en 
                toepassen van hun specifieke kennis of hun vaardigheden. Zij willen het liefste de beste
                van de wereld worden in hun vakgebied. Hun grootste probleem is dat ze nogal eens
                terecht komen in generalistische of leidinggevende taken, waarin ze mislukken
                en waar ze een hartgrondige hekel aan hebben, omdat ze daarmee hun competentie
                gebeid los hebben gelaten.
            </p>
        </article>

        <article class="results__explanation">
            <h2 class="results__explanationTitle">
                Algemeen management (AM)
            </h2>
            <p class="results__explanationText">
                Mensen met dit anker kenmerken zich door hun bekwaamheid in het leidinggeven aan
                anderen, het integreren van functies en het dragen van verantwoordelijkheid voor een
                afdeling of organisatie. Ontwikkeling van hun loopbaan bestaat uit het bekleden van een
                steeds hogere en meer verantwoordelijke posities in een organisatie. Zij willen
                verantwoordelijkheid en aanspreekbaar zijn voor het eindresultaat. Zij schrijven het succes
                van een project of hun organisatie dan ook graag toe aan hun bekwame manier van
                leidinggeven. Bekwaamheden die worden gekenmerkt door analystische vaardigheden, de
                vaardigheden om met mensen en groepen om te gaan en de eigenshap om grote
                verantwoordelijkheden aan te kunnen.
            </p>
        </article>

        <article class="results__explanation">
            <h2 class="results__explanationTitle">
                Autonomie/onafhankelijkheid (AU)
            </h2>
            <p class="results__explanationText">
                Mensen met dit anker hechten een groot belang aan autonomie en onafhankelijkheid. Zij
                willen de ruimte om hun werk op een eigen manier te definiëren en in te richten. Zij willen
                vrij zijn in alles wat zij doen. Vaak kiezen deze mensen voor een zelfstandig bestaan of voor
                een baan met een hoge mate van autonomie waarin zij zelf bepalen hoe en wanneer zij
                werken. Zij zijn desnoods bereid promotie of verbetering af te wijzen als daarmee hun
                autonomie in het gedrang komt. Het kunnen zelfstandige adviseurs zijn, docenten of
                onderwijzers, (kleine) zelfstandige ondernemers, vertegenwoordigers of freelancers.
            </p>
        </article>

        <article class="results__explanation">
            <h2 class="results__explanationTitle">
                Zekerheid en stabiliteit (ZE)
            </h2>
            <p class="results__explanationText">
                Mensen met dit anker streven bij het opbouwen en inrichten van hun loopbaan naar
                vastigheid en stabiliteit op langere termijn. Zij voelen zich pas echt op hun gemak als ze in
                hun loopbaan een zekere mate van succes en stabiliteit hebben bereikt, die tevens het
                gevoel met zich meebrengt dat ze "het voor elkaar hebben". Dat wil zeggen: een basis voor
                financiële zekerheid en de zekerheid van een vaste baan. Bij het handhaven van deze
                zekerheden zijn ze bereid te voldoen aan de verwachtingen van de werkgever. Ze houden
                zich niet zo bezig met de inhoud van hun werk of een hogere positie die binnen handbereik
                is op basis van potentiele talenten. Voor hen is het gevoel van zekerheid en veiligheid
                belangrijker dan de vraag wel werk ze precies doen.
            </p>
        </article>

        <article class="results__explanation">
            <h2 class="results__explanationTitle">
                Ondernemingsgerichte creativiteit (OC)
            </h2>
            <p class="results__explanationText">
                Mensen met dit anker hebben de behoefte aan een vorm van persoonlijke creativiteit
                waarmee ze iets opbouwen dat groter is dan zijzelf. Zij onderscheiden zich op grond van hum
                vermogen een eigen onderneming te creëren die het resultaat is van eigen inspanningen. Zij
                identificeren zich volledig met die onderneming en het succes daarvan als bewijs van eigen
                talenten. Deze behoefte is zo sterk dat ze bij het zoeken naar het ultieme succes de nodige
                mislukkingen voor lief nemen. Ze zijn bereid risico's te nemen en hindernissen te
                overwinnen.
            </p>
        </article>

        <article class="results__explanation">
            <h2 class="results__explanationTitle">
                Dienstverlening/toewijding aan de zaak (DV)
            </h2>
            <p class="results__explanationText">
                Mensen met dit anker kenmerken zich door het belang dat ze hechten aan werk dat iets van
                waarden oplevert. Zoals je inzetten voor de leefbaarheid van de wereld, aandacht besteden
                aan milieuproblemen en bijdragen aan de ontwikkeling van de mensen. Door middel van hun
                beroep en het werkveld waarin ze werkzaam zijn, willen zij letterlijk uiting aan de zaken en
                onderwerpen geven waar zij waarde aan hechten. Bijvoorbeeld door iets te geven, te
                genezen, te verzorgen, te begeleiden of te adviseren. De desbetreffende waarden bepalen
                het werk wat ze doen en de werkkring waarin zij dat willen doen.
            </p>
        </article>

        <article class="results__explanation">
            <h2 class="results__explanationTitle">
                Zuivere uitdaging (UI)
            </h2>
            <p class="results__explanationText">
                Mensen met dit anker hebben oven alles behoefte aan nieuwe kansen en variatie, aan
                ogenschijnlijk onoverkomelijke obstakels of sterke concurrenten waartegen zij het op
                kunnen nemen. Het soort werk wat zij doen, is minder belangrijk dan het plezier wat zij
                beleven aan het wedijveren met anderen of het overwinnen van obstakels of tegenstanders.
                Als zij er niet in slagen steeds moeilijkere obstakels te vinden, wordt het te saai, Dan gaan ze
                weg en zoeken ze elders naar een nieuwe uitdaging. Sommigen vinden hun uitdaging in
                intellectueel werk, sommigen in het analyseren en ontwarren van complexe situaties en
                sommigen in het concurreren van anderen.
            </p>
        </article>

        <article class="results__explanation">
            <h2 class="results__explanationTitle">
                Levensstijl (LS)
            </h2>
            <p class="results__explanationText">
                Mensen met dit anker hechten waarde aan het integreren van werk en gezinszaken. Voor
                hen is het van groot belang dat hun loopbaan, hun gezinsleven en persoonlijke waarden
                zodanig in evenwicht zijn, dat weken en leven aansluit op hun persoonlijkheid en privéleven.
                Sommigen richten hun werk in op de loopbaan van hun man of vrouw. Of ze zoeken naar
                een baan in de omgeving waarin zij willen wonen, waar zij hun kinderen op willen laten
                groeien of waar zij hun kinderen naar school willen laten gaan. Voor hen is een succesvol
                leven niet afhankelijk van een succesvolle loopbaan, maar hoe het leven als geheel wordt
                ervaren en hoe zij zich daarin persoonlijk ontwikkelen. In de huidige tijd wint dit anker
                steeds meer terrein.
            </p>
        </article>

    </section> */

    createResult(){
        this.chart = document.createElement("canvas");
        this.chart.setAttribute("id", "myChart");

        //section will append this
        this.figureChart = document.createElement("figure");
        this.figureChart.setAttribute("class", "results__chart");
        //figure append canvas
        this.figureChart.appendChild(this.chart);

        this.resultInfoText = document.createElement("h2");
        this.resultInfoText.setAttribute("class", "results__infoText");
        this.resultInfoText.innerText = "Hieronder staan korte omschrijvingen van de ankers die je kan lezen. Kijk wat jij hiervan herkent."

        this.resultExplanationTitle1 = document.createElement("h2");
        this.resultExplanationTitle1.setAttribute("class", "results__explanationTitle");
        this.resultExplanationTitle1.innerText = "Technisch/functioneel (TF)";
        this.resultExplanationText1 = document.createElement("p");
        this.resultExplanationText1.setAttribute("class", "results__explanationText");
        this.resultExplanationText1.innerText = 'Mensen met dit anker kenmerken zich door hun kennis, vaardigheden of "ambachtelijkheid" op een bepaald gebied. Zij zoeken voortdurend naar nieuwe uitdagingen op hun specifieke vakgebied, zodat zij zich voortdurend kunnen ontwikkelen naar een hoger niveau. Zij ontlenen hun identiteit aan het uitoefenen en  toepassen van hun specifieke kennis of hun vaardigheden. Zij willen het liefste de beste van de wereld worden in hun vakgebied. Hun grootste probleem is dat ze nogal eens terecht komen in generalistische of leidinggevende taken, waarin ze mislukken en waar ze een hartgrondige hekel aan hebben, omdat ze daarmee hun competentie gebeid los hebben gelaten.'
        this.resultArticle1 = document.createElement("article");
        this.resultArticle1.setAttribute("class", "results__explanation")
        this.resultArticle1.appendChild(this.resultExplanationTitle1);
        this.resultArticle1.appendChild(this.resultExplanationText1);

        this.resultExplanationTitle2 = document.createElement("h2");
        this.resultExplanationTitle2.setAttribute("class", "results__explanationTitle");
        this.resultExplanationTitle2.innerText = "Algemeen management (AM)";
        this.resultExplanationText2 = document.createElement("p");
        this.resultExplanationText2.setAttribute("class", "results__explanationText");
        this.resultExplanationText2.innerText = 'Mensen met dit anker kenmerken zich door hun bekwaamheid in het leidinggeven aan anderen, het integreren van functies en het dragen van verantwoordelijkheid voor een afdeling of organisatie. Ontwikkeling van hun loopbaan bestaat uit het bekleden van een steeds hogere en meer verantwoordelijke posities in een organisatie. Zij willen verantwoordelijkheid en aanspreekbaar zijn voor het eindresultaat. Zij schrijven het succes van een project of hun organisatie dan ook graag toe aan hun bekwame manier van leidinggeven. Bekwaamheden die worden gekenmerkt door analystische vaardigheden, de vaardigheden om met mensen en groepen om te gaan en de eigenshap om grote verantwoordelijkheden aan te kunnen.'
        this.resultArticle2 = document.createElement("article");
        this.resultArticle2.setAttribute("class", "results__explanation")
        this.resultArticle2.appendChild(this.resultExplanationTitle2);
        this.resultArticle2.appendChild(this.resultExplanationText2);
        
        this.resultExplanationTitle3 = document.createElement("h2");
        this.resultExplanationTitle3.setAttribute("class", "results__explanationTitle");
        this.resultExplanationTitle3.innerText = "Autonomie/onafhankelijkheid (AU)"
        this.resultExplanationText3 = document.createElement("p");
        this.resultExplanationText3.setAttribute("class", "results__explanationText");
        this.resultExplanationText3.innerText = 'Mensen met dit anker hechten een groot belang aan autonomie en onafhankelijkheid. Zij willen de ruimte om hun werk op een eigen manier te definiëren en in te richten. Zij willen vrij zijn in alles wat zij doen. Vaak kiezen deze mensen voor een zelfstandig bestaan of voor een baan met een hoge mate van autonomie waarin zij zelf bepalen hoe en wanneer zij werken. Zij zijn desnoods bereid promotie of verbetering af te wijzen als daarmee hun autonomie in het gedrang komt. Het kunnen zelfstandige adviseurs zijn, docenten of onderwijzers, (kleine) zelfstandige ondernemers, vertegenwoordigers of freelancers.'
        this.resultArticle3 = document.createElement("article");
        this.resultArticle3.setAttribute("class", "results__explanation")
        this.resultArticle3.appendChild(this.resultExplanationTitle3);
        this.resultArticle3.appendChild(this.resultExplanationText3);
        
        this.resultExplanationTitle4 = document.createElement("h2");
        this.resultExplanationTitle4.setAttribute("class", "results__explanationTitle");
        this.resultExplanationTitle4.innerText = 'Zekerheid en stabiliteit (ZE)';
        this.resultExplanationText4 = document.createElement("p");
        this.resultExplanationText4.setAttribute("class", "results__explanationText");
        this.resultExplanationText4.innerText = 'Mensen met dit anker streven bij het opbouwen en inrichten van hun loopbaan naar vastigheid en stabiliteit op langere termijn. Zij voelen zich pas echt op hun gemak als ze in hun loopbaan een zekere mate van succes en stabiliteit hebben bereikt, die tevens het gevoel met zich meebrengt dat ze "het voor elkaar hebben". Dat wil zeggen: een basis voor financiële zekerheid en de zekerheid van een vaste baan. Bij het handhaven van deze zekerheden zijn ze bereid te voldoen aan de verwachtingen van de werkgever. Ze houden zich niet zo bezig met de inhoud van hun werk of een hogere positie die binnen handbereik is op basis van potentiele talenten. Voor hen is het gevoel van zekerheid en veiligheid belangrijker dan de vraag wel werk ze precies doen.';
        this.resultArticle4 = document.createElement("article");
        this.resultArticle4.setAttribute("class", "results__explanation")
        this.resultArticle4.appendChild(this.resultExplanationTitle4);
        this.resultArticle4.appendChild(this.resultExplanationText4);
        
        this.resultExplanationTitle5 = document.createElement("h2");
        this.resultExplanationTitle5.setAttribute("class", "results__explanationTitle");
        this.resultExplanationTitle5.innerText = 'Ondernemingsgerichte creativiteit (OC)';
        this.resultExplanationText5 = document.createElement("p");
        this.resultExplanationText5.setAttribute("class", "results__explanationText");
        this.resultExplanationText5.innerText = 'Mensen met dit anker hebben de behoefte aan een vorm van persoonlijke creativiteit waarmee ze iets opbouwen dat groter is dan zijzelf. Zij onderscheiden zich op grond van hum vermogen een eigen onderneming te creëren die het resultaat is van eigen inspanningen. Zij identificeren zich volledig met die onderneming en het succes daarvan als bewijs van eigen talenten. Deze behoefte is zo sterk dat ze bij het zoeken naar het ultieme succes de nodige mislukkingen voor lief nemen. Ze zijn bereid risicos te nemen en hindernissen te overwinnen.';
        this.resultArticle5 = document.createElement("article");
        this.resultArticle5.setAttribute("class", "results__explanation")
        this.resultArticle5.appendChild(this.resultExplanationTitle5);
        this.resultArticle5.appendChild(this.resultExplanationText5);

        this.resultExplanationTitle6 = document.createElement("h2");
        this.resultExplanationTitle6.setAttribute("class", "results__explanationTitle");
        this.resultExplanationTitle6.innerText = 'Dienstverlening/toewijding aan de zaak (DV)';
        this.resultExplanationText6 = document.createElement("p");
        this.resultExplanationText6.setAttribute("class", "results__explanationText");
        this.resultExplanationText6.innerText = 'Mensen met dit anker kenmerken zich door het belang dat ze hechten aan werk dat iets van waarden oplevert. Zoals je inzetten voor de leefbaarheid van de wereld, aandacht besteden aan milieuproblemen en bijdragen aan de ontwikkeling van de mensen. Door middel van hun beroep en het werkveld waarin ze werkzaam zijn, willen zij letterlijk uiting aan de zaken en onderwerpen geven waar zij waarde aan hechten. Bijvoorbeeld door iets te geven, te genezen, te verzorgen, te begeleiden of te adviseren. De desbetreffende waarden bepalen het werk wat ze doen en de werkkring waarin zij dat willen doen.';
        this.resultArticle6 = document.createElement("article");
        this.resultArticle6.setAttribute("class", "results__explanation")
        this.resultArticle6.appendChild(this.resultExplanationTitle6);
        this.resultArticle6.appendChild(this.resultExplanationText6);
        
        this.resultExplanationTitle7 = document.createElement("h2");
        this.resultExplanationTitle7.setAttribute("class", "results__explanationTitle");
        this.resultExplanationTitle7.innerText = 'Zuivere uitdaging (UI)';
        this.resultExplanationText7 = document.createElement("p");
        this.resultExplanationText7.setAttribute("class", "results__explanationText");
        this.resultExplanationText7.innerText = 'Mensen met dit anker hebben oven alles behoefte aan nieuwe kansen en variatie, aan ogenschijnlijk onoverkomelijke obstakels of sterke concurrenten waartegen zij het op kunnen nemen. Het soort werk wat zij doen, is minder belangrijk dan het plezier wat zij beleven aan het wedijveren met anderen of het overwinnen van obstakels of tegenstanders. Als zij er niet in slagen steeds moeilijkere obstakels te vinden, wordt het te saai, Dan gaan ze weg en zoeken ze elders naar een nieuwe uitdaging. Sommigen vinden hun uitdaging in intellectueel werk, sommigen in het analyseren en ontwarren van complexe situaties en sommigen in het concurreren van anderen.';
        this.resultArticle7 = document.createElement("article");
        this.resultArticle7.setAttribute("class", "results__explanation")
        this.resultArticle7.appendChild(this.resultExplanationTitle7);
        this.resultArticle7.appendChild(this.resultExplanationText7);
        
        this.resultExplanationTitle8 = document.createElement("h2");
        this.resultExplanationTitle8.setAttribute("class", "results__explanationTitle");
        this.resultExplanationTitle8.innerText = 'Levensstijl (LS)';
        this.resultExplanationText8 = document.createElement("p");
        this.resultExplanationText8.setAttribute("class", "results__explanationText");
        this.resultExplanationText8.innerText = 'Mensen met dit anker hechten waarde aan het integreren van werk en gezinszaken. Voor hen is het van groot belang dat hun loopbaan, hun gezinsleven en persoonlijke waarden zodanig in evenwicht zijn, dat weken en leven aansluit op hun persoonlijkheid en privéleven. Sommigen richten hun werk in op de loopbaan van hun man of vrouw. Of ze zoeken naar een baan in de omgeving waarin zij willen wonen, waar zij hun kinderen op willen laten groeien of waar zij hun kinderen naar school willen laten gaan. Voor hen is een succesvol leven niet afhankelijk van een succesvolle loopbaan, maar hoe het leven als geheel wordt ervaren en hoe zij zich daarin persoonlijk ontwikkelen. In de huidige tijd wint dit anker steeds meer terrein.';
        this.resultArticle8 = document.createElement("article");
        this.resultArticle8.setAttribute("class", "results__explanation")
        this.resultArticle8.appendChild(this.resultExplanationTitle8);
        this.resultArticle8.appendChild(this.resultExplanationText8);

        //section append everything above
        this.resultSection = document.createElement("section");
        this.resultSection.setAttribute("class", "results");
        this.resultSection.setAttribute("id", "js--resultSection");

        this.resultSection.appendChild(this.figureChart);
        this.resultSection.appendChild(this.resultInfoText);
        this.resultSection.appendChild(this.resultArticle1);
        this.resultSection.appendChild(this.resultArticle2);
        this.resultSection.appendChild(this.resultArticle3);
        this.resultSection.appendChild(this.resultArticle4);
        this.resultSection.appendChild(this.resultArticle5);
        this.resultSection.appendChild(this.resultArticle6);
        this.resultSection.appendChild(this.resultArticle7);
        this.resultSection.appendChild(this.resultArticle8);

        //body append section
        document.getElementsByTagName("body")[0].appendChild(this.resultSection);
    }
}

let app = new App("/js/loopbaanAnkers.json");