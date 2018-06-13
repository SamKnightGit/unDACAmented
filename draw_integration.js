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

	var bar_canvas = d3.select("#visuals").append("svg")
			.attr("width", "100%")
			.attr("height", 600);

		var margin = {top: 40, right: 100, bottom: 150, left: 100},
			width = parseInt(bar_canvas.style("width").replace("px", "") ) - margin.left - margin.right,
			height = parseInt(bar_canvas.style("height").replace("px", "")) - margin.top - margin.bottom,
			g = bar_canvas.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		console.log("occupation width " + width);
		// Below code from: https://bl.ocks.org/mbostock/3887051
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
			console.log(data);
			if (error) throw error;

			var keys = get_every_other(data.columns.slice(1));
			console.log(keys)
			occupation_scale.domain(data.map(function (d) {return d.Occupation; }));
			data_scale.domain(keys).rangeRound([0, occupation_scale.bandwidth()]);
			y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

			g.append("g")
				.selectAll("g")
				.data(data)
				.enter().append("g")
					.attr("transform", function(d) {return "translate(" + occupation_scale(d.Occupation) + ",0)";})
				.selectAll("rect")
				.data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
				.enter().append("rect")
					.attr("x", function(d) {return data_scale(d.key); })
					.attr("y", function(d) {return y(d.value); })
					.attr("width", data_scale.bandwidth())
					.attr("height", function(d) { return height - y(d.value); })
					.attr("fill", function(d) {
						return z(d.key);
					})
					.attr("fill-opacity", function(d) {
						console.log(d.key);
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
				.attr("x", -height/2 + 18)
				.attr("y", -40)
				.attr("dy", "0.32em")
				.attr("fill", "#000")
				.attr("font-weight", "bold")
				.attr("text-anchor", "middle")
				.attr("font-size", "16px")
				.text("% of Workforce");


		})
>>>>>>> master
}

function draw_education() {
	console.log("educated!");
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
	var w = width / 6;
	var h = height / 3;
	var duration = 750;

	// scale readius based on gro
	var radius =( Math.min(w, h) / 2 ) - 20;
	var min = d3.min([parseInt(daca_data[0].total), parseInt(daca_ineligible_data[0].total), parseInt(us_data[0].total)]);
	var max = d3.max([parseInt(daca_data[0].total), parseInt(daca_ineligible_data[0].total), parseInt(us_data[0].total)]);
	var radius_scale = d3.scaleSqrt().domain([min, max]).range([50, radius]);

	// DACA PIE **********************************************************************
	var daca_svg = d3.select("#visuals")
	.append('svg')
	.attr('class', 'pie')
	.attr('width', w)
	.attr('height', h);

	var daca_label = daca_svg.append("text").text("DACA EMPLOYMENT RATE")
	.attr('transform', 'translate(' + (w / 4) + ',' + (h) + ')');

	var daca_g = daca_svg.append('g')
	.attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')');

	// DACA INELIGIBLE PIE ***********************************************************
	var daca_ineligible_svg = d3.select("#visuals")
		.append('svg')
		.attr('class', 'pie')
		.attr('width', w)
		.attr('height', h);

	var daca_ineligible_label = daca_ineligible_svg.append("text").text("DACA-INELIGIBLE EMPLOYMENT RATE")
	.attr('transform', 'translate(' + (w / 4) + ',' + (h) + ')');

	var daca_ineligible_g = daca_ineligible_svg.append('g')
	.attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')');

	// US PIE ************************************************************************
	var us_svg = d3.select("#visuals")
		.append('svg')
		.attr('class', 'pie')
		.attr('width', w)
		.attr('height', h);

	var us_label = us_svg.append("text").text("US EMPLOYMENT RATE")
		.attr('transform', 'translate(' + (w / 4) + ',' + (h) + ')');

	var us_g = us_svg.append('g')
	.attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')');















	var arc = d3.arc()
	.innerRadius(0)
	.outerRadius(radius_scale(us_data[0].total));

	var daca_arc = d3.arc()
	.innerRadius(0)
	.outerRadius(radius_scale(daca_data[0].total));

	var daca_ineligible_arc = d3.arc()
	.innerRadius(0)
	.outerRadius(radius_scale(daca_ineligible_data[0].total));

	// var labelArc = d3.arc()
	// 	.innerRadius(0)
	// 	.outerRadius(radius_scale(daca_data[0].total) - 10);
	//
	// daca_g.append("text")
	// .attr("transform", function(d) {
	// 	return "translate(" + labelArc.centroid(d) + ")"; }
	// )
	// .attr("dy", ".35em")
	// .text(function(d) {return d.percent});

	var pie = d3.pie()
	.value(function(d) { return d.percent; })
	.sort(null);

	daca_ineligible_g.append("text")
	var daca_ineligible_path = daca_ineligible_g.selectAll('path')
	.data(pie(daca_ineligible_data))
	.enter()
	.append("g")
	.style("margin", 0)
		.append('path')
		.attr('d', daca_ineligible_arc)
		.attr('fill', function(d,i) {
			if(d.data.status == 'Employed') { return "#fc8d62";}
			else if(d.data.status == 'Unemployed') {return "#ffffcc";}
			else {return "#fff2ae";}
		})
		.on("mouseover", function(d) {
				d3.select(this)
					.style("cursor", "pointer")
					.style("fill", "black");
			})
		.on("mouseout", function(d) {
				d3.select(this)
					.style("cursor", "none")
					.style("fill", color(this._current));
			})
		.each(function(d, i) { this._current = i; });

	var us_path = us_g.selectAll('path')
	.data(pie(us_data))
	.enter()
	.append("g")
	.style("margin", 0)
		.append('path')
		.attr('d', arc)
		.attr('fill', function(d,i) {
			if(d.data.status == 'Employed') { return "#8da0cb";}
			else if(d.data.status == 'Unemployed') {return "#ffffcc";}
			else {return "#fff2ae";}
		})
		.on("mouseover", function(d) {
				d3.select(this)
					.style("cursor", "pointer")
					.style("fill", "black");
			})
		.on("mouseout", function(d) {
				d3.select(this)
					.style("cursor", "none")
					.style("fill", color(this._current));
			})
		.each(function(d, i) { this._current = i; });


	daca_g.append('text')
		.attr('text-anchor', 'middle')
		.attr('dy', '.35em')
		.text(text);

	var daca_path = daca_g.selectAll('path')
	.data(pie(daca_data))
	.enter()
	.append("g")
	.style("margin", 0)
		.append('path')
		.attr('d', daca_arc)
		.attr('fill', function(d,i) {
			console.log("i", d);
			if(d.data.status == 'Employed') { return "#66c2a5";}
			else if(d.data.status == 'Unemployed') {return "#ffffcc";}
			else {return "#fff2ae";}
		})
		.on("mouseover", function(d) {
				d3.select(this)
					.style("cursor", "pointer")
					.style("fill", "black");
			})
		.on("mouseout", function(d) {
				d3.select(this)
					.style("cursor", "none")
					.style("fill", color(this._current));
			})
		.each(function(d, i) { this._current = i; });


}

function draw_integration() {
		d3.select("#visuals").remove();
		d3.select("svg").remove();
		d3.select(".timeline").append("div")
			.attr("id", "visuals")
			.transition().duration(200);

		draw_pie_chart();
		draw_employment();

}
