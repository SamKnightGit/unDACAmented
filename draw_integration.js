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
        .style("text-anchor", "end")
      .append("text")
        .attr("x", "0")
        .attr("y", "0")
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
  
        draw_employment();
}
