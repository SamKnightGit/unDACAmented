/* global d3 */
var width=960;
var height=660;
function draw_origin() {
  d3.select("svg").remove();
  
  var svg_canvas = d3.select("#visuals").append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // Placeholder for visuals
  var projection = d3.geoNaturalEarth()
    .scale(140)
    .translate([300,350]);
  var path = d3.geoPath()
      .projection(projection);

  world_map_svg = svg_canvas.append("svg")
    .attr("width", 700)
    .attr("height", 500);

  // Load external data and boot
  d3.json('world_map.json', function(error, json) {
    if (error) throw error;
    console.log(json)
    world_map_svg.selectAll("path")
      .data(json.features)
      .enter().append("path")
      .attr("d", path)
      .style("stroke", "grey");
  });
} 

function draw_integration() {
  d3.select("svg").remove();
  
  var svg_canvas = d3.select("#visuals").append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // Placeholder for visuals
  svg_canvas.append("text")
    .attr("x", 25)
    .attr("y", 25)
    .attr("font-family", "sans-serif")
    .attr("fill", "red")
    .text("INTEGRATION VISUALIZATION");
}

function draw_gdp() {
  d3.select("svg").remove();
  
  var svg_canvas = d3.select("#visuals").append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // Placeholder for visuals
  svg_canvas.append("text")
    .attr("x", 25)
    .attr("y", 25)
    .attr("font-family", "sans-serif")
    .attr("fill", "red")
    .text("GDP VISUALIZATION");
}