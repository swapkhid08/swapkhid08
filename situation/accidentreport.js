
function json_to_csv(json_data, title, label, fromDate, toDate, filename) {
    //Json  Parser
    var arr_data = JSON.parse(json_data);
    var csv = '';    
    
    //Title of the csv file, utilize it if needed 
    //csv += title + '\r\n\n';
    
    // column labels extraction
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
   // if(document.getElementById("des").checked == true){
        for (var i = 0; i < arr_data.length; i++) {
            var row = "";        
            for (var index in arr_data[i]) {
                if(index == 'CreationDate' || index == 'AccidentTime'){
                    if(arr_data[i][index] != null && arr_data[i][index] != undefined && arr_data[i][index] != 'null' && arr_data[i][index] != ''){
                        row += '"' + getFormattedDate(arr_data[i][index],'Y-m-d H:m:s','d-m-y H:m:s') + '",';
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
    // }
    // else{
    //     for (var i = 0; i < arr_data.length; i++) {
    //     var row = "";        
    //     for (var index in arr_data[i]) {
    //         row += '"' + arr_data[i][index] + '",';
    //     }
    //     row.slice(0, row.length - 1);
    //     //add a line break after each row
    //     csv += row + '\r\n';
    // }
    // }

    if (csv == '') {        
        $.alert({
            type: 'red',
            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
            content: '<div class="fw-bold">No data found</div>'
        });
        return;
    }   
    
    // file name declaration change accordingly
    var file_name = filename+fromDate+"_"+toDate;  
    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);    
    var link = document.createElement("a");    
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = file_name + ".csv";    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

$(document).ready(function(){
	var dates = getCurrentStartNEndDate();
    // console.log(dates)
    var fromDate = sanitize($('.accSDate').val())+' 00:00:00';
    var toDate = sanitize($('.accEDate').val())+' 23:59:59';

    //   var startDate =  $('.accSDate').val(getFormattedDate(dates[0],'Y-m-d','d-m-y'));
//   var endDate =   $('.accEDate').val(getFormattedDate(dates[1],'Y-m-d','d-m-y'));
    
	var logic = function( currentDateTime ){
	        if (currentDateTime && currentDateTime.getDay() == 6){
	            this.setOptions({
	                minTime:'11:00'
	            });
	        }
	        else
	            this.setOptions({
	                minTime:'8:00'
	            });
		    };

		    $('.datetimepicker').datetimepicker({
		    onChangeDateTime:logic,
		    onShow:logic
		    });
	// console.log("startDate = "+JSON.stringify(startDate)+", endDate ="+endDate)
	var selector = '[data-rangeslider]';
	var $element = $(selector);	
	var textContent = ('textContent' in document) ? 'textContent' : 'innerText';

	function valueOutput(element) {
            var value = element.value;
            var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
            output[textContent] = value;
        }

    $(document).on('input', 'input[type="range"], ' + selector, function(e) {
        valueOutput(e.target);
    });

	$element.rangeslider();

	get_dt = function(){
        $('.loader').show();
        $('#dataTable').DataTable({
            "processing": true,
            "serverSide": true,
            "searching": false,
            "scrollY": "500px",
			"scrollCollapse": true,
            "columnDefs": [ { orderable: false, targets: [1,2,3,4,10,11,12]}],
            "order":[[7,"desc"]],
            "ajax": {
                "url": "../../../models/situation/getdt_filter_accidents.hh",
                "type": "POST",
                "data": function ( d ) {
                	type=sanitize($('#accType').val()),
					sev=sanitize($('#accSev').val());
                    var adtime=sanitize(getFormattedDate($('.accSDate').val(),'d-m-y','Y-m-d'))+ ' 00:00:00';
                    var edtime=sanitize(getFormattedDate($('.accEDate').val(),'d-m-y','Y-m-d'))+ ' 23:59:59';

					var dNow = new Date();
			    	var localdate= dNow.getFullYear() + '-' + (dNow.getMonth()+1) + '-' + (dNow.getDate()+1) + ' 23:59:59';

					if(adtime == ""){
                        $.alert({
                            type: 'red',
                            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                            content: '<div class="fw-bold">Please enter start time</div>'
                        });
						return;
						adtime = "0000-00-00 00:00:00"
					}

					if(edtime == ""){
                        $.alert({
                            type: 'red',
                            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                            content: '<div class="fw-bold">Please enter end time</div>'
                        });
						return;
						edtime = localdate;
					}

					if(sev == "0")
						sev=""
					if(type == "Select situation type" || type == "" || type == null || type == undefined){
						$.alert({
                            type: 'red',
                            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                            content: '<div class="fw-bold">Please select a situation type</div>'
                        });
						return;
					}
					// AccidentType:type,EndTime:edtime,Severity:sev,StartTime:adtime
                    d.AccidentType = type
                    _AccidentType = d.AccidentType

                    d.EndTime = edtime
                    _EndTime = d.EndTime

                    d.Severity = sev
                    _Severity = d.Severity

                    d.StartTime = adtime
                    _StartTime = d.adtime

                },
                'dataSrc':function(res){
                    var check = res;
                    var return_data = new Array();
                    check = check.data
                    for(var i=0;i< check.length; i++){
                        return_data.push({
                            "SystemCodeNumber":check[i].SystemCodeNumber,
                            "ShortDescription":check[i].ShortDescription ,
                            "LongDescription":check[i].LongDescription ,
                            "Northing":check[i].Northing ,
                            "Easting":check[i].Easting,
                            "AccidentType":check[i].AccidentType ,
                            "CreationDate":check[i].CreationDate ,
                            "AccidentTime":check[i].AccidentTime ,
                            "EndDate":(check[i].EndDate == null ? "" : check[i].EndDate) ,
                            "Severity":check[i].Severity ,
                            "ReportedBy":check[i].ReportedBy ,
                            "CreatedBy":check[i].CreatedBy ,
                            "view":'<span class="view_report" type="'+check[i].SituationType+'" scn="'+check[i].SystemCodeNumber+'">View Report</span>' ,
                        })
                    }
                    return return_data;
                }
            },
            "columns": [
                { "data": "SystemCodeNumber" , class: "a_scn"},
                { "data": "ShortDescription" , class: "a_sdesc"},
                { "data": "LongDescription" , class: "a_ldesc"},
                { "data": "Northing" , class: "a_nor"},
                { "data": "Easting" , class: "a_eas"},
                { "data": "AccidentType" , class: "a_tid"},
                { "data": "CreationDate" , class: "a_ctime",render: renderDate},
                { "data": "AccidentTime" , class: "a_atime",render: renderDate},
                { "data": "EndDate" , class: "a_etime",render: renderDate},
                { "data": "Severity" , class: "a_sev"},
                { "data": "ReportedBy" , class: "a_rby"},
                { "data": "CreatedBy" , class: "a_cby"},
                { "data": "view" }
            ],
            "fnDrawCallback": function( oSettings ) {
		      	$('#dataTable tbody tr').each(function(){
		        	// $('td:nth-child(5),td:nth-child(6),td:nth-child(8),td:nth-child(12),td:nth-child(13),td:nth-child(14)',this).css('display','none')
		        }),
                $('.loader').hide();

		  //       $('.viewdetails').click(function(){
				// 	$('#view_modal').modal()
				// 	var ele = $(this).parent().parent()
				// 	$('.v_scn').html($('.a_scn',ele).html())
				// 	$('.v_sdesc').html($('.a_sdesc',ele).html())
				// 	$('.v_ldesc').html($('.a_ldesc',ele).html())
				// 	$('.v_lat').html($('.a_nor',ele).html())
				// 	$('.v_lon').html($('.a_eas',ele).html())
				// 	$('.v_stype').html($('.a_tid',ele).html())
				// 	$('.v_stime').html($('.a_atime',ele).html())
				// 	$('.v_etime').html($('.a_etime',ele).html())
				// 	$('.v_sev').html($('.a_sev',ele).html())
				// 	$('.v_rby').html($('.a_rby',ele).html())
				// 	$('.v_mby').html($('.a_mby',ele).html())
				// })
		    }
        });
function renderDate(data, type, full,meta)
        {
            return data==null||data==undefined||data==''?'--':getFormattedDate(data,'Y-m-d H:m:s','d-m-y H:m:s');
        }

    }

    get_onloaddt = function(){
        $('#dataTable').DataTable({
            "processing": true,
            "serverSide": true,
            "searching": false,
            "scrollY": "500px",
			"scrollCollapse": true,
            // "columnDefs": [ { orderable: false, targets: [1,2,3,4,10,11,12]}],
            "columnDefs": [
				{ orderable: false, targets: [0] },
				{
					targets: [1,2],
					className: 'text-left'
				}
			],
            "order":[[7,"desc"]],
            "ajax": {
                "url": "../../../models/situation/getdt_filter_accidents.hh",
                "type": "POST",
                "data": function ( d ) {
                	type= "all"
                	dNow = new Date();
                    var adtime=sanitize(getFormattedDate($('.accSDate').val(),'d-m-y','Y-m-d'))+ ' 00:00:00';
                    var edtime=sanitize(getFormattedDate($('.accEDate').val(),'d-m-y','Y-m-d'))+ ' 23:59:59';
                	// edtime = dNow.getFullYear() + '-' + (dNow.getMonth()+1) + '-' + (dNow.getDate()) + ' 23:59:59';
					sev = 0
					// adtime = dNow.getFullYear() + '-' + (dNow.getMonth()+1) + '-' + (dNow.getDate()) + ' 00:00:00';

                    d.AccidentType = type
                    _AccidentType = d.AccidentType

                    d.EndTime = edtime
                    _EndTime = d.EndTime

                    d.Severity = sev
                    _Severity = d.Severity

                    d.StartTime = adtime
                    _StartTime = d.adtime

                },
                'dataSrc':function(res){
                    var check = res;
                    var return_data = new Array();
                    check = check.data
                    for(var i=0;i< check.length; i++){
                        return_data.push({
                            "SystemCodeNumber":check[i].SystemCodeNumber,
                            "ShortDescription":check[i].ShortDescription ,
                            "LongDescription":check[i].LongDescription ,
                            "Northing":check[i].Northing ,
                            "Easting":check[i].Easting,
                            "AccidentType":check[i].AccidentType ,
                            "CreationDate":check[i].CreationDate ,
                            "AccidentTime":check[i].AccidentTime ,
                            "EndDate":(check[i].EndDate == null ? "" : check[i].EndDate) ,
                            "Severity":check[i].Severity ,
                            "ReportedBy":check[i].ReportedBy ,
                            "CreatedBy":check[i].CreatedBy ,
                            "view":'<span class="view_report" type="'+check[i].SituationType+'" scn="'+check[i].SystemCodeNumber+'">View Report</span>' ,
                        })
                    }
                    return return_data;
                }
            },
            "columns": [
                { "data": "SystemCodeNumber" , class: "a_scn"},
                { "data": "ShortDescription" , class: "a_sdesc"},
                { "data": "LongDescription" , class: "a_ldesc"},
                { "data": "Northing" , class: "a_nor"},
                { "data": "Easting" , class: "a_eas"},
                { "data": "AccidentType" , class: "a_tid"},
                { "data": "CreationDate" , class: "a_ctime"},
                { "data": "AccidentTime" , class: "a_atime"},
                { "data": "EndDate" , class: "a_etime"},
                { "data": "Severity" , class: "a_sev"},
                { "data": "ReportedBy" , class: "a_rby"},
                { "data": "CreatedBy" , class: "a_cby"},
                { "data": "view" }
            ],
            "fnDrawCallback": function( oSettings ) {
		      	$('#dataTable tbody tr').each(function(){
		        	// $('td:nth-child(5),td:nth-child(6),td:nth-child(8),td:nth-child(12),td:nth-child(13),td:nth-child(14)',this).css('display','none')
		        }),
                $('.loader').hide();

		    }
        });

    }

    setTimeout(get_onloaddt,300);

	$('.search').click(function(){
        $('#dataTable').DataTable().destroy();
        var type=sanitize($('#accType').val());
        if(type == "Select Situation Type" || type == "" || type == null || type == undefined){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select a situation type</div>'
            });
            return;
        }
        get_dt()
		// var type=$('#accType').val().toLowerCase(),
		// 	edtime=$('.accEDate').val(),
		// 	sev=$('#accSev').val(),
		// 	adtime=$('.accSDate').val();

		// var dNow = new Date();
  //   	var localdate= dNow.getFullYear() + '-' + (dNow.getMonth()+1) + '-' + (dNow.getDate()+1) + ' 23:59:59';

		// if(adtime == ""){
            // $.alert({
            //     type: 'red',
            //     title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
            //     content: '<div class="fw-bold">Please enter start time</div>'
            // });
		// 	return;
		// 	adtime = "0000-00-00 00:00:00"
		// }

		// if(edtime == ""){
            // $.alert({
            //     type: 'red',
            //     title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
            //     content: '<div class="fw-bold">Please enter end time</div>'
            // });
		// 	return;
		// 	edtime = localdate;
		// }

		// if(sev == "0")
		// 	sev=""
		// if(type == "select situation type"){
            // $.alert({
            //     type: 'red',
            //     title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
            //     content: '<div class="fw-bold">Please select a situation type</div>'
            // });
		// 	return;
		// }

		// $.ajax({
		// 	url:'../../utils/filter_accidents.hh',
		// 	method:'POST',
		// 	data:{AccidentType:type,EndTime:edtime,Severity:sev,StartTime:adtime},
		// 	success:function(res){
		// 		res=jQuery.parseJSON(res);
		// 		if (res.length == 0 ) {
		// 			$('.acc_table tbody tr').has('td').remove();
        // $.alert({
        //     type: 'red',
        //     title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
        //     content: '<div class="fw-bold">No report found</div>'
        // });
		// 		}
		// 		else{
		// 			$('.acc_table tbody tr').has('td').remove();
		// 			for (var i = 0; i < res.length; i++) {
		// 				$('.acc_table tbody').append('<tr><td colspan="1"><input type="radio" name="acc_record"></td><td class="a_scn">'+res[i].SystemCodeNumber+'</td><td class="a_sdesc">'+res[i].ShortDescription+'</td><td class="a_ldesc">'+res[i].LongDescription+'</td><td class="a_nor">'+res[i].Northing+'</td><td class="a_eas">'+res[i].Easting+'</td><td class="a_tid">'+res[i].AccidentType+'</td><td class="a_ctime">'+res[i].CreationDate+'</td><td class="a_atime">'+res[i].AccidentTime+'</td><td class="a_etime">'+(res[i].EndDate == null ? "" : res[i].EndDate)+'</td><td class="a_sev">'+res[i].Severity+'</td><td class="a_rby">'+res[i].ReportedBy+'</td><td class="a_cby">'+res[i].CreatedBy+'</td><td style="color:blue;" class="view_report" scn="'+res[i].SystemCodeNumber+'">View Report</td></tr>')
		// 			}
		// 		}
		// 	}
		// })	
	})
	
	// var today = new Date();
	// var dd = today.getDate();
	// var mm = today.getMonth()+1; 

	// var yyyy = today.getFullYear();
	// if(dd<10){
	//     dd='0'+dd;
	// } 
	// if(mm<10){
	//     mm='0'+mm;
	// } 
	
	// var today = yyyy+'-'+mm+'-'+dd;
	// var stime = today + " 00:00:00"
	// 	etime = today + " 23:59:59"

	// $.ajax({
	// 	url:'../../utils/filter_accidents.hh',
	// 	method:'POST',
	// 	data:{AccidentType:"all",EndTime:etime,Severity:"",StartTime:stime},
	// 	success:function(res){
	// 		res=jQuery.parseJSON(res);
	// 		if (res.length == 0 ) {
	// 			$('.acc_table tbody tr').has('td').remove();
    // $.alert({
    //     type: 'red',
    //     title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
    //     content: '<div class="fw-bold">No report found for today</div>'
    // });
	// 		}
	// 		else{
	// 			$('.acc_table tbody tr').has('td').remove();
	// 			for (var i = 0; i < res.length; i++) {
	// 				$('.acc_table tbody').append('<tr><td colspan="1"><input type="radio" name="acc_record"></td><td class="a_scn">'+res[i].SystemCodeNumber+'</td><td class="a_sdesc">'+res[i].ShortDescription+'</td><td class="a_ldesc">'+res[i].LongDescription+'</td><td class="a_nor">'+res[i].Northing+'</td><td class="a_eas">'+res[i].Easting+'</td><td class="a_tid">'+res[i].AccidentType+'</td><td class="a_ctime">'+res[i].CreationDate+'</td><td class="a_atime">'+res[i].AccidentTime+'</td><td class="a_etime">'+(res[i].EndDate == null ? "" : res[i].EndDate)+'</td><td class="a_sev">'+res[i].Severity+'</td><td class="a_rby">'+res[i].ReportedBy+'</td><td class="a_cby">'+res[i].CreatedBy+'</td><td style="color:blue;" class="view_report" scn="'+res[i].SystemCodeNumber+'" type="'+res[i].SituationType+'">View Report</td></tr>')
	// 			}
	// 		}
	// 	}
	// })

	$(document).on('click', ".view_report", function() {
		var scn = $(this).attr("scn");
		var mid = $(this).attr('type');
		$("#name_modal")[0].innerHTML = scn;
		$("#chk_modal tbody").empty();
		$.ajax({
			url:'../../../models/situation/performance_reports.hh',
			method:'POST',
			data:{SystemCodeNumber:scn,MainID:mid},              
			success:function(res){
				res=jQuery.parseJSON(res);
				var table = "";
				for (var i = 0; i < res.length; i++) {
					$("#action_modal")[0].innerHTML = res[i].Action;
					if (res[i].Checklist_type != "Camera" || res[i].Checklist_type !="VMS") {
						table += "<tr><td>"+res[i].Checklist_type+"</td><td>"+res[i].Informed+"</td><td>"+(res[i].Informed_time==null||res[i].Informed_time==''||res[i].Informed_time==undefined?'--':getFormattedDate(res[i].Informed_time,'Y-m-d H:m:s','d-m-y H:m:s'))+"</td><td>"+res[i].Arrived+"</td><td>"+(res[i].Arrived_time==null||res[i].Arrived_time==''||res[i].Arrived_time==undefined?'--':getFormattedDate(res[i].Arrived_time,'Y-m-d H:m:s','d-m-y H:m:s'))+"</td><td>"+res[i].Resolved+"</td><td>"+(res[i].Resolved_time==null||res[i].Resolved_time==''||res[i].Resolved_time==undefined?'--':getFormattedDate(res[i].Resolved_time,'Y-m-d H:m:s','d-m-y H:m:s'))+"</td></tr>";
					}
					else{
						table += "<tr><td>"+res[i].Checklist_type+"</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td></tr>";
					}
				}
				$("#chk_modal tbody").append(table);
				$("#viewReportModal").modal();
			}
		})
	})

	$('.download').click(function(){
		var type=sanitize($('#accType').val().toLowerCase()),
			sev=sanitize($('#accSev').val());
        var adtime=sanitize(getFormattedDate($('.accSDate').val(),'d-m-y','Y-m-d'))+ ' 00:00:00';;
        var edtime=sanitize(getFormattedDate($('.accEDate').val(),'d-m-y','Y-m-d'))+ ' 23:59:59';;

		var dNow = new Date();
    	var localdate= dNow.getFullYear() + '-' + (dNow.getMonth()+1) + '-' + (dNow.getDate()+1) + ' 23:59:59';

		if(adtime == ""){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter start time</div>'
            });
			return;
			adtime = "0000-00-00 00:00:00"
		}

		if(edtime == ""){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter end time</div>'
            });
			return;
			edtime = localdate;
		}

		if(sev == "")
			sev="0"
		if(type == "select situation type"){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select a situation type</div>'
            });
			return;
		}

		$.ajax({
			url:'../../../models/situation/filter_accidents.hh',
			method:'POST',
			data:{
				AccidentType:type,EndTime:edtime,Severity:sev,StartTime:adtime
			},
			success:function(res){
                // console.log(res)
				json_to_csv(res, "Fault Report - Situation", true,adtime,edtime, 'fault_report_situation_');
			}
		})
	})	

    $('.downloadbreakdownpdf').click(function(){
        var type=sanitize($('#accType').val().toLowerCase()),
            sev=sanitize($('#accSev').val())
        var adtime=sanitize(getFormattedDate($('.accSDate').val(),'d-m-y','Y-m-d'))+ ' 00:00:00';;
        var edtime=sanitize(getFormattedDate($('.accEDate').val(),'d-m-y','Y-m-d'))+ ' 23:59:59';;


        var dNow = new Date();
        var localdate= dNow.getFullYear() + '-' + (dNow.getMonth()+1) + '-' + (dNow.getDate()+1) + ' 23:59:59';

        if(adtime == ""){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter start time</div>'
            });
            return;
            adtime = "0000-00-00 00:00:00"
        }

        if(edtime == ""){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter end time</div>'
            });
    
            return;
            edtime = localdate;
        }

        if(sev == "")
            sev="0"
        if(type == "select situation type"){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select a situation type</div>'
            });
            return;
        }

        $.ajax({
            url:'../../../models/situation/filter_breakdown_accident.hh',
            method:'POST',
            data:{
                AccidentType:type,EndTime:edtime,Severity:sev,StartTime:adtime
            },
            success:function(res){
               
                // for(const data in res){
                    console.log(res)
                json_to_csv(res, "Fault Report - Situation", true,adtime,edtime,'fault_report_situation_NHAI_');
            // }
        }
        })
    })      

	download_pdf = function(){
        var type=sanitize($('#accType').val().toLowerCase()),
			sev=sanitize($('#accSev').val());
        var adtime=sanitize(getFormattedDate($('.accSDate').val(),'d-m-y','Y-m-d'))+ ' 00:00:00';;
        var edtime=sanitize(getFormattedDate($('.accEDate').val(),'d-m-y','Y-m-d'))+ ' 23:59:59';;

		var dNow = new Date();
    	var localdate= dNow.getFullYear() + '-' + (dNow.getMonth()+1) + '-' + (dNow.getDate()+1) + ' 23:59:59';

        var from_text = $(".accSDate").val();
        var to_text = $(".accEDate").val();
        var accType_text = $("#accType :selected").text();

		if(adtime == ""){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter start time</div>'
            });
			return;
			adtime = "0000-00-00 00:00:00"
		}

		if(edtime == ""){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter end time</div>'
            });
			return;
			edtime = localdate;
		}

		if(sev == "")
			sev="0"
		if(type == "select situation type"){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select a situation type</div>'
            });
			return;
		}

        // AccidentType:type,EndTime:edtime,Severity:sev,StartTime:adtime
            $.ajax({
              url: '../../../models/utils/get_username.hh',
              type: 'POST',
                success: function(result) {
					result = JSON.parse(result);
                    var username = result.user.trim();
                    window.open("../../../models/situation/createreport_accidents_pdf.hh?AccidentType=" + type +"&EndTime=" + edtime +"&Severity="+sev+"&StartTime="+adtime+"&username="+username+"&from_text="+from_text+"&to_text="+to_text+"&accType_text="+accType_text,'_blank');    
                }
            });
        
    }
    $(".downloadpdf").click(function() {
            download_pdf();
    });
})
