class App{
    jsonFile
    htmlNomering
    htmlElementTxt
    htmlElementForward
    htmlElementBackward
    htmlScoreButtonsWrap
    htmlScoreButton
    constructor(jsonFile, htmlNomering, htmlElementTxt, htmlElementForward, htmlElementBackward, htmlScoreButtonsWrap, htmlScoreButton){
        this.jsonFile = jsonFile;
        this.htmlNomering = htmlNomering;
        this.htmlElementTxt = htmlElementTxt;
        this.htmlElementForward = htmlElementForward;
        this.htmlElementBackward = htmlElementBackward;
        this.htmlScoreButtonsWrap = htmlScoreButtonsWrap;
        this.htmlScoreButton = htmlScoreButton;
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
        //Breekt de hele website, wil niet meet laden
        /* for(let i = 0; i < 39; i++){
            for(let x = 0; x < 6; i++){
                this.htmlScoreButton = document.createElement("label");
                this.htmlScoreButton.setAttribute("type", "radio")
                this.htmlScoreButton.setAttribute("name", "InputButtonRadio"+i)
                this.htmlScoreButton.setAttribute("class", "vragen__scoreButton js--scoreButtons")

                this.htmlScoreLi = document.createElement("li");
                this.htmlScoreLi.classList = "vragen__scoreButtonListItem"
                this.htmlScoreLi.appendChild(this.htmlScoreButton);
            }

            this.htmlScoreButtonsWrap = document.createElement("ul");
            this.htmlScoreButtonsWrap.classList = "vragen__scoreButtonList";
            this.htmlScoreButtonsWrap.appendChild(this.htmlScoreLi);

            document.getElementById("js--vragen").appendChild(this.htmlScoreButtonsWrap);
        } */
    }

    ObjectCreator(){
        this.valueCounter = new ValueCounter(this.data,this.htmlScoreButton);
        this.transition = new Transition(this.htmlNomering, this.htmlElementTxt, this.htmlElementForward, 
        this.htmlElementBackward, this.htmlScoreButtonsWrap, this.data);
    }
}

class Transition{
    htmlNomering;
    htmlElementTxt;    
    htmlElementForward;
    htmlElementBackward
    data;
    currentPage;
    GoBack;
    GoForward;
    constructor(htmlNomering, htmlElementTxt, htmlElementForward, htmlElementBackward,htmlScoreButtonsWrap, data){
        this.htmlNomering = htmlNomering;
        this.htmlElementTxt = htmlElementTxt;
        this.htmlElementForward = htmlElementForward;
        this.htmlElementBackward = htmlElementBackward;
        this.htmlScoreButtonsWrap = htmlScoreButtonsWrap;
        this.data = data;
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

            this.Render();
            app.valueCounter.valueCases(this.currentPage);
        }
    }

    ButtonClickedBackward = () =>{
        if(this.currentPage > 0){
            this.currentPage -= 1;
            
            this.GoBack=true;
            this.GoForward=false;

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
    constructor(data, htmlScoreButton){
        this.data = data;
        this.htmlScoreButton = htmlScoreButton;
        this.Value = Object.values(this.data[0].question);

        this.TF = 0;
        this.AM = 0;
        this.AU = 0;
        this.ZE = 0;
        this.OC = 0;
        this.DV = 0;
        this.UI = 0;
        this.LS = 0;

        this.AssignValue()
    }

    valueCases(currentPage){
        console.log(this.Value[currentPage-1])
        switch(this.Value[currentPage-1]){
            case "TF":
                this.TF+=1;
                console.log(this.TF);
                break;
            case "AM":
                this.AM+=1;
                break;
            case "AU":
                this.AU+=1;
                break;
            case "ZE":
                this.ZE+=1;
                break;
            case "OC":
                this.OC+=1;
                break;
            case "DV":
                this.DV+=1;
                break;
            case "UI":
                this.UI+=1;
                break;
            case "LS":
                this.LS+=1;
                break;
        }
    }

    AssignValue(){
        
    }
}


let app = new App("/public/js/loopbaanAnkers.json", document.getElementById("js--beweringNomering"), 
document.getElementById("js--bewering"), document.getElementById("js--forward"), 
document.getElementById("js--backward"), document.getElementsByClassName("vragen__scoreButtonList"), 
document.getElementsByClassName("js--scoreButtons"));