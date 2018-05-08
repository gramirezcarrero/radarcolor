//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end,
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html
var globalRisk = "";
var colorWar = [
  "#195382", //1
  "#195382", //15
  "#195382", //14
  "#195382", //13
  "#195382", //12
  "#195382", //11
  "#195382", //10
  "#195382", //9
  "#195382", //8
  "#195382", //7
  "#195382", //6
  "#195382", //5
  "#195382", //4
  "#195382", //3
  "#195382" //2
];
console.log("init")
var RadarChart = {

  draw: function (id, d, options) {
    var firstData = d;
    var cfg = {
      radius: 0,
      w: 600,
      h: 600,
      factor: 1,
      factorLegend: 1,
      levels: 3,
      maxValue: 0,
      radians: 2 * Math.PI,
      opacityArea: 0.88,
      baseColor: ["", "#8e8e8e"],
      ToRight: 5,
      TranslateX: 80,
      TranslateY: 30,
      ExtraWidthX: 100,
      ExtraWidthY: 130,
      color: d3.scale.category10()
    };

    if ("undefined" !== typeof options) {
      for (var i in options) {
        if ("undefined" !== typeof options[i]) {
          cfg[i] = options[i];
        }
      }
    }
    var legends = cfg.legends;
    cfg.maxValue = Math.max(
      cfg.maxValue,
      d3.max(d, function (i) {
        return d3.max(
          i.map(function (o) {
            return o.value;
          })
        );
      })
    );

    var allAxis = d[0].map(function (i, j) {
      return i.axis;
    });

    var total = allAxis.length;
    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

    var Format = d3.format("");
    d3
      .select(id)
      .select("svg")
      .remove();
    var g = d3
      .select(id)
      .append("svg")
      .attr("width", cfg.w + cfg.ExtraWidthX)
      .attr("height", cfg.h + cfg.ExtraWidthY)
      .append("g")
      .attr(
        "transform",
        "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")"
      );
    var tooltip;

    // 
    var backgroundCircle = function () {
      var dataValuesColors = [];

      var createArea = function (dataValuesColors, id) {
        // console.log(dataValuesColors[0])
        dataValuesColors.push(dataValuesColors[0]);

        // 
        g
          .selectAll(".area")
          .data([dataValuesColors])
          .enter()
          .append("polygon")
          .attr("class", "animated bounceIn radar-chart-serie22")
          .attr("points", function (d) {
            var str = "";
            console.log(d)
            for (var pti = 0; pti < d.length; pti++) {
              str = str + (~~d[pti][0]) + "," + (~~d[pti][1]) + " ";
            }
            console.log(str)
            return str;
          })
          .style("fill", function (j, i) {
            return dataColor[id];
          })
      }

      for (areaB in areasBack) {
        for (var e = 0; e < 16; e++) {
          var value = areasBack[areaB]
          dataValuesColors.push([
            cfg.w / 2 * (1 - parseFloat(Math.max(value, 0)) / cfg.maxValue * cfg.factor * Math.sin(e * cfg.radians / total)),
            cfg.h / 2 * (1 - parseFloat(Math.max(value, 0)) / cfg.maxValue * cfg.factor * Math.cos(e * cfg.radians / total))
          ]);

        }
        createArea(dataValuesColors, areaB)
        dataValuesColors = []
      }


    }
    backgroundCircle()
    // 
    //Circular segments

    for (var j = 0; j < cfg.levels; j++) {

      var levelFactor = (cfg.factor * radius * ((j + 1) / cfg.levels));
      g
        .selectAll(".levels")
        .data(allAxis)
        .enter()
        .append("svg:line")
        .attr("x1", function (d, i) {
          return (
            levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total))
          );
        })
        .attr("y1", function (d, i) {
          return (
            levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total))
          );
        })
        .attr("x2", function (d, i) {
          return (
            levelFactor *
            (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total))
          );
        })
        .attr("y2", function (d, i) {
          return (
            levelFactor *
            (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total))
          );
        })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-opacity", "0.75")
        .style("stroke-width", "0.3px")
        .attr(
          "transform",
          "translate(" +
          (cfg.w / 2 - levelFactor) +
          ", " +
          (cfg.h / 2 - levelFactor) +
          ")"
        );

    }

    //Text indicating at what % each level is
    for (var j = 0; j < cfg.levels; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data([1]) //dummy data
        .enter()
        .append("svg:text")
        .attr("x", function (d) { return levelFactor * (1 - cfg.factor * Math.sin(0)); })
        .attr("y", function (d) { return levelFactor * (1 - cfg.factor * Math.cos(0)); })
        .attr("class", "legend")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
        .attr("fill", "#C2C2C2")
        .text(Math.round(Format((j + 1) * cfg.maxValue / cfg.levels) * 10));
    }

    series = 0;

    var axis = g
      .selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");

    if (cfg.lineVertical) {
      axis
        .append("line")
        .attr("class", "lineVertical")
        .attr("x1", cfg.w / 2)
        .attr("y1", cfg.h / 2)
        .attr("x2", function (d, i) {
          return (
            cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total))
          );
        })
        .attr("y2", function (d, i) {
          return (
            cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total))
          );
        })
        .attr("class", "line")
        .style("stroke", function (d, i) {
          var newColor1 = colorWar;
          return newColor1[i];
        })
        .style("stroke-width", "1px");

    }
    if (legends) {
      var text = "";
      var idText = id.replace("#", "") + "text"

      axis
        .append("text")
        .attr("class", idText)
        .text(function (d) {
          text = d;
        })
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", function (d, i) {
          return "translate(0, 0)";
        })
        .style("font-family", "Cabin;")
        .style("font-size", "11px")
        .style("fill", "#ccc")
        .attr("text-anchor", "middle")
        .attr("x", function (d, i) {
          return (
            cfg.w /
            2 *
            (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) -
            60 * Math.sin(i * cfg.radians / total)
          );
        })
        .attr("y", function (d, i) {
          return (
            cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) -
            30 * Math.cos(i * cfg.radians / total)
          );
        })
        .call(wrap, w * 0.47, text);
    }

    //* wrap */
    function wrap(text, width, d, i) {
      var idText = id.replace("#", "") + "text"
      var lengthD = d.length
      // console.log(lengthD)
      text.each(function (d, o) {
        var text = d3.select(this),
          words = d.split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0,
          flag = 0;

        text
          .text(null)
          .attr("id", idText + "" + o)
        var word_arr = [[], []]
        function wordsWork() {
          var arr = d.split(" ")

          arr.forEach(function (e, i) {

            if (i < 2) {
              word_arr[0] += e + ' ';

            } else {
              word_arr[1] += e + ' ';
            }
          })


        }
        wordsWork()
        for (var u in word_arr) {

          if (u < 1) {
            var fill = firstData[1][o].value > 0.4 ? "#F33B4B" : firstData[1][o].value <= 0.4 && firstData[1][o].value > 0.2 ? "#EEAE4A" : "#79D568"
            d3.select("#" + idText + "" + o)
              .append("tspan")
              .text(word_arr[u].trim())
              .attr("dx", function () {
                return "1.8em"
              })
              .attr("dy", u + "em")
              .attr("x", function () {
                return x
              })
              .attr("fill", fill)
              .attr("text-anchor", function () {
                if (o % (lengthD / 2) == 0)
                  return "end"
                else
                  return "start"
              })
          }
          else {
            var fill = firstData[1][o].value > 0.4 ? "#F33B4B" : firstData[1][o].value <= 0.4 && firstData[1][o].value > 0.2 ? "#EEAE4A" : "#79D568"
            d3.select("#" + idText + "" + o)
              .append("tspan")
              .text(word_arr[u])
              .attr("dx", function () {
                if (o % (lengthD / 2) == 0) {
                  return "1.8em"
                } else {
                  return "0em"
                }
              })
              .attr("dy", u + "em")
              .attr("x", function () {
                if (o > 0 && o < 7) {
                  return x
                } else if (o > 13) {
                  return x
                } else {
                  return x
                }
              })
              .attr("fill", fill)
              .attr("text-anchor", function () {
                if (o > 0 && o < 7)
                  return "end"
                else
                  return "start"
              })
          }
        }
      });
    }
    // wrap

    d.forEach(function (y, x) {
      dataValues = [];
      g.selectAll(".nodes").data(y, function (j, i) {
        dataValues.push([
          cfg.w /
          2 *
          (1 -
            parseFloat(Math.max(j.value, 0)) /
            cfg.maxValue *
            cfg.factor *
            Math.sin(i * cfg.radians / total)),
          cfg.h /
          2 *
          (1 -
            parseFloat(Math.max(j.value, 0)) /
            cfg.maxValue *
            cfg.factor *
            Math.cos(i * cfg.radians / total))
        ]);
      });
      dataValues.push(dataValues[0]);
      g
        .selectAll(".area")
        .data([dataValues])
        .enter()
        .append("polygon")
        .attr("class", "animated bounceIn radar-chart-serie" + series)
        .style("stroke-width", "1")
        .style("stroke", function () {
          return series > 0 ? "black" : ""
        })
        .attr("points", function (d) {
          var str = "";
          for (var pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + "," + d[pti][1] + " ";
          }
          return str;
        })
        .style("fill", function (j, i) {
          return cfg.baseColor[series];
        })
        .style("fill-opacity", cfg.opacityArea)
        .on("mouseover", function (d) {
          z = "polygon." + d3.select(this).attr("class");
          // g
          //   .selectAll("polygon")
          //   .transition(200)
          //   .style("fill-opacity", 0.1);
          g
            .selectAll('.radar-chart-serie1')
            .transition(200)
            .style("fill-opacity", 0.1);
        })
        .on("mouseout", function () {
          g
            .selectAll(".radar-chart-serie1")
            .transition(200)
            .style("fill-opacity", cfg.opacityArea);
        });
      series++;
    });
    series = 0;

    d.forEach(function (y, x) {
      g
        .selectAll(".nodes")
        .data(y)
        .enter()
        .append("svg:circle")
        .attr("class", function (d) {
          if (series == 1)
            return "animated bounceIn radar-chart-serie" + series;
          else {
            "radar-chart-serie" + series;
          }
        })
        .attr("r", function (d) {
          // console.log(d.value == 0.6)
          if (d.value == 0 || d.value == 0.6) return 0;
          return cfg.radius;
        })
        .attr("alt", function (j) {
          return Math.max(j.value, 0);
        })
        .attr("cx", function (j, i) {
          dataValues.push([
            cfg.w /
            2 *
            (1 -
              parseFloat(Math.max(j.value, 0)) /
              cfg.maxValue *
              cfg.factor *
              Math.sin(i * cfg.radians / total)),
            cfg.h /
            2 *
            (1 -
              parseFloat(Math.max(j.value, 0)) /
              cfg.maxValue *
              cfg.factor *
              Math.cos(i * cfg.radians / total))
          ]);
          return (
            cfg.w /
            2 *
            (1 -
              Math.max(j.value, 0) /
              cfg.maxValue *
              cfg.factor *
              Math.sin(i * cfg.radians / total))
          );
        })
        .attr("cy", function (j, i) {
          return (
            cfg.h /
            2 *
            (1 -
              Math.max(j.value, 0) /
              cfg.maxValue *
              cfg.factor *
              Math.cos(i * cfg.radians / total))
          );
        })
        .attr("data-id", function (j) {
          return j.axis;
        })
        // .style("fill", cfg.color(series)).style("fill-opacity", .9)
        .style("fill", function (j, i) {

          //    0   ,     1   ,        2  ,   3   ,     4   ,     5
          //  green  , orange  ,  orange  , orange   ,  red  ,     5
          // fc1515
          // ff7f29
          // 66d63c
          var colors = [
            "#000",
            "#000",
            "#000",
            "#000",
            "#000",
            "#000"
          ];

          var idColor = Math.round(Math.max(j.value, 0) * 10) - 1;
          idColor = idColor < 0 ? 0 : idColor;
          if (series <= 0) {
            var nwColor = colorWar;
            return nwColor[i];
          } else {

            return colors[idColor];
          }
        })
        .style("fill-opacity", 0.9)
        .append("svg:title")
        .text(function (j) {
          return Math.max(j.value, 0);
        });

      series++;
    });
    //Tooltip
    tooltip = g
      .append("text")
      .style("opacity", 0)
      .style("font-family", "sans-serif")
      .style("font-size", "13px");
  }
};
