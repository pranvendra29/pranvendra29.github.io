function districtMap(districts, disputed) {

    var width  = 800, height = 700, scale = 1200;
    var propTag = 'Literacy', ttName = 'Literacy Rate', unit = '%';
    
    function render(selection) {
      selection.each(function() {

        d3.select(this).select("svg").remove();
        var svg = d3.select(this).append("svg")
                    .attr("width", width)
                    .attr("height", height);

        d3.select(this).select("#tooltip").remove();
        d3.select(this).append("div").attr("id", "tooltip").style("opacity", 0);

        var projection = d3.geo.mercator()
            .center([83, 23])
            .scale(scale)
            .translate([width / 2, height / 2]);
    
        var path = d3.geo.path().projection(projection);

        svg.selectAll(".district")
            .data(districts.features)
          .enter().append("path")
            .attr("class", "district")
            .style("fill", function(d) { return d.color; })
            .attr("d", path)
          .on("mouseover", function(d) {      
                 d3.select("#tooltip").transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                 d3.select("#tooltip").html("<h3>"+(d.id)+"</h3><h4>("+(d.properties.NAME_1)+")</h4><table>"+
                          // "<tr><td>"+ttName+"</td><td>"+(d.properties[propTag])+unit+"</td></tr>"+
                          "<tr><td>"+d.bioregion+"</td></tr>"+
                          "</table>")
                    .style("left", (d3.event.pageX-document.getElementById('map').offsetLeft + 20) + "px") 
                    .style("top", (d3.event.pageY-document.getElementById('map').offsetTop - 60) + "px");
          })  
          .on("mouseout", function(d) {       
                 d3.select("#tooltip").transition()        
                    .duration(500)      
                    .style("opacity", 0);   
          });
          
        svg.selectAll(".disputed")
            .data(disputed.features)
          .enter().append("path")
            .attr("class", "disputed")
            .style("fill", function(d) { return d.color; })
            .attr("d", path);

      });
    } // render
    render.height = function(value) {
            	if (!arguments.length) return height;
            	height = value;
            	return render;
        	};
    render.width = function(value) {
            	if (!arguments.length) return width;
            	width = value;
            	return render;
        	};
    render.scale = function(value) {
            	if (!arguments.length) return scale;
            	scale = value;
            	return render;
        	};
    render.propTag = function(value) {
            	if (!arguments.length) return propTag;
            	propTag = value;
            	return render;
        	};
    render.ttName = function(value) {
            	if (!arguments.length) return ttName;
            	ttName = value;
            	return render;
        	};
    render.unit = function(value) {
            	if (!arguments.length) return unit;
            	unit = value;
            	return render;
        	};
  
return render;
} // districtMap
