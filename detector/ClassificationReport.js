flag=0;
$(document).ready(function () {
	// $.ajax({
	// 	url: '../../../models/detector/atcc_devices.hh',
	// 	success: function (result) {
	// 		var scns = JSON.parse(result);
	// 		devicetable_tbody = '<option value="all" selected>All devices</option>';
	// 		for (var i = 0; i < scns.length; i++) {
	// 			devicetable_tbody += '<option value="' + scns[i].SystemCodeNumber + '">' + scns[i].Place + ' - ' + scns[i].ShortDescription + '</option>';
	// 		}

	// 		$('#scnATCC').html(devicetable_tbody);
	// 	}
	// });
});

$(document).ready(function () {
	$(".datetimepicker").datetimepicker({ format: 'd-m-Y H:i:s' ,timepicker: true });
	setStartAndEndDate('#from', '#to', 7,true);

	var zones_input = [];
	// var dates = getCurrentStartNEndDate();
	// module_report_api('Detector');

	getFormattedDate($('#from').val(), 'd-m-y', 'Y-m-d')+" 00:00:00";
    getFormattedDate($('#to').val(), 'd-m-y', 'Y-m-d')+" 23:59:59";

	$.ajax({
		url: '../../../models/detector/detector_report_filters.hh',
		type: 'POST',
		success: function (result) {
			var result = JSON.parse(result);
			detector_types_arr = result.detector_types;
			class_head_arr = result.class_head;
			device_zones_arr = result.device_zones;
			devices_arr = result.devices;
			make_modal_arr = result.make_model;

			setTimeout(()=>{
			if(devices_arr.devices_types[$("#device_type").val()]==undefined){
				console.log('true')
			if(flag==0){				
					get_default_module('detector').then((data)=>{
						$('#device_type option[value="'+data.default_device_type+'"]').attr('selected',true);
						device_type_select.destroy();
						device_type_select = new SlimSelect({
							select: '#device_type',
							placeholder: 'Select type'
						  })
						  $('#device_type').change();
						})	
				flag++;
			}
			else{
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">No devices from selected device type added</div>'
			});
			$('#device_type').empty();
		}
	}
	// else{
	// 	// console.log('not switching')
	// 	console.log("devices: ",devices_arr.devices_types[$("#device_type").val()])
	// }
},1000)
			if (detector_types_arr.length < 1) {
				$.alert({
					type: 'red',
					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">No detector type added</div>'
				});
				$('#device_type').empty();
			}
			else {				
				scnATCC = '';
				for (var i = 0; i < detector_types_arr.length; i++) {
					scnATCC += '<option value="' + detector_types_arr[i].TypeID + '">' + detector_types_arr[i].TypeDescription + '</option>';
				}
				$('#device_type').html(scnATCC);
				$('#device_type').trigger('change')
			}
		}
	});
	$('#device_type').on('change',function(){
		var type = $(this).val();
		var scns = devices_arr.devices_types[type];
		var scn_zone = [];
		var makemodal = make_modal_arr[type];
		var makemodalarr = [];
		for (const key in makemodal) {
			if(key!=undefined){
                makemodalarr.push(makemodal[key])
			}			
		}
		$('#make_model').empty();
		$('#devicetable_tbody').html('');
		$('#zones_select').html('');
		$('#vehicle_class').html('');
		for (var i = 0; i < makemodalarr.length; i++) {
			$('#make_model').append('<option value="' + makemodalarr[i].ID + '">' + makemodalarr[i].Make +' - '+ makemodalarr[i].Model + '</option>')
		}
		$('#make_model').change();
	});
	$('#make_model').on('change', function(){
		var make_model = $('#make_model').val();
		var nscns = devices_arr.devices_make_model[make_model];
		if(nscns != undefined && nscns != ''){
			var scns = [];
			for (const key in nscns) {
				if(key!=undefined){
					scns.push(nscns[key])
				}			
			}
			var scn_zone = [];
			scnATCC = '<option value="all" selected>All devices</option>';
			for (var i = 0; i < scns.length; i++) {
				scn_zone[i]=scns[i].SystemCodeNumber;
				scnATCC += '<option value="' + scns[i].SystemCodeNumber + '">' + scns[i].Place + ' - ' + scns[i].ShortDescription + '</option>';
			}
			$('#scnATCC').html(scnATCC);
			var selectzones = '<option value="all" selected>All</option>';				
			for(var z=0;z<scn_zone.length;z++){		
				var zonearr = device_zones_arr[scn_zone[z]];
				var newzones = [];
				if(zonearr != undefined){
					for (const key in zonearr) {
						if(key!=undefined){
							newzones.push(zonearr[key])
						}			
					}
					for(var d=0;d<newzones.length;d++){	
						selectzones += '<option value="'+newzones[d].ZoneSCN+'">'+newzones[d].ZoneName+'</option>';
					}
				}				
			}
			$('#zones_select').html(selectzones);
		
			var newclass_heads = class_head_arr[make_model];
			var class_heads = [];
			if(newclass_heads != undefined && newclass_heads != ''){
				for (const key in newclass_heads) {
					if(key!=undefined){
						class_heads.push(newclass_heads[key])
					}			
				}
				var vehicle_class = '<option value="all" selected>All</option>';
				for(var c=0;c<class_heads.length;c++){
					vehicle_class += '<option value="'+class_heads[c].binName+'">'+class_heads[c].binName+'</option>';
				}
				$('#vehicle_class').html(vehicle_class);
			}else{
				$('#vehicle_class').html('');
			}
			
		}else{
			$('#scnATCC').html('');
			$('#zones_select').html('');
			$('#vehicle_class').html('');
		}
		
	})
	
	$('#scnATCC').on('change',function(){
		var selectedscn = $('#scnATCC').val();
		var selectzones = '<option value="all" selected>All</option>';
		if(selectedscn == null){
			$('#scnATCC > option').each(function() {
				var optval = $(this).val();
				if(optval != 'all'){
					var zonearr = device_zones_arr[optval];
					var newzones = [];
					for (const key in zonearr) {
						if(key!=undefined){
							newzones.push(zonearr[key])
						}			
					}
					for(var d=0;d<newzones.length;d++){	
						selectzones += '<option value="'+newzones[d].ZoneSCN+'">'+newzones[d].ZoneName+'</option>';
					}
				}
			});
		}else{
			if(selectedscn.includes("all")){
				$('#scnATCC > option').each(function() {
					var optval = $(this).val();
					if(optval != 'all'){
						var zonearr = device_zones_arr[optval];
						var newzones = [];
						for (const key in zonearr) {
							if(key!=undefined){
								newzones.push(zonearr[key])
							}			
						}
						for(var d=0;d<newzones.length;d++){	
							selectzones += '<option value="'+newzones[d].ZoneSCN+'">'+newzones[d].ZoneName+'</option>';
						}
					}
				});
			}else{
				for(var s=0;s<selectedscn.length;s++){
					var optval = selectedscn[s];
					var zonearr = device_zones_arr[optval];
						var newzones = [];
						for (const key in zonearr) {
							if(key!=undefined){
								newzones.push(zonearr[key])
							}			
						}
					for(var d=0;d<newzones.length;d++){	
						selectzones += '<option value="'+newzones[d].ZoneSCN+'">'+newzones[d].ZoneName+'</option>';
					}
				}
			}
		}
		
		$('#zones_select').html(selectzones);
	
	});

	create_report = function () {
		var fromDate = $('#from').val(); //+" 00:00:00";
		var toDate = $('#to').val(); //+" 23:59:59";
		// console.log(sanitize(getFormattedDate(fromDate, 'd-m-y H:m:s', 'Y-m-d H:m:s')));
		// console.log(toDate);
		// return;
		timerange = $("#timerange :selected").val();
		if ($('#scnATCC').val() == '' || $('#scnATCC').val() == null) {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select Devices</div>'
			});
			return;
		}
		var scn = $('#scnATCC').val().toString();
		var radioVal = $('#order').val();
		// var fromTime = $('#fromTime').val();
		// var toTime = $('#toTime').val();

		if (fromDate == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter from date</div>'
			});
			return;
		}
		if (toDate == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter to date</div>'
			});
			return;
		}

		var fromDate = sanitize(getFormattedDate($('#from').val(),  'd-m-y H:m:s', 'Y-m-d H:m:s')); //+' 00:00:00');
		var toDate = sanitize(getFormattedDate($('#to').val(),  'd-m-y H:m:s', 'Y-m-d H:m:s')); //+' 23:59:59');
		var q = new Date();
		var m = q.getMonth();
		var d = q.getDate();
		var y = q.getFullYear();
		var date = new Date(y, m, d);
		mydate = new Date(fromDate);
		var zones_select = $('#zones_select').val();
		var day_type = $('input[name=data_type]:checked').val();
		var aggregation = $('input[name=aggregation]:checked').val();
		fromtime = fromDate.split(" ")[1];
		totime = toDate.split(" ")[1];
		if (fromDate > toDate) {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">From Date should be less than To Date</div>'
			});
			return;
		}else if(day_type == 'interval' && fromtime > totime){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">From Date Time should be less than To Date Time</div>'
			});
			return;
		} else {
			$('#dataTable').hide();
			$('#dataTable1').hide();
			$('#dataTable2').hide();
			$('#dataTable3').hide();
			var dtblests = $("#dtblests").val();
			if (dtblests != '') {
				$('#' + dtblests).DataTable().destroy();
			}
			if (timerange == "Monthly") {
				$('#dataTable').DataTable({
					"searching": false
				});
				$('#dataTable').DataTable().clear();
				$('#dataTable').DataTable().destroy();
				var disable_col = [];
				var diablstart = 0;
				var diablend = 0;
				$.ajax({
					url: '../../../models/detector/get_detector_class_head.hh',
					type: 'POST',
					data:{makeid:$('#make_model').val()},
					success: function (class_heads) {
						var class_heads = jQuery.parseJSON(class_heads);
						if(class_heads.length > 0){
							var dt_head = (aggregation=='zone')?'<th>Zone</th>':'<th>Name</th>';
							dt_head += '<th>Year</th>';
							dt_head += '<th>Month</th>';
							var columnsArray = [
								{ "data": "ShortDescription" },
								{ "data": "Year" },
								{ "data": "Month" }
							];
							diablstart = 2;
							diablend = 2;
							for(var c=0;c<class_heads.length;c++){
								dt_head += '<th>'+class_heads[c].binName+'</th>';
								var txt = class_heads[c].binName;
								txt = replaceString(txt,'/','_');
								txt = replaceString(txt,'-','_');
								txt = replaceString(txt,' ','_');
								columnsArray.push({'data':txt});	
								diablend++;					   
							}
							columnsArray.push({'data':'PCU'});
							columnsArray.push({'data':'Total_Flow'});
							dt_head += '<th>PCU</th>';
							dt_head += '<th>Total</th>';
							//console.log(columnsArray.length)
							var selectfield = columnsArray.length-1;
							diablend = columnsArray.length-2;
							for(var d=diablstart+1;d<=diablend;d++){
								disable_col.push(d);
							}
							$('#dt_head').html(dt_head);
							$('#dataTable').show();
							$("#dtblests").val('dataTable');
							$('#dataTable').DataTable({
								"processing": true,
								"serverSide": true,
								"searching": false,
								// "scrollY": "500px",
                				// "scrollCollapse": true,
								"scrollX": true,
								"columnDefs": [ { orderable: false, targets: disable_col}],
								"order": [[0, radioVal]],
								"ajax": {
									"url": "../../../models/detector/createreport_atccClassification.hh",
									"type": "POST",
									"data": function (d) {
										d.fromDate = fromDate
										_fromDate = d.fromDate
										d.toDate = toDate
										_toDate = d.toDate
										d.timerange = timerange
										_timerange = d.timerange
										d.scn = scn
										_scn = d.scn
										d.makeid = $('#make_model').val()
										_makeid = d.makeid
										d.device_type = $('#device_type').val()
										_device_type = d.device_type

										d.zone = zones_select
										_zone = d.zone

										d.day_type = day_type
										_day_type = d.day_type

										d.aggregation = aggregation
										_aggregation = d.aggregation
									},
									'dataSrc':function(res){
					                    var check = res;
					                    var return_data = res;
					                    check = check.data
					                    for(var i=0;i<return_data.data.length; i++){
					                    	var total = 0;
					                    	for(var c=0;c<class_heads.length;c++){
												total += parseFloat(return_data.data[i][class_heads[c].binName.split(' ').join('_').split('-').join('_').split('/').join('_')])*parseFloat(class_heads[c].PCU);
											}
											return_data.data[i]['PCU'] = parseFloat(total).toFixed(1);
					                    }
					                    return return_data.data;
					                }
								},
								"columns": columnsArray
							});
						}
						
					}
				});

				
				/*
					$("#dtblests").val('dataTable');
					$('#dataTable').DataTable({
						"processing": true,
						"serverSide": true,
						"searching": false,
						"order": [[1, "desc"]],
						"ajax": {
							"url": "../../../models/detector/createreport_atccClassification.hh",
							"data": function (d) {
								d.fromDate = fromDate
								_fromDate = d.fromDate
								d.toDate = toDate
								_toDate = d.toDate
								d.timerange = timerange
								_timerange = d.timerange
								d.scn = scn
								_scn = d.scn
								d.makeid = $('#make_model').val()
								_makeid = d.makeid
							}
						},
						"columns": [
							{ "data": "SCN" },
							{ "data": "Year" },
							{ "data": "Month" },
							{ "data": "Car_Jeep_Van" },
							{ "data": "LCV_Minibus" },
							{ "data": "Bus_Truck" },
							{ "data": "MAV" },
							{ "data": "OSV" },
							{ "data": "Other" },
							{ "data": "Total_Flow" }
						]
					});append = '<tr>'
				append += '<td>'+data_queried[data_queried.length-1-i].SCN+'</td>'
				append += '<td>'+data_queried[data_queried.length-1-i].Year+'</td>'
				if(timerange=="Monthly" || timerange=="Daily" || timerange=="Hourly"){
					append += '<td>'+data_queried[data_queried.length-1-i].Month+'</td>'	
					if(timerange=="Daily" || timerange=="Hourly"){
						append += '<td>'+data_queried[data_queried.length-1-i].Day+'</td>'
						if(timerange=="Hourly")	{
							append += '<td>'+data_queried[data_queried.length-1-i].Hour+'</td>'
						}
					}
				} else if(timerange=="Weekly"){
					append += '<td>'+data_queried[data_queried.length-1-i].Week+'</td>'
				}
				//append += '<td>'+data_queried[data_queried.length-1-i].Bike+'</td>'
				append += '<td>'+data_queried[data_queried.length-1-i].Car_Jeep_Van+'</td>'
				append += '<td>'+data_queried[data_queried.length-1-i].LCV_Minibus+'</td>'
				append += '<td>'+data_queried[data_queried.length-1-i].Bus_Truck+'</td>'
				append += '<td>'+data_queried[data_queried.length-1-i].MAV+'</td>'
				append += '<td>'+data_queried[data_queried.length-1-i].OSV+'</td>'
				append += '<td>'+data_queried[data_queried.length-1-i].Other+'</td>'
				append += '<td>'+data_queried[data_queried.length-1-i].Total_Flow+'</td>'
				append += '</tr>'*/

			} else if (timerange == "Weekly") {
				$('#dataTable').DataTable({
					"searching": false
				});
				$('#dataTable').DataTable().clear();
				$('#dataTable').DataTable().destroy();
				var disable_col = [];
				var diablstart = 0;
				var diablend = 0;
				$.ajax({
					url: '../../../models/detector/get_detector_class_head.hh',
					type: 'POST',
					data:{makeid:$('#make_model').val()},
					success: function (class_heads) {
						var class_heads = jQuery.parseJSON(class_heads);
						if(class_heads.length > 0){
							var dt_head = (aggregation=='zone')?'<th>Zone</th>':'<th>Name</th>';
							dt_head += '<th>Year</th>';
							dt_head += '<th>Week</th>';
							var columnsArray = [
								{ "data": "ShortDescription" },
								{ "data": "Year" },
								{ "data": "Week" }
							];
							diablstart = 2;
							diablend = 2;
							for(var c=0;c<class_heads.length;c++){
								dt_head += '<th>'+class_heads[c].binName+'</th>';
								var txt = class_heads[c].binName;
								txt = replaceString(txt,'/','_');
								txt = replaceString(txt,'-','_');
								txt = replaceString(txt,' ','_');
								columnsArray.push({'data':txt});
								diablend++;						   
							}
							columnsArray.push({'data':'PCU'});
							columnsArray.push({'data':'Total_Flow'});
							dt_head += '<th>PCU</th>';
							dt_head += '<th>Total</th>';
							//console.log(columnsArray.length)
							var selectfield = columnsArray.length-1;
							diablend = columnsArray.length-2;
							for(var d=diablstart+1;d<=diablend;d++){
								disable_col.push(d);
							}
							$('#dt_head').html(dt_head);
							$('#dataTable').show();
							$("#dtblests").val('dataTable');
							$('#dataTable').DataTable({
								"processing": true,
								"serverSide": true,
								"searching": false,
								// "scrollY": "500px",
                				// "scrollCollapse": true,
								"scrollX": true,
								"columnDefs": [ { orderable: false, targets: disable_col}],
								"order": [[0, radioVal]],
								"ajax": {
									"url": "../../../models/detector/createreport_atccClassification.hh",
									"type": "POST",
									"data": function (d) {
										d.fromDate = fromDate
										_fromDate = d.fromDate
										d.toDate = toDate
										_toDate = d.toDate
										d.timerange = timerange
										_timerange = d.timerange
										d.scn = scn
										_scn = d.scn
										d.makeid = $('#make_model').val()
										_makeid = d.makeid
										d.device_type = $('#device_type').val()
										_device_type = d.device_type
										d.zone = zones_select
										_zone = d.zone
										d.day_type = day_type
										_day_type = d.day_type

										d.aggregation = aggregation
										_aggregation = d.aggregation
									},
									'dataSrc':function(res){
					                    var check = res;
					                    var return_data = res;
					                    check = check.data
					                    for(var i=0;i<return_data.data.length; i++){
					                    	var total = 0;
					                    	for(var c=0;c<class_heads.length;c++){
												total += parseFloat(return_data.data[i][class_heads[c].binName.split(' ').join('_').split('-').join('_').split('/').join('_')])*parseFloat(class_heads[c].PCU);
											}
											return_data.data[i]['PCU'] = parseFloat(total).toFixed(1);
					                    }
					                    return return_data.data;
					                }
								},
								"columns": columnsArray
							});
						}
						
					}
				});
				/*$('#dataTable1').show();
				$("#dtblests").val('dataTable1');
				$('#dataTable1').DataTable({
					"processing": true,
					"serverSide": true,
					"searching": false,
					"order": [[1, "desc"]],
					"ajax": {
						"url": "../../../models/detector/createreport_atccClassification.hh",
						"data": function (d) {
							d.fromDate = fromDate
							_fromDate = d.fromDate
							d.toDate = toDate
							_toDate = d.toDate
							d.timerange = timerange
							_timerange = d.timerange
							d.scn = scn
							_scn = d.scn
							d.makeid = $('#make_model').val()
							_makeid = d.makeid
						}
					},
					"columns": [
						{ "data": "SCN" },
						{ "data": "Year" },
						{ "data": "Week" },
						{ "data": "Car_Jeep_Van" },
						{ "data": "LCV_Minibus" },
						{ "data": "Bus_Truck" },
						{ "data": "MAV" },
						{ "data": "OSV" },
						{ "data": "Other" },
						{ "data": "Total_Flow" }
					]
				});*/

			} else if (timerange == "Daily") {
				$('#dataTable').DataTable({
					"searching": false
				});
				$('#dataTable').DataTable().clear();
				$('#dataTable').DataTable().destroy();
				var disable_col = [];
				var diablstart = 0;
				var diablend = 0;
				$.ajax({
					url: '../../../models/detector/get_detector_class_head.hh',
					type: 'POST',
					data:{makeid:$('#make_model').val()},
					success: function (class_heads) {
						var class_heads = jQuery.parseJSON(class_heads);
						if(class_heads.length > 0){
							var dt_head = (aggregation=='zone')?'<th>Zone</th>':'<th>Name</th>';
							dt_head += '<th>Year</th>';
							dt_head += '<th>Month</th>';
							dt_head += '<th>Day</th>';
							var columnsArray = [
								{ "data": "ShortDescription" },
								{ "data": "Year" },
								{ "data": "Month" },
								{ "data": "Day" }
							];
							diablstart = 3;
							diablend = 3;
							for(var c=0;c<class_heads.length;c++){
								dt_head += '<th>'+class_heads[c].binName+'</th>';
								var txt = class_heads[c].binName;
								txt = replaceString(txt,'/','_');
								txt = replaceString(txt,'-','_');
								txt = replaceString(txt,' ','_');
								columnsArray.push({'data':txt});	
								diablend++;					   
							}
							columnsArray.push({'data':'PCU'});
							columnsArray.push({'data':'Total_Flow'});
							dt_head += '<th>PCU</th>';
							dt_head += '<th>Total</th>';
							//console.log(columnsArray.length)
							var selectfield = columnsArray.length-1;
							diablend = columnsArray.length-2;
							for(var d=diablstart+1;d<=diablend;d++){
								disable_col.push(d);
							}
							$('#dt_head').html(dt_head);
							$('#dataTable').show();
							$("#dtblests").val('dataTable');
							$('#dataTable').DataTable({
								"processing": true,
								"serverSide": true,
								"searching": false,
								// "scrollY": "500px",
                				// "scrollCollapse": true,
								"scrollX": true,
								"columnDefs": [ { orderable: false, targets: disable_col}],
								"order": [[0, radioVal]],
								"ajax": {
									"url": "../../../models/detector/createreport_atccClassification.hh",
									"type": "POST",
									"data": function (d) {
										d.fromDate = fromDate
										_fromDate = d.fromDate
										d.toDate = toDate
										_toDate = d.toDate
										d.timerange = timerange
										_timerange = d.timerange
										d.scn = scn
										_scn = d.scn
										d.makeid = $('#make_model').val()
										_makeid = d.makeid
										d.device_type = $('#device_type').val()
										_device_type = d.device_type
										d.zone = zones_select
										_zone = d.zone
										d.day_type = day_type
										_day_type = d.day_type

										d.aggregation = aggregation
										_aggregation = d.aggregation
									},
									'dataSrc':function(res){
					                    var check = res;
					                    var return_data = res;
					                    check = check.data
					                    for(var i=0;i<return_data.data.length; i++){
					                    	var total = 0;
					                    	for(var c=0;c<class_heads.length;c++){
												total += parseFloat(return_data.data[i][class_heads[c].binName.split(' ').join('_').split('-').join('_').split('/').join('_')])*parseFloat(class_heads[c].PCU);
											}
											return_data.data[i]['PCU'] = parseFloat(total).toFixed(1);
					                    }
					                    return return_data.data;
					                }
								},
								"columns": columnsArray
							});
						}
						
					}
				});
				/*$('#dataTable2').show();
				$("#dtblests").val('dataTable2');
				$('#dataTable2').DataTable({
					"processing": true,
					"serverSide": true,
					"searching": false,
					"order": [[1, "desc"]],
					"ajax": {
						"url": "../../../models/detector/createreport_atccClassification.hh",
						"data": function (d) {
							d.fromDate = fromDate
							_fromDate = d.fromDate
							d.toDate = toDate
							_toDate = d.toDate
							d.timerange = timerange
							_timerange = d.timerange
							d.scn = scn
							_scn = d.scn
							d.makeid = $('#make_model').val()
							_makeid = d.makeid
						}
					},
					"columns": [
						{ "data": "SCN" },
						{ "data": "Year" },
						{ "data": "Month" },
						{ "data": "Day" },
						{ "data": "Car_Jeep_Van" },
						{ "data": "LCV_Minibus" },
						{ "data": "Bus_Truck" },
						{ "data": "MAV" },
						{ "data": "OSV" },
						{ "data": "Other" },
						{ "data": "Total_Flow" }
					]
				});*/
			} else if (timerange == "Hourly") {
				$('#dataTable').DataTable({
					"searching": false
				});
				$('#dataTable').DataTable().clear();
				$('#dataTable').DataTable().destroy();
				var disable_col = [];
				var diablstart = 0;
				var diablend = 0;
				$.ajax({
					url: '../../../models/detector/get_detector_class_head.hh',
					type: 'POST',
					data:{makeid:$('#make_model').val()},
					success: function (class_heads) {
						var class_heads = jQuery.parseJSON(class_heads);
						if(class_heads.length > 0){
							var dt_head = (aggregation=='zone')?'<th>Zone</th>':'<th>Name</th>';
							dt_head += '<th>Year</th>';
							dt_head += '<th>Month</th>';
							dt_head += '<th>Day</th>';
							dt_head += '<th>Hour</th>';
							diablstart = 4;
							diablend =4;
							var columnsArray = [
								{ "data": "ShortDescription" },
								{ "data": "Year" },
								{ "data": "Month" },
								{ "data": "Day" },
								{ "data": "Hour" }
							];
							for(var c=0;c<class_heads.length;c++){
								dt_head += '<th>'+class_heads[c].binName+'</th>';
								var txt = class_heads[c].binName;
								txt = replaceString(txt,'/','_');
								txt = replaceString(txt,'-','_');
								txt = replaceString(txt,' ','_');
								columnsArray.push({'data':txt});
								diablend++;						   
							}
							columnsArray.push({'data':'PCU'});
							columnsArray.push({'data':'Total_Flow'});
							dt_head += '<th>PCU</th>';
							dt_head += '<th>Total</th>';
							//console.log(columnsArray.length)
							var selectfield = columnsArray.length-1;
							diablend = columnsArray.length-2;
							for(var d=diablstart+1;d<=diablend;d++){
								disable_col.push(d);
							}
							$('#dt_head').html(dt_head);
							$('#dataTable').show();
							$("#dtblests").val('dataTable');
							$('#dataTable').DataTable({
								"processing": true,
								"serverSide": true,
								"searching": false,
								// "scrollY": "500px",
                				// "scrollCollapse": true,
								"scrollX": true,
								"columnDefs": [ { orderable: false, targets: disable_col}],
								"order": [[0, radioVal]],
								"ajax": {
									"url": "../../../models/detector/createreport_atccClassification.hh",
									"type": "POST",
									"data": function (d) {
										d.fromDate = fromDate
										_fromDate = d.fromDate
										d.toDate = toDate
										_toDate = d.toDate
										d.timerange = timerange
										_timerange = d.timerange
										d.scn = scn
										_scn = d.scn
										d.makeid = $('#make_model').val()
										_makeid = d.makeid
										d.device_type = $('#device_type').val()
										_device_type = d.device_type
										d.zone = zones_select
										_zone = d.zone
										d.day_type = day_type
										_day_type = d.day_type

										d.aggregation = aggregation
										_aggregation = d.aggregation
									},
									'dataSrc':function(res){
					                    var check = res;
					                    var return_data = res;
					                    check = check.data
					                    for(var i=0;i<return_data.data.length; i++){
					                    	var total = 0;
					                    	for(var c=0;c<class_heads.length;c++){
												total += parseFloat(return_data.data[i][class_heads[c].binName.split(' ').join('_').split('-').join('_').split('/').join('_')])*parseFloat(class_heads[c].PCU);
											}
											return_data.data[i]['PCU'] = parseFloat(total).toFixed(1);
					                    }
					                    return return_data.data;
					                }
								},
								"columns": columnsArray
							});
						}
						
					}
				});
				/*$('#dataTable3').show();
				$("#dtblests").val('dataTable3');
				$('#dataTable3').DataTable({
					"processing": true,
					"serverSide": true,
					"searching": false,
					"order": [[1, "desc"]],
					"ajax": {
						"url": "../../../models/detector/createreport_atccClassification.hh",
						"data": function (d) {
							d.fromDate = fromDate
							_fromDate = d.fromDate
							d.toDate = toDate
							_toDate = d.toDate
							d.timerange = timerange
							_timerange = d.timerange
							d.scn = scn
							_scn = d.scn
							d.makeid = $('#make_model').val()
							_makeid = d.makeid
						}
					},
					"columns": [
						{ "data": "SCN" },
						{ "data": "Year" },
						{ "data": "Month" },
						{ "data": "Day" },
						{ "data": "Hour" },
						{ "data": "Car_Jeep_Van" },
						{ "data": "LCV_Minibus" },
						{ "data": "Bus_Truck" },
						{ "data": "MAV" },
						{ "data": "OSV" },
						{ "data": "Other" },
						{ "data": "Total_Flow" }
					]
				});*/
			}
			/*$.ajax({
				url: '../../../models/detector/createreport_atccClassification.hh',
				data :{fromDate:fromDate,toDate:toDate,timerange:timerange,scn:scn,orderby:radioVal},
				type: 'GET',
				success: function(result) {
					if(result.length == 2){
						alert("No Data found");
					}
					else{
						var devices_set = jQuery.parseJSON(result);
						if(devices_set.length > 0){

							data_queried = jQuery.parseJSON(result);
							pagenation(1);
						
						}else{
							append = '<tr>'
							append += '<td colspan="8">No Results</td></tr>'
							$('#searchResult').append(append);
						}
					}
				}
			});*/
		}
		setTimeout(()=>{
			$('#dataTable tbody tr > td').each((k,v)=>{
				if($(v).text() == null || $(v).text() == ' ' || $(v).text() == ''){
					$(v).text(0)
				}
			})
		},500);
		
	}
	$("#createReport").click(function () {
		create_report();
	});
});


