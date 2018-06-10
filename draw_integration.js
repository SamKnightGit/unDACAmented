/* global d3 */
var width=1800;
var height=600;

function draw_employment() {
	var bar_canvas = d3.select("#visuals").append("svg")
      .attr("width", width)
      .attr("height", 400);
}

function draw_education() {
	console.log("educated!");
}

function draw_integration() {
		d3.select("#visuals").remove();
		d3.select("svg").remove();
		d3.select(".timeline").append("div")
			.attr("id", "visuals")
			.transition().duration(200);

		var svg_canvas = d3.select("#visuals").append("svg")
			.attr("width", width)
			.attr("height", height - 100)
			.attr("class", "integration_canvas")
			.style("background", "red");
}
