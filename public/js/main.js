class App{
    jsonFile
    htmlNomering
    htmlElementTxt
    htmlElementForward
    htmlElementBackward
    htmlScoreButtonsWrap
    htmlScoreButton
    constructor(jsonFile, htmlNomering, htmlElementTxt, htmlElementForward, 
        htmlElementBackward, progressBar){
        this.jsonFile = jsonFile;
        this.htmlNomering = htmlNomering;
        this.htmlElementTxt = htmlElementTxt;
        this.htmlElementForward = htmlElementForward;
        this.htmlElementBackward = htmlElementBackward;
        this.progressBar = progressBar;
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
                    console.log(this.htmlScoreButton)
                    this.htmlScoreButtonsWrap.appendChild(this.htmlScoreLi);
                }

           
           this.htmlScoreButtonsWrapArr.push(this.htmlScoreButtonsWrap);

           document.getElementById("js--receiver").appendChild(this.htmlScoreButtonsWrap);

        }  

    }

    ObjectCreator(){
        console.log(this.htmlScoreButtonsWrapArr)
        this.valueCounter = new ValueCounter(this.data,this.htmlScoreButtonArr, this.htmlScoreButtonsWrapArr);
        this.transition = new Transition(this.htmlNomering, this.htmlElementTxt, this.htmlElementForward, 
        this.htmlElementBackward, this.htmlScoreButtonsWrapArr, this.data, this.progressBar);
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
    }

    ButtonClickedBackward = () =>{
        if(this.currentPage > 0){
            this.currentPage -= 1;
            
            this.GoBack=true;
            this.GoForward=false;

            this.progressBar.style.width = this.currentProgress - 100 / this.Question.length + "%";
            this.currentProgress = this.currentProgress - 100 / this.Question.length;

            this.Render();
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
    }

    AssignValue(currentPage){
        this.currentPage = currentPage
        this.currentInputButtons = []
        //I have no clue why this works, I have no clue why it has to loop 8 times to log 7 buttons, but it works.
        //this part makes sure that the factor is changed to the value of the button at the time of going to the next question
        for(let i = 0; i < 7; i++){
            this.currentInputButtons.push(this.htmlScoreButton[this.currentPage*7+i-7])
        }

        for(let y = 0; y < this.currentInputButtons.length; y++){
            if(this.currentInputButtons[y].checked){
                if(this.currentInputButtons[y].value == 10){
                    this.maxChosen+=1
                }
                this.factor = this.currentInputButtons[y].value;
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
    }

    initInterval(){
        let scope = this
        setInterval(function () {scope.TenthBtnBLock()}, 33);
    }

    TenthBtnBLock(){
        if(this.htmlScoreButtonsWrap[this.currentPage].children[6].children[0].checked){
            this.htmlScoreButtonsWrap[this.currentPage].children[6].children[0].checked = false
        }
    }
}


let app = new App("/public/js/loopbaanAnkers.json", document.getElementById("js--beweringNomering"), 
document.getElementById("js--bewering"), document.getElementById("js--forward"), 
document.getElementById("js--backward"), document.getElementById("js--progressBar"));
