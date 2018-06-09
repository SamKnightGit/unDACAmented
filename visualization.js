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
