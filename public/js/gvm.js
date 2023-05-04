class App{
    constructor(){
        this.header = new CreateHeader();
        this.main = new CreateMain();
        this.save = new SaveAndLoad(document.getElementById("js--saveBtn"), document.getElementsByClassName("js--textArea"));
    }
}

class SaveAndLoad{
    saveBtn;
    textAreaArr;
    constructor(saveBtn, textAreaArr){
        this.saveBtn = saveBtn;
        this.textAreaArr = textAreaArr;
        
        this.saveBtn.onclick = this.saveInLocal;
        this.Load();
    }

    saveInLocal=()=>{
        for(let i = 0; i < this.textAreaArr.length; i++){
           window.localStorage.setItem("textArea"+i, this.textAreaArr[i].value); 
        }
        console.log(window.localStorage)
        
    }

    Load(){
        for(let i = 0; i < this.textAreaArr.length; i++){
            this.textAreaArr[i].value = window.localStorage.getItem("textArea"+i);
        }
    }
}

class CreateHeader{
    /* <header class="banner">
        <figure class="banner__logo">
            <img src="img/site-logo-2.png" alt="" class="banner__logoImage">
        </figure>
    </header> */
    constructor(){
        this.headerImg = document.createElement("img");
        this.headerImg.setAttribute("src", "img/site-logo-2.webp");
        this.headerImg.setAttribute("alt", "Logo van doesburg coaching");
        this.headerImg.setAttribute("class", "banner__logoImage");

        this.headerFigure = document.createElement("figure");
        this.headerFigure.setAttribute("class", "banner__logo")
        //figure append img
        this.headerFigure.appendChild(this.headerImg);
        
        this.header = document.createElement("header");
        this.header.setAttribute("class", "banner");
        //header append figure
        this.header.appendChild(this.headerFigure);
        //body append header
        document.getElementsByTagName("body")[0].appendChild(this.header)
    }
}

