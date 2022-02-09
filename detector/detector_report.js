var flag=0;
$(document).ready(function () {
	setStartAndEndDate('#start_date', '#end_date', 7,true);
	// $('#from').val(getFormattedDate(dates[0],'Y-m-d H:m:s','d/m/y H:m:s'));
	// $('#to').val(getFormattedDate(dates[1],'Y-m-d H:m:s','d/m/y H:m:s'));
	var zones_input = [];
	var zones_input_zone = [];
	var detector_types_arr = [];
	var class_head_arr = [];
	var device_zones_arr = [];
	var devices_arr = [];
	var make_modal_arr = [];
	// var dates = getCurrentStartNEndDate();
	// $('#start_date').val(getFormattedDate(dates[0], 'Y-m-d H:m:s', 'd-m-y H:m:s'));
	// $('#end_date').val(getFormattedDate(dates[1], 'Y-m-d H:m:s', 'd-m-y H:m:s'));

	// getFormattedDate($('#start_date').val(), 'd-m-y', 'Y-m-d')+' 00:00:00';
 //    getFormattedDate($('#end_date').val(), 'd-m-y', 'Y-m-d')+' 23:59:59';

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
				console.log("true");
				if(flag==0){						
						get_default_module('detector').then((data)=>{
							$('#device_type option[value="'+data.default_device_type+'"]').attr('selected',true);
							device_type_select.destroy();
							device_type_select = new SlimSelect({
								select: '#device_type',
								placeholder: 'Select type'
							  })
							  $('#device_type').change();

							  $('#make_model option[value="'+data.default_make_model+'"]').attr('selected',true);
							//   make_model_select.destroy();
							//   var make_model_select = new SlimSelect({
							// 	  select: '#make_model',
							// 	  placeholder: 'Select type'
							// 	})
								$('#make_model').change();
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
		else{
			console.log('error')
		}
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
				devicetable_tbody = '';
				for (var i = 0; i < detector_types_arr.length; i++) {
					devicetable_tbody += '<option value="' + detector_types_arr[i].TypeID + '">' + detector_types_arr[i].TypeDescription + '</option>';
				}
				$('#device_type').html(devicetable_tbody);
				$('#device_type').trigger('change')
			}
		}
	});
	$('#device_type').on('change',function(){
		var type = $(this).val();
		// alert($(this).val());return;
		if($(this).val()=='4'&&$('#report_type').val()=='vbv'){
			$('.atcc_filter_content').show();
			$('.drection_lbl').hide();
			$('.drection_col').hide();
			$('.error_lbl').hide();
			$('.error_col').hide();
			//getDeviceScns($(this).val());
			//populateMakeModel();
		}else if($('#report_type').val()=='classified'){
			$('.atcc_filter_content').hide();
			//populateMakeModel();
		}else{
			$('.atcc_filter_content').hide();
			//getDeviceScns($(this).val());
			//populateMakeModel();			
		}
		var scns = devices_arr.devices_types[type];
		// console.log(scns);
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
			devicetable_tbody = '<option value="all" selected>All devices</option>';
			for (var i = 0; i < scns.length; i++) {
				scn_zone[i]=scns[i].SystemCodeNumber;
				devicetable_tbody += '<option value="' + scns[i].SystemCodeNumber + '">' + scns[i].Place + ' - ' + scns[i].ShortDescription + '</option>';
			}
			$('#devicetable_tbody').html(devicetable_tbody);
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
			$('#devicetable_tbody').html('');
			$('#zones_select').html('');
			$('#vehicle_class').html('');
		}
		
	})
	
	$('#devicetable_tbody').on('change',function(){
		var selectedscn = $('#devicetable_tbody').val();
		var selectzones = '<option value="all" selected>All</option>';
		if(selectedscn == null){
			$('#devicetable_tbody > option').each(function() {
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
				$('#devicetable_tbody > option').each(function() {
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
	$('#report_type').on('change',function(){
		if($(this).val()=='vbv'&&$('#device_type').val()=='4')
		{
			$('.vbv_filter_content').show();
			$('.atcc_filter_content').show();
			$('.drection_lbl').hide();
			$('.drection_col').hide();
			$('.error_lbl').hide();
			$('.error_col').hide();
			$('.classified_data_content').hide();
			//populateMakeModel();
		}else if($(this).val()=='vbv'){
			$('.vbv_filter_content').show();
			$('.classified_data_content').hide();
			$('.non-vbv').hide();
			//populateMakeModel();
		}else if($(this).val()=='aggregate'){
			$('.vbv_filter_content').hide();
			$('.atcc_filter_content').hide();
			$('.classified_data_content').hide();
			$('.non-vbv').show();
			//populateMakeModel();
		}else{
			$('.vbv_filter_content').show();
			$('.atcc_filter_content').hide();
			$('.classified_data_content').show();
			$('.non-vbv').show();
			//populateMakeModel();
		}
		$('#device_type').trigger('change')
	})
	/*$.ajax({
		url: '../../../models/detector/get_detector_types.hh',
		success: function (result) {
			var scns = JSON.parse(result);
			if (result.length < 2) {
				$.alert({
					type: 'red',
					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">No detector type added</div>'
				});
				$('#device_type').empty();
			}
			else {
				
				devicetable_tbody = '';
				for (var i = 0; i < scns.length; i++) {
					devicetable_tbody += '<option value="' + scns[i].TypeID + '">' + scns[i].TypeDescription + '</option>';
				}

				$('#device_type').html(devicetable_tbody);
				$('#device_type').trigger('change')
			}
		}
	});*/
	/*function getDeviceScns(type)
	{
		var make_model = $('#make_model').val();
		var report_type = $('#report_type').val();
		$.ajax({
			url: '../../../models/detector/detector_devices.hh',
			data:{type:type,make_model:make_model,report_type:report_type},
			success: function (result) {
				if (result.length == 2) {
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">No detector device added</div>'
					});
					$('#devicetable_tbody').empty();
				}
				else {
					var scn_zone = [];
					var scns = JSON.parse(result);
					devicetable_tbody = '<option value="all" selected>All devices</option>';
					for (var i = 0; i < scns.length; i++) {
						scn_zone[i]=scns[i].SystemCodeNumber;
						devicetable_tbody += '<option value="' + scns[i].SystemCodeNumber + '">' + scns[i].Place + ' - ' + scns[i].ShortDescription + '</option>';
					}
					$('#devicetable_tbody').html(devicetable_tbody);
					$('#zones_select').empty();
					$.ajax({
						url: '../../../models/detector/detector_devices_zones.hh',
						data:{scn_zone:scn_zone,type:type},
						success: function (result_zone) {
							result_zone = JSON.parse(result_zone);	
							var selectzones = '<option value="all" selected>All</option>';				
							for(var z=0;z<scn_zone.length;z++){								
								zones_input[scn_zone[z]] = [];
								//console.log(zones_input);
								for(var m=0;m<result_zone.length;m++){
									if(result_zone[m].SystemCodeNumber == scn_zone[z]){
										//console.log(result_zone[m].SystemCodeNumber)
										if(zones_input[result_zone[m].SystemCodeNumber] == undefined){
											var clen = 0;
										}else{
											var clen = zones_input[result_zone[m].SystemCodeNumber].length;
										}
											
										zones_input[result_zone[m].SystemCodeNumber][clen] = [];	
										//var zonecoun = [];							
										zones_input[result_zone[m].SystemCodeNumber][clen]['ZoneSCN'] = result_zone[m].ZoneSCN;
										zones_input[result_zone[m].SystemCodeNumber][clen]['ZoneName'] = result_zone[m].ZoneName;
										//zones_input[result_zone[m].SystemCodeNumber][clen].push(zonecoun);
										//console.log(zones_input)	
									}									
								}
								
								if(zones_input[scn_zone[z]].length > 0){
									for(var mz=0;mz<zones_input[scn_zone[z]].length;mz++){
										selectzones += '<option value="'+zones_input[scn_zone[z]][mz]['ZoneSCN']+'">'+zones_input[scn_zone[z]][mz]['ZoneName']+'</option>';
										//$('#zones').append('<option value="'+zones_input[scn_zone[z]][mz]['ZoneSCN']+'">'+zones_input[scn_zone[z]][mz]['ZoneSCN']+'</option>');
									}
									
								}
							}

							//console.log(selectzones);
							$('#zones_select').html(selectzones);
							//$('#report_type').change();
						}
					});
				}
			}
		});
		$.ajax({
			url: '../../../models/detector/get_detector_class_head.hh',
			method: 'GET',
			data:{makeid:make_model},
			success: function (class_heads) {
				var class_heads = jQuery.parseJSON(class_heads);
				var vehicle_class = '<option value="all" selected>All</option>';
				for(var c=0;c<class_heads.length;c++){
                    vehicle_class += '<option value="'+class_heads[c].binName+'">'+class_heads[c].binName+'</option>';
                }
                $('#vehicle_class').html(vehicle_class);
			}
		});
	}
	$('#device_type').on('change',function(){
		if($(this).val()=='4'&&$('#report_type').val()=='vbv')
		{
			$('.atcc_filter_content').show();
			$('.drection_lbl').hide();
			$('.drection_col').hide();
			$('.error_lbl').hide();
			$('.error_col').hide();
		getDeviceScns($(this).val());
		populateMakeModel();
		}else if($('#report_type').val()=='classified'){
			$('.atcc_filter_content').hide();
			populateMakeModel();
		}else{
			$('.atcc_filter_content').hide();
			populateMakeModel();
		getDeviceScns($(this).val());
		}
	});
	$('#devicetable_tbody').on('change',function(){
		var selectedscn = $('#devicetable_tbody').val();
		//console.log(selectedscn);
		var selectzones = '<option value="all" selected>All</option>';
		if(selectedscn != null){
			if(selectedscn.includes("all")){
				$('#devicetable_tbody > option').each(function() {
					var scnn= $(this).val();
					if(scnn != 'all'){
						for(var z=0;z<zones_input[scnn].length;z++){
							selectzones += '<option value="'+zones_input[scnn][z]['ZoneSCN']+'">'+zones_input[scnn][z]['ZoneName']+'</option>';
						}	
					}
									
				});
			}else{
				for(var j=0;j<selectedscn.length;j++){
					var scnn= selectedscn[j];
					for(var z=0;z<zones_input[scnn].length;z++){
						selectzones += '<option value="'+zones_input[scnn][z]['ZoneSCN']+'">'+zones_input[scnn][z]['ZoneName']+'</option>';
					}	
				}
			}
		}else{
			$('#devicetable_tbody > option').each(function() {
				var scnn= $(this).val();
				if(scnn != 'all'){
					for(var z=0;z<zones_input[scnn].length;z++){
						selectzones += '<option value="'+zones_input[scnn][z]['ZoneSCN']+'">'+zones_input[scnn][z]['ZoneName']+'</option>';
					}	
				}
								
			});
		}
		//console.log(selectzones);
		$('#zones_select').html(selectzones);
		
	})
	$('#make_model').on('change',function(){
		getDeviceScns($('#device_type').val());
	})

	function populateMakeModel(){
		var device_type = $('#device_type').val();
		$.ajax({
			url: '../../../models/detector/get_detector_make_model.hh',
			method: 'POST',
			data: { type: device_type },
			success: function (res) {
				res = JSON.parse(res);
				$('#make_model').empty();
				for (var i = 0; i < res.length; i++) {
					$('#make_model').append('<option value="' + res[i].ID + '">' + res[i].Make +' - '+ res[i].Model + '</option>')
				}
				if(res.length>0)
					getDeviceScns($('#device_type').val());
				else{
					$('#devicetable_tbody').empty();
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">No detector Make and Model added</div>'
					});
				}
	
			}
		})
	}*/


});


function disableInput () {

	var param = document.getElementById("createdBy").options[document.getElementById("createdBy").selectedIndex].text;

	if (param == "Manual") {
		document.getElementById("username").removeAttribute("disabled");
	} else {
		document.getElementById("username").setAttribute("disabled", true);
	}

}


$(document).ready(function () {
	$('input[name=selectallcb]').click(function () {
		if ($(this).prop("checked") == false) {
			$('.devicetable_tbody td').each(function () {
				$(this).removeClass('active')
				$('input[name=scncb]', this).prop('checked', false)
			})
			return;
		}
		$('.devicetable_tbody td').each(function () {
			$(this).addClass('active')
			$('input[name=scncb]', this).prop('checked', true)
		})
	})

	get_dt = function () {
		var fromDate = sanitize(getFormattedDate($('#start_date').val(),  'd-m-y H:m:s', 'Y-m-d H:m:s'));
		var toDate = sanitize(getFormattedDate($('#end_date').val(),  'd-m-y H:m:s', 'Y-m-d H:m:s'));
		if ($('#devicetable_tbody').val() == '' || $('#devicetable_tbody').val() == null) {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select Devices</div>'
			});
			return;
		}
		var scn = $('#devicetable_tbody').val();
		var device_type = sanitize($("#device_type :selected").val());
		var report_type = sanitize($("#report_type :selected").val());
		var direction = sanitize($("#direction :selected").val());
		// var lane = sanitize($("#lane :selected").val());
		var error = sanitize($("#error :selected").val());
		var vehicle_class = $("#vehicle_class").val();
		var order_by = sanitize($("#order_by :selected").val());
		var zones_select = $('#zones_select').val();
		var day_type = $('input[name=data_type]:checked').val();
		var aggregation = $('input[name=aggregation]:checked').val();
		if (fromDate > toDate) {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">From Date should be less than To Date</div>'
			});
			return;
		}
		if(report_type=='vbv')
		{
			if (vehicle_class == null || vehicle_class == '') {
				$.alert({
					type: 'red',
					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">Please select vehicle class</div>'
				});
				return;
			}
			$('#dataTable').dataTable().fnDestroy();
			$('#dataTable').hide();
			$('#dataTable3').dataTable().fnDestroy();
			$('#dataTable3').hide();
			$('#dataTable2').show();
			$('#dataTable2').DataTable({
				"processing": true,
				"serverSide": true,
				"searching": false,
				"destroy": true,
				"deferRender": true,
				"scrollY": screen_height+"px",
  				"scrollCollapse": true,
				// "columnDefs": [ { orderable: false, targets: [0,2,3,14]}],
				"order": [[4, order_by]],
				"ajax": {
					"url": "../../../models/detector/createreport_detector.hh",
					"type": "POST",
					"data": function (d) {
						d.scn = scn
						_scn = d.scn

						d.fromDate = fromDate
						_fromDate = d.fromDate

						d.toDate = toDate
						_toDate = d.toDate

						d.device_type = device_type
						_device_type = d.device_type

						d.report_type = report_type
						_report_type = d.report_type

						d.direction = direction
						_direction = d.direction

						d.error = error
						_error = d.error

						d.vehicle_class = vehicle_class
						_vehicle_class = d.vehicle_class

						d.order_by = order_by
						_order_by = d.order_by

						d.zone = zones_select
						_zone = d.zone

						d.makeid = $('#make_model').val()
						_makeid = d.makeid
						
						d.day_type = day_type
						_day_type = d.day_type

						d.aggregation = aggregation
						_aggregation = d.aggregation
					}
				},
				"columns": [
					{ "data": "SCN" },
					{ "data": "ShortDescription" },
					// { "data": "TowardsToll", render: renderDirection },
					// { "data": "Lane" },
					// { "data": "ErrorLoop" },
					{ "data": "Speed (km/hr)" },
					// { "data": "VehicleLength"},
					{ "data": "Class"},
					// { "data": "NumberOfAxle"},
					{ "data": "TimeStamp", render: renderDate }
				]
			});
		}else if(report_type=='aggregate')
		{
			$('#dataTable2').dataTable().fnDestroy();
			$('#dataTable2').hide();
			$('#dataTable3').dataTable().fnDestroy();
			$('#dataTable3').hide();
			$('#dataTable').show();
			$.ajax({
		        url: '../../../models/detector/get_detector_class_head.hh',
		        method: 'POST',
		        data:{makeid:$('#make_model').val()},
		        success: function (class_heads) {
		            var class_heads = jQuery.parseJSON(class_heads);
					$('#dataTable').DataTable({
						"processing": true,
						"serverSide": true,
						"searching": false,
						"destroy": true,
						"columnDefs": [ { orderable: false, targets: [6]}],
						"order": [[7, order_by]],
						"ajax": {
							"url": "../../../models/detector/createreport_detector.hh",
							"type": "POST",
							"data": function (d) {
								d.scn = scn
								_scn = d.scn

								d.fromDate = fromDate
								_fromDate = d.fromDate

								d.toDate = toDate
								_toDate = d.toDate

								d.device_type = device_type
								_device_type = d.device_type

								d.report_type = report_type
								_report_type = d.report_type

								d.direction = direction
								_direction = d.direction


								d.error = error
								_error = d.error

								d.vehicle_class = vehicle_class
								_vehicle_class = d.vehicle_class

								d.order_by = order_by
								_order_by = d.order_by

								d.zone = zones_select
								_zone = d.zone

								d.makeid = $('#make_model').val()
								_makeid = d.makeid

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
										if(vehicle_class.includes('all')){
											total += parseFloat(return_data.data[i]['Class'+(class_heads[c].binNumber)+'Count'])*parseFloat(class_heads[c].PCU);
										}else{
											if(vehicle_class.includes(class_heads[c].binName)){
												total += parseFloat(return_data.data[i]['Class'+(class_heads[c].binNumber)+'Count'])*parseFloat(class_heads[c].PCU);
											}
										}
									}
									return_data.data[i]['PCU'] = parseFloat(total).toFixed(2);
			                    }
			                    return return_data.data;
			                }
						},
						"columns": [
							{ "data": "SystemCodeNumber" },
							{ "data": "ShortDescription" },
							{ "data": "TotalFlow" },
							{ "data": "FlowInterval" },
							{ "data": "Speed (km/hr)" },
							{ "data": "Headway" },
							{ "data": "PCU"},
							{ "data": "LastUpdated", render: renderDate }
						]
					});
				}
			});
		}else
		{
			if (vehicle_class == null || vehicle_class == '') {
				$.alert({
					type: 'red',
					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">Please select vehicle class</div>'
				});
				return;
			}
			$('#dataTable2').dataTable().fnDestroy();
			$('#dataTable2').hide();
			$('#dataTable').dataTable().fnDestroy();
			$('#dataTable').hide();
			$('#dataTable3').show();
			$('#dataTable3').dataTable().fnDestroy();
			$('#dataTable3').DataTable({
				"searching": false
			});
			$('#dataTable3').DataTable().clear();
			$('#dataTable3').DataTable().destroy();
			var disable_col = [];
			var diablstart = 0;
			var diablend = 0;
			$.ajax({
		        url: '../../../models/detector/get_detector_class_head.hh',
		        method: 'POST',
		        data:{makeid:$('#make_model').val()},
		        success: function (class_heads) {
		            var class_heads = jQuery.parseJSON(class_heads);
		            var dt2_head = '<th>SCN</th>';
            		dt2_head += '<th>Name</th>';
		            dt2_head += '<th>Total flow</th>';
		            dt2_head += '<th>Flow Interval (min)</th>';
					dt2_head += '<th>Speed (km/hr)</th>';
		            dt2_head += '<th>Headway (s)</th>';
		            var columnsArray = [
		            	{ "data": "SystemCodeNumber" },
						{ "data": "ShortDescription" },
						{ "data": "TotalFlow" },
						{ "data": "FlowInterval" },
						{'data':'Speed (km/hr)'},
						{'data':'Headway'}
		            ];
					
		            for(var c=0;c<class_heads.length;c++){
						if(vehicle_class.includes('all')){
							dt2_head += '<th>'+class_heads[c].binName+'</th>';
							// dt2_head += '<th>'+class_heads[c].binName+' PCU</th>';
							columnsArray.push({'data':'Class'+(class_heads[c].binNumber)+'Count'});
							// columnsArray.push({'data':'Class'+(c)+'Count','parameters':{"pcu":class_heads[c].PCU},"render": function(data, type, row, meta) {var parameters = meta.settings.oInit.columns[meta.col].parameters;return parseFloat(data)*parseFloat(parameters.pcu);}});
						}else{
							if(vehicle_class.includes(class_heads[c].binName)){
								dt2_head += '<th>'+class_heads[c].binName+'</th>';
								// dt2_head += '<th>'+class_heads[c].binName+' PCU</th>';
								columnsArray.push({'data':'Class'+(class_heads[c].binNumber)+'Count'});
								// columnsArray.push({'data':'Class'+(c)+'Count','parameters':{"pcu":class_heads[c].PCU},"render": function(data, type, row, meta) {var parameters = meta.settings.oInit.columns[meta.col].parameters;return parseFloat(data)*parseFloat(parameters.pcu);}});
							}
						}
						diablend++;
		            }
		            diablstart = 5;
		            columnsArray.push({'data':'PCU'});		            
		            dt2_head += '<th>PCU</th>';
		            columnsArray.push({'data':'LastUpdated', render: renderDate});		            
		            dt2_head += '<th>Timestamp</th>';
					diablend = columnsArray.length-2;
					for(var d=diablstart+1;d<=diablend;d++){
						disable_col.push(d);
					}
					var selectfield = columnsArray.length-1;
		            $('#dt2_head').html(dt2_head);
					$('#dataTable3').DataTable({
						"processing": true,
						"serverSide": true,
						"searching": false,
						"destroy": true,
						"scrollY": "500px",
                		// "scrollCollapse": true,
						"columnDefs": [ { orderable: false, targets: disable_col}],
						"order": [[selectfield, order_by]],
						"ajax": {
							"url": "../../../models/detector/createreport_detector.hh",
							"type": "POST",
							"data": function (d) {
								d.scn = scn
								_scn = d.scn

								d.fromDate = fromDate
								_fromDate = d.fromDate

								d.toDate = toDate
								_toDate = d.toDate

								d.device_type = device_type
								_device_type = d.device_type

								d.report_type = report_type
								_report_type = d.report_type

								d.direction = direction
								_direction = d.direction

								d.error = error
								_error = d.error

								d.vehicle_class = vehicle_class
								_vehicle_class = d.vehicle_class

								d.order_by = order_by
								_order_by = d.order_by

								d.makeid = $('#make_model').val()
								_makeid = d.makeid

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
										if(vehicle_class.includes('all')){
											total += parseFloat(return_data.data[i]['Class'+(class_heads[c].binNumber)+'Count'])*parseFloat(class_heads[c].PCU);
										}else{
											if(vehicle_class.includes(class_heads[c].binName)){
												total += parseFloat(return_data.data[i]['Class'+(class_heads[c].binNumber)+'Count'])*parseFloat(class_heads[c].PCU);
											}
										}
									}
									return_data.data[i]['PCU'] = parseFloat(total).toFixed(2);
			                    }
			                    return return_data.data;
			                }
						},
						"columns": columnsArray
					});
				}
			});
		}
		
		function renderDate (data, type, full, meta) {
			return data == null ? '--' : getFormattedDate(data, 'Y-m-d H:m:s', 'd-m-y H:m:s');
		}

		function renderDirection (data, type, full, meta) {
			return data == 1 ? 'TowardsToll' : 'FromToll';
		}

	}

	$("#createReport").click(function () {
		get_dt()
	});
	// create_reportOnLoad();
});


