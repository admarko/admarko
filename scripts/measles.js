/* module syntax directly copied from d3.v4.js */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.p3 = global.p3 || {})));
}(this, (function (exports) { 'use strict';

const transDur = 500;         //if using transitions
const hexWidth = 39.5;        //size of hexagons in US map
const txtWidth = 20;          //width of state label on each row of grid
const plotOpac = 0.25;        //opacity of plots
const plotStrokeWidth = 2.5;  //width of stroke for drawing plot

var sortBy = "alpha";   // in synch with index.html
var colorBy = "value";  // in synch with index.html

// these are set by index.html
var popYears;           //array of years for which there is population data
var caseYears;          //array of all years for which we have case counts
var mapData;            //data from hex map file
var popData;            //(processed) data from population file
var caseData;           //(processed) data from measles case counts
var plotWdth, plotHght; //dimensions of rectangle in which plots are drawn
var plotXScale;         //linear scale for mapping years to position

//set by index.html, buthave to compute and fill in correct values
var stRate; //per-state rate of measles per 1 million people
var usRate; //national average rate of measles per 1 million people

// little utility for making link to google search for measles
// in given year and state. If no state is passed, "US" is used.
// The year and state are made to be required in the search results
// by enclosing them in (escaped) quotes.
function searchLink(year, state) {
  state = state ? state : "US";
  return ("<a href=\"https://www.google.com/search?q="
  + "measles" + "+%22" + year + "%22+%22" + state + "%22"
  + "\" target=_blank>measles " + year + " " + state + "</a>");
}

function sortBySet(wat) {
  //console.log("sortBy ", wat);

}

function colorBySet(wat) {
  //console.log("colorBy ", wat);
  p3.colorsetting = wat;

  p3.recToRate = function(year, state){
    for(var i =0; i<51; i++){
      if(p3.stRate[i].state === state){
        return p3.stRate[i].rates[year-1930].rate;
      }
    }
  }

  switch(wat) {
    case "diff": //value-mean
    var divergeRates = [];
    for (var y = 0; y < 87; y++) {
      for (var i = 0; i < 51; i++) {
        divergeRates.push(p3.stRate[i].rates[y].rate - p3.usRate[y].rate);
      }
    }
    var divergeExtent = [d3.min(divergeRates), d3.max(divergeRates)];

    p3.divergemap = {}
    p3.divergemap.color = d3.scaleLinear()
    .domain(divergeExtent)
    .range(["black", "white"]);

    for(var i=0; i<51; i++){
      //color in map
      p3.mapState = d3.select("#stateMapG").selectAll("g")._groups[0][i].id.split("-")[1]
      d3.select("#stateMapG").selectAll("path")._groups[0][i].style.fill =
      p3.divergemap.color(p3.recToRate(p3.selectedYear.toString(), p3.mapState));

      //color in grid
      for(var j=0; j<87; j++){
        var recState = d3.select("#stateGrid").selectAll("g").selectAll("rect")._groups[i][j].id.split("-")[1];
        var recYear = d3.select("#stateGrid").selectAll("g").selectAll("rect")._groups[i][j].id.split("-")[2];
        d3.select("#stateGrid").selectAll("g").selectAll("rect")._groups[i][j].style.fill = d3.rgb(p3.divergemap.color(p3.recToRate(recYear, recState)));
      }
    }
    break;

    //value
    case "value": //value
    p3.maxRate = 0
    for(i=0; i<51; i++){
      for(j=0;j<87;j++){
        if(p3.stRate[i].rates[j].rate > p3.maxRate){
          p3.maxRate = p3.stRate[i].rates[j].rate;
        }
      }
    }

    p3.cmap = {}
    p3.cmap.color = d3.scaleLinear()
    .domain([29558.99,16000,8000,2452.46,1000,189.68,100,31.67,15, 0])
    .range([d3.rgb(247, 204, 160.7), d3.rgb(232, 178.5, 125), d3.rgb(204, 153, 102),
      d3.rgb(165.8, 127.5, 89.3), d3.rgb(117.3, 102, 86.7), d3.rgb(86.7, 102, 117.3),
      d3.rgb(89.3, 127.5, 165.8), d3.rgb(102, 153, 204), d3.rgb(125, 178.5, 232), d3.rgb(160.7, 204, 247.3)]);

      function yearlyExtent(){
        var yearlyRates = []
        for(var i =0; i<51; i++){
          yearlyRates.push(p3.stRate[i].rates[p3.selectedYear-1930].rate);
        }
        var yearlyExtent = d3.extent(yearlyRates);
      }

      //color in grid
      for(var i=0; i<51; i++){
        //color in map
        p3.mapState = d3.select("#stateMapG").selectAll("g")._groups[0][i].id.split("-")[1]
        d3.select("#stateMapG").selectAll("path")._groups[0][i].style.fill = p3.cmap.color(p3.recToRate(p3.selectedYear.toString(), p3.mapState));

        //color in grid
        for(var j=0; j<87; j++){
          var recState = d3.select("#stateGrid").selectAll("g").selectAll("rect")._groups[i][j].id.split("-")[1];
          var recYear = d3.select("#stateGrid").selectAll("g").selectAll("rect")._groups[i][j].id.split("-")[2];
          d3.select("#stateGrid").selectAll("g").selectAll("rect")._groups[i][j].style.fill = d3.rgb(p3.cmap.color(p3.recToRate(recYear, recState)));
        }
      }
      break;
    }
  }

  function caseRowFinish(d) {
    return d; // keep this line
  }

  function caseDataFinish(Data) {
    //console.log("caseDataFinish: Data=", Data);
    p3.caseData = Data;
    // initialize the per-state and US rate data arrays;
    // your code will compute correct rates
    p3.stRate = Data.map(row => ({
      state: row.StateAbbr,
      rates: Data.columns
      .filter(y => !isNaN(y)) // keep only the (numeric) years
      .map(y => ({year: +y, rate: 0})) // initialize to zero
    })
  );

  p3.usRate = p3.stRate[0].rates.map(a => Object.assign({}, a));

}

function popRowFinish(d) {
  // console.log("popRowFinish: ", d);
  return d; // keep this line
}

function popDataFinish(Data) {
  //console.log("popDataFinish: ", Data);
  p3.popData = Data;
}


//compute rate per-state per-year
function finalFinish() {
  var popScale = d3.scaleLinear()
                      .domain([1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010])

  var stateData = [];
  var popSum = [];

  for (var i = 0; i < 51; i++) {
    popSum[i] = [];
    for (var m=0; m < 87; m++) {
      popSum[i][m] = 0;
    }

    for (var y = 1930; y < 2010; y+=10) {
      stateData.push(p3.popData[i][y]);
    }
    popScale.range(stateData);
    for (var x = 0; x < 87; x++) {
      var yearPop = popScale(p3.stRate[i].rates[x].year);
      var yearMeasles = p3.caseData[i][x+1930];
      popSum[i][x] = yearPop;
      p3.stRate[i].rates[x].rate = yearMeasles*1000000/yearPop;
    }
    stateData = [];
  }

  var yearSum = 0;
  var measelsSums = []
  var sum = 0;
  for(var i=1930; i <2017; i++){
    for(var j = 0; j< 50; j++){
      sum += p3.caseData[j][i];
    }
    measelsSums.push(sum);
    sum = 0;
  }

  for (y = 0; y < 87; y++) {
    for (x = 0; x < 51; x++) {
      yearSum += popSum[x][y]
    }
    p3.usRate[y].rate = 1000000 * measelsSums[y] / yearSum;
    yearSum=0;
  }
}

function yearSelect(year) {
  p3.selectedYear = year;

  if (p3.colorsetting == "diff") {
    colorBySet("diff");
  } else {
    colorBySet("value");
  }

  //line plots
  p3.maxUSRate = 0;
  for (var i = 0; i < 87; i++) {
    if (p3.usRate[i].rate > p3.maxUSRate) {
      p3.maxUSRate = p3.usRate[i].rate;
    }
  }

  var y = d3.scaleLinear()
              .domain([0, p3.maxUSRate])
              .range([p3.plotHght, 0]);

  var line = d3.line()
                .x(function(d) {return p3.plotXScale(d.year);})
                .y(function(d) {return y(d.rate);});

  d3.select("#plot-us").datum(d=>p3.usRate)
      .transition(p3.transDur).attr("d", line);

  var firstrates = [];

  function correctYear(item) {
    if (item.year >= 1930 && item.year <= 1967) {
      return true;
    } else {
      return false;
    }
  }

  function push(element, index, array) {
    firstrates.push(element.rate);
  }

  function firstInterval(element, index, array) {
    element.rates.filter(correctYear).forEach(push);
  }

  p3.stRate.forEach(firstInterval)

  var ystates = d3.scaleLinear()
  .domain([0, d3.max(firstrates)])
  .range([p3.plotHght,0]);

  var stateline = d3.line()
                      .x(function(d) {return p3.plotXScale(d.year);})
                      .y(function(d) {return ystates(d.rate);});


  d3.select("#plotsG").selectAll("path").data(p3.stRate)
      .datum(d => d.rates).transition(p3.transDur)
      .attr("d", stateline);


  d3.select("#stateMapY").text(year);
}

/* onMouse() is called with mousedown (downward part of click) and
mousemove events. The first argument is what element was under the cursor
at the time, and the second argument is the XY position of the cursor
within that element, which can used (if "plot" == IDspl[0]) to recover,
via p3.plotXScale the corresponding year */
function onMouse(ID, xy) {
  var IDspl = ID.split("-");
  //console.log("onMouse: ", ID, IDspl, xy, d3.event.type);
  p3.clickedYear = IDspl[2];
  p3.clickedState = IDspl[1];
  p3.gridhexplot = IDspl[0];

  //Update coloring of Map in response to changes in selected year
  if (p3.gridhexplot == "grid") {
    yearSelect(p3.clickedYear);
  }

  //Indicate the selected state in Map (Red) and in Plot (Blue)
  for(var i=0; i<51; i++){
    if(p3.clickedState == d3.select("#stateMapG").selectAll("g")._groups[0][i].id.split("-")[1] &&
    p3.clickedState == d3.select("#plotsG").selectAll("path").data(p3.stRate).datum(d => d.rates)._groups[0][i].id.split("-")[1]){
      d3.select("#stateMapG").selectAll("g")._groups[0][i].style.stroke = "red";
      d3.select("#stateMapG").selectAll("g")._groups[0][i].style.strokeWidth = 1;
      //d3.select("#stateMapG").selectAll("g")._groups[0][i].style.strokeOpacity = 1;
      d3.select("#plotsG").selectAll("path").data(p3.stRate).datum(d => d.rates)._groups[0][i].style.stroke = "blue";
    }else{
      d3.select("#stateMapG").selectAll("g")._groups[0][i].style.stroke = "";
      d3.select("#plotsG").selectAll("path").data(p3.stRate).datum(d => d.rates)._groups[0][i].style.stroke = "";
    }
  }
}

exports.hexWidth = hexWidth;
exports.txtWidth = txtWidth;
exports.plotOpac = plotOpac;
exports.plotStrokeWidth = plotStrokeWidth;
exports.transDur = transDur;
exports.sortBySet = sortBySet;
exports.colorBySet = colorBySet;
exports.popRowFinish = popRowFinish;
exports.caseRowFinish = caseRowFinish;
exports.popDataFinish = popDataFinish;
exports.caseDataFinish = caseDataFinish;
exports.mapData = mapData;
exports.popData = popData;
exports.caseData = caseData;
exports.stRate = stRate;
exports.usRate = usRate;
exports.searchLink = searchLink;
exports.plotWdth = plotWdth;
exports.plotHght = plotHght;
exports.plotXScale = plotXScale;
exports.popYears = popYears;
exports.finalFinish = finalFinish;
exports.yearSelect = yearSelect;
exports.onMouse = onMouse;
Object.defineProperty(exports, '__esModule', { value: true });
})));
