/* global d3 */
var width=1600;
var height=1400;

var total_unauthorized_pop = {
  "mexico":1254083,
  "other_north":239723,
  "asia":108024,
  "africa":4893,
  "south_america":110016,
  "europe":29990,
  "oceania":22680
};

var unauthorized_percentage = {
}

build_percentage(total_unauthorized_pop, get_total_pop(total_unauthorized_pop));

var color = d3.scaleQuantile()
  .domain([0, 10, 20, 30, 40])
  .range(d3.schemeGreens[5]);

var key_scale = d3.scaleLinear()
  .domain([0, 10, 20, 30, 40])
  .rangeRound([1025, 1065]);

function build_percentage(pop_object, total) {
  for (var property in pop_object) {
    if (pop_object.hasOwnProperty(property)) {
      unauthorized_percentage[property] = (pop_object[property] / total) * 100;
    }
  }
}

function get_total_pop(pop_object) {
  var sum = 0;
  for (var property in pop_object) {
    if (pop_object.hasOwnProperty(property)) {
      sum += pop_object[property];
    }
  }
  return sum;
}
function get_max_pop(pop_object) {
  var max = 0;
  for (var property in pop_object) {
    if (pop_object.hasOwnProperty(property)) {
      if (pop_object[property] > max) {
        max = pop_object[property];
      }
    }
  }
  return max;
}

function draw_origin() {
  d3.select("svg").remove();
  
  var svg_canvas = d3.select("#visuals").append("svg")
    .attr("width", width)
    .attr("height", height);
  
  var world_svg = svg_canvas.append("svg")
    .attr("id", "world")
    .attr("width", width)
    .attr("height", height);
  
  var america_svg = svg_canvas.append("svg")
    .attr("id", "america")
    .attr("width", width)
    .attr("height", height);
  
  var us_projection = d3.geoAlbersUsa()
    .scale(750)
    .translate([400,235]);
  var us_path = d3.geoPath()
    .projection(us_projection);
  
  var world_projection = d3.geoNaturalEarth()
    .scale(150)
    .translate([1100,260]);
  var world_path = d3.geoPath()
      .projection(world_projection);

  var g = world_svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(0,15)");

  g.selectAll("rect")
    .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      return d;
    }))
    .enter().append("rect")
      .attr("height", 10)
      .attr("x", function(d, i) { return 1025+(40 * i); })
      .attr("width", 40)
      .attr("fill", function(d, i) { return color(d[0]); });

  g.append("text")
      .attr("class", "caption")
      .attr("x", 1000)
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Percentage of Unauthorized Immigrants from Region");

  g.call(d3.axisBottom(key_scale)
      .tickSize(13)
      .tickFormat(function(x) {
          return d3.format(".2s")(x) + "%";
      })
      .tickValues([10, 20, 30, 40]))
    .select(".domain")
      .remove();
  
  d3.csv("origin_data.csv", function(data) {
    //Maybe some data processing stuff
    
    d3.json('us_states.json', function(error, json) {
      for (var i = 0; i < data.length; i++) {
        var state = data[i].State;
        var popObject = {
          "mexico": +data[i].mexico,
          "other_north":+data[i].other_north,
          "asia":+data[i].asia,
          "africa":+data[i].africa,
          "south_america":+data[i].south_america,
          "europe":+data[i].europe,
          "oceania":+data[i].oceania
        }
         
        for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.name;
          if (state == jsonState) {
            json.features[j].properties.unauthorized_pop = popObject;
          }
        }
      }
      
      if (error) throw error;
      console.log(json)
      america_svg.selectAll("path")
        .data(json.features)
        .enter().append("path")
        .attr("d", us_path)
        .style("stroke", "grey")
        .style("fill", "2196F3")
        .on("mouseover", function(d) {
          d3.select(this)
            .style("fill", "2196F3");
        })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("fill", "white");
        });   
    });       
  });

  d3.json('world_map.json', function(error, json) {
    if (error) throw error;
    console.log(json)
    world_svg.selectAll("path")
      .data(json.features)
      .enter().append("path")
      .attr("d", world_path)
      .style("stroke", "grey")
      .style("fill", "white")
      .style("fill", function(d) {
        var region = d.properties.name;
        if (region == "united_states") {
          return "grey";
        }
        else {
          return color(unauthorized_percentage[region]);
        }
      });
  }); 
  
}