$(document).ready(function () {
	download_report = function () {

		var downloadPermission = false;

		$.ajax({
			url: '../../../models/utils/get_roles.hh',
			type: 'POST',
			success: function (result) {
				var id_set = jQuery.parseJSON(result);
				/*for(i=0; i<id_set.length;i++){
					if((id_set[i].role.indexOf("Manager") > -1) || (id_set[i].role.indexOf("Admin") > -1)){
						downloadPermission = true;
					}
						
				}*/
				downloadPermission = true;

				if (downloadPermission) {

					var fromDate = $('#from').val(); //+" 00:00:00";
					var toDate = $('#to').val(); //+" 23:59:59";
					var timerange = $("#timerange :selected").val();
					if ($('#scnATCC').val() == '' || $('#scnATCC').val() == null) {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Please select Devices</div>'
						});
						return;
					}
					var scn = $('#scnATCC').val().toString();
					var radioVal = $('#order').val();
					// var fromTime = $('#fromTime').val();
					// var toTime = $('#toTime').val();

					if (fromDate == "") {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Please enter from date</div>'
						});
						return;
					}
					if (toDate == "") {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Please enter to date</div>'
						});

						return;
					}
					// if (fromTime == "") {
					// 	fromTime = "00:00:00"
					// }
					// if (toTime == "") {
					// 	toTime = "23:59:59"
					// }

					var fromDate = sanitize(getFormattedDate($('#from').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s')); //+" 00:00:00");
					var toDate = sanitize(getFormattedDate($('#to').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s')); //+" 23:59:59");
					var q = new Date();
					var m = q.getMonth();
					var d = q.getDate();
					var y = q.getFullYear();
					var date = new Date(y, m, d);
					mydate = new Date(fromDate);
					makeid = $('#make_model').val()
					device_type = $('#device_type').val()
					var aggregation = $('input[name=aggregation]:checked').val();
					var zones_select = $('#zones_select').val();
					

					if (fromDate > toDate) {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">From Date should be less than To Date</div>'
						});
						return;
					}
					else {
						$.ajax({
							url: '../../../models/detector/createreport_atcc_Classification.hh',
							data: { fromDate: fromDate, toDate: toDate, timerange: timerange, scn: scn, orderby: radioVal, makeid: makeid, device_type: device_type,zone:zones_select,day_type:$('input[name=data_type]:checked').val(),aggregation:aggregation},
							type: 'POST',
							success: function (result) {
								if (result.length == 2) {
									$.alert({
										type: 'red',
										title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
										content: '<div class="fw-bold">No data found</div>'
									});
								}
								else {
									$.ajax({
										url: '../../../models/utils/get_username.hh',
										type: 'POST',
										success: function (result_username) {
											// console.log(result_username.user)
											// var username = result_username.user.trim();
											var currentdate = new Date();
											var ts = "Downloaded at: " + currentdate.getDate() + "/"
												+ (currentdate.getMonth() + 1) + "/"
												+ currentdate.getFullYear() + " @ "
												+ currentdate.getHours() + ":"
												+ currentdate.getMinutes() + ":"
												+ currentdate.getSeconds();

									// json_to_csv(result, "ATCC Report", true, fromDate, toDate, timerange, result_devices, username, ts, scn, radioVal);
									json_to_csv(result, "Detector Summary Report", true, fromDate, toDate, timerange, ts, scn, radioVal);
										}
									});
									


								}
							}
						});
					}

				} else {

					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Permission denied. Please contact your administrator</div>'
					});
				}

			}

		});

	}
	$("#downloadReport").click(function () {
		download_report();
	});
});


