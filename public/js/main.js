class App{
    jsonFile
    htmlNomering
    htmlElementTxt
    htmlElementForward
    htmlElementBackward
    constructor(jsonFile, htmlNomering, htmlElementTxt, htmlElementForward, htmlElementBackward){
        this.jsonFile = jsonFile;
        this.htmlNomering = htmlNomering;
        this.htmlElementTxt = htmlElementTxt;
        this.htmlElementForward = htmlElementForward;
        this.htmlElementBackward = htmlElementBackward;
        this.readJson();
    }

    readJson(){
        fetch(this.jsonFile).then(
            (responce) => {
            return responce.json()
        }).then((data) =>{
            this.data = data
            this.ObjectCreator()
        });
    }

    ObjectCreator(){
        const transition = new Transition(this.htmlNomering, this.htmlElementTxt, this.htmlElementForward, this.htmlElementBackward, this.data);
    }
}

class Transition{
    htmlNomering;
    htmlElementTxt;    
    htmlElementForward;
    htmlElementBackward
    data;
    currentPage;
    constructor(htmlNomering, htmlElementTxt, htmlElementForward, htmlElementBackward, data){
        this.htmlNomering = htmlNomering;
        this.htmlElementTxt = htmlElementTxt;
        this.htmlElementForward = htmlElementForward;
        this.htmlElementBackward = htmlElementBackward;
        this.data = data;
        this.currentPage = 0

        this.Render();
        this.htmlElementForward.onclick = this.ButtonClickedForward;
        this.htmlElementBackward.onclick = this.ButtonClickedBackward;
    }

    ButtonClickedForward = () =>{
        if(this.currentPage < this.data[0].question.length-1){
            this.currentPage += 1;
            this.Render();
        }
    }

    ButtonClickedBackward = () =>{
        if(this.currentPage > 0){
            this.currentPage -= 1;
            this.Render();
        }
    }

    Render(){
        this.htmlElementTxt.innerText = this.data[0].question[this.currentPage];
        this.htmlNomering.innerText = "Vraag: " + parseInt(this.currentPage + 1)       
    }
    

}


let app = new App("/public/js/loopbaanAnkers.json", document.getElementById("js--beweringNomering"), document.getElementById("js--bewering"), document.getElementById("js--forward"), document.getElementById("js--backward"))