var url ='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

var myMap = L.map('map', {
    center: [37.09, -95.71],
    zoom:3,
    layers: earthquake
});

var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(myMap);

var earthquakecircle=[];

d3.json(url).then(function(data) {   
    for (var i=0; i < data.features.length; i++) {
        var feature = data.features[i];
        var color = "";
        if(feature.geometry.coordinates[2]>90) {color='red';}
        else if(feature.geometry.coordinates[2]>70) {color = 'orange';}
        else if(feature.geometry.coordinates[2]>50) {color='yellow';}
        else if(feature.geometry.coordinates[2]>30) {color='green';}
        else if(feature.geometry.coordinates[2]>10) {color='blue';}
        else {color='grey'}
        earthquakecircle.push(
            L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                fillOpacity:0.75,
                color:color,
                fillColor:color,
                radius: Math.sqrt(feature.properties.mag)*40000
            })
            .bindPopup(`<h3>${feature.properties.place}</h3>
            <hr><p>Magnitude: ${feature.properties.mag}</p>
            <p>Depth: ${feature.geometry.coordinates[2]}</p>`).addTo(myMap)
        );
    }
});

var earthquake = L.layerGroup(earthquakecircle);

var baseMap = {'Street Map': street};

var overlayMap = {"Earthquake":earthquake};


L.control.layers(baseMap,overlayMap, {collapsed: true}).addTo(myMap);

var legend = L.control({
    position: "bottomright"
  });

legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var labels = [-10, 10, 30, 50, 70, 90];
    var colors = ['grey','blue','green','yellow','orange','red'];    

    for (var i = 0; i <labels.length; i++) {
      div.innerHTML += "<i style='background-color: " + colors[i] + "'></i> "
        + labels[i] + (labels[i + 1] ? "&ndash;" + labels[i + 1] + "<br>" : "+");
    }
    return div;
  };

legend.addTo(myMap);