$(document).ready(function () {
	download_pdf = function () {

		var downloadPermission = false;

		$.ajax({
			url: '../../../models/utils/get_roles.hh',
			type: 'POST',
			success: function (result) {
				var id_set = jQuery.parseJSON(result);
				/*for(i=0; i<id_set.length;i++){
					if((id_set[i].role.indexOf("Manager") > -1) || (id_set[i].role.indexOf("Admin") > -1)){
						downloadPermission = true;
					}
						
				}*/

				downloadPermission = true;

				if (downloadPermission) {

					var fromDate = $('#from').val(); //+" 00:00:00";
					var toDate = $('#to').val(); //+" 23:59:59";
					//console.log(fromDate);
					var timerange = $("#timerange :selected").val();
					if ($('#scnATCC').val() == '' || $('#scnATCC').val() == null) {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Please select Devices</div>'
						});

						return;
					}
					var scn = $('#scnATCC').val().toString();
					var radioVal = $('#order').val();
					// var fromTime = $('#fromTime').val();
					// var toTime = $('#toTime').val();

					if (fromDate == "") {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Please enter from date</div>'
						});
						return;
					}
					if (toDate == "") {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Please enter to date</div>'
						});

						return;
					}
					// if (fromTime == "") {
					// 	fromTime = "00:00:00"
					// }
					// if (toTime == "") {
					// 	toTime = "23:59:59"
					// }
					// console.log('date',sanitize(getFormattedDate($('#from').val(),'d-m-y H:m:s', 'Y-m-d H:m:s')));
					// return ;
					var fromDate = sanitize(getFormattedDate($('#from').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s')); //+" 00:00:00");
					var toDate = sanitize(getFormattedDate($('#to').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s')); //+" 23:59:59");
					var q = new Date();
					var m = q.getMonth();
					var d = q.getDate();
					var y = q.getFullYear();
					var date = new Date(y, m, d);
					mydate = new Date(fromDate);
					makeid = $('#make_model').val();
					device_type = $('#device_type').val();
					var zones_select = $('#zones_select').val();
					var day_type = $('input[name=data_type]:checked').val();
					var aggregation = $('input[name=aggregation]:checked').val();

					var from_text = $("#from").val();
					var to_text = $("#to").val();
					var device_type_text = $("#device_type :selected").text();
					var make_model_text = $("#make_model :selected").text();
					var devices_text = $('#scnATCC :selected').toArray().map(item => item.text).join();
					var timerange_text = $("#timerange :selected").text();
					var zones_select_text = $('#zones_select :selected').toArray().map(item => item.text).join();
					var order_by_text = $('#order :selected').toArray().map(item => item.text).join();
					var data_type_text = day_type.substring(0,1).toUpperCase() + day_type.substring(1,day_type.length)
					var aggregation_text = aggregation.substring(0,1).toUpperCase() + aggregation.substring(1,aggregation.length)
					//console.log((date-mydate)/86400000);

					// if((date-mydate)/86400000 > 60){
					// 	alert("Please use Archival Report Screen for searches before 60 days.")
					// 	return;
					// }						

					if (fromDate > toDate) {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">From Date should be less than To Date</div>'
						});
						return;
					}
					else {
						$.ajax({
							url: '../../../models/detector/createreport_atcc_Classification.hh',
							data: { fromDate: fromDate, toDate: toDate, timerange: timerange, scn: scn, orderby: radioVal, makeid: makeid, device_type: device_type,zone:zones_select,day_type:$('input[name=data_type]:checked').val(),aggregation:aggregation},
							type: 'POST',
							success: function (result) {
								if (result.length == 2) {
									$.alert({
										type: 'red',
										title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
										content: '<div class="fw-bold">No data found</div>'
									});
								}
								else {
									$.ajax({
										url: '../../../models/utils/get_username.hh',
										type: 'POST',
										success: function (result_username) {
											result = JSON.parse(result_username);
											// console.log(result_username.user)
											var username = JSON.parse(result_username).user.trim();
											window.open("../../../models/detector/createreport_atccClassification_pdf.hh?fromDate=" + fromDate + "&toDate=" + toDate + "&timerange=" + timerange + "&username=" + username + "&scn=" + scn + "&orderby=" + radioVal +"&makeid="+makeid+"&device_type="+device_type+"&zone="+zones_select+"&day_type="+day_type+"&device_type_text="+device_type_text+"&make_model_text="+make_model_text+"&devices_text="+devices_text+"&timerange_text="+timerange_text+"&zones_select_text="+zones_select_text+"&order_by_text="+order_by_text+"&data_type_text="+data_type_text+"&from_text="+from_text+"&to_text="+to_text+'&aggregation='+aggregation+'&aggregation_text='+aggregation_text, '_blank');
										}
									});
								}
							}
						});
					}
				} else {
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Permission denied. Please contact your administrator</div>'
					});
				}

			}
		});

	}
	$("#downloadPDF").click(function () {
		download_pdf();
	});
});

