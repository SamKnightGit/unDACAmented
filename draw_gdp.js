var width=1200;
var height=550;
function draw_gdp() {
	// d3.select("#visuals").remove();
	// d3.select("svg").remove();
	// d3.select(".timeline").append("div")
	// 	.attr("id", "visuals")
	// 	.transition().duration(200);

	var svg_canvas = d3.select("#gdp_visuals").append("svg")
		.attr("width", width - 100)
		.attr("height", height - 100)
		.attr("class", "gdp_canvas")
		.attr("border", "1px sold red;");

	var tooltip = d3.select("#visuals").append("div")
			.attr("class", "tooltip")
			.attr("width", width/4)
			.style("opacity", 1);

	// var button-div = d3.select("#visuals").append("div")
	// 		.s
	var without_daca_btn = d3.select("#visuals").append("button")
		.attr("class", "toggleBtn btn red")
		.style("margin", "10px")
		.style("width", "200px")
		.text("Without DACA");


	var naturalized_daca_btn = d3.select("#visuals").append("button")
			.attr("class", "toggleBtn btn blue")
			.style("margin", "10px")
			.style("width", "200px")
			.text("Naturalized DACA");

	//Define map projection
	var projection = d3.geoAlbersUsa()
	.translate([width/2, height / 2.5])
	.scale([800]);

	// color scale using user defined domain
	var gdp_loss_color = d3.scaleQuantile()
		.domain([1000000, 100000000, 500000000, 1000000000, 5000000000, 14000000000])
		.range(["#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"]);

	var gdp_gain_color = d3.scaleQuantile()
		.domain([1000000, 100000000, 500000000, 1000000000, 5000000000, 14000000000])
		.range(["#ccece6", "#66c2a4", "#41ae76", "#238b45", "#005824"]);

	svg_canvas.append("g")
	.attr("class", "gdp_loss_legend")
	.attr("transform", "translate(960, 20)")

	var gdp_loss_legend = d3.scaleQuantize()
		.domain([1, 14000])
		.range(["#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"]);

	var gdp_gain_legend = d3.scaleQuantize()
		.domain([1, 100, 500, 1000, 5000, 14000])
		.range(["#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"]);

	var legend = d3.legendColor()
	.shapeWidth(25).shapePadding(0)
	.orient("vertical")
	.labelFormat(d3.format(".2s"))
	.scale(gdp_loss_legend)
	.title("GDP Loss in millions")
	.titleWidth(250);

	svg_canvas.select(".gdp_loss_legend").call(legend);

	// Define path generator
	var path = d3.geoPath().projection(projection);

	d3.csv("data/DACA_data_1.csv", function(data) {
		d3.json("us-states.json", function(json) {
			for (var i = 0; i < data.length; i++) {
				// grab state name
				var dataState = data[i].State;

				// grab GDP loss and GDP Gain
				var gdp_loss = parseInt(data[i]["GDP Loss"])
				var gdp_gain = parseInt(data[i]["GDP Gain Education"])
				var daca_pop = parseInt(data[i]["DACA Population"])
				//Find the corresponding state inside the GeoJSON
				for (var j = 0; j < json.features.length; j++) {
					var jsonState = json.features[j].properties.name;
					if(dataState == jsonState) {
						//Copy the data value into the JSON
						json.features[j].properties.gdp_loss = gdp_loss;
						json.features[j].properties.gdp_gain = gdp_gain;
						json.features[j].properties.daca_pop = daca_pop;
						//Stop looking through the JSON
						break;
					} // END IF
				} // END JSON FOR LOOP
			} // END CSV FOR LOOP


			//Bind data and create one path per GeoJSON feature
			//Default map(the view on page load) will be productivity data
			svg_canvas.selectAll("path")
				 .data(json.features)
				 .enter()
				 .append("path")
				 .attr("d", path).attr("class", "feature")
				 .attr("stroke","#fff").attr("stroke-width","0.4").style("opacity", "0.8").style("stroke-opacity", "1")
				 .style("fill", function(d) {
							//Get data value
							var value = d.properties.gdp_loss;
							if (value) {
									return gdp_loss_color(value);
							} else {
									//If value is undefined…
									return "#fff";
							}
				 })
				 .on('mouseover', d => {
						 console.log("mouse over", d.properties.name);
						 tooltip.transition()
							 .duration(200)
							 .style('opacity', .9);
						// tooltip.text(d.country)
						 tooltip.html(
							 "<br>State: " + d.properties.name +
							 "<br>GDP Loss: " + d.properties.gdp_loss +
							 "<br>Daca Population: " + d.properties.daca_pop
						 ).style("transform", "translate(960px, -200px)")
					 })
					 .on('mouseout', () => {
						 tooltip.transition()
							 .duration(400)
							 .style('opacity', 0);
					 })

				// Defining Button Interactivity
				var togData = false;
				d3.select(".toggleBtn")
					.on("click", function(){
						// Determine if current line is visible
						togData=!togData;
						//console.log(togData);
						if (togData == true){
							svg_canvas.selectAll("path")
								.transition().duration(1000)
								.style("fill", function(d) {
									var value = d.properties.gdp_gain;
									if (value) {
										return gdp_gain_color(value);
									} else {
										return "#ccc";
									}
								});
							} else {
								svg_canvas.selectAll("path")
								.transition().duration(1000)
								.style("fill", function(d) {
									var value = d.properties.gdp_loss;
									if(value) {
										return gdp_loss_color(value);
									} else {
										return "#ccc";
									}
								})
							}
						});
		}) // END D3.JSON
	}) // END D3.CSV



	// // Placeholder for visuals
	// svg_canvas.append("text")
	// 	.attr("x", (width - 100) /2)
	// 	.attr("y", 25)
	// 	.attr("font-family", "sans-serif")
	// 	.attr("fill", "red")
	// 	.text("GDP LOSS");
}
