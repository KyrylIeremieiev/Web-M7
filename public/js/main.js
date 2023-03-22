class App{
    jsonFile
    htmlElementTxt
    htmlElementBtn
    constructor(jsonFile, htmlElementTxt, htmlElementBtn){
        this.jsonFile = jsonFile;
        this.htmlElementTxt = htmlElementTxt;
        this.htmlElementBtn = htmlElementBtn;
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
  
        const transition = new Transition(this.htmlElementTxt, this.htmlElementBtn, this.data);
    }
}

class Transition{
    htmlElementTxt;    
    htmlElementBtn;
    data;
    currentPage;
    constructor(htmlElementTxt, htmlElementBtn, data){
        this.htmlElementTxt = htmlElementTxt;
        this.htmlElementBtn = htmlElementBtn;
        this.data = data;
        this.currentPage = 0

        this.htmlElementBtn.onclick = this.ButtonClickedForward;
    }

    ButtonClickedForward = () =>{
        console.log(this.data);
        this.currentPage += 1;
        this.Render();
    }

    Render(){
        this.htmlElementTxt.innerText = this.data[0].question[this.currentPage];        
    }
    

}


let app = new App("/public/js/loopbaanAnkers.json", document.getElementById("js--txt"), document.getElementById("js--btn"))