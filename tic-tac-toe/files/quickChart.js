

document.addEventListener("DOMContentLoaded", function () {

    setDefaultTheme();

    fetch("http://127.0.0.1:3000/api/stats")
    .then (res => res.json())
    .then(stats => {

        let graph = document.getElementById("graph");
        graph.src='https://quickchart.io/chart?c='.concat(JSON.stringify(stats));


    })
})

function setDefaultTheme(){
    let currentTime = new Date().getTime();
    fetch("https://api.sunrise-sunset.org/json?lat=48.1454&lng=16.2142")
        .then(response => response.json())
        .then(data => {
            let sunrise = new Date(data.results.sunrise).getTime();
            let sunset = new Date(data.results.sunset).getTime();
            if(sunrise < currentTime && currentTime < sunset){
                document.getElementById('main').style.background="linear-gradient(to left bottom, rgb(22, 20, 31), rgb(24, 57, 70))";
            }else{
                document.getElementById('main').style.background="linear-gradient(to left bottom, rgb(147, 209, 128), rgb(96, 116, 231))";
            }
        })
}

function swapTheme () {
	if(document.getElementById('main').style.background!=="linear-gradient(to left bottom, rgb(22, 20, 31), rgb(24, 57, 70))")
    document.getElementById('main').style.background="linear-gradient(to left bottom, rgb(22, 20, 31), rgb(24, 57, 70))";

    else {
        document.getElementById('main').style.background="linear-gradient(to left bottom, rgb(147, 209, 128), rgb(96, 116, 231))";
    }
}