var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://www.colourlovers.com/api/palettes/random?format=json");
xhr.setRequestHeader("format", "json");
xhr.send(data);

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomIntSections(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min)
}

var randomArray = function (n, minMax) {
  var obj = [];
  for (var i = 0; i < n; i++) {
    obj.push({
      value: getRandomInt(minMax[0], minMax[1]),
      axis: ""
    });
  }
  return obj;
};

var w = 300,
  h = 300;

var colorscale = d3.scale.category10();
var areasBack = [0.6, 0.4, 0.2];
var dataColor = ['lightblue', 'lightgray', 'lightyellow']
var LegendOptions = [];
let genData = ((n) => {
  var re = new Array()
  Array(n).fill().map((k, val) => {
    re.push({ axis: `data ${val}`, value: 0.6 })
  })
  return re
})

let numberR = ~~getRandomIntSections(3, 20)
// numberR = 9
// console.log(numberR)
var f = [
  genData(numberR),
  randomArray(numberR, [0, 0.5])
];

//Options for the Radar chart, other than default
var mycfg = {
  areaColor: true,
  lineVertical: true,
  w: w,
  h: h,
  maxValue: 0.6,
  levels: 6,
  baseColor: ["transparent", "rgba(255,255,255,.8)"],
  ExtraWidthX: 220,
  legends: true,
  TranslateX: 100,
  TranslateY: 65,
  radius: 2
  // radius: w * 0.013
};
//Call function to draw the Radar chart for test radars
// Will expect that data is in %'s
RadarChart.draw("#chart", f, mycfg);
