const allPhotos = ["pic1.jpg","pic3.jpg","pic4.jpg","pic5.jpg","pic6.jpg","oldliceu.jpeg","pic2.jpg"];
const slidingPhotos = document.getElementById("pic-holder");
let replayInterval;
let index = 0;

function slideLeft(){
    clearInterval(replayInterval);
    if(index<=0) index=6;

    slidingPhotos.style.backgroundImage = `url(images/gallery/${allPhotos[--index]})`
    
}
function slideRight(){
    if(index>=6) index=0;
    
    slidingPhotos.style.backgroundImage = `url(images/gallery/${allPhotos[index]})`;
    ++index;
}
function displayImg() {
    replayInterval = setInterval(() => 
        {
            slidingPhotos.style.backgroundImage = `url(images/gallery/${allPhotos[index]})`;
            
            index = (index + 1) % allPhotos.length;
        }, 2500
    );
}

document.addEventListener("DOMContentLoaded",
    () => {
        displayImg();
    })
        document.getElementById("slide-left").onclick = slideLeft;
        document.getElementById("slide-right").onclick = slideRight;