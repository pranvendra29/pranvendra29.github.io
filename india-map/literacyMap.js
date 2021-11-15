(function() {
    d3.queue()
        .defer(d3.json, "IND_adm2_Literacy.json")
        .defer(d3.json, "ne_10m_admin_0_Kashmir_Occupied.json")
        .await(function(error, topoMain, topoKashmir) {
            var districts, disputed;
            if (error) throw error;

            // Features for districts and disputed areas
            districts   = topojson.feature(topoMain, topoMain.objects.IND_adm2);
            disputed    = topojson.feature(topoKashmir, topoKashmir.objects.ne_10m_admin_0_Kashmir_Occupied);

            // Radio HTML
            d3.select("#select").call(selectFilter());
            var filter  = d3.select('#select input[name="gender"]:checked').node().value;

            // Color codes for districts based on Literacy Rates
            colorCode(districts.features, filter);
            colorDisputed(disputed.features);

            // Map render
            var map     = districtMap(districts, disputed).width(800).height(700).scale(1200).propTag(filter);
            d3.select("#map").call(map);

            // On change of selection re-render
            d3.selectAll("#select input[name=gender]").on("change", function() {
                filter  = d3.select('#select input[name="gender"]:checked').node().value;
                colorCode(districts.features, filter);
                map     = districtMap(districts, disputed).width(800).height(700).scale(1200).propTag(filter);
                d3.select("#map").call(map);
            });
        });
}());

function selectFilter() {
    function render(selection) {
      selection.each(function() {
        d3.select(this).html("<form>"+
                             "<input type='radio' name='gender' value='Literacy' checked> Version 1 (Linguistic) <br>"+
                             "<input type='radio' name='gender' value='FemaleLiteracy'> Version 2<br>"+
                             "<input type='radio' name='gender' value='MaleLiteracy'> Version 3"+
                             "</form>");
      });
    } // render
return render;
} // selectFilter

function colorCode(data, filter) {
    var color = d3.scale.threshold()
                  .domain([60, 65, 72, 78, 85])
                  .range([
                      "#f6d55c", 
                      "#21b9a1", 
                      "#bcbddc", 
                      "#9e9ac8", 
                      "#807dba", 
                      "#6a51a3"]);
    var bioregionsMap = 
    {
        "#f6d55c" : "Arid",
        "#21b9a1" : "Braj", 
        "#bcbddc" : "Malwa", 
        "#9e9ac8" : "x", 
    };

    data.forEach(function(d) { 
        if (isNaN(d.properties[filter])) { d.properties[filter] = 77; }
        d.color = color(d.properties[filter]);
        d.bioregion = bioregionsMap[d.color] == undefined ? "unknown" : bioregionsMap[d.color];
    });
}

function colorDisputed(data) {
    var color         = "#eaeafa";
    data.forEach(function(d) { 
        d.color       = color;
    });
}
