/* global d3 */
var width=1800;
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

var unauthorized_pop = {
}

var unauthorized_percentage = {
}

build_percentage(total_unauthorized_pop, get_total_pop(total_unauthorized_pop));

var color = d3.scaleQuantile()
  .domain([0, 5, 10, 15, 20])
  .range(d3.schemeGreens[5]);

var key_scale = d3.scaleLinear()
  .domain([0, 5, 10, 15, 20])
  .rangeRound([1280, 1320]);

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
  
  function clear_america() {
    if (selected_state) {
      america_svg.selectAll("path")
        .style("fill", function(d) {
          if(d.id == selected_state.id) {
            return "82adf2";
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
      .style("fill", "82adf2");
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
  
  d3.select("svg").remove();
  
  var svg_canvas = d3.select("#visuals").append("svg")
    .attr("width", width)
    .attr("height", height);
  
  var american_tooltip = d3.select("#visuals").append("div")
    .style("transform", "translate(300px,0px)")
    .attr("class", "american_legend")
    .style("width", "400px")
    .style("height", "200px")
    .style("float", "left");
  
  
  
  var world_svg = svg_canvas.append("svg")
    .attr("id", "world")
    .attr("width", width)
    .attr("height", height);
  
  var main_tooltip = d3.select("#visuals").append("div")
    .attr("class", "main_tooltip");
  
  var main_title = main_tooltip.append("p")
    .attr("class", "main_title")
    .text("");
  
  var main_pop1 = main_tooltip.append("p")
    .attr("class", "world_p")
    .text("");
  
  var main_pop2 = main_tooltip.append("p")
    .attr("class", "world_p")
    .text("");
  
  var main_pop3 = main_tooltip.append("p")
    .attr("class", "world_p")
    .text("");
 
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
    .attr("width", width)
    .attr("height", height);
  
  var us_projection = d3.geoAlbersUsa()
    .scale(750)
    .translate([600,265]);
  var us_path = d3.geoPath()
    .projection(us_projection);
  
  var world_projection = d3.geoNaturalEarth()
    .scale(150)
    .translate([1300,280]);
  var world_path = d3.geoPath()
      .projection(world_projection);

  var title = america_svg.append("g")
    .attr("transform", "translate(0,15)");
  
  var title_text = title.append("text")
    .attr("class", "title")
    .attr("x", 730)
    .attr("y", 0)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .text("Potential DACA Beneficiaries by Region of Birth, 2012");
  
  var prompt_text = title.append("text")
    .attr("class", "prompt_on")
    .attr("x", 470)
    .attr("y", 85)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-size", "14px")
    .attr("color", "d8d8d8")
    .text("Click on a state to view breakdown by region");

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
      .attr("x", function(d, i) { return 1280+(40 * i); })
      .attr("width", 40)
      .attr("fill", function(d, i) { return color(d[0]); });

  key.append("text")
      .attr("class", "caption")
      .attr("x", 1280)
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
      .tickValues([5, 10, 15, 20]))
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
        .style("fill", "82adf2")
        .on("mouseover", function() {
          clear_america();
          d3.select(this)
            .style("fill", "82adf2");
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
                .style("fill", "82adf2")
            }
          }
        })
        .on("mousedown", function(d) {
          prompt_text.attr("display", "none");
          if (!selected_state) {
            selected_state = d;
            main_title.text(d.properties.name);
          }
          else {
            if (d.id == selected_state.id) {
              selected_state = null;
              main_title.text("USA")
            }
            else {
              selected_state = d;
              main_title.text(d.properties.name);
            }
          }
          clear_america();
          redraw_world();
        });
    });       
  });

  d3.json('world_map.json', function(error, json) {
    if (error) throw error;
    console.log(json)
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