situationSCN = "";

$(document).ready(function () {
	setStartAndEndDate('#from', '#to', 7);
	// var dates = getCurrentStartNEndDate();
	// $('#from').val(getFormattedDate(dates[0], 'Y-m-d H:m:s', 'd-m-y H:m:s'));
	// $('#to').val(getFormattedDate(dates[1], 'Y-m-d H:m:s', 'd-m-y H:m:s'));
	getFormattedDate($('#from').val(), 'd-m-y', 'Y-m-d');
    getFormattedDate($('#to').val(), 'd-m-y', 'Y-m-d');
	active_mode = function () {
		$('.situationConfigure').addClass('active')
		$("#situationRoadwork").addClass("nav-active")
		$("#accidents").addClass('active')
	}
	setTimeout(function () {
		active_mode();
	}, 100);


	$.ajax({
		url: '../../../models/utils/get_username.hh',
		type: 'POST',
		success: function (result) {
			result = JSON.parse(result);
			/*if(result.length > 30){
					window.location = "../index.html"
			}*/
			uname = result.user.trim();

			$('.modified').val(uname)
			$('.modified').parent().parent().css('display', 'none')
		}

	});

	var selector = '[data-rangeslider]';
	var $element = $(selector);
	var textContent = ('textContent' in document) ? 'textContent' : 'innerText';

	function valueOutput (element) {
		var value = element.value;
		var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
		output[textContent] = value;
	}

	$(document).on('input', 'input[type="range"], ' + selector, function (e) {
		valueOutput(e.target);
	});

	$element.rangeslider();

	$.ajax({
		url: '../../../models/situation/get_utmc_types.hh',
		method: 'POST',
		// data: {
		//     type: $('#select_type_id').val().toLowerCase()
		// },
		data: {
			type: "roadwork"
		},
		success: function (res) {
			res = jQuery.parseJSON(res);
			$('#accident_type_id').empty();
			for (var i = 0; i < res.length; i++) {
				$('#accident_type_id').append('<option value=' + res[i].accident_type_id + '>' + res[i].accident_type.toUpperCase() + '</option>');
				//$('.up_type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
			}
		}
	});

	// $('#select_type_id').change(function() {
	//        var selected_option = $('#select_type_id').val();
	//        selected_option = selected_option.toLowerCase();
	//        $('.scn').val(selected_option.substring(0, 1).toUpperCase())
	//        ////console.log(selected_option);
	//        if (selected_option != "") {
	// $.ajax({
	//     url: '../../utils/get_utmc_types.hh',
	//     method: 'POST',
	//     data: {
	//         type: "roadwork"
	//     },
	//     success: function(res) {
	//         res = jQuery.parseJSON(res);
	//         $('#accident_type_id').empty();
	//         for (var i = 0; i < res.length; i++) {
	//             $('#accident_type_id').append('<option value=' + res[i].accident_type_id + '>' + res[i].accident_type.toUpperCase() + '</option>');
	//             //$('.up_type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
	//         }
	//     }
	// });
	//     } else {
	//         $('#accident_type_id').empty();
	//     };
	// })


	// $.ajax({
	// 	url:'../../utils/get_accident_actions.hh',
	// 	method:'POST',
	// 	success:function(res){
	// 		res=$.parseJSON(res);
	// 		for(var i=0;i<res.length;i++){
	// 			//$('.type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
	// 			$('#accident_action').append('<option value='+res[i].name+' list="'+res[i].list+'">'+res[i].name+'</option>');
	// 			$('.up_type_id').append('<option value='+res[i].TypeID+' list="'+res[i].list+'">'+res[i].name+'</option>');
	// 		}
	// 	}
	// });


	// $.ajax({
	// 	url:'../../utils/get_accident_actions.hh',
	// 	method:'POST',
	// 	success:function(res){
	// 		res=$.parseJSON(res);
	// 		for(var i=0;i<res.length;i++){
	// 			//$('.type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
	// 			$('.up_type_id').append('<option value='+res[i].TypeID+' list="'+res[i].list+'">'+res[i].name+'</option>');
	// 		}
	// 	}
	// });

	var signallist = {}, signalscns = ''
	var aff_junc_select = '<select class="form-control selectpicker" multiple data-live-search="true" id="aff_junc_select">'
	$.ajax({
		url: '../../../models/traffic_signal/get_all_transport_links.hh',
		method: 'POST',
		success: function (res) {
			res = JSON.parse(res)

			for (var i = 0; i < Object.keys(res).length; i++) {
				if (!signallist.hasOwnProperty(res[i].SignalSCN)) {
					aff_junc_select += '<option value="' + res[i].SignalSCN + '">' + res[i].SignalName + '</option>'
					signallist[res[i].SignalSCN] = res[i].SignalName + '&&'
				}

				signallist[res[i].SignalSCN] = signallist[res[i].SignalSCN] + '<option value="' + res[i].SystemCodeNumber + '">' + res[i].LinkName + '</option>'
			}
			aff_junc_select += '</select>'
		}
	})

	$('.getDt').click(function () {
		$('#dataTable').dataTable().fnDestroy();
		get_dt();
	});
	get_dt = function (pageload='') {
		if(pageload == 'pageload'){
			var from = '';
			var to = '';
		}else{
			// var from = sanitize(getFormattedDate($('#from').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
			// var to = sanitize(getFormattedDate($('#to').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
			var from = sanitize(getFormattedDate($('#from').val(),  'd-m-y', 'Y-m-d')+' 00:00:00');
			var to = sanitize(getFormattedDate($('#to').val(),  'd-m-y', 'Y-m-d')+' 23:59:59');
		}
		$('#dataTable').DataTable({
			"processing": true,
			"serverSide": true,
			"searching": false,
			"scrollY": "500px",
			"scrollCollapse": true,
			"columnDefs": [{ orderable: false, targets: [1, 2, 5, 13,34] }],
			"order": [[1, "desc"]],
			"ajax": {
				"url": "../../../models/situation/getdt_roadwork.hh",
				"type": "POST",
				"data": function (d) {
					d.from = from;
					d.to = to;
				},
				'dataSrc': function (res) {
					var check = res;
					var return_data = new Array();
					check = check.data
					for (var i = 0; i < check.length; i++) {
						return_data.push({
							"radio":'<input type="radio" name="acc_record"></td>',
							"SystemCodeNumber": check[i].SystemCodeNumber,
							"ShortDescription": check[i].ShortDescription,
							"LongDescription": check[i].LongDescription,
							"Northing": check[i].Northing,
							"Easting": check[i].Easting,
							"AccidentType": check[i].AccidentType,
							"CreationDate": check[i].CreationDate,
							"Severity": check[i].Severity,
							"AccidentTime": check[i].AccidentTime,
							"LastUpdated": check[i].LastUpdated,
							"EndDate": (check[i].EndDate == null ? "" : check[i].EndDate),
							"ReportedBy": check[i].ReportedBy,
							"CreatedBy": check[i].CreatedBy,
							"ModifiedBy": check[i].ModifiedBy,
							"view": '<span class="viewdetails" scn="' + check[i].SystemCodeNumber + '" sdesc="' + check[i].ShortDescription + '" ldesc="' + check[i].LongDescription + '" nor="' + check[i].Northing + '" eas="' + check[i].Easting + '" stype="' + check[i].AccidentType + '"  stime="' + check[i].AccidentTime + '" etime="' + check[i].EndDate + '" sev="' + check[i].Severity + '" rby="' + check[i].ReportedBy + '" mby="' + check[i].ModifiedBy + '">View/Edit Details</span>',
							"ComplianceTime": check[i].ComplianceTime,
							"RemedialTime": check[i].RemedialTime,
							"Status": check[i].Status,
							"DetailedReason": check[i].DetailedReason,
							"OtherInformation": check[i].OtherInformation,
							"Question1": check[i].Question1,
							"Question2": check[i].Question2,
							"Question3": check[i].Question3,
							"Remarks": check[i].Remarks,
							"AmountDue": check[i].AmountDue,
							"AmountPaid": check[i].AmountPaid,
							"AmountUnpaid": check[i].AmountUnpaid,
							"DamageRemarks": check[i].DamageRemarks,
							"ImagePath": check[i].ImagePath,
							"HumanImpact": check[i].HumanImpact,
							"HumanFactors": check[i].HumanFactors,
							"InjuryNature": check[i].InjuryNature,
							"PropertyDamage": check[i].PropertyDamage,
							"SocioEconomic": check[i].SocioEconomic,
							"Causes": check[i].Causes,
							// "createmodel": '<span class="situationmodels" scn="' + check[i].SystemCodeNumber + '" sdesc="' + check[i].ShortDescription + '" nor="' + check[i].Northing + '" eas="' + check[i].Easting + '"  stime="' + check[i].AccidentTime + '">Create Model</span> / <span class="downloadmodels" scn="' + check[i].SystemCodeNumber + '">Download Model</span>'
							"createmodel": `<span class="createmodel" scn="${check[i].SystemCodeNumber}" type="accident">Create</span> / <a href="./view_situation_model.html?scn=${check[i].SystemCodeNumber}&type=roadwork" target="_blank">View</a> / <span class="downloadmodel" scn="${check[i].SystemCodeNumber}" type="accident">Download</span>`
						})
					}
					return return_data;
				}
			},
			"columns": [
				{ "data": "radio" },
				{ "data": "SystemCodeNumber", class: "a_scn" },
				{ "data": "ShortDescription", class: "a_sdesc" },
				{ "data": "LongDescription", class: "a_ldesc" },
				{ "data": "Northing", class: "a_nor" },
				{ "data": "Easting", class: "a_eas" },
				{ "data": "AccidentType", class: "a_tid" },
				{ "data": "CreationDate", class: "a_ctime", render: renderDate },
				{ "data": "Severity", class: "a_sev" },
				{ "data": "AccidentTime", class: "a_atime", render: renderDate },
				{ "data": "EndDate", class: "a_etime", render: renderDate },
				{ "data": "ReportedBy", class: "a_rby" },
				{ "data": "CreatedBy", class: "a_cby" },
				{ "data": "ModifiedBy", class: "a_mby" },
				{ "data": "view" },
				{ "data": "ComplianceTime", class: "a_comptime" },
				{ "data": "RemedialTime", class: "a_remtime" },
				{ "data": "Status", class: "a_status" },
				{ "data": "DetailedReason", class: "a_dreason" },
				{ "data": "OtherInformation", class: "a_other" },
				{ "data": "Question1", class: "a_q1" },
				{ "data": "Question2", class: "a_q2" },
				{ "data": "Question3", class: "a_q3" },
				{ "data": "Remarks", class: "a_remark" },
				{ "data": "AmountDue", class: "a_adue" },
				{ "data": "AmountPaid", class: "a_apaid" },
				{ "data": "AmountUnpaid", class: "a_aunpaid" },
				{ "data": "DamageRemarks", class: "a_damageremark" },
				{ "data": "ImagePath", class: "a_imagepath" },
				{ "data": "HumanImpact", class: "a_humanimpact" },
				{ "data": "HumanFactors", class: "a_humanfactors" },
				{ "data": "InjuryNature", class: "a_injurynature" },
				{ "data": "PropertyDamage", class: "a_propertydamage" },
				{ "data": "SocioEconomic", class: "a_socioeconomic" },
				{ "data": "Causes", class: "a_causes" },
				{ "data": "createmodel" }
			],
			"fnDrawCallback": function (oSettings) {
				$('#dataTable tbody tr').each(function () {
					$('td:nth-child(5),td:nth-child(6),td:nth-child(8),td:nth-child(12),td:nth-child(13),td:nth-child(14),td:nth-child(17),td:nth-child(16),td:nth-child(18),td:nth-child(19),td:nth-child(20),td:nth-child(21),td:nth-child(22),td:nth-child(23),td:nth-child(24),td:nth-child(25),td:nth-child(26),td:nth-child(27),td:nth-child(28),td:nth-child(29),td:nth-child(30),td:nth-child(31),td:nth-child(32),td:nth-child(33),td:nth-child(34),td:nth-child(35)', this).css('display', 'none')
				})

				$('.viewdetails').click(function () {
					var ele = $(this).parent().parent();
					//window.open('view_details.html?module=roadwork&id=' + $('.a_scn', ele).html(), "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=" + $(window).width() + ",height=" + $(window).height());
					window.location.href='view_details.html?module=roadwork&id=' + $('.a_scn', ele).html();
				})
				$('.situationmodels').click(function () {
					// var ele = $(this).parent().parent()

					// window.open('view_details.html?module=accident&id='+$('.a_scn',ele).html(), "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width="+$(window).width()+",height="+$(window).height());
					// return;
					$('#create_situation_modal').modal()

					var tbody = '<tr><td>' + $(this).attr('scn') + '</td><td>' + $(this).attr('sdesc') + '</td><td>' + $(this).attr('nor') + ',' + $(this).attr('eas') + '</td><td>' + $(this).attr('stime') + '</td></tr>'
					$('#sitinfo_table tbody').html(tbody)

					$('#aff_junc').html(aff_junc_select)
					$('#aff_app').html('')

					$('#aff_junc_select').selectpicker();

					bind_click()
				})

				$('.createmodel').click(function () {
					
					var scn = $(this).attr('scn'),
						type = $(this).attr('type')
					var url = `${document.location.protocol}//${GLOBAL.SUMO.IP}:${GLOBAL.SUMO.PORT}/run_model/incident/${scn}/type/8/create`;
					console.log(url)
					// window.open(url, '_blank')
					var err=0
					$.ajax({
						url: url,
						method:'GET',
						success:function(res){
							$.alert({
								type: 'green',
								title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
								content: `<div class="fw-bold">Model creation initiated for ${scn}. Please check for updates after ~10 min.</div>`
							});
						},
						error:function(res){
							$.alert({
								type: 'red',
								title: '<h3 class="text-danger fw-bold mb-0">Error</h3>',
								content: `<div class="fw-bold">Please make sure the situation is valid.</div>`
							});
							err=1
						}
					})

					// if(err == 0){
						$.alert({
							type: 'green',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: `<div class="fw-bold">Model creation initiated for ${scn}. Please check for updates after ~10 min.</div>`
						});
					// }

				})

				$('.downloadmodel').click(function () {
					var scn = $(this).attr('scn'),
						type = $(this).attr('type')
					var url = `${document.location.protocol}//${GLOBAL.SUMO.IP}:${GLOBAL.SUMO.PORT}/download/incident/${scn}/model`;
					window.open(url, '_blank')
				})
			}
		});
		function renderDate(data, type, full,meta)
        {
            return data==''||data==null||data==undefined?'--':getFormattedDate(data,'Y-m-d H:m:s','d-m-y H:m:s');
        }

	}

	get_dt('pageload')
	bind_click = function () {
		$('#aff_junc_select').change(function () {
			console.log($(this).val())

			var selVal = $(this).val()
			var selEle = ''
			for (var i = 0; i < selVal.length; i++) {
				// var cur_selected_junc = $(this).val()[0]
				var curele = signallist[selVal[i]].split('&&')

				selEle += '<div class="aff_app_container"><h5>' + curele[0] + '</h5><select class="form-control selectpicker aff_app_select" multiple data-live-search="true">' + curele[1] + '</select></div>'
			}

			$('#aff_app').html(selEle)
			$('.aff_app_select').selectpicker()

			// bind_click()
		});
	}

	$('.situationmodelbtn').click(function () {
		var situation_scn = $('#sitinfo_table tbody tr td:nth-child(1)').html().trim(),
			latitude = $('#sitinfo_table tbody tr td:nth-child(3)').html().trim().split(',')[0],
			longitude = $('#sitinfo_table tbody tr td:nth-child(3)').html().trim().split(',')[1],
			timestamp = $('#sitinfo_table tbody tr td:nth-child(4)').html().trim()

		var linkscns = ''
		$('#aff_app .aff_app_select').each(function (i, obj) {
			console.log($(obj).val())
			if ($(obj).val() != '')
				linkscns += $(obj).val().join() + ','
		})
		linkscns = linkscns.substring(0, linkscns.length - 1)

		$.ajax({
			url: '../../../models/situation/create_incident_model.hh',
			method: 'POST',
			data: {
				situation_scn: situation_scn,
				latitude: latitude,
				longitude: longitude,
				linkscns: linkscns,
				timestamp: timestamp,
			},
			success: function (res) {

			}
		})
	})


	// $.ajax({
	// 	url:'../../utils/get_roadworks.php',
	// 	method:'POST',
	// 	success:function(res){
	// 		res=jQuery.parseJSON(res);

	// 		for (var i = 0; i < res.length; i++) {

	// 			$('.acc_table tbody').append('<tr><td colspan="1"><input type="radio" name="acc_record"></td><td class="a_scn">'+res[i].SystemCodeNumber+'</td><td class="a_sdesc">'+res[i].ShortDescription+'</td><td class="a_ldesc">'+res[i].LongDescription+'</td><td class="a_nor" style="display:none">'+res[i].Northing+'</td><td class="a_eas" style="display:none">'+res[i].Easting+'</td><td class="a_tid">'+res[i].AccidentType+'</td><td class="a_ctime" style="display:none">'+res[i].CreationDate+'</td><td class="a_sev">'+res[i].Severity+'</td><td class="a_atime">'+res[i].AccidentTime+'</td><td class="a_etime">'+(res[i].EndDate == null ? "" : res[i].EndDate)+'</td><td class="a_rby" style="display:none">'+res[i].ReportedBy+'</td><td class="a_cby" style="display:none">'+res[i].CreatedBy+'</td><td class="a_mby" style="display:none;">'+res[i].ModifiedBy+'</td><td><span class="viewdetails">View Details</span></td></tr>')
	// 		}

	// 		$('.viewdetails').click(function(){
	// 			$('#view_modal').modal()
	// 			var ele = $(this).parent().parent()
	// 			$('.v_scn').html($('.a_scn',ele).html())
	// 			$('.v_sdesc').html($('.a_sdesc',ele).html())
	// 			$('.v_ldesc').html($('.a_ldesc',ele).html())
	// 			$('.v_lat').html($('.a_nor',ele).html())
	// 			$('.v_lon').html($('.a_eas',ele).html())
	// 			$('.v_stype').html($('.a_tid',ele).html())
	// 			$('.v_stime').html($('.a_atime',ele).html())
	// 			$('.v_etime').html($('.a_etime',ele).html())
	// 			$('.v_sev').html($('.a_sev',ele).html())
	// 			$('.v_rby').html($('.a_rby',ele).html())
	// 			$('.v_mby').html($('.a_mby',ele).html())
	// 		})

	// 	}
	// })

	$('#add_acc_btn').click(function () {
		
		var plannedStart = sanitize($('.planned_start').val());
		// var plannedEnd = sanitize($('.planned_end').val());
		// if(plannedStart && !plannedEnd){
		// 	$.alert({
        //         type: 'red',
        //         title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
        //         content: '<div class="fw-bold">Planned End Date is Required</div>'
        //     });
		// 	return;
		// }
		if( plannedEnd && !plannedStart){
			$.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Planned Start Date is Required</div>'
            });
			return;
		}
		

		// var actualStart = sanitize($('.actual_start').val());
		// var actualEnd = sanitize($('.actual_end').val());
		
		// if( actualEnd && !actualStart){
		// 	$.alert({
        //         type: 'red',
        //         title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
        //         content: '<div class="fw-bold">Actual Start Date is Required</div>'
        //     });
		// 	return;
		// }


		var myFormData = new FormData();
		// var scn=$('.scn').val(),
		var sdesc = sanitize($('.sdesc').val()),
			ldesc = sanitize($('.ldesc').val()),
			nor = sanitize($('.northing').val()),
			eas = sanitize($('.easting').val()),
			tid = sanitize($('#accident_type_id').val()),
			accDT = sanitize($('.acc_datetime').val()),
			edate = sanitize($('.end_datetime').val()),
			sev = sanitize($('#severity').val()),
			rep = sanitize($('#usernameGet').html()),
			mod = sanitize($('.modified').val());
		// type=$('#select_type_id').val().toLowerCase();
		type = "roadwork"
		action = null;
		var ComplianceTime = sanitize($('.compliance_time').val());
		RemedialTime = sanitize($('.remedial_datetime').val())
		Status = sanitize($('.accident_status').val())
		DetailedReason = sanitize($('.detailed_reason').val())
		OtherInformation = sanitize($('.other_information').val())
		Question1 = sanitize($('input[name=q1]:checked').val())
		Question2 = sanitize($('input[name=q2]:checked').val())
		Question3 = sanitize($('input[name=q3]:checked').val())
		Remarks = sanitize($('.remarks').val())
		AmountDue = sanitize($('.amount_due').val()) == '' ? 0 : sanitize($('.amount_due').val())
		AmountPaid = sanitize($('.amount_paid').val()) == '' ? 0 : sanitize($('.amount_paid').val())
		AmountUnpaid = sanitize($('.amount_unpaid').val()) == '' ? 0 : sanitize($('.amount_unpaid').val())
		DamageRemarks = sanitize($('.damageremarks').val())

		human_impact = sanitize($('.human_impact').val())
		human_factors = sanitize($('.human_factors').val())
		injury_nature = sanitize($('.injury_nature').val())
		property_damage = sanitize($('.property_damage').val())
		socio_economic = sanitize($('.socio_economic').val())
		causes = sanitize($('.causes').val())

		if (sdesc == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter the short description</div>'
			});
			return;
		}
		if (nor == "" || eas == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter the location cordinates</div>'
			});
			return;
		}
		if (accDT == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter the start time</div>'
			});
			return;
		}
		if (sev == "0") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter severity</div>'
			});
			return;
		}
		var currentdate = new Date();
		var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-"
			+ currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
		if (accDT > datetime) {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Start time cannot be a future time for accident situation. Please enter correct time.</div>'
			});
			return;
		}
		if (edate != "" && accDT > edate) {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">End time should be greater than start time</div>'
			});
			return;
		}
		if (rep == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter the \"Reported By\" field</div>'
			});
			return;
		}
		data_entry_list = []
		// for (var i = list_types.length - 1; i >= 0; i--) {
		var data_objects = {};
		////console.log($("#td_list"+i)[0].innerHTML.toString()+$("#check_list"+i).is(":checked"));
		// data_objects['item'] = $("#accident_action option:selected").attr('list');
		data_objects['value'] = "true" //$("#check_list_id"+i).is(":checked");
		data_entry_list.push(data_objects);

		for (var i = 0; i < $('#images').prop('files').length; i++) {
			myFormData.append('imageFiles[]', $('#images').prop('files')[i]);
		}
		myFormData.append('SystemCodeNumber', "acc")
		myFormData.append('ShortDescription', sdesc)
		myFormData.append('LongDescription', ldesc)
		myFormData.append('MainID', type)
		myFormData.append('Northing', nor)
		myFormData.append('Easting', eas)
		myFormData.append('Action', null)
		myFormData.append('TypeID', tid)
		myFormData.append('AccidentTime', accDT)
		myFormData.append('CreatedBy', uname)
		myFormData.append('EndDate', edate)
		myFormData.append('Severity', sev)
		myFormData.append('ReportedBy', rep)
		myFormData.append('isedit', 0)
		myFormData.append('ModifiedBy', mod)
		myFormData.append('CreationDate', datetime)

		myFormData.append('ComplianceTime', ComplianceTime)
		myFormData.append('RemedialTime', RemedialTime)
		myFormData.append('Status', Status)
		myFormData.append('DetailedReason', DetailedReason)
		myFormData.append('OtherInformation', OtherInformation)
		myFormData.append('Question1', Question1)
		myFormData.append('Question2', Question2)
		myFormData.append('Question3', Question3)
		myFormData.append('Remarks', Remarks)
		myFormData.append('AmountDue', AmountDue)
		myFormData.append('AmountPaid', AmountPaid)
		myFormData.append('AmountUnpaid', AmountUnpaid)
		myFormData.append('DamageRemarks', DamageRemarks)

		myFormData.append('human_impact', human_impact)
		myFormData.append('human_factors', human_factors)
		myFormData.append('injury_nature', injury_nature)
		myFormData.append('property_damage', property_damage)
		myFormData.append('socio_economic', socio_economic)
		myFormData.append('causes', causes)

		$.ajax({
			url: '../../../models/situation/add_accident.hh',
			type: 'POST',
			processData: false,
			contentType: false,
			data: myFormData,
			success: function (res) {
				$.ajax({
					url: '../../../models/situation/add_accident_relation.hh',
					method: 'POST',
					data: { SystemCodeNumber: res.trim(), MainID: type, TypeId: tid, Action: action, Checklist: data_entry_list },
					success: function (res) {
						// return;
						$.alert({
							type: 'green',
							title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Selected device is edited successfully</div>'
						});
						location.reload();
					}
				});

			}
			//traditional: true
		});
	})

	$('.update_group_modal').click(function(){
		if($('input[name=acc_record]:checked').length == 0){	
				alert('Select a record to edit');
				return;
			}
		$("#update_modal").modal()
		$('.up_acc_datetime').prop('disabled',false)

		var currEle=$('input[name=acc_record]:checked').closest('tr');

		$('.up_scn').val($('.a_scn',currEle).html());
		$('.up_sdesc').val($('.a_sdesc',currEle).html());
		$('.up_ldesc').val($('.a_ldesc',currEle).html());
		$('.up_northing').val($('.a_nor',currEle).html());
		$('.up_easting').val($('.a_eas',currEle).html());
		$('.up_type_id').html('<option>'+$('.a_tid',currEle).html()+'</option>');
		$('.up_acc_datetime').val($('.a_atime',currEle).html());
		$('.up_end_datetime').val($('.a_etime',currEle).html());
		$('#up_severity').val($('.a_sev',currEle).html());
		$('#up_sev_out').val($('.a_sev',currEle).html())
		$('.up_reported').val($('.a_rby',currEle).html());
		$('.up_modified').val($('.a_mby',currEle).html());
		$('.up_compliance_time').val($('.a_comptime',currEle).html());
		$('.up_remedial_datetime').val($('.a_remtime',currEle).html());
		$('.up_accident_status').val($('.a_status',currEle).html());
		$('.up_detailed_reason').val($('.a_dreason',currEle).html());
		$('.up_other_information').val($('.a_other',currEle).html());
		$('.up_remarks').val($('.a_remark',currEle).html());
		$('.up_damageremarks').val($('.a_damageremark',currEle).html());
		$('.up_amount_due').val($('.a_adue',currEle).html());
		$('.up_amount_paid').val($('.a_apaid',currEle).html());
		$('.up_amount_unpaid').val($('.a_aunpaid',currEle).html());
		$('input[name=up_q1][value='+$('.a_q1',currEle).html()+']').prop('checked',true);
		$('input[name=up_q2][value='+$('.a_q2',currEle).html()+']').prop('checked',true);
		$('input[name=up_q3][value='+$('.a_q3',currEle).html()+']').prop('checked',true);
		$('.up_human_impact').val($('.a_humanimpact', currEle).html());
		$('.up_human_factors').val($('.a_humanfactors', currEle).html());
		$('.up_injury_nature').val($('.a_injurynature', currEle).html());
		$('.up_property_damage').val($('.a_propertydamage', currEle).html());
		$('.up_socio_economic').val($('.a_socioeconomic', currEle).html());
		$('.up_causes').val($('.a_causes', currEle).html());

		var images = $('.a_imagepath', ele).html().split(';')
		for (var i = 0; i < images.length; i++) {
			$('.up_imagepath').append('<a href="' + images[i] + '" class="imagelink" target="_blank" title="Click to open this Image in a new tab"><img src="' + images[i] + '"/></a>')
		}

	});

	$('.update_acc_btn').click(function () {

		var scn = sanitize($('.up_scn').val()),
			sdesc = sanitize($('.up_sdesc').val()),
			ldesc = sanitize($('.up_ldesc').val()),
			nor = sanitize($('.up_northing').val()),
			eas = sanitize($('.up_easting').val()),
			tid = sanitize($('.type_id option:contains("' + $('.up_type_id').text() + '")').val());
		accDT = sanitize($('.up_acc_datetime').val()),
			edate = sanitize($('.up_end_datetime').val()),
			sev = sanitize($('#up_severity').val()),
			rep = sanitize($('.up_reported').val()),
			mod = sanitize($('.up_modified').val());
		// type=$('#select_type_id').val().toLowerCase();
		type = "roadwork"

		var ComplianceTime = sanitize($('.up_compliance_time').val());
		RemedialTime = sanitize($('.up_remedial_datetime').val())
		Status = sanitize($('.up_accident_status').val())
		DetailedReason = sanitize($('.up_detailed_reason').val())
		OtherInformation = sanitize($('.up_other_information').val())
		Question1 = sanitize($('input[name=up_q1]:checked').val())
		Question2 = sanitize($('input[name=up_q2]:checked').val())
		Question3 = sanitize($('input[name=up_q3]:checked').val())
		Remarks = sanitize($('.up_remarks').val())
		AmountDue = sanitize($('.up_amount_due').val())
		AmountPaid = sanitize($('.up_amount_paid').val())
		AmountUnpaid = sanitize($('.up_amount_unpaid').val())
		DamageRemarks = sanitize($('.up_damageremarks').val())

		human_impact = sanitize($('.up_human_impact').val())
		human_factors = sanitize($('.up_human_factors').val())
		injury_nature = sanitize($('.up_injury_nature').val())
		property_damage = sanitize($('.up_property_damage').val())
		socio_economic = sanitize($('.up_socio_economic').val())
		causes = sanitize($('.up_causes').val())

		if (rep == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Enter the reported By field</div>'
			});
			return;
		}
		if (mod == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Enter the modified by field</div>'
			});
			return;
		}
		if (sev == "0") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select Severity</div>'
			});
			return;
		}

		if (edate != "" && accDT > edate) {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">End time should be greater than start time</div>'
			});
			return;
		}

		if ($('.up_accident_status').val() == "--Select--") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select status</div>'
			});
			return;
		}

		$.ajax({
			url: '../../../models/situation/update_accident.hh',
			method: 'POST',
			data: { SystemCodeNumber: scn, ShortDescription: sdesc, LongDescription: ldesc, Northing: nor, Easting: eas, TypeID: tid, AccidentTime: accDT, CreatedBy: uname, EndDate: edate, Severity: sev, ReportedBy: rep, ModifiedBy: mod, isedit: 1, MainID: type, ComplianceTime: ComplianceTime, RemedialTime: RemedialTime, Status: Status, DetailedReason: DetailedReason, OtherInformation: OtherInformation, Question1: Question1, Question2: Question2, Question3: Question3, Remarks: Remarks, AmountDue: AmountDue, AmountPaid: AmountPaid, AmountUnpaid: AmountUnpaid, DamageRemarks: DamageRemarks, human_impact: human_impact, human_factors: human_factors, injury_nature: injury_nature, property_damage: property_damage, socio_economic: socio_economic, causes: causes },
			success: function (res) {
				location.reload();
			}
		});
	});

	// $('.delete_group').click(function () {
	// 	if ($('input[name=acc_record]:checked').length == 0) {
	// 		$.alert({
	// 			type: 'red',
	// 			title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
	// 			content: '<div class="fw-bold">Select a record to delete</div>'
	// 		});
	// 		return;
	// 	}
	// 	var delRecord = $('.a_scn', $('input[name=acc_record]:checked').closest('tr')).html()
	// 	//console.log(delRecord);	
	// 	if (confirm("Are you sure you want to delete this Situation?")) {
	// 		$.ajax({
	// 			url: '../../../models/situation/delete_accident.hh',
	// 			method: 'POST',
	// 			data: { SystemCodeNumber: delRecord, type: "roadwork" },
	// 			success: function (res) {
	// 				if (res)
	// 					location.reload();

	// 			}
	// 		})
	// 	}
	// 	else
	// 		return


	// })

	$('#delete_group').click(function () {
		try {
			var delRecord = $("input[type='radio'][name='acc_record']:checked").parent().parent().children()[1].innerHTML
	
			// var delRecord = $('.a_scn', $('input[name=acc_record]:checked').closest('tr')).html()
			
			// var scn = $("input[type='radio'][name='mds']:checked").parent().parent().children()[2].innerHTML
			$.ajax({
				url: '../../../models/situation/delete_accident.hh',
				method: 'POST',
				data: { SystemCodeNumber: delRecord, type: "roadwork" },
				success: function (res) {
					console.log(delRecord);	
					if (res.length == 2) {
						console.log("error in delete_accident.hh");
						$.alert({
							type: 'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
						});
					}
					else if (res=="success"){
						console.log("815")
						$.confirm({
							type: 'green',
							title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Situation deleted successfully</div>',
							buttons: {
								Ok: function () {
									window.location.href='road_work_setup.html';
								}
							}
						});
					}
					else {
						console.log("827")
						$.confirm({
							type: 'red',
							title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
							// buttons: {
							// 	Ok: function () {
							// 		window.location.href='accident_setup.html';
							// 	}
							// }
						});
					}
				}
			});
		}
		catch (e) {
			console.log("830")
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please Select a Record to Delete </div>'
			});
		}
	})

})