class CreateMain{
/*  <section class="gvm">
        <h2 class="gvm__gevoelItemTitle">Gevoel</h2>
        <li class="gvm__gevoelItem gvm__gevoelItem--1">
            Onrustig
            <figure class="gevoelStip gevoelStip--1"></figure>
        </li>
        <li class="gvm__gevoelItem gvm__gevoelItem--2">
            Twijfel
            <figure class="gevoelStip gevoelStip--2"></figure>
        </li>
        <li class="gvm__gevoelItem gvm__gevoelItem--3">
            Lichte Twijfel
            <figure class="gevoelStip gevoelStip--3"></figure>
        </li>
        <li class="gvm__gevoelItem gvm__gevoelItem--4">
            Goed
            <figure class="gevoelStip gevoelStip--4"></figure>
        </li>

        <h2 class="gvm__signalenTitle">Signalen/gewaarwoordingen</h2>

        <textarea name="" id="" cols="30" rows="10" class="gvm__signalenTextarea gvm__signalenTextarea--1 js--textArea"></textarea>
        <textarea name="" id="" cols="30" rows="10" class="gvm__signalenTextarea gvm__signalenTextarea--2 js--textArea"></textarea>
        <textarea name="" id="" cols="30" rows="10" class="gvm__signalenTextarea gvm__signalenTextarea--3 js--textArea"></textarea>
        <textarea name="" id="" cols="30" rows="10" class="gvm__signalenTextarea gvm__signalenTextarea--4 js--textArea"></textarea>
        <h2 class="gvm__actiesTitle">Acties/maatregelen</h2>
        <textarea name="" id="" cols="30" rows="10" class="gvm__actiesTextarea gvm__actiesTextarea--1 js--textArea"></textarea>
        <textarea name="" id="" cols="30" rows="10" class="gvm__actiesTextarea gvm__actiesTextarea--2 js--textArea"></textarea>
        <textarea name="" id="" cols="30" rows="10" class="gvm__actiesTextarea gvm__actiesTextarea--3 js--textArea"></textarea>
        <textarea name="" id="" cols="30" rows="10" class="gvm__actiesTextarea gvm__actiesTextarea--4 js--textArea"></textarea>
        <button class="inleverButton info__startButton" id="js--saveBtn">Inleveren</button>
    </section> */
    constructor(){
        this.gvmTitle = document.createElement("h2");
        this.gvmTitle.setAttribute("class", "gvm__gevoelItemTitle");
        this.gvmTitle.innerText = "Gevoel";

        this.gevoelstip1 = document.createElement("figure");
        this.gevoelstip1.classList = "gevoelStip gevoelStip--1";
        this.gevoelItem1 = document.createElement("li");
        this.gevoelItem1.classList = "gvm__gevoelItem gvm__gevoelItem--1";
        this.gevoelItem1.innerText = "Onrustig";
        this.gevoelItem1.appendChild(this.gevoelstip1);
        
        this.gevoelstip2 = document.createElement("figure");
        this.gevoelstip2.classList = "gevoelStip gevoelStip--2";
        this.gevoelItem2 = document.createElement("li");
        this.gevoelItem2.classList = "gvm__gevoelItem gvm__gevoelItem--2";
        this.gevoelItem2.innerText = "Twijfel";
        this.gevoelItem2.appendChild(this.gevoelstip2);

        this.gevoelstip3 = document.createElement("figure");
        this.gevoelstip3.classList = "gevoelStip gevoelStip--3";
        this.gevoelItem3 = document.createElement("li");
        this.gevoelItem3.classList = "gvm__gevoelItem gvm__gevoelItem--3";
        this.gevoelItem3.innerText = "Lichte Twijfel";
        this.gevoelItem3.appendChild(this.gevoelstip3);

        this.gevoelstip4 = document.createElement("figure");
        this.gevoelstip4.classList = "gevoelStip gevoelStip--4";
        this.gevoelItem4 = document.createElement("li");
        this.gevoelItem4.classList = "gvm__gevoelItem gvm__gevoelItem--4";
        this.gevoelItem4.innerText = "Goed";
        this.gevoelItem4.appendChild(this.gevoelstip4);

        this.signalenTitle = document.createElement("h2");
        this.signalenTitle.setAttribute("class", "gvm__signalenTitle");
        this.signalenTitle.innerText = "Signalen/gewaarwoordingen";

        this.textAreaSignalen1 = document.createElement("textarea");
        this.textAreaSignalen1.classList = "gvm__signalenTextarea gvm__signalenTextarea--1 js--textArea";
        this.textAreaSignalen1.setAttribute("cols", 30);
        this.textAreaSignalen1.setAttribute("rows", 10);

        this.textAreaSignalen2 = document.createElement("textarea");
        this.textAreaSignalen2.classList = "gvm__signalenTextarea gvm__signalenTextarea--2 js--textArea";
        this.textAreaSignalen2.setAttribute("cols", 30);
        this.textAreaSignalen2.setAttribute("rows", 10);

        this.textAreaSignalen3 = document.createElement("textarea");
        this.textAreaSignalen3.classList = "gvm__signalenTextarea gvm__signalenTextarea--3 js--textArea";
        this.textAreaSignalen3.setAttribute("cols", 30);
        this.textAreaSignalen3.setAttribute("rows", 10);

        this.textAreaSignalen4 = document.createElement("textarea");
        this.textAreaSignalen4.classList = "gvm__signalenTextarea gvm__signalenTextarea--4 js--textArea";
        this.textAreaSignalen4.setAttribute("cols", 30);
        this.textAreaSignalen4.setAttribute("rows", 10);

        this.actieTitle = document.createElement("h2");
        this.actieTitle.classList = "gvm__actiesTitle";
        this.actieTitle.innerText = "Acties/maatregelen";

        this.textAreaacties1 = document.createElement("textarea");
        this.textAreaacties1.classList = "gvm__actiesTextarea gvm__actiesTextarea--1 js--textArea";
        this.textAreaacties1.setAttribute("cols", 30);
        this.textAreaacties1.setAttribute("rows", 10);

        this.textAreaacties2 = document.createElement("textarea");
        this.textAreaacties2.classList = "gvm__actiesTextarea gvm__actiesTextarea--2 js--textArea";
        this.textAreaacties2.setAttribute("cols", 30);
        this.textAreaacties2.setAttribute("rows", 10);

        this.textAreaacties3 = document.createElement("textarea");
        this.textAreaacties3.classList = "gvm__actiesTextarea gvm__actiesTextarea--3 js--textArea";
        this.textAreaacties3.setAttribute("cols", 30);
        this.textAreaacties3.setAttribute("rows", 10);

        this.textAreaacties4 = document.createElement("textarea");
        this.textAreaacties4.classList = "gvm__actiesTextarea gvm__actiesTextarea--4 js--textArea";
        this.textAreaacties4.setAttribute("cols", 30);
        this.textAreaacties4.setAttribute("rows", 10);
        
        this.InleverBtn = document.createElement("button");
        this.InleverBtn.classList = "inleverButton info__startButton";
        this.InleverBtn.setAttribute("id", "js--saveBtn");
        this.InleverBtn.innerText = "Inleveren";

        this.gvm = document.createElement("section");
        this.gvm.classList = "gvm";

        this.gvm.appendChild(this.gvmTitle);
        this.gvm.appendChild(this.gevoelItem1);
        this.gvm.appendChild(this.gevoelItem2);
        this.gvm.appendChild(this.gevoelItem3);
        this.gvm.appendChild(this.gevoelItem4);
        this.gvm.appendChild(this.signalenTitle);
        this.gvm.appendChild(this.textAreaSignalen1);
        this.gvm.appendChild(this.textAreaSignalen2);
        this.gvm.appendChild(this.textAreaSignalen3);
        this.gvm.appendChild(this.textAreaSignalen4);
        this.gvm.appendChild(this.actieTitle);
        this.gvm.appendChild(this.textAreaacties1);
        this.gvm.appendChild(this.textAreaacties2);
        this.gvm.appendChild(this.textAreaacties3);
        this.gvm.appendChild(this.textAreaacties4);
        this.gvm.appendChild(this.InleverBtn);
        
        document.getElementsByTagName("body")[0].appendChild(this.gvm)
    }
}

let app = new App();
let app2 = new App();