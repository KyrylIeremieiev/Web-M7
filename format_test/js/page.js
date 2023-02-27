class Main{
    page;
    htmlForward;
    htmlBackward;
    constructor(page,htmlForward, htmlBackward){
        this.page = page;
        this.htmlForward = htmlForward;
        this.htmlBackward = htmlBackward;

        this.styleChange = new StyleChange(this.page);
        this.htmlForward.onclick = this.styleChange.forward;
        this.htmlBackward.onclick = this.styleChange.backward;
    }
}

class StyleChange{
    page;
    constructor(page){
        this.page = page
        this.current = 0;
        console.log(this.page[this.i])
        console.log(this.page.length)
        console.log(this.page)
    }

    forward = () =>{
        if(this.current < this.page.length-1){
            this.page[this.current].style.display = "none";
            this.current+=1;
            this.page[this.current].style.display = "block";
        }
    }

    backward = () =>{
        if(this.current > 0){
            this.page[this.current].style.display = "none";
            this.current-=1;
            this.page[this.current].style.display = "block";
        }
    }
}

let main = new Main(document.getElementsByClassName("page"), document.getElementById("forward"), document.getElementById("backward"))