/* global d3 */
var width=1600;
var height=1400;

var world_pop = {
  "other_north":0,
  "mexico": 0,
  "south_america":0,
  "europe":0,
  "asia":0,
  "africa":0,
  "oceania":0
};

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
  
  // Taken from: http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
  var us_projection = d3.geoAlbersUsa()
    .scale(750)
    .translate([400,225]);
  var us_path = d3.geoPath()
    .projection(us_projection);
  
  // Placeholder for visuals
  var world_projection = d3.geoNaturalEarth()
    .scale(150)
    .translate([1100,250]);
  var world_path = d3.geoPath()
      .projection(world_projection);


  d3.json('us_states.json', function(error, json) {
    if (error) throw error;
    console.log(json)
    america_svg.selectAll("path")
      .data(json.features)
      .enter().append("path")
      .attr("d", us_path)
      .style("stroke", "grey")
      .style("fill", "white")
      .on("mouseover", function(d) {
        d3.select(this)
          .style("fill", "blue");
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("fill", "white");
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
      .style("fill", function(d) {
        var region = d.properties.name;
        if (region == "united_states") {
          return "grey";
        }
      });
  }); 
  
}