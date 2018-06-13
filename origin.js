/* global d3 */
var height=600;

var total_unauthorized_pop = {
	"mexico":1254083,
	"other_north":239723,
	"asia":108024,
	"africa":4893,
	"south_america":110016,
	"europe":29990,
	"oceania":22680
};

var top_regions = [];
var top_regions_pop = [];
var bar_data = [];

var unauthorized_pop = {
};

var unauthorized_percentage = {
};

function get_top_3(pop_object) {
    var data = []
	var pop_array = Object.values(pop_object);
	pop_array.sort(function (x,y) {
		return d3.descending(x,y);
	});
	for (var i = 0; i < 3; i++) {
		var pop = pop_array[i];
		for (var property in pop_object) {
			if (pop_object.hasOwnProperty(property)) {
				if (pop_object[property] == pop) {
					data[i] = {[pretty_country_name([property])]: pop};
				}
			}
		}
	}
    var sum = 0;
    for (var i = 3; i < pop_array.length; i++) {
      sum += pop_array[i];
    }
    data.push({
      "Other": sum
    });
    bar_data = data;
}



build_percentage(total_unauthorized_pop, get_total_pop(total_unauthorized_pop));
get_top_3(total_unauthorized_pop);


var pop_scale = d3.scaleLinear()
    .rangeRound([150, 10]);

var region_scale = d3.scaleBand()
      .rangeRound([40, 270])
      .paddingInner(0.2);

var color = d3.scaleQuantile()
	.domain([0, 5, 10, 25, 50, 100])
	.range(d3.schemeGreens[5]);

var key_scale = d3.scalePow()
    .exponent(0.535)
	.domain([20, 100, 200, 500, 1000])
	.rangeRound([1305, 1465]);

function build_pop(state_pop) {
	for (var property in state_pop) {
		if (state_pop.hasOwnProperty(property)) {
			unauthorized_pop[property] = state_pop[property];
		}
	}
}

function build_percentage(pop_object, total) {
	for (var property in pop_object) {
		if (pop_object.hasOwnProperty(property)) {
			unauthorized_percentage[property] = (pop_object[property] / total) * 100;
		}
	}
}

function get_total_pop(pop_object) {
	var sum = 0;
	for (var property in pop_object) {
		if (pop_object.hasOwnProperty(property)) {
			sum += pop_object[property];
		}
	}
	return sum;
}

function get_max_pop(pop_object) {
	var max = 0;
	for (var property in pop_object) {
		if (pop_object.hasOwnProperty(property)) {
			if (pop_object[property] > max) {
				max = pop_object[property];
			}
		}
	}
	return max;
}

function pretty_country_name(country_name) {
	pretty_names = {
		"mexico":"Mexico",
		"other_north":"North and Central America",
		"asia":"Asia",
		"africa":"Africa",
		"south_america":"South America",
		"europe":"Europe",
		"oceania":"Oceania"
	};
	return pretty_names[country_name];
}

var selected_state = null;