function json_to_csv (json_data, title, label, fromDate, toDate, timerange, footer, scn, orderBy) {
	//Json  Parser
	var arr_data = JSON.parse(json_data);
	// var arr_data_devices = JSON.parse(json_data_devices);
	var csv = '';

	// if (label) {
	// 	var row = "";
	// 	for (var index in arr_data_devices[0]) {

	// 		if (index == 'Northing') {
	// 			index = 'Latitude';
	// 		} else if (index == 'Easting') {
	// 			index = 'Longitude';
	// 		}

	// 		row += index + ',';
	// 	}
	// 	row = row.slice(0, -1);
	// 	//new line
	// 	csv += row + '\r\n';
	// }

	//Traffic data extraction
	// if ($('#order').val() == 'asc') {
	// 	for (var i = arr_data_devices.length - 1; i >= 0; i--) {
	// 		var row = "";
	// 		for (var index in arr_data_devices[i]) {
	// 			if (index == 'LastUpdated' || index == 'CreationDate' || index == 'DeletionDate') {
	// 				if (arr_data_devices[i][index] != 'null' && arr_data_devices[i][index] != null && arr_data_devices[i][index] != undefined && arr_data_devices[i][index] != '') {
	// 					row += '"' + getFormattedDate(arr_data_devices[i][index], "Y-m-d H:m:s", "d-m-y H:m:s") + '",';
	// 				} else {
	// 					row += '"' + arr_data_devices[i][index] + '",';
	// 				}

	// 			} else {
	// 				row += '"' + arr_data_devices[i][index] + '",';
	// 			}
	// 		}
	// 		row.slice(0, row.length - 1);
	// 		//add a line break after each row
	// 		csv += row + '\r\n';
	// 	}
	// }
	// else {
	// 	for (var i = 0; i < arr_data_devices.length; i++) {
	// 		var row = "";
	// 		for (var index in arr_data_devices[i]) {
	// 			if (index == 'LastUpdated' || index == 'CreationDate' || index == 'DeletionDate') {
	// 				if (arr_data_devices[i][index] != 'null' && arr_data_devices[i][index] != null && arr_data_devices[i][index] != undefined && arr_data_devices[i][index] != '') {
	// 					row += '"' + getFormattedDate(arr_data_devices[i][index], "Y-m-d H:m:s", "d-m-y H:m:s") + '",';
	// 				} else {
	// 					row += '"' + arr_data_devices[i][index] + '",';
	// 				}

	// 			} else {
	// 				row += '"' + arr_data_devices[i][index] + '",';
	// 			}
	// 		}
	// 		row.slice(0, row.length - 1);
	// 		//add a line break after each row
	// 		csv += row + '\r\n';
	// 	}
	// }

	//Title of the csv file, utilize it if needed 
	csv += '\r\n\n' + title + '\r\n\n';
	// csv += '\r' + ' (' + fromDate + ' - ' + toDate + ')';
	// csv += '\r\n\nFilters Applied - ';
	// csv += '\r\nSCN - ' + scn + '\n';
	// csv += '\rOrdered by - ' + orderBy + '\r\n\n';

	// column labels extraction
	if (label) {
		var row = "";
		for (var index in arr_data[0]) {
			if(index.indexOf('_PCU') == -1)
				row += index + ',';
		}
		row += 'PCU,';
		row = row.slice(0, -1);
		//new line
		csv += row + '\r\n';
	}

	
	for (var i = 0; i < arr_data.length; i++) {
		var row = "";
		arr_data[i]['PCU']=0;
		for (var index in arr_data[i]) {
			if(index.indexOf('_PCU') != -1)
				arr_data[i]['PCU'] += parseFloat(arr_data[i][index]);
			else{
				if (index == 'TimeStamp') {
					row += '"' + getFormattedDate(arr_data[i][index], "Y-m-d H:m:s", "d-m-y H:m:s") + '",';
				} else {
					row += '"' + arr_data[i][index] + '",';
				}
			}
			
		}
		row.slice(0, row.length - 1);
		//add a line break after each row
		csv += row + '\r\n';
	}

	// csv += '\r\n\n' + footer + ' by ' + username + '\r\n\n';

	if (csv == '') {
		$.alert({
			type: 'red',
			title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
			content: '<div class="fw-bold">No data found</div>'
		});

		return;
	}

	// file name declaration change accordingly
	var file_name = "detector_summary_report_" + fromDate + "_" + toDate + "_" + timerange;
	var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
	var link = document.createElement("a");
	link.href = uri;
	link.style = "visibility:hidden";
	link.download = file_name + ".csv";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
