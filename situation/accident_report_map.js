list_types = "";
situationSCN = ""; //defined globally

coarray = [];

$(document).ready(function () {
    $(".datetimepicker,.datepicker").datetimepicker({ format: 'd-m-Y', timepicker: false });

    setStartAndEndDate('.accSDate', '.accEDate', 30);
    // var dates = getCurrentStartNEndDate();

    var polylines;
    var AccidentFrequency;
    var circles;
    var circleList = [];
    baseLinksLayer = false,
        geofenceLayer = false,
        geoData = false,
        links = []
    layerControl = false

    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google Maps</a>',
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
        googleTraffic = L.tileLayer('https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}', {
            attribution: '&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google Maps</a>',
            maxZoom: 20,
            minZoom: 2,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }),
        openStreetMaps = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });


    var map = new L.map('accident_map', {
        center: new L.LatLng(GLOBAL.COORD.LATITUDE, GLOBAL.COORD.LONGITUDE),
        zoom: 11,
        layers: [openStreetMaps],
        projectionKey: 'EPSG:4326',
        zoomControl: true
    });
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    var baseMaps = {
        "<span class='fontOpenSansRegular'><i class='fab fa-google'></i> Maps</span> ": googleStreets,
        "<span class='fontOpenSansRegular'><i class='fab fa-google'></i> Traffic</span>": googleTraffic,
        "<span class='fontOpenSansRegular'><i class='fab fa-opera'></i> OSM</span>": openStreetMaps
    };
    layerControl = L.control.layers(baseMaps).addTo(map);


    var legendFatalities = L.control({ position: 'bottomright' });
    legendFatalities.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend-circle');
        gradesFatalities = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML +=
            '<h class="severityname">Number of Fatalities</h>'
        // div.innerHTML +=
        // '<i class="severityname"> Fatalities</i>'

        for (var i = 0; i < gradesFatalities.length; i++) {
            if (gradesFatalities[i] == 0) {
                div.innerHTML +=
                    '<span><i class = "circle-1"></i> ' +
                    '<span class = "number1">' + gradesFatalities[i] + '-5</span></span>';
            } else if (gradesFatalities[i] == 6) {
                div.innerHTML +=
                    '<span><i class = "circle-2"></i>' +
                    '<span class = "number2">' + gradesFatalities[i] + '-10</span></span>';
            } else if (gradesFatalities[i] == 10) {
                div.innerHTML +=
                    '<span><i class = "circle-3"></i> ' +
                    '<span class = "number3">>' + gradesFatalities[i] + '</span></span>';
            }
        }

        return div;
    };
    legendFatalities.addTo(map);

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [1, 2, 3],
            labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML +=
            '<h class="severity"> Severity</h>'
        for (var i = 0; i < grades.length; i++) {
            if (grades[i] == 1) {
                div.innerHTML +=
                    '<span><i style="background:#e20707"></i>Fatal(' +
                    grades[i] + ')</span>';
            } else if (grades[i] == 2) {
                div.innerHTML +=
                    '<span><i style="background:#fe7c26"></i>Serious(' +
                    grades[i] + ')</span>';
            } else if (grades[i] == 3) {
                div.innerHTML +=
                    '<span><i style="background:#eace03"></i>Slight(' +
                    grades[i] + ')</span>';
            }
        }

        return div;
    };
    legend.addTo(map);

    var legendLinks = L.control({ position: 'bottomleft' });
    legendLinks.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legendLinks');
        grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            // loop through our density intervals and generate a label with a colored square for each interval
            div.innerHTML +=
            '<h class="riskIndex">Risk Index</h>'
        for (var i = 0; i < grades.length; i++) {
            if (grades[i] == 1) {
                div.innerHTML +=
                    '<i style="background:#30ff00"></i>';
            } else if (grades[i] == 2) {
                div.innerHTML +=
                    '<i style="background:#5fff00"></i>';
            } else if (grades[i] == 3) {
                div.innerHTML +=
                    '<i style="background:#8eff00"></i>';
            } else if (grades[i] == 4) {
                div.innerHTML +=
                    '<i style="background:#fffa00"></i>';
            } else if (grades[i] == 5) {
                div.innerHTML +=
                    '<i style="background:#ffbf00"></i>';
            } else if (grades[i] == 6) {
                div.innerHTML +=
                    '<i style="background:#ff9000"></i>';
            } else if (grades[i] == 7) {
                div.innerHTML +=
                    '<i style="background:#ff6d00"></i>';
            } else if (grades[i] == 8) {
                div.innerHTML +=
                    '<i style="background:#ff4900"></i>';
            } else if (grades[i] == 9) {
                div.innerHTML +=
                    '<i style="background:#ff3200"></i>';
            } else if (grades[i] == 10) {
                div.innerHTML +=
                    '<i style="background:#ff0000"></i>';
            }
        }

        return div;
    };
    legendLinks.addTo(map);

    function removeAllLayer() {
        map.eachLayer(function (layer) {
            if (!layer._tiles) {
                map.removeLayer(layer);
            }
        });
    }

    var polylineColorDataList = [{ "startRange": "0", "endRange": "0.1", "color": "#30ff00" }, { "startRange": "0.1", "endRange": "0.2", "color": "#5fff00" }, { "startRange": "0.2", "endRange": "0.3", "color": "#8eff00" }, { "startRange": "0.3", "endRange": "0.4", "color": "#fffa00" }, { "startRange": "0.4", "endRange": "0.5", "color": "#ffbf00" }, { "startRange": "0.5", "endRange": "0.6", "color": "#ff9000" }, { "startRange": "0.6", "endRange": "0.7", "color": "#ff6d00" }, { "startRange": "0.7", "endRange": "0.8", "color": "#ff4900" }, { "startRange": "0.8", "endRange": "0.9", "color": "#ff3200" }, { "startRange": "0.9", "endRange": "1.0", "color": "#ff0000" }]
    // console.log(polylineColorDataList);


    function getSituationRiskAnalysisData(datatype) {
        console.log(datatype)
        // removeAllLayer();
        $.ajax({
            url: '../../../models/situation/get_situation_risk_analysis_data.hh',
            method: 'POST',
            success: function (res) {
                res = JSON.parse(res)
                if (!baseLinksLayer) {
                    geoData = createGeoJSONFormat(res)
                    baseLinksLayer = plotLinksOnMap(links, geoData, datatype)
                    layerControl.addOverlay(baseLinksLayer, 'Links')
                }
                else {
                    updateTransportLinkData(res, datatype)
                }
                // populatePolylines(res);
            }
        })
    }

    createGeoJSONFormat = function (data) {
        var geoData = {
            "type": "FeatureCollection",
            "features": []
        }
        for (var i = 0; i < Object.keys(data).length; i++) {
            var riskColorRange = polylineColorDataList.find(item => parseFloat(data[i].RiskFactor) >= item.startRange && data[i].RiskFactor <= item.endRange),
                afColorRange = polylineColorDataList.find(item => parseFloat(data[i].AccidentFrequency) >= item.startRange && data[i].AccidentFrequency <= item.endRange)
            geoData['features'].push({
                'geometry': data[i].geom == null ? { 'type': 'LineString', 'coordinates': [[data[i].Easting, data[i].Northing], [data[i].EastingEnd, data[i].NorthingEnd]] } : JSON.parse(data[i].geom),
                'type': 'Feature',
                'properties': {
                    'scn': data[i].SystemCodeNumber,
                    'name': data[i].ShortDescription == null ? '--' : data[i].ShortDescription,
                    'data': {
                        'RiskFactor': {
                            'color': riskColorRange == undefined ? '#30ff00' : riskColorRange.color,
                            'value': data[i].RiskFactor
                        },
                        'AccidentFrequency': {
                            'color': afColorRange == undefined ? '#30ff00' : afColorRange.color,
                            'value': data[i].AccidentFrequency
                        }
                    }
                }
            })
        }

        return geoData;
    }

    plotLinksOnMap = function (links, data, datatype) {
        console.log(datatype)
        var layergroup = L.layerGroup().addLayer(L.geoJSON(data, {
            style: function (feature) {
                return {
                    "color": feature.properties.data[datatype].color,
                    "weight": 3,
                    "opacity": 1, //0.65
                }
            },
            onEachFeature: function (feature, layer) {
                var popupContent = `<p><b>SCN</b>: ${feature.properties.scn}<br><b>Name</b>: ${feature.properties.name}<br><b>${datatype == 'RiskFactor' ? 'Risk Factor' : 'AccidentFrequency'}</b>: ${feature.properties.data[datatype].value}</p>`;
                layer.bindPopup(popupContent);
                links[feature.properties.scn] = layer
            }
        })).addTo(map);

        return layergroup;

        // var myLayer = L.geoJSON().addTo(map);
        // myLayer.addData(geojsonFeature);
    }

    updateTransportLinkData = function (data, datatype) {
        // links['LINK0001'].getPopup()._content
        for (var i = 0; i < Object.keys(data).length; i++) {
            if (links[data[i].SystemCodeNumber] == undefined) continue;

            var contentData = `<p><b>SCN</b>: ${data[i].SystemCodeNumber}<br><b>Name</b>: ${data[i].ShortDescription}<br><b>${datatype == 'RiskFactor' ? 'Risk Factor' : 'AccidentFrequency'}</b>: ${data[i][datatype]}</p>`;
            links[data[i].SystemCodeNumber].setPopupContent(contentData)
            links[data[i].SystemCodeNumber].setStyle({
                "color": polylineColorDataList.find(item => parseFloat(data[i][datatype]) >= item.startRange && data[i][datatype] <= item.endRange).color,
                "weight": 3,
                "opacity": 1, //0.65
            })
        }
    }

    setTimeout(function () { $('#riskindex_switch').trigger('change') }, 500);
    $('#riskindex_switch').change(function () {
        if ($(this).is(':checked')) {

            getSituationRiskAnalysisData('RiskFactor');

        } else {
            getSituationRiskAnalysisData('AccidentFrequency');
            // setBubbleMarkers();
        }
    });

    var lat, long;
    var pedestrianData = [];
    var pedestrianMarker;
    function pedestrianInvolved() {
        if (pedestrianMarker) map.removeLayer(pedestrianMarker);
        $.ajax({
            url: '../../../models/situation/get_morth_details.hh',
            method: 'POST',
            data: {
                // module: get_parameter_by_name('module'),
                // id: get_parameter_by_name('id')
            },
            success: function (res) {
                res = res.data[0],
                    console.log(res);
                if (res = "success") {
                    for (var i = 0; i < res.length; i++) {
                        lat = res.Latitude;
                        long = res.Longitude;

                        if (res.pedestrianInvolved) {
                            var myIcon = L.icon({
                                iconUrl: '../../images/focus-in.png',
                                iconSize: [38, 95],
                                iconAnchor: [22, 94],
                                popupAnchor: [-3, -76],
                                // shadowUrl: 'my-icon-shadow.png',
                                // shadowSize: [68, 95],
                                // shadowAnchor: [22, 94]
                            });

                            var pedestrianMarker = L.marker([lat, long], { icon: myIcon }).addTo(map);
                        }
                    }
                    pedestrianData.push(pedestrianMarker);
                    if (pedestrianData.length > 0) {
                        if (pedestrianMarker != undefined) 
                        {
                            layerControl.removeLayer(pedestrianMarker)
                            map.removeLayer(pedestrianMarker)
                        }
                        pedestrianMarker = L.layerGroup(pedestrianData).addTo(map);
                        layerControl.addOverlay(pedestrianMarker, 'pedestrian')
                    }
                }
                else {
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                        content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot </div>'
                    });
                }
            }
        });
    }


    $('#pedestrian_involved').change(function () {
        if (this.checked) {
        pedestrianInvolved();
        }
    });









    $('.situation_type').change(function () {

        $.ajax({
            url: '../../../models/situation/get_utmc_types.hh',
            method: 'POST',
            data: {
                type: sanitize($(this).val())
            },
            success: function (res) {
                $('.situation_subtype').html('');
                res = JSON.parse(res)

                $('.situation_subtype').append('<option value="all">All</option>');
                for (var i = 0; i < Object.keys(res).length; i++) {

                    $('.situation_subtype').append('<option ' + res[i].accident_type_id + '">' + res[i].accident_type.toUpperCase() + '</option>')

                }
            }
        })
    })

    $('.situation_type').trigger('change')

    function setLayerControl(overlayMaps) {
        if (layerControl) {
            layerControl._layers = [];
            layerControl.remove(map);
        }
        layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
    }

    $('.submit').click(function () {
        // mapMarker();
        $('#riskindex_switch').prop('checked', false);
        setBubbleMarkers();
    })

    function setBubbleMarkers() {
        var starttime = sanitize(getFormattedDate($('#startDate').val(), 'd-m-y', 'Y-m-d'));
        var endtime = sanitize(getFormattedDate($('.accEDate').val(), 'd-m-y', 'Y-m-d'));
        if (starttime == '' || endtime == '') {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter start time and end time</div>'
            });
            return;
        }
        starttime += " 00:00:00";
        endtime += " 23:59:59";
        var module = sanitize($('.situation_type').val()) ? sanitize($('.situation_type').val()) : 'all';
        var subType = sanitize($('.situation_subtype').val()) ? sanitize($('.situation_subtype').val()) : 'all';
        var fatalities = sanitize($('.fatalities').val()) ? sanitize($('.fatalities').val()) : '';
        var roadUserType = sanitize($('.type_of_roaduser').val()) ? sanitize($('.type_of_roaduser').val()) : 'all';
        var data = {
            starttime: starttime,
            endtime: endtime,
            module: module,
            subtype_list: subType,
            fatalities: fatalities,
            roaduser_type: roadUserType,
        }
        getBubbleAnalysisFilterData(data);
    }

    function getBubbleAnalysisFilterData(data) {
        if (circles) map.removeLayer(circles);
        $.ajax({
            url: '../../../models/situation/get_analysis_filter_data.hh',
            method: 'POST',
            data: data,
            success: function (response) {
                response = JSON.parse(response)
                populateBubbles(response);
            }
        })
    }

    function populateBubbles(bubbleChartDataList) {
        let circlecolor, fillcolor;
        var boundsList = [];
        circleList = [];
        var currentZoom = map.getZoom();
        for (var i = 0; i < bubbleChartDataList.length; i++) {

            var bubbleData = bubbleChartDataList[i];
            boundsList.push([bubbleData.Northing, bubbleData.Easting]);
            var bubbleSeverity = parseInt(bubbleData.Severity)
            if (bubbleSeverity == 1) {
                fillcolor = '#e20707';
                circlecolor = '#d00a0a'
            }
            else if (bubbleSeverity == 2) {
                fillcolor = '#fe7c26'
                circlecolor = '#f76f15'
            }
            else {
                fillcolor = '#eace03';
                circlecolor = '#d6bd06'
            }

            var radius;
            if (!bubbleData.NoOfFatalities || (bubbleData.NoOfFatalities >= 0 && bubbleData.NoOfFatalities <= 5)) {
                radius = 12;
            }
            else if (bubbleData.NoOfFatalities > 5 && bubbleData.NoOfFatalities <= 10) {
                radius = 18;
            }
            else {
                radius = 24;
            }


            // var radius = 0;

            var circle = L.circle([bubbleData.Northing, bubbleData.Easting],
                //map.getZoom() * radius / 3,
                {
                    color: circlecolor,
                    opacity: 1, //0,
                    fillOpacity: 1, //0.7,
                    fillColor: fillcolor,
                    radius: radius,
                    stroke: 2
                }).bindPopup(bubbleData.ShortDescription + '\n' + bubbleData.Severity + '\n');
            circleList.push(circle);
            // map.fitBounds(boundsList,{padding: [119, 119]});
            // map.fitBounds(boundsList);
            // map.setView()
            // map.setView(circle.getBounds().getCenter());
            // map.setZoom(7);
        }

        if (circleList.length > 0) {
            if (circles != undefined) {
                layerControl.removeLayer(circles)
                map.removeLayer(circles)
            }
            circles = L.layerGroup(circleList).addTo(map);
            layerControl.addOverlay(circles, 'Bubbles')
        }


        // var overlayMaps = {};
        // if (circles) {
        //     overlayMaps.Bubbles = circles;
        // }
        // // setLayerControl(overlayMaps);
    }

    //Define markers globally
    markers = L.featureGroup();

})
