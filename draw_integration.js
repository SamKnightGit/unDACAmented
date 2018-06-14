/* global d3 */
var width=1800;
var height=800;

function draw_employment() {

		function get_every_other(array) {
			new_array = [];
			for (i = 1; i < array.length; i += 2) {
				new_array.push(array[i]);
			}
			return new_array;
		}

	var bar_canvas = d3.select("#bar_svg").append("svg")
			.attr("class", "card")
			.attr("width", "100%")
			.attr("height", 600);

		var margin = {top: 40, right: 100, bottom: 150, left: 100},
			width = parseInt(bar_canvas.style("width").replace("px", "") ) - margin.left - margin.right,
			height = parseInt(bar_canvas.style("height").replace("px", "")) - margin.top - margin.bottom,
			g = bar_canvas.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var occupation_scale = d3.scaleBand()
			.rangeRound([0, width])
			.paddingInner(0.2);

		var data_scale = d3.scaleBand()
			.padding(0.3);

		var y = d3.scaleLinear()
			.rangeRound([height, 0]);

		var z = d3.scaleOrdinal()
			.range(["#8da0cb", "#66c2a5", "#fc8d62"]);


		d3.csv("data/employment.csv", function(d, i, columns) {
			for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
			return d;
		}, function(error, data) {
			if (error) throw error;

			var keys = get_every_other(data.columns.slice(1));
			occupation_scale.domain(data.map(function (d) {return d.Occupation; }));
			data_scale.domain(keys).rangeRound([0, occupation_scale.bandwidth()]);
			y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

			var legend = bar_canvas.selectAll(".legend")
				.data(keys)
				.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(110," + (50 +  (i * 25)) + ")"; });

			legend.append("rect")
					.attr("x", width - 18)
					.attr("width", 18)
					.attr("height", 18)
					.style("fill", function(d) {
						return z(d);
					});

			legend.append("text")
					.attr("x", width - 24)
					.attr("y", 9)
					.attr("dy", ".35em")
					.style("text-anchor", "end")
					.text(function(d) {
											var split = d.split(" ")[1];
											return split + " Workers";
										});

			g.append("g")
				.selectAll("g")
				.data(data)
				.enter().append("g")
					.attr("transform", function(d) {return "translate(" + occupation_scale(d.Occupation) + ",0)";})
				.selectAll("rect")
				.data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
				.enter().append("rect")
					.attr("class", function(d) {return d.key; })
					.attr("x", function(d) {return data_scale(d.key); })
					.attr("y", function(d) {return y(d.value); })
					.attr("width", data_scale.bandwidth())
					.attr("height", function(d) { return height - y(d.value); })
					.attr("fill", function(d) {
						return z(d.key);
					})
					.attr("fill-opacity", function(d) {
						if (d.key != " DACA Percent") {
							return "0.25";
						}
					});

			g.append("g")
				.attr("class", "no_domain")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(occupation_scale))
				.selectAll("text")
				.attr("transform", "rotate(-30)")
				.style("text-anchor", "end");

			g.append("g")
				.append("text")
					.attr("text-anchor", "middle")
					.attr("x", width/2)
					.attr("y", height + 120)
					.attr("font-weight", "bold")
					.attr("font-size", "16px")
					.text("Occupation");

			g.append("g")
				.attr("class", "no_domain")
				.call(d3.axisLeft(y).ticks(null, "s"))
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("x", -height/2)
				.attr("y", -40)
				.attr("dy", "0.32em")
				.attr("fill", "#000")
				.attr("font-weight", "bold")
				.attr("text-anchor", "middle")
				.attr("font-size", "16px")
				.text("% of Workforce in Occupation");


		})


}


