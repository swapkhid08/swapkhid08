$(document).ready(function(){
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
	var getUrlParameter = function getUrlParameter (sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;
	
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');
	
			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};
	$('#editDeviceModal').on('shown.bs.modal', function () {
		setTimeout(function () {
			editmap.invalidateSize();
		}, 1);
	})



	let marker;
	var default_osm = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors',
        maxZoom: 18,
    });
    var editmap = new L.map('detector_add_map', {
        center: new L.LatLng(GLOBAL.COORD.LATITUDE, GLOBAL.COORD.LONGITUDE),
        zoom: 11,
        layers: [default_osm],
        projectionKey: 'EPSG:4326',
        zoomControl: false
    });

    L.control.zoom({
        position: 'bottomright'
    }).addTo(editmap);

    var baseMaps = {
        "<span class='fontOpenSansRegular'>Default OSM</span>": default_osm
    };

    L.control.layers(baseMaps).addTo(editmap);

	editmap.on('click', function (e) {
		if (marker) {
			// editmap.removeLayer(marker);
			return;
		}
		options = {
			draggable: true,
			icon: L.icon({ iconUrl: '../../images/detectorcamera-none.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] })
		};
		marker = L.marker([e.latlng.lat, e.latlng.lng],options).addTo(editmap);
		$("#latitude").val(e.latlng.lat);
		$("#longitude").val(e.latlng.lng);
		marker.on('drag', function (ein) {
            var inmarker = ein.target;
            var latlng = inmarker.getLatLng();
            $("#latitude").val(latlng.lat.toString());
            $("#longitude").val(latlng.lng.toString());
        })
	})

	$("#latitude, #longitude").change(function () {
		if (marker) {
			editmap.removeLayer(marker);
		}
		options = {
			draggable: true,
			icon: L.icon({ iconUrl: '../../images/detectorcamera-none.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] })
		};
		marker = L.marker([$("#latitude").val(), $("#longitude").val()],options).addTo(editmap);
		marker.on('drag', function (ein) {
            var inmarker = ein.target;
            var latlng = inmarker.getLatLng();
            $("#latitude").val(latlng.lat.toString());
            $("#longitude").val(latlng.lng.toString());
        })
	})


	//$("#editDeviceModalButton").click(function () {
		$('#detector_add_map').css("height",$('#detector_add_map').parent('td').css("height"));
		var prev_detector_lat,prev_detector_lng;
		setTimeout(function(){ 
			var lat = $("#latitude").val()
			var lng = $("#longitude").val()
			if (marker) {
				editmap.removeLayer(marker);
			}
			options = {
				draggable: true,
				icon: L.icon({ iconUrl: '../../images/detectorcamera-none.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] })
			};
			marker = L.marker([lat, lng],options).bindPopup("Detector").addTo(editmap);
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
						},
						no: function () {
							createMarker()
						}
					}
				});
				
			})
			resetZoneIndex();
			var markers_group = new L.featureGroup(markers_array);
    		editmap.fitBounds(markers_group.getBounds().pad(0.05));
			
		}, 2000);
	function createMarker()
	{
		options = {
			draggable: true,
			icon: L.icon({ iconUrl: '../../images/detectorcamera-none.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] })
		};
		if (marker) {
			editmap.removeLayer(marker);
		}
		marker = L.marker([$("#latitude").val(), $("#longitude").val()],options).addTo(editmap);
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
					},
					no: function () {
						createMarker()
					}
				}
			});
			
		})
	}
	
	//})
	var scn = getUrlParameter('scn');
	var markers_array = [];
	$.ajax({
		url: '../../../models/detector/get_edit_detector_setup.hh',
		type: 'POST',
		data: { scn: scn },
		success: function (result) {
			if(result == 'F'){
				$.alert({
					type: 'red',
					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>',
					buttons: {
						Ok: function () {
							// window.location.href="detector_setup.html"
						}
					}
				});
				return;
			}
			result = JSON.parse(result);
			var detectorval = result.detector[0];
			var is_tool = result.is_tool;
			var zoneslist = result.zoneslist;
			$('#scn').val(detectorval.SystemCodeNumber);
			$('#scn').attr('disabled',true);
			$('#shortDescription').val(detectorval.ShortDescription);
			$('#latitude').val(detectorval.Northing);
			$('#longitude').val(detectorval.Easting);
			$('#place').val(detectorval.Place);
			$('#ipAddress').val(detectorval.IPAddress);
			$('#port').val(detectorval.Port);
			$('#chainage').val(detectorval.Chainage);
			$('#public_live_link').val(detectorval.PublicLiveLink);
			$('#live_link').val(detectorval.LiveLink);
			markers_array.push(new L.marker([detectorval.Northing, detectorval.Easting]))
			var directopt ='';
			if(detectorval.Direction == 'LHS'){
				directopt += '<option value="LHS" selected>LHS</option>'
				directopt += '<option value="RHS">RHS</option>' 
				directopt += '<option value="Median">Median</option>'
			}
			else if(detectorval.Direction == 'RHS'){
				directopt += '<option value="LHS">LHS</option>'
				directopt += '<option value="RHS" selected>RHS</option>'
				directopt += '<option value="Median">Median</option>'
			}
			else{
				directopt += '<option value="LHS">LHS</option>'
				directopt += '<option value="RHS">RHS</option>'
				directopt += '<option value="Median" selected>Median</option>'
			}
			$('#direction').html(directopt);
			$.ajax({
				url: '../../../models/detector/get_types.hh',
				type: 'POST',
				data: { type: 'detector' },
				success: function (res) {
					res = JSON.parse(res)
					//$('#supporttype').append('<option value="">Select device type</option>')
					for (var i = 0; i < res.length; i++) {
						if(detectorval.TypeId == res[i].TypeID){
							$('#supporttype').append('<option value="' + res[i].TypeID + '" selected>' + res[i].TypeDescription + '</option>')
						}else{
							$('#supporttype').append('<option value="' + res[i].TypeID + '">' + res[i].TypeDescription + '</option>')
						}
						
					}
					//$('#supporttype').change();
				}
			})

			$.ajax({
				url: '../../../models/detector/get_detector_make_model.hh',
				type: 'POST',
				data: { type: detectorval.TypeId },
				success: function (mres) {
					mres = JSON.parse(mres)
					$('#make_model').append('<option value="">Select model</option>')
					for (var i = 0; i < mres.length; i++) {
						if(detectorval.MakeId == mres[i].ID){
							$('#make_model').append('<option value="' + mres[i].ID + '" selected>' + mres[i].Make +' - '+ mres[i].Model + '</option>')
						}else{
							$('#make_model').append('<option value="' + mres[i].ID + '">' + mres[i].Make +' - '+ mres[i].Model + '</option>')
						}
						
					}
					var mod = $( "#supporttype option:selected" ).text();
					$('.atcc_div').each(function(){
						$(this).hide();
					})
					$('.signal_div').show();
					$('#addzones').val(zoneslist.length);
					$('#countzones').val(zoneslist.length);
					//$('#addzones').keyup();
					var template = '';
					for(var z=0;z<zoneslist.length;z++){
						var s = z+1;
						markers_array.push(new L.marker([zoneslist[z].Latitude, zoneslist[z].Longitude]))
				        template += "<tr class='r' id='zone_tr_"+s+"'><td class='slimTableBox fw-bold w-10 labels_text_transform'>";
				        template += "Zone #" + s + " </td>";
				        template += "<td class='fw-bold w-5 labels_text_transform'>SCN &nbsp;&nbsp;<i class='fas fa-info-circle w-2' style='font-size:14px;'  data-toggle='tooltip' data-placement='right' title='Use \"_\" instead of \"-\".'></i></td><td class='w-10'><input type='text' placeholder='Enter SCN' class='form-control' name='zone_scn_" + s + "' id='zone_scn_" + s + "' value='"+zoneslist[z].ZoneSCN+"'></td><td class='fw-bold w-5 labels_text_transform'>Name</td><td class='w-10'><input type='text' placeholder='Enter Name' class='form-control' name='zone_name_" + s + "' id='zone_name_" + s + "' value='"+zoneslist[z].ZoneName+"'></td>";
				        template += "<td class='fw-bold w-5 labels_text_transform'>Latitude</td><td class='w-10'><input type='text' class='form-control coordinate' placeholder='Enter Latitude' name='zone_latitude_" + s + "' id='zone_latitude_" + s + "' value='"+zoneslist[z].Latitude+"'></td><td class='fw-bold w-5 labels_text_transform'>Longitude</td><td class='w-10'><input type='text' class='form-control coordinate' placeholder='Enter Longitude' name='zone_longitude_" + s + "' id='zone_longitude_" + s + "' value='"+zoneslist[z].Longitude+"'></td>";
						template += "<td class='fw-bold w-5 labels_text_transform'>LiveLink</td><td class='w-10'><input type='text' placeholder='Enter LiveLink' class='form-control' name='zone_livelink_" + s + "' id='zone_livelink_" + s + "' value='"+zoneslist[z].LiveLink+"'></td>";
						template += "<td class='fw-bold w-5 labels_text_transform'>Public LiveLink</td><td class='w-10'><input type='text' placeholder='Enter PublicLiveLink' class='form-control' name='zone_publiclivelink_" + s + "' id='zone_publiclivelink_" + s + "' value='"+zoneslist[z].PublicLiveLink+"'></td>";
				        template += "<td><button type='button' class='btn deleteZonebtn' zone_id='"+s+"' style='margin-left:10%;'><i class='fas fa-trash-alt'></i> </button></td></tr>";						
					}
					$('.zones_table').append(template);
					
				}
			})
		}
	})
	$(document).on('change','.coordinate',function(){
        resetZoneIndex();
    });
	var zones = 0;
    var zone_markers = {};
    $('#supporttype').change(function(){
        $.each(zone_markers, function (key, val) {
            if (val) {
                editmap.removeLayer(val);
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
        template += "<tr class='r' id='zone_tr_"+i+"'><td class='fw-bold w-10 labels_text_transform'>";
        template += "Zone #" + i + " </td>";
        template += "<td class='fw-bold w-5 labels_text_transform'>SCN &nbsp;&nbsp;<i class='fas fa-info-circle w-2' style='font-size:14px;'  data-toggle='tooltip' data-placement='right' title='Use \"_\" instead of \"-\".'></i></td><td class='slimTableBox w-10'><input type='text' placeholder='Enter SCN' class='form-control' name='zone_scn_" + i + "' id='zone_scn_" + i + "'></td><td class='fw-bold w-5 labels_text_transform'>Name</td><td class='w-10'><input type='text' placeholder='Enter Name' class='form-control' name='zone_name_" + i + "' id='zone_name_" + i + "'></td>";
        template += "<td class='fw-bold w-5 labels_text_transform'>Latitude</td><td class='w-10'><input type='text' class='form-control' placeholder='Enter Latitude' name='zone_latitude_" + i + "' id='zone_latitude_" + i + "'></td><td class='fw-bold w-5 labels_text_transform'>Longitude</td><td class='w-10'><input type='text' class='form-control' placeholder='Enter Longitude' name='zone_longitude_" + i + "' id='zone_longitude_" + i + "'></td>";
		template += "<td class='fw-bold w-5 labels_text_transform'>Live Link</td><td class='w-10'><input type='text' placeholder='Enter LiveLink' class='form-control' name='zone_livelink_" + i + "' id='zone_livelink_" + i + "'></td>";
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

    function resetZoneIndex()
    {
        var i = 1;
        $.each(zone_markers, function (key, val) {
            if (val) {
                editmap.removeLayer(val);
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
            	icon: markerIcon(colorsArr[i])
            };

            if(j==$('.r').length-1)
            {
            	zone_markers['zone_'+i] = L.marker([$(this).children(':nth-child(7)').children(':first').val(), $(this).children(':nth-child(9)').children(':first').val()],options).bindPopup("Zone #" + i).addTo(editmap).openPopup();
            }else{
            	zone_markers['zone_'+i] = L.marker([$(this).children(':nth-child(7)').children(':first').val(), $(this).children(':nth-child(9)').children(':first').val()],options).bindPopup("Zone #" + i).addTo(editmap);
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
			editmap.removeLayer(zone_markers['zone_'+id]);
		}
		options = {
            draggable: true,
            icon:markerIcon(colorsArr[id])
        };
        zone_markers['zone_'+id] = L.marker([$('#zone_latitude_'+zone_id).val(), $('#zone_longitude_'+zone_id).val()],options).bindPopup("Zone #" + id).addTo(editmap);
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
    	console.log($("#addzones").val())
        var id = $(this).attr('zone_id');
        $('#zone_tr_'+id).remove();
        if (zone_markers['zone_'+id]) {
            editmap.removeLayer(zone_markers['zone_'+id]);
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