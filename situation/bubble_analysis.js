$(document).ready(function () {


    var layerControl;
    subArray = []
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
                console.log(res);

                $('.situation_subtype').append('<option value="all">All</option>');
                for (var i = 0; i < Object.keys(res).length; i++) {

                    $('.situation_subtype').append('<option ' + res[i].accident_type_id + '">' + res[i].accident_type.toUpperCase() + '</option>')
                }

            }
        })
    })

    $('.situation_type').trigger('change')

    var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var streetMapnext = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var baseMaps = {
        "<span class='fontOpenSansRegular'><i class='fab fa-google'></i> Maps</span> ": streetMap,
        "<span class='fontOpenSansRegular'><i class='fab fa-google'></i> Traffic</span>": streetMapnext,

    };

    var map = L.map('mapid', {
        center: GLOBAL.COORD.LAT_LON,
        zoom: 10,
        layers: [streetMap],
        zoomControl: false
    });

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    var polylines;
    var circles;




    function getBubbleAnalysisFilterData(data) {
        console.log(JSON.stringify(data));
        $.ajax({
            url: '../../../models/situation/get_analysis_filter_data.hh',
            method: 'POST',
            data: data,
            success: function (response) {
                response = JSON.parse(response)
                console.log(response);
                populateBubbles(response);
            }
        })
    }

    $('.submit').click(function () {
        var starttime = sanitize(getFormattedDate($('.accSDate').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
        var endtime = sanitize(getFormattedDate($('.accEDate').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));

        if (starttime == '' || endtime == '') {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter start time and end time</div>'
            });
            return;
        }

        var module = sanitize($('.situation_type').val());
        var subType = sanitize($('.situation_subtype').val());
        var fatalities = sanitize($('.fatalities').val());
        var roadUserType = sanitize($('.type_of_roaduser').val());

        var data = {
            starttime: starttime,
            endtime: endtime,
            module: module,
            subtype_list: subType,
            fatalities: fatalities,
            roaduser_type: roadUserType,
        }
        getBubbleAnalysisFilterData(data);
    })

    function getSituationRiskAnalysisData() {
        $.ajax({
            url: '../../../models/situation/get_situation_risk_analysis_data.hh',
            method: 'POST',
            success: function (res) {
                res = JSON.parse(res)
                console.log(res);
                populatePolylines(res);
            }
        })
    }
    getSituationRiskAnalysisData();

    function populateBubbles(bubbleChartDataList) {
        var circleList = [];
        for (var i = 0; i < bubbleChartDataList.length; i++) {
            var bubbleData = bubbleChartDataList[i];
            var circle = L.circleMarker([bubbleData.Northing, bubbleData.Easting], {
                pane: 'markers1',
                "radius": bubbleData.Severity * 5,
                "fillColor": "#ff7800",
                "color": "#ff7800",
                "weight": 1,
                "opacity": 1
            }).addTo(map).bindPopup(bubbleData.ShortDescription + '\n' + bubbleData.Severity + '\n' + bubbleData.CreatedBy);
            circleList.push(circle);

        }
        circles = L.layerGroup(circleList);
        var overlayMaps = {
            "Polylines": polylines,
            "Bubbles": circles
        };
        setLayerControl(overlayMaps);
    }




    var polyloneColorDataString = ('[{ "startRange": "0", "endRange": "0.1", "color": "#ffe6e6" }, { "startRange": "0.1", "endRange": "0.2", "color": "#ffcccc" }, { "startRange": "0.2", "endRange": "0..3", "color": "#ff9999" }, { "startRange": "0.3", "endRange": "0.4", "color": "#ff6666" }, { "startRange": "0.4", "endRange": "0.5", "color": "#ff4d4d" }, { "startRange": "0.5", "endRange": "0.6", "color": "#ff3333" }, { "startRange": "0.6", "endRange": "0.7", "color": "#ff0000" }, { "startRange": "0.7", "endRange": "0.8", "color": "#e60000" }, { "startRange": "0.8", "endRange": "0.9", "color": "#b30000" }, { "startRange": "0.9", "endRange": "1.0", "color": "#800000" } ]')
    polylineColorDataList = JSON.parse(polyloneColorDataString);
    console.log(polylineColorDataList);



    function populatePolylines(polylineDataList) {
        // console.log(polylineColorDataList);
        var polylineList = [];

        for (i = 0; i < polylineDataList.length; i++) {
            var polylineData = polylineDataList[i];
            var cor = [[parseFloat(polylineData.Northing), parseFloat(polylineData.Easting)],
            [parseFloat(polylineData.NorthingEnd), parseFloat(polylineData.EastingEnd)]];
            var polylineColorData = polylineColorDataList.find(item => parseFloat(polylineData.RiskFactor) > item.startRange && polylineData.RiskFactor <= item.endRange);
            if (polylineColorData) {
                var polyline = L.polyline(cor, {
                    color: polylineColorData.color
                }).addTo(map).bindPopup(polylineData.SystemCodeNumber);
                polylineList.push(polyline);
            }

        }

        polylines = L.layerGroup(polylineList);
        var overlayMaps = {
            "Polylines": polylines
        };  
        setLayerControl(overlayMaps);
    }
    
    function setLayerControl(overlayMaps) {
        if(layerControl){
            layerControl.removeFrom(map);
        }
        layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
    }
})
