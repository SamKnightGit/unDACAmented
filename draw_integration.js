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
	var daca_data = [
		{status: "Employed", percent: 55, number: 379390},
		{status: "Unemployed", percent: 8, number: 55184},
		{status: "Not In Labor Force", percent: 36, number: 248335},
	];

	var undocumented_data = [
		{status: "Employed", percent: 64, number: 6466000},
		{status: "Unemployed", percent: 7, number: 702000},
		{status: "Not In Labor Force", percent: 29, number: 2970000},
	];

	var us_data = [
		{status: "Employed", percent: 60, number: 153337000},
		{status: "Unemployed", percent: 3, number: 6982000},
		{status: "Not In Labor Force", percent: 37, number: 94759000},
	];


	var text = "";

	var w = width / 3;
	var h = height / 2;
	var thickness = 40;
	var duration = 750;

	var radius = Math.min(w, h) / 2;
	var color = d3.scaleOrdinal(d3.schemeCategory20);

	// var svg = d3.select("#visuals")
	// .append('svg')
	// .attr('class', 'pie')
	// .attr('width', width)
	// .attr('height', height);

	var svg = d3.select("#visuals")
	.append('svg')
	.attr('class', 'pie')
	.attr('width', w)
	.attr('height', h);

	var us_svg = d3.select("#visuals")
		.append('svg')
		.attr('class', 'pie')
		.attr('width', w)
		.attr('height', h);

	var undocumented_svg = d3.select("#visuals")
		.append('svg')
		.attr('class', 'pie')
		.attr('width', w)
		.attr('height', h);

	var daca_g = svg.append('g')
	.attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')');

	var us_g = us_svg.append('g')
	.attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')');

	var undocumented_g = us_svg.append('g')
	.attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')');


	var arc = d3.arc()
	.innerRadius(radius - thickness)
	.outerRadius(radius);

	var pie = d3.pie()
	.value(function(d) { return d.percent; })
	.sort(null);

	var undocumented_path = us_g.selectAll('path')
	.data(pie(undocumented_data))
	.enter()
	.append("g")
	.style("margin", 0)
	.on("mouseover", function(d) {
				let undocumented_g = d3.select(this)
					.style("cursor", "pointer")
					.style("fill", "black")
					.append("g")
					.attr("class", "text-group");

				undocumented_g.append("text")
					.attr("class", "name-text")
					.text(`${d.data.status}`)
					.attr('text-anchor', 'middle')
					.attr('dy', '-1.2em');

				undocumented_g.append("text")
					.attr("class", "value-text")
					.text(`${d.data.percent}`)
					.attr('text-anchor', 'middle')
					.attr('dy', '.6em');
			})
		.on("mouseout", function(d) {
				d3.select(this)
					.style("cursor", "none")
					.style("fill", color(this._current))
					.select(".text-group").remove();
			})
		.append('path')
		.attr('d', arc)
		.attr('fill', (d,i) => color(i))
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
	.on("mouseover", function(d) {
				let us_g = d3.select(this)
					.style("cursor", "pointer")
					.style("fill", "black")
					.append("g")
					.attr("class", "text-group");

				us_g.append("text")
					.attr("class", "name-text")
					.text("US")
					.attr('text-anchor', 'middle')
					.attr('dy', '-1.5em');

				us_g.append("text")
					.attr("class", "name-text")
					.text(`${d.data.status}`)
					.attr('text-anchor', 'middle')
					.attr('dy', '-1.2em');

				us_g.append("text")
					.attr("class", "value-text")
					.text(`${d.data.percent}` + "%")
					.attr('text-anchor', 'middle')
					.attr('dy', '.6em');
			})
		.on("mouseout", function(d) {
				d3.select(this)
					.style("cursor", "none")
					.style("fill", color(this._current))
					.select(".text-group").remove();
			})
		.append('path')
		.attr('d', arc)
		.attr('fill', (d,i) => color(i))
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
	.on("mouseover", function(d) {
				let daca_g = d3.select(this)
					.style("cursor", "pointer")
					.style("fill", "black")
					.append("g")
					.attr("class", "text-group");

				daca_g.append("text")
					.attr("class", "name-text")
					.text(`${d.data.status}`)
					.attr('text-anchor', 'middle')
					.attr('dy', '-1.2em');

				daca_g.append("text")
					.attr("class", "value-text")
					.text(`${d.data.percent}`)
					.attr('text-anchor', 'middle')
					.attr('dy', '.6em');
			})
		.on("mouseout", function(d) {
				d3.select(this)
					.style("cursor", "none")
					.style("fill", color(this._current))
					.select(".text-group").remove();
			})
		.append('path')
		.attr('d', arc)
		.attr('fill', (d,i) => color(i))
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
