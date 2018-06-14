var width=$(window).width();
var height=600;
function draw_gdp() {
	d3.select("#visuals").remove();
	d3.select("svg").remove();
	d3.select(".timeline").append("div")
		.attr("id", "visuals")
		.transition().duration(200);

	var svg_canvas = d3.select("#visuals").append("svg")
		.attr("width", "100%")
		.attr("height", height - 100)
		.attr("class", "gdp_canvas");

	var tooltip = d3.select("#visuals").append("div")
			.attr("class", "tooltip")
			.attr("width", width/4)
			.style("opacity", 1);

	var naturalized_daca_btn = d3.select("#visuals").append("button")
			.attr("class", "toggleBtnGain btn")
			.style("background", "#52a26b")
		    .style("position", "absolute")
		    .style("top", height/1.2)
            .style("left", width/1.4)
			.style("margin", "10px")
			.style("width", "15%")
			.text("Naturalized DACA")
			// .attr("transform", "translate(" + width / 2+ ", 800)");

	//Define map projection
	var projection = d3.geoAlbersUsa()
	.translate([width / 3, height / 3])
	.scale([width/2]);

	// color scale using user defined domain
	var gdp_current_color = d3.scaleQuantile()
		.domain([1000000, 100000000, 500000000, 1000000000, 5000000000, 14000000000])
		.range(d3.schemeBlues[7].slice(2,8));

	var gdp_gain_color = d3.scaleQuantile()
		.domain([1000000, 100000000, 500000000, 1000000000, 5000000000, 14000000000])
		.range(["#ccece6", "#66c2a4", "#41ae76", "#238b45", "#005824"]);

	svg_canvas.append("g")
	.attr("class", "gdp_legend")
	.attr("transform", "translate(" + width / 1.9 + ", " + height/4 + ")");

	var us_map = svg_canvas.append("g")
	.attr("class", "us_map")
	.attr("transform", "translate(0, 0)");

	var gdp_loss_legend = d3.scaleQuantile()
		.domain([1000000, 100000000, 500000000, 1000000000, 5000000000, 14000000000])
		.range(d3.schemeBlues[7].slice(2,8));

	var gdp_gain_legend = d3.scaleQuantile()
		.domain([1000000, 100000000, 500000000, 1000000000, 5000000000, 14000000000])
		.range(["#ccece6", "#66c2a4", "#41ae76", "#238b45", "#005824"]);

	var legend_loss = d3.legendColor()
	// .shapeWidth(25)
	.orient("vertical")
	.shapePadding(-2).shapeHeight(30)
	// .style("border-bottom", "1px solid black !important")
	.labelFormat(d3.format(".2s"))
	.scale(gdp_loss_legend)
	.title("GDP contribution in dollars annually")
	.titleWidth(400);
  

	var legend_gain = d3.legendColor()
	// .shapeWidth(25)
	.shapePadding(-2).shapeHeight(30)
	.orient("vertical")
	.labelFormat(d3.format(".2s"))
	.scale(gdp_gain_legend)
	.title("GDP Gain in millions annually")
	.titleWidth(400);


	svg_canvas.select(".gdp_legend").call(legend_loss);

	// Define path generator
	var path = d3.geoPath().projection(projection);
	var total_loss = 0;
	var total_gain = 0;

	d3.csv("data/DACA_data_1.csv", function(data) {
		d3.json("us-states.json", function(json) {
			for (var i = 0; i < data.length; i++) {
				// grab state name
				var dataState = data[i].State;

				// grab GDP loss and GDP Gain
				var gdp_loss = parseInt(data[i]["GDP Loss"])
				var gdp_gain = parseInt(data[i]["GDP Gain Education"])

				var daca_pop = parseInt(data[i]["DACA Population"])

				total_loss += parseInt(data[i]["GDP Loss"]);
				if(data[i]["GDP Gain Education"]) {
					total_gain += parseInt(data[i]["GDP Gain Education"]);
				}

				console.log("total_gain", total_gain)
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

			// total_loss
			var loss = d3.format(".2s")(total_loss).replace(/G/,"B");
			var gain = d3.format(".2s")(total_gain).replace(/G/,"B");
			//Bind data and create one path per GeoJSON feature
			//Default map(the view on page load) will be productivity data
			// d3.select("svg").append("circle")


			var circle = svg_canvas.append("g");
			circle.append("circle")
						.attr("cx", width / 10)
						.attr("cy", height/5)
			.attr("r", 75)
			.attr("id", "total")
			.attr("class", "total_dollars")
			.style("fill", "#426BA8");

			// var rectangle = svg_canvas.append("g");
			// rectangle.append("rectangle")
			// 			.attr("x", width / 2)
			// 			.attr("y", )
			// var total_dollars_circle = svg_canvas

			circle.append("text")
			// .style("stroke", "white")
              .style("font-weight", "bolder")
              .attr("class", "total_dollars_text")
              .attr("position", "relative")
              .attr("text-anchor", "middle")
              .style("transform", "translate(" + width/10 + "px," + height/5 + "px)")
              .style("fill", "white")
              .text("$" + loss);
          
            circle.append("text")
              .style("font-weight", "bolder")
              .attr("class", "total_dollars_text")
              .attr("position", "relative")
              .attr("text-anchor", "middle")
              .style("transform", "translate(" + width/10 + "px," + ((height/5) + 20) + "px)")
              .style("fill", "white")
              .text("Contributed");

			d3.select(".total_dollars").append("i").attr("class", "fas fa-angle-double-down")
			.style("transform", "translate(160px, 150px)")
			// .style("positon", "absolute")
			// .style("top", "0")
			// .style("left", "0");
			// circle.append("text")
			// .text("\uf103")
			// .style("fill", "black")
			// .style("transform", "translate(160px, 180px)")
			// .style("font-family", "Font Awesome\ 5 Free");
			// .style("transform", "translate(250px, 175px)");



			us_map.selectAll("path")
				 .data(json.features)
				 .enter()
				 .append("path")
				 .attr("d", path).attr("class", "feature")
				 .attr("stroke","#fff").attr("stroke-width","0.4").style("opacity", "0.8").style("stroke-opacity", "1")
				 .style("fill", function(d) {
							//Get data value
							var value = d.properties.gdp_loss;
							if (value) {
									return gdp_current_color(value);
							} else {
									//If value is undefined…
									return "#fff";
							}
				 })
				 .on('mouseover', function(d) {
						 d3.select(this).style("fill-opacity", .75);
						 tooltip.transition()
							 .duration(200)
							 .style('opacity', .9);
						// tooltip.text(d.country)
						 tooltip.html(
							 "<br>State: " + d.properties.name +
							 "<br>GDP Loss: " + d.properties.gdp_loss +
							 "<br>Daca Population: " + d.properties.daca_pop
						 )
                          .attr("position", "absolute")
                          .attr("top", "50%")
                          .attr("left", "20%");
					 })
                 .on('mouseout', function() {
                     d3.select(this).style("fill-opacity", 1);
                     tooltip.transition()
                         .duration(400)
                         .style('opacity', 0);
                 });

				// Defining Button Interactivity
				d3.select(".toggleBtnGain")
					.on("click", function(){
                        if (d3.select(this).classed("toggleBtnContribution")) {
                          svg_canvas.selectAll("path")
                              .transition().duration(1000)
                              .style("fill", function(d) {
                                  var value = d.properties.gdp_loss;
                                  if (value) {
                                      return gdp_current_color(value);
                                  } else {
                                      return "#ccc";
                                  }
                              });
                          svg_canvas.select(".gdp_legend")
                              .call(legend_loss);

                          d3.select(".total_dollars")
                              .transition()
                              .duration(1000)
                              .style("fill", "#426BA8");

                          d3.select(".total_dollars_text")
                              .transition()
                              .duration(1000)
                              .text("$" + loss);

                          d3.select(this)
                            .style("background", "#52a26b")
                            .text("Naturalized DACA")
                            .classed("toggleBtnContribution", false);      
                        }
                        else {
                          // Determine if current line is visible
                          // togData=!togData;
                          //console.log(togData);
                          // if (togData == true){
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
                          svg_canvas.select(".gdp_legend")
                            .call(legend_gain)
                            .transition()
                            .duration(1000);
                              // console.log("total_gain", gain);
                          d3.select(".total_dollars")
                            .transition()
                            .duration(1000)
                            .style("fill", "#52a26b");
                          d3.select(".total_dollars_text")
                            .transition()
                            .duration(1000)
                            .text("$" + gain + " gain");

                          d3.select(this)
                            .style("background", "#426BA8")
                            .text("Current DACA")
                            .classed("toggleBtnContribution", true);
                        }
						
				    });
		}) // END D3.JSON
	}) // END D3.CSV



	// Placeholder for visuals
	var title = svg_canvas.append("text")
	 .attr("class", "canvas_title")
		.attr("x", "50%")
		.attr("y", 50)
		.attr("fill", "#000")
		.attr("text-anchor", "middle")
		.attr("font-size", "20px")
		.attr("font-weight", "bold")
	 .text("DACA Workers' GDP Contribution, 2017")


}
