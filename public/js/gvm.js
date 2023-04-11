class App{
    constructor(){
        this.html = new CreateHtml();
        this.save = new Save(document.getElementById("js--saveBtn"), document.getElementsByClassName("js--textArea"));
    }
}

class Save{
    saveBtn;
    textAreaArr;
    constructor(saveBtn, textAreaArr){
        this.saveBtn = saveBtn;
        this.textAreaArr = textAreaArr;
        
        this.saveBtn.onclick = this.saveInLocal;
    }

    saveInLocal=()=>{
        for(let i = 0; i < this.textAreaArr.length; i++){
           window.localStorage.setItem("textArea"+i, this.textAreaArr[i].value); 
        }
        
    }

    Load(){
        for(let i = 0; i < this.textAreaArr.length; i++){
            this.textAreaArr[i].value = window.localStorage.getItem("textArea"+i);
        }
    }
}

class CreateHtml{
    
}

let app = new App();