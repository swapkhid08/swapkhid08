$(document).ready(function(){
    var default_osm = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors',
        maxZoom: 19,
    });

    map = new L.map('map', {
        center: new L.LatLng(GLOBAL.COORD.LATITUDE, GLOBAL.COORD.LONGITUDE),
        zoom: 11,
        layers: [default_osm],
        projectionKey: 'EPSG:4326',
        zoomControl: true
    });

    var baseMaps = {
        "Default OSM": default_osm
    };

    var overlayMaps = {
        // "Hospitals": hospital_department,
        // "Fire Stations": fire_station,
        // "Police Stations": police_station_bldg
    };

    var accidentIcon = L.icon({ iconUrl: '../../images/accident-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var eventIcon = L.icon({ iconUrl: '../../images/event-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var incidentIcon = L.icon({ iconUrl: '../../images/incident-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var crimeIcon = L.icon({ iconUrl: '../../images/crime-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var roadworkIcon = L.icon({ iconUrl: '../../images/roadwork-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });

    layercontrol = false,
    allLinksLayer = false,
    situationLinksLayer = false,
    baseSituationLinksLayer = false,
    geofenceLayer = false,
    geoData = false,
    links=[]
    
    layercontrol = L.control.layers(baseMaps, overlayMaps, { position: 'topleft' }).addTo(map);

    getModelData = function(scn, type){
        $.ajax({
            url:'../../../models/situation/get_situation_model_data.hh',
            method:'POST',
            data:{
                scn: scn,
                type: type
            },
            success:function(res){
                res = JSON.parse(res)
                
                var linkStyle = {
                    "color": "#253654",
                    "weight": 3,
                    "opacity": 0.65
                };
                // console.log(geoData, allLinksLayer)
                if(allLinksLayer){
                    layercontrol.removeLayer(allLinksLayer)
                    map.removeLayer(allLinksLayer)
                }
                if(situationLinksLayer){
                    layercontrol.removeLayer(situationLinksLayer)
                    map.removeLayer(situationLinksLayer)
                }
                if(baseSituationLinksLayer){
                    layercontrol.removeLayer(baseSituationLinksLayer)
                    map.removeLayer(baseSituationLinksLayer)
                }

                if(Object.keys(res.all_links).length != 0){
                    geoData = createGeoJSONFormat(res.all_links)
                    allLinksLayer = plotLinksOnMap(links, geoData, linkStyle)
                    layercontrol.addOverlay(allLinksLayer, 'All Links')
                }

                if(Object.keys(res.base_situation_links).length != 0){
                    linkStyle = {
                        "color": "#253654",
                        "weight": 5,
                        "opacity": 0.85
                    };
                    geoData = createGeoJSONFormat(res.base_situation_links)
                    baseSituationLinksLayer = plotLinksOnMap(links, geoData, linkStyle)
                    layercontrol.addOverlay(baseSituationLinksLayer, 'Base Situation Links')
                }
    
                if(Object.keys(res.situation_links).length != 0){
                    linkStyle = {
                        "color": "#e60a0a",
                        "weight": 5,
                        "opacity": 0.85
                    };
                    geoData = createGeoJSONFormat(res.situation_links)
                    situationLinksLayer = plotLinksOnMap(links, geoData, linkStyle)
                    layercontrol.addOverlay(situationLinksLayer, 'Situation Links')
                }

                if(Object.keys(res.geofence_zones).length != 0){
                    linkStyle = {
                        "color": "#253654",
                        "weight": 3,
                        "opacity": 0.65
                    };
                    geoData = createGeoJSONFormat(res.geofence_zones)
                    geofenceLayer = plotLinksOnMap(links, geoData, linkStyle)
                    layercontrol.addOverlay(geofenceLayer, 'Zones')
                }

                var typeIcon = accidentIcon;
                if (type == "accident")
                    typeIcon = accidentIcon
                else if (type == "event")
                    typeIcon = eventIcon
                else if (type == "crime")
                    typeIcon = crimeIcon
                else if (type == "incident")
                    typeIcon = incidentIcon
                else if (type == "roadwork")
                    typeIcon = roadworkIcon
                var markerPopupContent = `<table class="table table-bordered table-striped">
                        <tbody>
                            <tr><th>SCN</th><td>${scn}</td></tr>
                            <tr><th>Short Description</th><td>${res.situation_data[0].ShortDescription == null ? '--' : res.situation_data[0].ShortDescription}</td></tr>
                            ${
                                type == 'event' || type == 'roadwork' ? `<tr><th>Planned Start</th><td>${res.situation_data[0].PlannedStart == null ? '--' : getFormattedDate(res.situation_data[0].PlannedStart, 'Y-m-d H:m:s', 'd-m-y H:m:s')}</td></tr>
                                    <tr><th>Planned End</th><td>${res.situation_data[0].PlannedEnd == null ? '--' : getFormattedDate(res.situation_data[0].PlannedEnd, 'Y-m-d H:m:s', 'd-m-y H:m:s')}</td></tr>
                                    <tr><th>Actual Start</th><td>${res.situation_data[0].ActualStart == null ? '--' : getFormattedDate(res.situation_data[0].ActualStart, 'Y-m-d H:m:s', 'd-m-y H:m:s')}</td></tr>
                                    <tr><th>Actual End</th><td>${res.situation_data[0].ActualEnd == null ? '--' : getFormattedDate(res.situation_data[0].ActualEnd, 'Y-m-d H:m:s', 'd-m-y H:m:s')}</td></tr>` 
                                    : ''
                            }
                        </tbody>
                    </table>`
                var marker = new L.marker([res.situation_data[0].Northing, res.situation_data[0].Easting], { icon: typeIcon }).bindPopup(markerPopupContent);
                marker.addTo(map)

                if(!geoData){
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">No Model Available yet</div>'
                    });
                }

                updateTransportLinkData(res.all_links_data)
                updateTransportLinkData(res.situation_links_data)

                $('.loader_container').css('display', 'none')

            }
        })
    }

    map.on('layeradd layerremove', function (e) {
        return false
        if(e.layer._content) return false;
        // Create new empty bounds
        var bounds = new L.LatLngBounds();
        // Iterate the map's layers
        map.eachLayer(function (layer) {
            // Check if layer is a featuregroup
            if (layer instanceof L.FeatureGroup) {
                // Extend bounds with group's bounds
                bounds.extend(layer.getBounds());
            }
        });
        // Check if bounds are valid (could be empty)
        if (bounds.isValid()) {
            // Valid, fit bounds
            map.fitBounds(bounds);
        } else {
            // Invalid, fit world
            map.setView(new L.LatLng(GLOBAL.COORD.LATITUDE, GLOBAL.COORD.LONGITUDE), 11);
        }
    });

    getModelData(getParam('scn'), getParam('type'))

    createGeoJSONFormat = function(data){
        var geoData = {
            "type": "FeatureCollection",
            "features": []
        }
        for(var i=0;i<Object.keys(data).length; i++){
            geoData['features'].push({
                'geometry': data[i].geom == null ? {'type': 'LineString', 'coordinates': [[data[i].Easting, data[i].Northing], [data[i].EastingEnd, data[i].NorthingEnd]]} : JSON.parse(data[i].geom),
                'type': 'Feature',
                'properties':{
                    'scn': data[i].SystemCodeNumber,
                    'name': data[i].ShortDescription == null ? '--' : data[i].ShortDescription
                }
            })
        }

        return geoData;
    }

    plotLinksOnMap = function(links, data, style){
        // console.log(data)
        var layergroup = L.layerGroup().addLayer(L.geoJSON(data, {
            style: style,
            onEachFeature: function (feature, layer) {
                var popupContent = `<p><b>SCN</b>: ${feature.properties.scn}<br><b>Name</b>: ${feature.properties.name}</p>`;
                layer.bindPopup(popupContent);
                links[feature.properties.scn] = layer
            }
        })).addTo(map);

        return layergroup;

        // var myLayer = L.geoJSON().addTo(map);
        // myLayer.addData(geojsonFeature);
    }

    updateTransportLinkData = function(data){
        // links['LINK0001'].getPopup()._content
        for(var i=0;i<Object.keys(data).length;i++){
            if(links[data[i].SystemCodeNumber] == undefined) continue;

            var contentData = '<p>'
            if(data[i].CurrentFlow != '') contentData += `<b>Current Flow</b>: ${data[i].CurrentFlow}<br>`
            if(data[i].AverageSpeed != '') contentData += `<b>Average Speed (kmph)</b>: ${data[i].AverageSpeed}`
            contentData += '</p>'
            var linkContent = links[data[i].SystemCodeNumber].getPopup()._content + contentData 
            links[data[i].SystemCodeNumber].setPopupContent(linkContent)
        }
    }
})