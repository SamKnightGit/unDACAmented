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

	// scale radius based on group's population
	var radius =( Math.min(w, h) / 2 ) - 20;
	var min = d3.min([parseInt(daca_data[0].total), parseInt(daca_ineligible_data[0].total), parseInt(us_data[0].total)]);
	var max = d3.max([parseInt(daca_data[0].total), parseInt(daca_ineligible_data[0].total), parseInt(us_data[0].total)]);
	var radius_scale = d3.scaleSqrt().domain([min, max]).range([50, radius]);

	// draw pie based on percentage
	var pie = d3.pie()
	.value(function(d) { return d.percent; })
	.sort(null);

	// DACA PIE **********************************************************************
	var daca_svg = d3.select("#visuals")
	.append('svg')
	.attr('class', 'pie')
	.attr('width', w)
	.attr('height', h);

	var daca_label = svg.append("text").text("DACA EMPLOYMENT RATE")
	.attr('transform', 'translate(' + (w / 4) + ',' + (h) + ')');

	var daca_g = daca_svg.append('g')
	.attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')');

	var daca_arc = d3.arc()
	.innerRadius(0)
	.outerRadius(radius_scale(daca_data[0].total));

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

	var daca_ineligible_arc = d3.arc()
	.innerRadius(0)
	.outerRadius(radius_scale(daca_ineligible_data[0].total));

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

	var us_arc = d3.arc()
	.innerRadius(0)
	.outerRadius(radius_scale(us_data[0].total));

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




}

function draw_integration() {
		d3.select("#visuals").remove();
		d3.select("svg").remove();
		d3.select(".timeline").append("div")
			.attr("id", "visuals")
			.transition().duration(200);

		draw_pie_chart();
		// var svg_canvas = d3.select("#visuals").append("svg")
		// 	.attr("width", width)
		// 	.attr("height", height - 100)
		// 	.attr("class", "integration_canvas")
		// 	.style("background", "red");
}
