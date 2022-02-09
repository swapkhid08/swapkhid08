$(document).ready(function () {
    colorsArr = []
    function getRandomColor () {

        color = "#" + Math.floor(Math.random() * 16777215).toString(16)
        return color;
    }
    for(var i=1;i<=10;i++)
    {
        var color = getRandomColor()
        if (colorsArr.indexOf(color) != -1) {
            color = getRandomColor()
        }

        colorsArr.push(color)
    }
    $('#addDeviceModal').on('shown.bs.modal', function () {
		setTimeout(function () {
			addmap.invalidateSize();
		}, 1);
	})
    var default_osm = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors',
        maxZoom: 18,
    });
    var addmap = new L.map('detector_add_map', {
        center: new L.LatLng(GLOBAL.COORD.LATITUDE, GLOBAL.COORD.LONGITUDE),
        zoom: 11,
        layers: [default_osm],
        projectionKey: 'EPSG:4326',
        zoomControl: false
    });

    L.control.zoom({
        position: 'bottomright'
    }).addTo(addmap);

    var baseMaps = {
        "<span class='fontOpenSansRegular'>Default OSM</span>": default_osm
    };

    let marker;
    L.control.layers(baseMaps).addTo(addmap);

	$('#detector_add_map').css("height",$('#detector_add_map').parent('td').css("height"));
    addmap.on('click', function (e) {
        if (marker) {
            // addmap.removeLayer(marker);
            return;
        }
        options = {
			draggable: true,
            icon: L.icon({ iconUrl: '../../images/detectorcamera-none.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] })
		};
        marker = L.marker([e.latlng.lat, e.latlng.lng],options).bindPopup("Detector").addTo(addmap);
        $("#latitude").val(e.latlng.lat);
        $("#longitude").val(e.latlng.lng);
        marker.on('dragend', function (ein) {
            $.confirm({
                title: '<h3 class="text-success fw-bold mb-0">Confirmation </h3>',
                content: '<div class="fw-bold">Are you sure, you want to edit the location of this device ?</div>',
                buttons: {
                    yes: function () {
                        var inmarker = ein.target;
                        var latlng = inmarker.getLatLng();
                        $("#latitude").val(latlng.lat.toString());
                        $("#longitude").val(latlng.lng.toString());
                        addmap.panTo([$("#latitude").val(),$("#longitude").val()]);
                    },
                    no: function () {
                        createMarker()
                    }
                }
            });
            
        })
    })
    function createMarker()
    {
        options = {
            draggable: true,
            icon: L.icon({ iconUrl: '../../images/detectorcamera-none.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] })
        };
        if (marker) {
            addmap.removeLayer(marker);
        }
        marker = L.marker([$("#latitude").val(), $("#longitude").val()],options).addTo(addmap);
        marker.on('dragend', function (ein) {
            $.confirm({
                title: '<h3 class="text-success fw-bold mb-0">Confirmation </h3>',
                content: '<div class="fw-bold">Are you sure, you want to edit the location of this device ?</div>',
                buttons: {
                    yes: function () {
                        var inmarker = ein.target;
                        var latlng = inmarker.getLatLng();
                        $("#latitude").val(latlng.lat.toString());
                        $("#longitude").val(latlng.lng.toString());
                        addmap.panTo([$("#latitude").val(),$("#longitude").val()]);
                    },
                    no: function () {
                        createMarker()
                    }
                }
            });
            
        })
    }


    $("#latitude, #longitude").change(function () {
        if (marker) {
            addmap.removeLayer(marker);
        }
        options = {
			draggable: true,
            icon: L.icon({ iconUrl: '../../images/detectorcamera-none.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] })
		};
        marker = L.marker([$("#latitude").val(), $("#longitude").val()],options).bindPopup("Detector").addTo(addmap);
        marker.on('dragend', function (ein) {
            $.confirm({
                title: '<h3 class="text-success fw-bold mb-0">Confirmation </h3>',
                content: '<div class="fw-bold">Are you sure, you want to edit the location of this device ?</div>',
                buttons: {
                    yes: function () {
                        var inmarker = ein.target;
                        var latlng = inmarker.getLatLng();
                        $("#latitude").val(latlng.lat.toString());
                        $("#longitude").val(latlng.lng.toString());
                        addmap.panTo([$("#latitude").val(),$("#longitude").val()]);
                    },
                    no: function () {
                        createMarker()
                    }
                }
            }); 
        })
        addmap.panTo([$("#latitude").val(),$("#longitude").val()]);
    })

    var zones = 0;
    var zone_markers = {};
    $('#supporttype').change(function(){
        $.each(zone_markers, function (key, val) {
            if (val) {
                addmap.removeLayer(val);
            }
        });
        
        zone_markers = {};
    });
    $('#addZonebtn').click(function(){
        var latitude = sanitize($('#latitude').val());
        var longitude = sanitize($('#longitude').val());
        $('.r').css('border','none');
        var scn = sanitize($('#scn').val());
        if(scn=='')
        {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please provide SCN for the detector to add zone</div>'
            });
            return;
        }
        if(latitude==''||longitude=='')
        {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please provide Latitude and Longitude for the detector to add zone</div>'
            });
            return;
        }
        zones = $("#addzones").val();
        countzones = $("#countzones").val();
        //alert(zones)
        if(countzones == ''){
            countzones = 0;
        }
        if(zones == ''){
            zones = 0;
        }else if(zones >= 10){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Maximum 10 zones are allowed</div>'
            });
            return;
        }
        var c = parseInt(zones)+1;
        var i = parseInt(countzones)+1;
        var template = '';
        template += "<tr class='r' id='zone_tr_"+i+"'><td class='slimTableBox fw-bold w-10 labels_text_transform'>";
        template += "Zone #" + i + " </td>";
        template += "<td class='fw-bold w-5 labels_text_transform'>SCN &nbsp;&nbsp;<i class='fas fa-info-circle w-2' style='font-size:14px;'  data-toggle='tooltip' data-placement='right' title='Use \"_\" instead of \"-\".'></i></td><td class='w-10'><input type='text' placeholder='Enter SCN' class='form-control' name='zone_scn_" + i + "' id='zone_scn_" + i + "'></td><td class='fw-bold w-5 labels_text_transform'>Name</td><td class='w-10'><input type='text' placeholder='Enter Name' class='form-control' name='zone_name_" + i + "' id='zone_name_" + i + "'></td>";
        template += "<td class='fw-bold w-5 labels_text_transform'>Latitude</td><td class='w-10'><input type='text' class='form-control coordinate' placeholder='Enter Latitude' name='zone_latitude_" + i + "' id='zone_latitude_" + i + "'></td><td class='fw-bold w-5 labels_text_transform'>Longitude</td><td class='w-10'><input type='text' class='form-control coordinate' placeholder='Enter Longitude' name='zone_longitude_" + i + "' id='zone_longitude_" + i + "'></td>";
        template += "<td class='fw-bold w-5 labels_text_transform'>LiveLink</td><td class='w-10'><input type='text' placeholder='Enter LiveLink' class='form-control' name='zone_livelink_" + i + "' id='zone_livelink_" + i + "'></td>";
        template += "<td class='fw-bold w-5 labels_text_transform'>Public LiveLink</td><td class='w-10'><input type='text' placeholder='Enter PublicLiveLink' class='form-control' name='zone_publiclivelink_" + i + "' id='zone_publiclivelink_" + i + "'></td>";
        template += "<td><button type='button' class='btn deleteZonebtn' zone_id='"+i+"' style='margin-left:10%;'><i class='fas fa-trash-alt'></i> </button></td></tr>";
        $('.zones_table').append(template);
        $("#addzones").val(c);
        $("#countzones").val(i);
        $("#zone_latitude_" + i).val(latitude);
        $("#zone_longitude_" + i).val(longitude-0.0001);
        $("#zone_scn_" + i).val(scn+'_'+i.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}));
        resetZoneIndex();
    })

    $(document).on('change','.coordinate',function(){
        resetZoneIndex();
    });

    function resetZoneIndex()
    {
        var i = 1;
        $.each(zone_markers, function (key, val) {
            if (val) {
                addmap.removeLayer(val);
            }
        });
        zone_markers = {};
        var j=0;
        $(".r").each(function() {
            $(this).children(":first").html("Zone #"+i);
            $(this).children(":first").css('color',colorsArr[i]);
            var zone_id = $(this).children(':nth-child(10)').children(':first').attr('zone_id');
            options = {
                draggable: true,
                icon:markerIcon(colorsArr[i])
            };
            if(j==$('.r').length-1)
            {
                zone_markers['zone_'+i] = L.marker([$(this).children(':nth-child(7)').children(':first').val(), $(this).children(':nth-child(9)').children(':first').val()],options).bindPopup("Zone #" + i).addTo(addmap).openPopup();
            }else{
                zone_markers['zone_'+i] = L.marker([$(this).children(':nth-child(7)').children(':first').val(), $(this).children(':nth-child(9)').children(':first').val()],options).bindPopup("Zone #" + i).addTo(addmap);
            }
            zone_markers['zone_'+i].on('drag', function (ein) {
                $('.r').css('border','none'); $('#zone_tr_'+zone_id).css('border','2px solid #253654');
                var inmarker = ein.target;
                var latlng = inmarker.getLatLng();
            })
            var id = i;
            zone_markers['zone_'+i].on('dragend', function (ein) {
                $('.r').css('border','none'); $('#zone_tr_'+zone_id).css('border','2px solid #253654');
                $.confirm({
                    title: '<h3 class="text-success fw-bold mb-0">Confirmation </h3>',
                    content: '<div class="fw-bold">Are you sure, you want to edit the location of the Zone #'+id+' ?</div>',
                    buttons: {
                        yes: function () {
                            var inmarker = ein.target;
                            var latlng = inmarker.getLatLng();
                            $("#zone_latitude_" + zone_id).val(latlng.lat.toString());
                            $("#zone_longitude_" + zone_id).val(latlng.lng.toString());
                        },
                        no: function () {
                            createZoneMarker(zone_id,id)
                        }
                    }
                });
                
            })
            zone_markers['zone_'+i].on('click', function (evt) {$('.r').css('border','none'); $('#zone_tr_'+zone_id).css('border','2px solid #253654');});
            i++;
            j++;
        });

    }

    function createZoneMarker(zone_id,id)
    {
        options = {
            draggable: true
        };
        if (zone_markers['zone_'+id]) {
            addmap.removeLayer(zone_markers['zone_'+id]);
        }
        options = {
            draggable: true,
            icon:markerIcon(colorsArr[id])
        };
        zone_markers['zone_'+id] = L.marker([$('#zone_latitude_'+zone_id).val(), $('#zone_longitude_'+zone_id).val()],options).bindPopup("Zone #" + id).addTo(addmap);
        zone_markers['zone_'+id].on('click', function (evt) {$('.r').css('border','none'); $('#zone_tr_'+zone_id).css('border','2px solid #253654');});
        zone_markers['zone_'+id].on('drag', function (ein) {
                $('.r').css('border','none'); $('#zone_tr_'+zone_id).css('border','2px solid #253654');
                var inmarker = ein.target;
                var latlng = inmarker.getLatLng();
            })
        zone_markers['zone_'+id].on('dragend', function (ein) {
            $.confirm({
                title: '<h3 class="text-success fw-bold mb-0">Confirmation </h3>',
                content: '<div class="fw-bold">Are you sure, you want to edit the location of the Zone #'+id+' ?</div>',
                buttons: {
                    yes: function () {
                        console.log(zone_id,id)
                        var inmarker = ein.target;
                        var latlng = inmarker.getLatLng();
                        $('#zone_latitude_'+zone_id).val(latlng.lat.toString());
                        $('#zone_longitude_'+zone_id).val(latlng.lng.toString());
                    },
                    no: function () {
                        console.log(zone_id,id)
                        createZoneMarker(zone_id,id)
                    }
                }
            })
            
        })
    }

    function markerIcon (color) {
        var icon = L.divIcon({
            // className: "pin",
            iconSize: null,
            popupAnchor: [0, -10],
            html:
                '<div class="pin" style="background:' + color + '"></div>'
        });

        return icon
    }

    $(document).on('click','.deleteZonebtn',function(){
        var id = $(this).attr('zone_id');
        $('#zone_tr_'+id).remove();
        if (zone_markers['zone_'+id]) {
            addmap.removeLayer(zone_markers['zone_'+id]);
        }
        zones = $("#addzones").val();
        var i = parseInt(zones)-1;
        if(i==0){
            $("#addzones").val(i);
            $("#countzones").val(i);
        }else{
            $("#addzones").val(i);
        }
        resetZoneIndex(); 
    })

})