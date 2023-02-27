class Main{
    constructor(newHtmlElementSlider, newHtmlElementText){
        this.htmlElementSlider = newHtmlElementSlider;
        this.htmlElementText = newHtmlElementText;
        this.startSlider()

    }
    startSlider(){
        this.slider = new Slider(this.htmlElementSlider, this.htmlElementText);
        this.slider.changeText()
    }
}

class Slider{
    htmlElementSlider;
    htmlElementText
    constructor(htmlElementSlider, htmlElementText){
        this.htmlElementSlider = htmlElementSlider;
        this.htmlElementText = htmlElementText
    }

    changeText(){
        
        let scope = this;
        setInterval(function(){scope.htmlElementText.innerText = scope.htmlElementSlider.value}, 33)
    }
}

let main = new Main(document.getElementById("js--sliderOne"), document.getElementById("js--labelOne"));