$(document).ready(function () {
	download_report = function () {

		var downloadPermission = false;

		$.ajax({
			url: '../../../models/utils/get_roles.hh',
			method: 'POST',
			success: function (result) {
				var id_set = jQuery.parseJSON(result);
				downloadPermission = true;

				if (downloadPermission) {

					var fromDate = sanitize(getFormattedDate($('#start_date').val(),  'd-m-y H:m:s', 'Y-m-d H:m:s'));
					var toDate = sanitize(getFormattedDate($('#end_date').val(),  'd-m-y H:m:s', 'Y-m-d H:m:s'));
					if ($('#devicetable_tbody').val() == '' || $('#devicetable_tbody').val() == null) {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Please select Devices</div>'
						});
						return;
					}
					var scn = $('#devicetable_tbody').val();
					var device_type = sanitize($("#device_type :selected").val());
					var report_type = sanitize($("#report_type :selected").val());
					var direction = sanitize($("#direction :selected").val());
					// var lane = sanitize($("#lane :selected").val());
					var error = sanitize($("#error :selected").val());
					var vehicle_class = $("#vehicle_class").val();
					var order_by = sanitize($("#order_by :selected").val());
					var zones_select = $('#zones_select').val();
					var day_type = $('input[name=data_type]:checked').val();
					var report_device_status = $('input[name=report_device_status]:checked').val();
					var aggregation = $('input[name=aggregation]:checked').val();
					if (fromDate > toDate) {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">From Date should be less than To Date</div>'
						});
						return;
					}
					var username = 'All'//$('#username').val();

					$.ajax({
						url: '../../../models/detector/createreport_detector.hh',
						method: 'POST',
						data: { fromDate: fromDate, toDate: toDate, scn: scn, device_type:device_type,report_type:report_type,direction:direction,error:error,vehicle_class:vehicle_class,order_by:order_by,zone:zones_select,makeid:$('#make_model').val(),day_type:day_type,aggregation:aggregation },
						type: 'POST',
						success: function (result) {
							if (JSON.parse(result).data.length == undefined||JSON.parse(result).data.length == 0) {
								$.alert({
									type: 'red',
									title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
									content: '<div class="fw-bold">No data found</div>'
								});
							}
							else {
								$.ajax({
									url: '../../../models/detector/detector_devices.hh',
									method: 'POST',
									success: function (result_devices) {
										$.ajax({
											url: '../../../models/utils/get_username.hh',
											method: 'POST',
											success: function (result_username) {
												var username = JSON.parse(result_username).user.trim();
												var currentdate = new Date();
												var ts = "Downloaded at: " + currentdate.getDate() + "/"
													+ (currentdate.getMonth() + 1) + "/"
													+ currentdate.getFullYear() + " @ "
													+ currentdate.getHours() + ":"
													+ currentdate.getMinutes() + ":"
													+ currentdate.getSeconds();
													if($('#report_type').val()=='classified')
													{
														$.ajax({
													        url: '../../../models/detector/get_detector_class_head.hh',
													        method: 'POST',
													        data:{makeid:$('#make_model').val()},
													        success: function (class_heads) {
													            var class_heads = jQuery.parseJSON(class_heads);
													            var dynamicheaders = ['SCN','Name','Total flow','Flow Interval','Speed (km/hr)','Headway'];
													            var dynamicheaders_cust = ['SystemCodeNumber','ShortDescription','TotalFlow','FlowInterval','Speed (km/hr)','Headway'];
													           	var pcu_columns = [];
																for(var c=0;c<class_heads.length;c++){
																	if(vehicle_class.includes('all')){
																		dynamicheaders.push(class_heads[c].binName);
																		dynamicheaders_cust.push('Class'+class_heads[c].binNumber+'Count');
																		pcu_columns.push({class_name:'Class'+class_heads[c].binNumber+'Count',pcu:class_heads[c].PCU});
																	}else{
																		if(vehicle_class.includes(class_heads[c].binName)){
																			dynamicheaders.push(class_heads[c].binName);
																			dynamicheaders_cust.push('Class'+class_heads[c].binNumber+'Count');
																			pcu_columns.push({class_name:'Class'+class_heads[c].binNumber+'Count',pcu:class_heads[c].PCU});
																		}
																	}
																   
																}
													            dynamicheaders.push('PCU');
													            dynamicheaders.push('LastUpdated');
													            dynamicheaders_cust.push('PCU');
													            dynamicheaders_cust.push('LastUpdated');
																json_to_csv(report_device_status,result, "Detector Report", true, fromDate, toDate, result_devices, username, ts, dynamicheaders,dynamicheaders_cust,pcu_columns);
													        }
													    });
													}else if($('#report_type').val()=='aggregate')
													{
														$.ajax({
													        url: '../../../models/detector/get_detector_class_head.hh',
													        method: 'POST',
													        data:{makeid:$('#make_model').val()},
													        success: function (class_heads) {
													            var class_heads = jQuery.parseJSON(class_heads);
													            var dynamicheaders = ['SCN','Name','Total flow','Flow Interval','Speed (km/hr)','Headway'];
													            var dynamicheaders_cust = ['SystemCodeNumber','ShortDescription','TotalFlow','FlowInterval','Speed (km/hr)','Headway'];
													           	var pcu_columns = [];
																for(var c=0;c<class_heads.length;c++){
																	if(vehicle_class.includes('all')){
																		dynamicheaders_cust.push('Class'+class_heads[c].binNumber+'Count');
																		pcu_columns.push({class_name:'Class'+class_heads[c].binNumber+'Count',pcu:class_heads[c].PCU});
																	}else{
																		if(vehicle_class.includes(class_heads[c].binName)){
																			dynamicheaders_cust.push('Class'+class_heads[c].binNumber+'Count');
																			pcu_columns.push({class_name:'Class'+class_heads[c].binNumber+'Count',pcu:class_heads[c].PCU});
																		}
																	}
																   
																}
													            dynamicheaders.push('PCU');
													            dynamicheaders.push('LastUpdated');
													            dynamicheaders_cust.push('PCU');
													            dynamicheaders_cust.push('LastUpdated');
																json_to_csv(report_device_status,result, "Detector Report", true, fromDate, toDate, result_devices, username, ts, dynamicheaders,dynamicheaders_cust,pcu_columns);
													        }
													    });
													}else
														json_to_csv(report_device_status,result, "Detector Report", true, fromDate, toDate, result_devices, username, ts);
											}
										});
									}
								});

							}
						}
					});
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
			method: 'POST',
			success: function (result) {
				var id_set = jQuery.parseJSON(result);
				/*for(i=0; i<id_set.length;i++){
					if((id_set[i].role.indexOf("Manager") > -1) || (id_set[i].role.indexOf("Admin") > -1)){
						downloadPermission = true;
					}
						
				}*/
				downloadPermission = true;

				if (downloadPermission) {
					var fromDate = sanitize(getFormattedDate($('#start_date').val(),  'd-m-y H:m:s', 'Y-m-d H:m:s'));
					var toDate = sanitize(getFormattedDate($('#end_date').val(),  'd-m-y H:m:s', 'Y-m-d H:m:s'));
					if ($('#devicetable_tbody').val() == '' || $('#devicetable_tbody').val() == null) {
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Please select Devices</div>'
						});
						return;
					}
					var scn = $('#devicetable_tbody').val();
					//console.log(scn)
					var device_type = sanitize($("#device_type :selected").val());
					var report_type = sanitize($("#report_type :selected").val());
					var direction = sanitize($("#direction :selected").val());
					// var lane = sanitize($("#lane :selected").val());
					var error = sanitize($("#error :selected").val());
					var vehicle_class = $("#vehicle_class").val();
					var order_by = sanitize($("#order_by :selected").val());
					var zones_select = $('#zones_select').val();
					var day_type = $('input[name=data_type]:checked').val();
					var aggregation = $('input[name=aggregation]:checked').val();
					var report_device_status = $('input[name=report_device_status]:checked').val();

					var from_text = $("#start_date").val();
					var to_text = $("#end_date").val();
					var device_type_text = $("#device_type :selected").text();
					var make_model_text = $("#make_model :selected").text();
					var devices_text = $('#devicetable_tbody :selected').toArray().map(item => item.text).join();
					var report_type_text = $("#report_type :selected").text();
					var vehicle_class_text = $('#vehicle_class :selected').toArray().map(item => item.text).join();
					var zones_select_text = $('#zones_select :selected').toArray().map(item => item.text).join();
					var order_by_text = $('#order_by :selected').toArray().map(item => item.text).join();
					var data_type_text = day_type.substring(0,1).toUpperCase() + day_type.substring(1,day_type.length)
					var aggregation_text = aggregation.substring(0,1).toUpperCase() + aggregation.substring(1,aggregation.length)

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
					}else{
						$.ajax({
							url: '../../../models/detector/createreport_detector.hh',
							data: { fromDate: fromDate, toDate: toDate, scn: scn, device_type:device_type,report_type:report_type,direction:direction,error:error,vehicle_class:vehicle_class,order_by:order_by,zone:zones_select,makeid:$('#make_model').val(),day_type:day_type,aggregation:aggregation },
							type: 'POST',
							success: function (result) {
								if (JSON.parse(result).data.length == undefined||JSON.parse(result).data.length == 0) {
									$.alert({
										type: 'red',
										title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
										content: '<div class="fw-bold">No data found</div>'
									});
								}else{
									$.ajax({
										url: '../../../models/utils/get_username.hh',
										method: 'POST',
										success: function (result_username) {
											var username = JSON.parse(result_username).user;
											window.open("../../../models/detector/createreport_detector_pdf.hh?fromDate=" + fromDate + "&toDate=" + toDate + "&scn=" + scn + "&device_type="+device_type+"&report_type="+report_type+"&direction="+direction+"&error="+error+"&vehicle_class="+vehicle_class+"&order_by="+order_by+"&username=" + username+'&zone='+zones_select+'&makeid='+$('#make_model').val()+'&day_type='+day_type+'&device_type_text='+device_type_text+'&make_model_text='+make_model_text+'&devices_text='+devices_text+'&report_type_text='+report_type_text+'&vehicle_class_text='+vehicle_class_text+'&zones_select_text='+zones_select_text+'&order_by_text='+order_by_text+'&data_type_text='+data_type_text+"&from_text="+from_text+"&to_text="+to_text+"&aggregation="+aggregation+'&aggregation_text='+aggregation_text+'&report_device_status='+report_device_status, '_blank');
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


function json_to_csv (report_device_status,json_data, title, label, fromDate, toDate, json_data_devices, username, timestamp, dynamicheaders=[],dynamicheaders_cust=[],pcu_columns) {
	//Json  Parser
	var arr_data = JSON.parse(json_data).data;
	var status_data = JSON.parse(json_data).status;
	var arr_data_devices = JSON.parse(json_data_devices);
	var csv = '';
	if(report_device_status=='On')
		csv = renderDeviceStatus(csv,status_data);

	//Title of the csv file, utilize it if needed 
	csv += '\r\n\n' + title + '\r\n\n';
	if($('#report_type').val()=='classified')
	{
		var row = "";
		for(var i=0;i<dynamicheaders.length;i++)
		{
			row += dynamicheaders[i] + ',';

		}
		row = row.slice(0, -1);
		//new line
		csv += row + '\r\n';
		//Traffic data extraction
		for (var i = 0; i < arr_data.length; i++) {
			var row = "";
			arr_data[i].PCU = 0;
			for (var j=0;j<dynamicheaders_cust.length;j++) {
				var index = dynamicheaders_cust[j];
				var pcu_index = pcu_columns.findIndex(x => x.class_name == index);
				if(pcu_index>=0)
				{
					arr_data[i].PCU += parseFloat(arr_data[i][index])*parseFloat(pcu_columns[pcu_index].pcu);
				}
				if(index == 'LastUpdated' || index == 'TimeStamp'){
					if(arr_data[i][index] != 'null' && arr_data[i][index] != null && arr_data[i][index] != undefined && arr_data[i][index] != ''){
						row += '"' + getFormattedDate(arr_data[i][index],"Y-m-d H:m:s","d-m-y H:m:s") + '",';	
					}else{
						row += '"' + arr_data[i][index] + '",';
					}				
				}else{
					row += '"' + arr_data[i][index] + '",';
				}
			}
			row.slice(0, row.length - 1);
			//add a line break after each row
			csv += row + '\r\n';
		}
	}else if($('#report_type').val()=='aggregate')
	{
		var row = "";
		for(var i=0;i<dynamicheaders.length;i++)
		{
			row += dynamicheaders[i] + ',';

		}
		row = row.slice(0, -1);
		//new line
		csv += row + '\r\n';
		//Traffic data extraction
		for (var i = 0; i < arr_data.length; i++) {
			var row = "";
			arr_data[i].PCU = 0;
			for (var j=0;j<dynamicheaders_cust.length;j++) {
				var index = dynamicheaders_cust[j];
				var pcu_index = pcu_columns.findIndex(x => x.class_name == index);
				if(pcu_index>=0)
				{
					arr_data[i].PCU += (parseFloat(arr_data[i][index])*parseFloat(pcu_columns[pcu_index].pcu)).toFixed(2);
				}else{
					if(index == 'LastUpdated' || index == 'TimeStamp'){
						if(arr_data[i][index] != 'null' && arr_data[i][index] != null && arr_data[i][index] != undefined && arr_data[i][index] != ''){
							row += '"' + getFormattedDate(arr_data[i][index],"Y-m-d H:m:s","d-m-y H:m:s") + '",';	
						}else{
							row += '"' + arr_data[i][index] + '",';
						}				
					}else{
						row += '"' + arr_data[i][index] + '",';
					}
				}
					
			}
			row.slice(0, row.length - 1);
			//add a line break after each row
			csv += row + '\r\n';
		}
	}else{
		//column labels extraction
		if (label) {
			var row = "";
			for (var index in arr_data[0]) {
				row += index + ',';
			}
			row = row.slice(0, -1);
			//new line
			csv += row + '\r\n';
		}
		//Traffic data extraction
		for (var i = 0; i < arr_data.length; i++) {
			var row = "";
			var j=0;
			for (var index in arr_data[i]) {
				if(index == 'LastUpdated' || index == 'TimeStamp'){
					if(arr_data[i][index] != 'null' && arr_data[i][index] != null && arr_data[i][index] != undefined && arr_data[i][index] != ''){
						row += '"' + getFormattedDate(arr_data[i][index],"Y-m-d H:m:s","d-m-y H:m:s") + '",';	
					}else{
						row += '"' + arr_data[i][index] + '",';
					}				
				}else{
					row += '"' + arr_data[i][index] + '",';
				}
				j++;
			}
			row.slice(0, row.length - 1);
			//add a line break after each row
			csv += row + '\r\n';
		}
	}
	



	if (csv == '') {
		$.alert({
            type: 'red',
            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
            content: '<div class="fw-bold">No data found</div>'
        });
		return;
	}

	// file name declaration change accordingly
	var file_name = "detector_report_" + fromDate + "_" + toDate;
	var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
	var link = document.createElement("a");
	link.href = uri;
	link.style = "visibility:hidden";
	link.download = file_name + ".csv";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