function draw_pie_chart() {

	// Employment Rate Data broken down by DACA, DACA Ineligible, and US
	var daca_data = [
		{total: 682909},
		{status: "Employed", percent: 55, number: 379390},
		{status: "Unemployed", percent: 8, number: 55184},
		{status: "Not In Labor Force", percent: 36, number: 248335},
	];

	var daca_ineligible_data = [
		{total: 10138000},
		{status: "Employed", percent: 64, number: 6466000},
		{status: "Unemployed", percent: 7, number: 702000},
		{status: "Not In Labor Force", percent: 29, number: 2970000},
	];

	var us_data = [
		{total: 255078000},
		{status: "Employed", percent: 60, number: 153337000},
		{status: "Unemployed", percent: 3, number: 6982000},
		{status: "Not In Labor Force", percent: 37, number: 94759000},
	];

	var text = "";

	// init svg sizes
	var w = width / 8;
	var h = height / 5;
	var duration = 750;

	// scale readius based on gro
	var radius = (Math.min(w, h) / 2);
	var min = d3.min([parseInt(daca_data[0].total), parseInt(daca_ineligible_data[0].total), parseInt(us_data[0].total)]);
	var max = d3.max([parseInt(daca_data[0].total), parseInt(daca_ineligible_data[0].total), parseInt(us_data[0].total)]);
	var radius_scale = d3.scaleSqrt().domain([0, max]).range([20, radius]);
	var daca_radius = radius_scale(daca_data[0].total);
	var us_radius = radius_scale(us_data[0].total);
	var daca_ineligible_radius = radius_scale(daca_ineligible_data[0].total);

	var pie = d3.pie()
	.value(function(d) { return d.percent; })
	.sort(null);

	// DACA PIE **********************************************************************
	var daca_svg = d3.select("#pie_svg")
	.append('svg')
	.attr('class', 'pie daca_pie')
	.attr('width', w)
	.attr('height', h + 20);

	var daca_g = daca_svg.append('g')
	.attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')')
	.attr("class", "daca_g");

	var daca_path = d3.arc()
	.innerRadius(0)
	.outerRadius(daca_radius);

	var daca_label = d3.arc()
		.outerRadius(daca_radius)
		.innerRadius(0);

	var daca_arc = daca_g.selectAll(".arc")
		.data(pie(daca_data))
		.enter().append("g")
			.attr("class", "arc daca_arc");

	daca_arc.append("path")
		.attr("d", daca_path)
		.attr("class", daca_path)
		.attr('fill', function(d) {
			if(d.data.status == 'Employed') { return "#66c2a5";}
			else if(d.data.status == 'Unemployed') {return "#bababa";}
			else {return "#fff2ae";}
		})
		.on("mouseover", function(d) {
				if(d.data.status == 'Employed') {
					d3.select(this)
						.style("cursor", "pointer")
						.style("stroke", "black");
				}
			})
		.on("mouseout", function(d) {
				d3.select(this)
					.style("cursor", "none")
					.style("stroke", "none");
		})
		.on("click", function() {
			d3.select(".daca_pie").attr("fill-opacity", "1");
			d3.selectAll(".daca, .daca_path, .daca_arc").attr("fill-opacity", "1");
			d3.selectAll(".undocumented, .us, .us_path, .daca_ineligible_path").attr("fill-opacity", ".25");
		})

	var daca_text = daca_arc.append("text")
		// .attr("transform", function(d) {
		// 	return "translate(" + daca_path.centroid(d)+  ")";
		// })
		.attr("transform", function(d) {
			var c = daca_path.centroid(d),
			x = c[0],
			y = c[1],
			h = Math.sqrt(x*x + y*y);
			 return "translate(" + (x/h * daca_radius + 30) +  ',' +
					 (y/h * (daca_radius + 30)) +  ")";
		})
		.attr("dy", ".25em")
		.attr("dx", "-2.75em")
		.text(function(d) {
			if(d.data.percent) {
					return (d.data.percent + "%")
			}
		})
		.style("font-size", "10px")
		.attr("text-anchor", function(d) {
			// return "middle";
				// are we past the center?
				return (d.endAngle + d.startAngle)/2 > Math.PI ?
						"end" : "start";
		})
		var daca_total = daca_svg.append("text")
		.text("Total: " + d3.format(".2s")(parseInt(daca_data[0].total)) + "*")
		.attr("fill", "black")
		.attr("class", "daca")
		.attr("text-anchor", "start")
		.attr("transform", "translate(60, 160)");


	// DACA INELIGIBLE PIE ***********************************************************
	var daca_ineligible_svg = d3.select("#pie_svg")
		.append('svg')
		.attr('class', 'pie daca_ineligible_pie')
		.attr('width', w)
		.attr('height', h + 20);

	var daca_ineligible_g = daca_ineligible_svg.append('g')
	.attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')')
	.style("background", "red")
	.attr("class", "daca_ineligible_g");

	var daca_ineligible_path = d3.arc()
	.innerRadius(0)
	.outerRadius(daca_ineligible_radius);

	var daca_ineligible_label = d3.arc()
		.outerRadius(daca_ineligible_radius)
		.innerRadius(0);

	var daca_ineligible_arc = daca_ineligible_g.selectAll(".arc")
		.data(pie(daca_ineligible_data))
		.enter().append("g")
			.attr("class", "arc daca_ineligible_arc");

		daca_ineligible_arc.append("path")
			.attr("d", daca_ineligible_path)
			.attr("class", "daca_ineligible_path")
			.attr("fill-opacity", ".25")
			.attr('fill', function(d) {
				if(d.data.status == 'Employed') { return "#fc8d62";}
				else if(d.data.status == 'Unemployed') {return "#bababa";}
				else {return "#fff2ae";}
			})
			.on("mouseover", function(d) {
					if(d.data.status == 'Employed') {
						d3.select(this)
							.style("cursor", "pointer")
							.style("stroke", "black");
					}
				})
			.on("mouseout", function(d) {
					d3.select(this)
						.style("cursor", "none")
						.style("stroke", "none");
			})
			.on("click", function() {
				d3.select(".daca_ineligible_pie").attr("fill-opacity", "1");
				d3.selectAll(".undocumented, .daca_ineligible_arc, .daca_ineligible_path").attr("fill-opacity", "1");
				d3.selectAll(".us, .us_path, .daca_path, .daca, .daca_arc").attr("fill-opacity", ".25");
			})

		var daca_ineligible_text = daca_ineligible_arc.append("text")
			// .attr("transform", function(d) {
			// 	return "translate(" + daca_path.centroid(d)+  ")";
			// })
			.attr("transform", function(d) {
				var c = daca_ineligible_path.centroid(d),
				x = c[0],
				y = c[1],
				h = Math.sqrt(x*x + y*y);
				 return "translate(" + (x/h * daca_ineligible_radius + 30) +  ',' +
						 (y/h * (daca_ineligible_radius + 30)) +  ")";
			})
			.attr("dy", ".25em")
			.attr("dx", "-2.75em")
			.text(function(d) {
				if(d.data.percent) {
						return (d.data.percent + "%")
				}
			})
			.style("font-size", "10px")
			.attr("text-anchor", function(d) {
				// return "middle";
					// are we past the center?
					return (d.endAngle + d.startAngle)/2 > Math.PI ?
							"end" : "start";
			})
		var daca_ineligible_total = daca_ineligible_svg.append("text")
		.text("Total: " + d3.format(".2s")(parseInt(daca_ineligible_data[0].total)) + "*")
		.attr("fill", "black")
		.attr("text-anchor", "start")
		.attr("class", "undocumented")
		.attr("transform", "translate(60, 155)");


	// US PIE ************************************************************************
	var us_svg = d3.select("#pie_svg")
		.append('svg')
		.attr('class', 'pie us_pie')
		.attr('width', w)
		.attr('height', h + 50);

	var us_total = us_svg.append("text")
	.text("Total: " + d3.format(".2s")(parseInt(us_data[0].total)) + "*")
	.attr("fill", "black")
	.attr("class", "US")
	.attr("text-anchor", "start")
	.attr("transform", "translate(60, " + 200 + ")");

	var us_g = us_svg.append('g')
	.attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')')
	.style("background", "red")
	.attr("class", "us_g");

	var us_path = d3.arc()
	.innerRadius(0)
	.outerRadius(us_radius);

	var us_label = d3.arc()
		.outerRadius(us_radius)
		.innerRadius(0);

	var us_arc = us_g.selectAll(".arc")
		.data(pie(us_data))
		.enter().append("g")
			.attr("class", "arc us_arc");

	us_arc.append("path")
		.attr("d", us_path)
		.attr("class", "us_path")
		.attr("fill-opacity", ".25")
		.attr('fill', function(d) {
			if(d.data.status == 'Employed') { return "#8da0cc";}
			else if(d.data.status == 'Unemployed') {return "#bababa";}
			else {return "#fff2ae";}
		})
		.on("mouseover", function(d) {
				if(d.data.status == 'Employed') {
					d3.select(this)
						.style("cursor", "pointer")
						.style("stroke", "black");
				}
			})
		.on("mouseout", function(d) {
				d3.select(this)
					.style("cursor", "none")
					.style("stroke", "none");
		})
		.on("click", function() {
			d3.select(".us_pie").attr("fill-opacity", "1");
			d3.selectAll(".US, .us_path").attr("fill-opacity", "1");
			d3.selectAll(".undocumented, .daca, .daca_arc, .daca_ineligible_arc, .daca_ineligible_path").attr("fill-opacity", ".25");
		})



	var us_text = us_arc.append("text")
		// .attr("transform", function(d) {
		// 	return "translate(" + daca_path.centroid(d)+  ")";
		// })
		.attr("transform", function(d) {
			var c = daca_ineligible_path.centroid(d),
			x = c[0],
			y = c[1],
			h = Math.sqrt(x*x + y*y);
			 return "translate(" + (x/h * us_radius + 30) +  ',' +
					 (y/h * (us_radius + 30)) +  ")";
		})
		.attr("dy", ".25em")
		.attr("dx", "-2.75em")
		.text(function(d) {
			// if(d.data.status) {
			// 	return d.data.status;
			// }
			if(d.data.percent) {
					return (d.data.percent + "%")
			}
		})
		.style("font-size", "10px")
		.attr("text-anchor", function(d) {
			// return "middle";
				// are we past the center?
				return (d.endAngle + d.startAngle)/2 > Math.PI ?
						"end" : "start";
		})

}


function draw_integration() {
		d3.select("#visuals").remove();
		d3.select("svg").remove();
		d3.select(".timeline").append("div")
			.attr("id", "visuals")
			.style("padding-top", "75px");

		// draw_timeline();
		d3.select("#visuals").append("p")
		.attr("class", "integration_title")
		.text("Employment Statistics 2017")
		.style("font-size", "20px")
		.style("font-weight", "bold")
		.attr("transform", "translate(0, 45)");

		d3.select("#visuals").append("div")
		.attr("id", "pie_svg")
		.attr("class", "col s3");


		d3.select("#visuals").append("div")
		.attr("id", "bar_svg")
		.attr("class", "col s9");

		draw_pie_chart();
		draw_employment();

		d3.select("#pie_svg").append("p")
		.attr("class", "footnote")
		.text("* Total population age 16 and over")

}