function draw_origin() {

	d3.select("#visuals").remove();
	d3.select("svg").remove();
	d3.select(".timeline").append("div")
		.attr("id", "visuals")
		.transition().duration(200);

	function clear_america() {
		if (selected_state) {
			america_svg.selectAll("path")
				.style("fill", function(d) {
					if(d.id == selected_state.id) {
						return "a6bddb";
					}
					else {
						return "white";
					}
			});
		}
		else {
			america_svg.selectAll("path")
				.style("fill", "white");
		}
	}

	function fill_america() {
		america_svg.selectAll("path")
			.style("fill", "a6bddb");
	}

	function redraw_world() {
		if (selected_state) {
			build_pop(selected_state.properties.unauthorized_pop);
			build_percentage(unauthorized_pop, get_total_pop(unauthorized_pop));
		}
		else {
			build_percentage(total_unauthorized_pop, get_total_pop(total_unauthorized_pop));
		}
		world_svg.selectAll("path")
			.style("fill", function (d) {
				var region = d.properties.name;
				if (region == "united_states") {
					return "d8d8d8";
				}
				else {
					return color(unauthorized_percentage[region]);
				}
			});
	}
  
    function update_bar_chart() {
      var regions_pop = [];
      var regions = [];
      for (var i = 0; i < bar_data.length; i++) {
        regions.push(Object.keys(bar_data[i])[0]);
        regions_pop.push(Object.values(bar_data[i])[0])
      }
      
      bar_data.forEach(function(d) {
        d.key = Object.keys(d)[0];
        d.value = Object.values(d)[0];
      });
      
      pop_scale.domain([0, d3.max(regions_pop)]);
      region_scale.domain(regions);
      
      
      pop_bar.selectAll("rect").remove();
      pop_bar.selectAll("rect")
        .data(bar_data)
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return region_scale(d.key);
        })
        .attr("y", function(d) {
          return pop_scale(d.value);
        })
        .attr("width", region_scale.bandwidth())
        .attr("height", function(d) {
          return 150 - pop_scale(d.value);
        });
      
        var xAxis = d3.axisBottom(region_scale);
        var yAxis = d3.axisLeft(pop_scale);
      
      //Source: 
      //https://bl.ocks.org/mbostock/7555321
      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      }
      
      pop_bar.selectAll("g").remove();
      pop_bar.selectAll("text").remove();
      pop_bar.append("g")
        .attr("class", "no_domain")
        .attr("transform", "translate(0," + 150 + ")")
        .call(xAxis)
        .selectAll("text")
        .call(wrap, region_scale.bandwidth());
      
      pop_bar.append("g")
        .attr("class", "no_domain")
        .attr("transform", "translate(40,0)")
        .call(yAxis
              .ticks(4)
              .tickFormat(d3.format(".0s")))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("font-size", "10px");
        
      pop_bar.selectAll("text")
        .data(bar_data)
        .enter()
        .append("text")
        .text(function(d) {
             return d
        });
        
    }
  
    
    /*
	function update_main_pop() {
		country1 = [Object.keys(top_3[0])[0]];
		country2 = [Object.keys(top_3[1])[0]];
		country3 = [Object.keys(top_3[2])[0]];
        country4 = "Other";

		pop1 = [Object.values(top_3[0])[0]];
		pop2 = [Object.values(top_3[1])[0]];
		pop3 = [Object.values(top_3[2])[0]];
        pop4 = rest_of_the_world;
	}
    */

	d3.select("svg").remove();

	var svg_canvas = d3.select("#visuals").append("svg")
		.attr("width", "100%")
		.attr("height", height);

    var whole_usa_btn = d3.select("#visuals").append("button")
        .attr("class", "btn")
        .style("background", "#a6bddb")
        .style("position","absolute")
        .style("bottom", "7%")
        .style("left", "18%")
        .style("margin", "10px")
        .style("width", "auto")
        .text("Select Entire U.S.")
        .on("mousedown", function() {
          selected_state = null;
          clear_america();
          fill_america();
          redraw_world();
          get_top_3(total_unauthorized_pop);
          //update_main_pop(top_3);
          main_title.text( "USA" );
          d3.select(this).classed("disabled", true);
        });
    
    var width = parseInt(svg_canvas.style("width").replace("px", ""));
  
	var world_svg = svg_canvas.append("svg")
		.attr("id", "world")
		.attr("width", "100%")
		.attr("height", height);

	var main_tooltip = d3.select("#visuals").append("div")
		.attr("class", "main_tooltip");

	var row_title = main_tooltip.append("div")
		.attr("class", "row")
		.style("margin-bottom", "5px");

	var main_title = row_title.append("div")
		.attr("class", "main_tt_title col s12")
		.text("USA");

    var pop_bar = main_tooltip.append("svg")
      .attr("class", "pop_bar");

    update_bar_chart();
	//update_main_pop();

	var world_tooltip = d3.select("#visuals").append("div")
		.attr("class", "world_tooltip");

	var world_country = world_tooltip.append("p")
		.attr("class", "world_p")
		.text("");

	var world_percentage = world_tooltip.append("p")
		.attr("class", "world_p")
		.text("");

	var america_svg = svg_canvas.append("svg")
		.attr("id", "america")
		.attr("width", "100%")
		.attr("height", height);

	var us_projection = d3.geoAlbersUsa()
		.scale(width/2.5)
		.translate([width/2 - width/4,260]);
	var us_path = d3.geoPath()
		.projection(us_projection);

	var world_projection = d3.geoNaturalEarth1()
		.scale(width/12)
		.translate([width/2 + width/4,290]);
	var world_path = d3.geoPath()
			.projection(world_projection);

	var title = america_svg.append("g")
		.attr("transform", "translate(0,45)");

	var title_text = title.append("text")
		.attr("class", "title")
		.attr("x", "50%")
		.attr("y", 0)
		.attr("fill", "#000")
		.attr("text-anchor", "middle")
		.attr("font-size", "20px")
		.attr("font-weight", "bold")
		.text("Potential DACA Beneficiaries by Region of Birth, 2012");

	var key = world_svg.append("g")
			.attr("class", "key")
			.attr("transform", "translate(0,450)");

	key.selectAll("rect")
		.data(color.range().map(function(d) {
			d = color.invertExtent(d);
			return d;
		}))
		.enter().append("rect")
			.attr("height", 12)
			.attr("x", function(d, i) { 
              console.log(d);
              var base = 1220;
              switch(i) {
                  case 0:
                    return base; 
                    break;
                  case 1:
                    return base+25; 
                    break;
                  case 2:
                    return base+50; 
                    break;
                  case 3:
                    return base+100; 
                    break;
                  case 4:
                    return base+160; 
                    break;
                  default:
                    return base; 
              }
                
              
            })
			.attr("width", function(d) {
              return 20*(Math.log(d[1]-d[0]));
            })
			.attr("fill", function(d, i) { return color(d[0]); });
  
	key.append("text")
			.attr("class", "caption")
			.attr("x", "74%")
			.attr("y", -10)
			.style("font-size", "12px")
			.attr("fill", "#000")
			.attr("text-anchor", "start")
			.attr("font-weight", "bold")
			.text("Potential Beneficiaries from Region");

	key.call(d3.axisBottom(key_scale)
			.tickSize(15)
			.tickFormat(function(x) {
					return x + "%";
			})
			.tickValues([5, 10, 25, 50]))
		.select(".domain")
			.remove();

	d3.csv("origin_data.csv", function(data) {
		//Maybe some data processing stuff

		d3.json('us_states.json', function(error, json) {
			for (var i = 0; i < data.length; i++) {
				var state = data[i].State;
				var popObject = {
					"mexico": +data[i].mexico,
					"other_north":+data[i].other_north,
					"asia":+data[i].asia,
					"africa":+data[i].africa,
					"south_america":+data[i].south_america,
					"europe":+data[i].europe,
					"oceania":+data[i].oceania
				}

				for (var j = 0; j < json.features.length; j++) {
					var jsonState = json.features[j].properties.name;
					if (state == jsonState) {
						json.features[j].properties.unauthorized_pop = popObject;
					}
				}
			}

			if (error) throw error;
			america_svg.selectAll("path")
				.data(json.features)
				.enter().append("path")
				.attr("d", us_path)
				.style("stroke", "grey")
				.style("fill", function(d) {
                  if (d.id == "06") {
                    selected_state = d;
                    whole_usa_btn.classed("disabled", false);
		            main_title.text( d.properties.name );
                    clear_america();
					redraw_world();
				    get_top_3(unauthorized_pop);
                    update_bar_chart();
					//update_main_pop(top_3);
                    return "a6bddb";
                  }
                  else {
                    return "white";
                  }
                })
				.on("mouseover", function() {
					clear_america();
					d3.select(this)
						.style("fill", "d2deed")
                        .style("cursor", "pointer");
				})
				.on("mouseout", function(d) {
					d3.select(this)
						.style("fill", "white");
					if (!selected_state) {
						fill_america();
					}
					else {
						if(d.id == selected_state.id) {
							d3.select(this)
								.style("fill", "a6bddb")
						}
					}
				})
				.on("mousedown", function(d) {
					if (!selected_state) {
						selected_state = d;
                        whole_usa_btn.classed("disabled", false);
						main_title.text( d.properties.name );
					}
					else {
						if (d.id == selected_state.id) {
                            whole_usa_btn.classed("disabled", true);
							selected_state = null;
							main_title.text( "USA" );
						}
						else {
							selected_state = d;
							main_title.text( d.properties.name );
						}
					}
					clear_america();
					redraw_world();
					if (selected_state) {
						get_top_3(unauthorized_pop);
					}
					else {
						get_top_3(total_unauthorized_pop);
					}
                    update_bar_chart();
					//update_main_pop(top_3);
				});
		});
	});

	d3.json('world_map.json', function(error, json) {
		if (error) throw error;
		world_svg.selectAll("path")
			.data(json.features)
			.enter().append("path")
			.attr("d", world_path)
			.style("stroke", "grey")
			.style("fill", function(d) {
				var region = d.properties.name;
				if (region == "united_states") {
					return "d8d8d8";
				}
				else {
					return color(unauthorized_percentage[region]);
				}
			})
			.on("mouseover", function(d) {
				if (d.properties.name != "united_states") {
					if (d.properties.name == "oceania") {
						world_svg.selectAll("path")
							.style("stroke", function(d) {
								if (d.properties.name == "oceania") {
									return "black";
								}
								else {
									return "grey";
								}
							});
					}
					else {
						d3.select(this)
							.style("stroke", "black");
					}
					world_country.text(pretty_country_name(d.properties.name));
					world_percentage.text(d3.format(".1f")(unauthorized_percentage[d.properties.name]).toString() + "%");
					world_tooltip.style("display", "inline");
				}
			})
			.on("mousemove", function() {
				world_tooltip
					.style("left", (d3.event.pageX-50) + "px")
					.style("top", (d3.event.pageY-40) + "px");
			})
			.on("mouseout", function(d) {
				if (d.properties.name != "united_states") {
					if (d.properties.name == "oceania") {
						world_svg.selectAll("path")
							.style("stroke", "grey");
					}
					else {
						d3.select(this)
							.style("stroke", "grey");
					}
					world_tooltip.style("display", "none");
				}
			});
	});

}
