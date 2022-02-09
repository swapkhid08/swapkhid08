var allDeviceList = []
flag=0;
$(document).ready(function () {
    google.charts.load('current', { 'packages': ['corechart'] });

    var dates = getCurrentStartNEndDate();
    $('#start_date').val(getFormattedDate(dates[0], 'Y-m-d H:m:s', 'd-m-y H:m:s').split(' ')[0]);
    $('#end_date').val(getFormattedDate(dates[1], 'Y-m-d H:m:s', 'd-m-y H:m:s').split(' ')[0]);

    // setStartAndEndDate('#start_date', '#end_date', 7, true);
    var detector_types_arr = [];
    var class_head_arr = [];
    var device_zones_arr = [];
    var devices_arr = [];
    var make_modal_arr = [];

    $.ajax({
        url: '../../../models/detector/detector_report_filters.hh',
        type: 'POST',
        success: function (result) {
            var result = JSON.parse(result);
            // console.log(result);
            detector_types_arr = result.detector_types;
            class_head_arr = result.class_head;
            device_zones_arr = result.device_zones;
            devices_arr = result.devices;
            make_modal_arr = result.make_model;
            if(devices_arr.devices_types[$("#device_type").val()]==undefined||null){
                if(flag==0){
                    setTimeout(()=>{
                        get_default_module('detector').then((data)=>{
                            $('#device_type option[value="'+data.default_device_type+'"]').attr('selected',true);
                            device_type_select.destroy();
                            device_type_select = new SlimSelect({
                                select: '#device_type',
                                placeholder: 'Select type'
                              })
                              $('#device_type').change();
                            })	
                    },1000)
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

    $('#device_type').on('change', function () {
        var type = $(this).val();
        //alert($(this).val());return;
        // if ($(this).val() == '4' && $('#report_type').val() == 'vbv') {
        //     $('.atcc_filter_content').show();
        //     $('.drection_lbl').hide();
        //     $('.drection_col').hide();
        //     $('.error_lbl').hide();
        //     $('.error_col').hide();
        //     //getDeviceScns($(this).val());
        //     //populateMakeModel();
        // } 
        if ($('#report_type').val() == 'classified') {
            $('.atcc_filter_content').hide();
            $('.non-vbv').show();
            //populateMakeModel();
        } else {
            $('.atcc_filter_content').hide();
            $('.non-vbv').show();
            //getDeviceScns($(this).val());
            //populateMakeModel();			
        }
        var scns = devices_arr.devices_types[type];
        var scn_zone = [];
        var makemodal = make_modal_arr[type];
        var makemodalarr = [];
        for (const key in makemodal) {
            if (key != undefined) {
                makemodalarr.push(makemodal[key])
            }
        }
        $('#make_model').empty();
        $('#devicetable_tbody').html('');
        $('#zones_select').html('');
        $('#vehicle_class').html('');
        for (var i = 0; i < makemodalarr.length; i++) {
            $('#make_model').append('<option value="' + makemodalarr[i].ID + '">' + makemodalarr[i].Make + ' - ' + makemodalarr[i].Model + '</option>')
        }
        $('#make_model').change();
    });

    $('#make_model').on('change', function () {
        var make_model = $('#make_model').val();
        var nscns = devices_arr.devices_make_model[make_model];
        if (nscns != undefined && nscns != '') {
            var scns = [];
            for (const key in nscns) {
                if (key != undefined) {
                    scns.push(nscns[key])
                }
            }
            var scn_zone = [];
            devicetable_tbody = '<option value="all" selected>All devices</option>';
            allDeviceList = scns;
            for (var i = 0; i < scns.length; i++) {
                scn_zone[i] = scns[i].SystemCodeNumber;
                devicetable_tbody += '<option value="' + scns[i].SystemCodeNumber + '">' + scns[i].Place + ' - ' + scns[i].ShortDescription + '</option>';
            }
            $('#devicetable_tbody').html(devicetable_tbody);
            var selectzones = '<option value="all" selected>All</option>';
            for (var z = 0; z < scn_zone.length; z++) {
                var zonearr = device_zones_arr[scn_zone[z]];
                var newzones = [];
                if (zonearr != undefined) {
                    for (const key in zonearr) {
                        if (key != undefined) {
                            newzones.push(zonearr[key])
                        }
                    }
                    for (var d = 0; d < newzones.length; d++) {
                        selectzones += '<option value="' + newzones[d].ZoneSCN + '">' + newzones[d].ZoneName + '</option>';
                    }
                }
            }
            $('#zones_select').html(selectzones);

            var newclass_heads = class_head_arr[make_model];
            var class_heads = [];
            if (newclass_heads != undefined && newclass_heads != '') {
                for (const key in newclass_heads) {
                    if (key != undefined) {
                        class_heads.push(newclass_heads[key])
                    }
                }
                var vehicle_class = '<option value="all" selected>All</option>';
                for (var c = 0; c < class_heads.length; c++) {
                    vehicle_class += '<option value="' + class_heads[c].binName + '">' + class_heads[c].binName + '</option>';
                }
                $('#vehicle_class').html(vehicle_class);
            } else {
                $('#vehicle_class').html('');
            }

        } else {
            $('#devicetable_tbody').html('');
            $('#zones_select').html('');
            $('#vehicle_class').html('');
        }
    })

    $('#devicetable_tbody').on('change', function () {
        var selectedscn = $('#devicetable_tbody').val();
        var selectzones = '<option value="all" selected>All</option>';
        if (selectedscn == null) {
            $('#devicetable_tbody > option').each(function () {
                var optval = $(this).val();
                if (optval != 'all') {
                    var zonearr = device_zones_arr[optval];
                    var newzones = [];
                    for (const key in zonearr) {
                        if (key != undefined) {
                            newzones.push(zonearr[key])
                        }
                    }
                    for (var d = 0; d < newzones.length; d++) {
                        selectzones += '<option value="' + newzones[d].ZoneSCN + '">' + newzones[d].ZoneName + '</option>';
                    }
                }
            });
        } else {
            if (selectedscn.includes("all")) {
                $('#devicetable_tbody > option').each(function () {
                    var optval = $(this).val();
                    if (optval != 'all') {
                        var zonearr = device_zones_arr[optval];
                        var newzones = [];
                        for (const key in zonearr) {
                            if (key != undefined) {
                                newzones.push(zonearr[key])
                            }
                        }
                        for (var d = 0; d < newzones.length; d++) {
                            selectzones += '<option value="' + newzones[d].ZoneSCN + '">' + newzones[d].ZoneName + '</option>';
                        }
                    }
                });
            } else {
                for (var s = 0; s < selectedscn.length; s++) {
                    var optval = selectedscn[s];
                    var zonearr = device_zones_arr[optval];
                    var newzones = [];
                    for (const key in zonearr) {
                        if (key != undefined) {
                            newzones.push(zonearr[key])
                        }
                    }
                    for (var d = 0; d < newzones.length; d++) {
                        selectzones += '<option value="' + newzones[d].ZoneSCN + '">' + newzones[d].ZoneName + '</option>';
                    }
                }
            }
        }

        $('#zones_select').html(selectzones);
    });

    $('#report_type').on('change', function () {
        if ($(this).val() == 'vbv' && $('#device_type').val() == '4') {
            $('.vbv_filter_content').show();
            $('.atcc_filter_content').show();
            $('.drection_lbl').hide();
            $('.drection_col').hide();
            $('.error_lbl').hide();
            $('.error_col').hide();
            $('.classified_data_content').hide();
            //populateMakeModel();
        } else if ($(this).val() == 'vbv') {
            $('.vbv_filter_content').show();
            $('.classified_data_content').hide();
            $('.non-vbv').hide();
            //populateMakeModel();
        } else if ($(this).val() == 'aggregate') {
            $('.vbv_filter_content').hide();
            $('.atcc_filter_content').hide();
            $('.classified_data_content').hide();
            $('.non-vbv').show();
            //populateMakeModel();
        } else {
            $('.vbv_filter_content').show();
            $('.atcc_filter_content').hide();
            $('.classified_data_content').show();
            $('.non-vbv').show();
            //populateMakeModel();
        }
        $('#device_type').trigger('change')
    })
    // $.ajax({
    // 	url: '../../../models/detector/get_detector_types.hh',
    // 	success: function (result) {
    // 		var scns = JSON.parse(result);
    // 		if (scns.length < 2) {
    // 			$.alert({
    // 				type: 'red',
    // 				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
    // 				content: '<div class="fw-bold">No detector type added</div>'
    // 			});
    // 			$('#device_type').empty();
    // 		}
    // 		else {

    // 			devicetable_tbody = '';
    // 			for (var i = 0; i < scns.length; i++) {
    // 				devicetable_tbody += '<option value="' + scns[i].TypeID + '">' + scns[i].TypeDescription + '</option>';
    // 			}

    // 			$('#device_type').html(devicetable_tbody);
    // 			// $('#device_type').trigger('change');
    // 		}
    // 	}
    // });

})

$(document).ready(function () {

    var slickDestroyCount =0;
    var pcu_data = [];
    var c = 1;
    var slickCarousel;
    var slickClass;
    var sdesc;
    var syscdn;

    get_dt = function () {
        // $('.loader').show();
        var zonetitle;
        slickCarousel = ''
        var updatedClassData = [];
        var class0 = 0, class1 = 0, class2 = 0, class3 = 0, class4 = 0, class5 = 0, class6 = 0, class7 = 0, class8 = 0, class9 = 0, class10 = 0, class11 = 0, class12 = 0, class13 = 0, class14 = 0, class15 = 0, class16 = 0, class17 = 0, class18 = 0, class19 = 0, class20 = 0;
        var FromDate = sanitize(getFormattedDate($('#start_date').val(), 'd-m-y', 'Y-m-d'));
        var ToDate = sanitize(getFormattedDate($('#end_date').val(), 'd-m-y', 'Y-m-d'));
        var fromTime = sanitize($("#from_time").val());
        var toTime = sanitize($("#to_time").val());
        var fromDate = (FromDate + ' ' + fromTime);
        var toDate = (ToDate + ' ' + toTime);
        // var fromDate = sanitize(getFormattedDate($('#start_date').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
        // var toDate = sanitize(getFormattedDate($('#end_date').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
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
        if (!zones_select) {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select a Zone</div>'
            });
            return;
        }
        // if (vehicle_class == null || vehicle_class == '') {
        //     $.alert({
        //         type: 'red',
        //         title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
        //         content: '<div class="fw-bold">Please select vehicle class</div>'
        //     });
        //     return;
        // }
        var classMap = {};
        $.ajax({
            url: '../../../models/detector/get_detector_class_head.hh',
            method: 'POST',
            data: {
                makeid: $('#make_model').val()
            },
            success: function (res) {
                // $('.loader').hide();
                pcu_data = jQuery.parseJSON(res);
                for (pc = 0; pc < pcu_data.length; pc++) {
                    var pcuClassObj = pcu_data[pc];
                    if (pcuClassObj && pcuClassObj.binNumber) {
                        classMap[pcuClassObj.binNumber] = pcuClassObj;
                        
                    }
                }

                for (i = 0; i < 21; i++) {
                    var updatedobj = [];
                    if (classMap['' + i]) {
                        updatedobj.binName = classMap['' + i].binName;
                        updatedobj.binNumber = classMap['' + i].binNumber;
                    }
                    else {
                        updatedobj.binName = '';
                        updatedobj.binNumber = i + '';
                    }
                    updatedClassData.push(updatedobj)
                    // console.log(updatedClassData);

                }
            }
            
        });
        // $('.loader').hide();

        $.ajax({
            url: "../../../models/detector/createreport_detector.hh",
            type: 'POST',
            data: {
                makeid: $('#make_model').val(),
                day_type: day_type,
                aggregation: aggregation,
                fromDate: fromDate,
                toDate: toDate,
                device_type: device_type,
                report_type: report_type,
                direction: direction,
                error: error,
                vehicle_class: vehicle_class,
                zone: zones_select,
                scn: scn,
                order_by: order_by
            },
            success: function (res) {
                // $('.loader').hide();
                if (res.length == 2) {
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">No data available</div>'
                    });
                    return;
                }
                else {
                    res = JSON.parse(res)
                    if (res.length == 0 || res.data.length == undefined) {
                        $.alert({
                            type: 'red',
                            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                            content: '<div class="fw-bold">No data available</div>'
                        });
                        return;
                    }
                    
                    if (zones_select.length >= 1 && zones_select[0] != "all" ) {
                        $(".container").show()
                        // $(".container").css("border:1px solid")

                        for (j = 0; j < zones_select.length; j++) {
                            zonetitle = zones_select[j];
                            slickCarousel = '<div class="h-25" style="height: 555px;"><span id="slickdiv' + c + '" style="position: relative; left: 19%;height: 1000px;"></span></div>';
                            slickClass = 'slickdiv' + c
                            $('#slick_carousel').append(slickCarousel);

                            for (i = 0; i < Object.keys(res.data).length; i++) {
                                if (res.data[i].SystemCodeNumber == zones_select[j]) {
                                    sdesc = res.data[i].ShortDescription;

                                    class0 = class0 + parseInt(res.data[i].Class0Count);
                                    class1 = class1 + parseInt(res.data[i].Class1Count);
                                    class2 = class2 + parseInt(res.data[i].Class2Count);
                                    class3 = class3 + parseInt(res.data[i].Class3Count);
                                    class4 = class4 + parseInt(res.data[i].Class4Count);
                                    class5 = class5 + parseInt(res.data[i].Class5Count);
                                    class6 = class6 + parseInt(res.data[i].Class6Count);
                                    class7 = class7 + parseInt(res.data[i].Class7Count);
                                    class8 = class8 + parseInt(res.data[i].Class8Count);
                                    class9 = class9 + parseInt(res.data[i].Class9Count);
                                    class10 = class10 + parseInt(res.data[i].Class10Count);
                                    class11 = class11 + parseInt(res.data[i].Class11Count);
                                    class12 = class12 + parseInt(res.data[i].Class12Count);
                                    class13 = class13 + parseInt(res.data[i].Class13Count);
                                    class14 = class14 + parseInt(res.data[i].Class14Count);
                                    class15 = class15 + parseInt(res.data[i].Class15Count);
                                    class16 = class16 + parseInt(res.data[i].Class16Count);
                                    class17 = class17 + parseInt(res.data[i].Class17Count);
                                    class18 = class18 + parseInt(res.data[i].Class18Count);
                                    class19 = class19 + parseInt(res.data[i].Class19Count);
                                    class20 = class20 + parseInt(res.data[i].Class20Count);
                                }
                            }
                            google.charts.setOnLoadCallback(drawChart());
                        }
                        // if(j == zones_select.length){
                        $(".single-item").slick({
                            dots: true,
                            arrows: false
                        });
                        slickDestroyCount++;
                     // }
                    }
                    else if (scn.length >= 1 && scn[0] != "all") {
                        $(".container").show()
                        // $(".container").css("border:1px solid")

                        for (j = 0; j < scn.length; j++) {
                            // zonetitle = scn[j];
                            slickCarousel = '<div class="h-25" style="height: 555px;"><span id="slickdiv' + c + '" style="position: relative; left: 19%;height: 1000px;"></span></div>';
                            slickClass = 'slickdiv' + c
                            $('#slick_carousel').append(slickCarousel);
                            syscdn = res.status[j].Name
                            // console.log(syscdn)

                            for (i = 0; i < Object.keys(res.data).length; i++) {
                                if (res.data[i].SystemCodeNumber.includes(scn[j])) {
                                   
                                    class0 = class0 + parseInt(res.data[i].Class0Count);
                                    class1 = class1 + parseInt(res.data[i].Class1Count);
                                    class2 = class2 + parseInt(res.data[i].Class2Count);
                                    class3 = class3 + parseInt(res.data[i].Class3Count);
                                    class4 = class4 + parseInt(res.data[i].Class4Count);
                                    class5 = class5 + parseInt(res.data[i].Class5Count);
                                    class6 = class6 + parseInt(res.data[i].Class6Count);
                                    class7 = class7 + parseInt(res.data[i].Class7Count);
                                    class8 = class8 + parseInt(res.data[i].Class8Count);
                                    class9 = class9 + parseInt(res.data[i].Class9Count);
                                    class10 = class10 + parseInt(res.data[i].Class10Count);
                                    class11 = class11 + parseInt(res.data[i].Class11Count);
                                    class12 = class12 + parseInt(res.data[i].Class12Count);
                                    class13 = class13 + parseInt(res.data[i].Class13Count);
                                    class14 = class14 + parseInt(res.data[i].Class14Count);
                                    class15 = class15 + parseInt(res.data[i].Class15Count);
                                    class16 = class16 + parseInt(res.data[i].Class16Count);
                                    class17 = class17 + parseInt(res.data[i].Class17Count);
                                    class18 = class18 + parseInt(res.data[i].Class18Count);
                                    class19 = class19 + parseInt(res.data[i].Class19Count);
                                    class20 = class20 + parseInt(res.data[i].Class20Count);
                                }
                            }
                            google.charts.setOnLoadCallback(drawChart());
                        }
                        // if(j == zones_select.length){
                        $(".single-item").slick({
                            dots: true,
                            arrows: false
                        });
                        slickDestroyCount++;
                       // }
                    }
                    else if (zones_select[0] == "all" && scn[0] == "all") {
                        $(".container").show()
                        // $('.loader').show();                       
                        for (scnsvar = 0; scnsvar < allDeviceList.length; scnsvar++) {
                        // $(".container").css("border:1px solid")
                            // zonetitle = scn[j];
                            slickCarousel = '<div class="h-25" style="height: 555px;"><span id="slickdiv' + c + '" style="position: relative; left: 19%;height: 1000px;"></span></div>';
                            slickClass = 'slickdiv' + c
                            $('#slick_carousel').append(slickCarousel);
                            syscdn = res.status[scnsvar].Name
                            // console.log(syscdn)

                            for (i = 0; i < Object.keys(res.data).length; i++) {
                                if (res.data[i].SystemCodeNumber.includes(allDeviceList[scnsvar].SystemCodeNumber)) {
                                   
                                    class0 = class0 + parseInt(res.data[i].Class0Count);
                                    class1 = class1 + parseInt(res.data[i].Class1Count);
                                    class2 = class2 + parseInt(res.data[i].Class2Count);
                                    class3 = class3 + parseInt(res.data[i].Class3Count);
                                    class4 = class4 + parseInt(res.data[i].Class4Count);
                                    class5 = class5 + parseInt(res.data[i].Class5Count);
                                    class6 = class6 + parseInt(res.data[i].Class6Count);
                                    class7 = class7 + parseInt(res.data[i].Class7Count);
                                    class8 = class8 + parseInt(res.data[i].Class8Count);
                                    class9 = class9 + parseInt(res.data[i].Class9Count);
                                    class10 = class10 + parseInt(res.data[i].Class10Count);
                                    class11 = class11 + parseInt(res.data[i].Class11Count);
                                    class12 = class12 + parseInt(res.data[i].Class12Count);
                                    class13 = class13 + parseInt(res.data[i].Class13Count);
                                    class14 = class14 + parseInt(res.data[i].Class14Count);
                                    class15 = class15 + parseInt(res.data[i].Class15Count);
                                    class16 = class16 + parseInt(res.data[i].Class16Count);
                                    class17 = class17 + parseInt(res.data[i].Class17Count);
                                    class18 = class18 + parseInt(res.data[i].Class18Count);
                                    class19 = class19 + parseInt(res.data[i].Class19Count);
                                    class20 = class20 + parseInt(res.data[i].Class20Count);
                                }
                            }
                            google.charts.setOnLoadCallback(drawChart());
                        }
                        // if(j == zones_select.length){
                        $(".single-item").slick({
                            dots: true,
                            arrows: false
                        });
                        slickDestroyCount++;
                    
                       // }
                    }
                    else {
                        $("#piechart").show()
                        for (i = 0; i < Object.keys(res.data).length; i++) {

                            class0 = class0 + parseInt(res.data[i].Class0Count);
                            class1 = class1 + parseInt(res.data[i].Class1Count);
                            class2 = class2 + parseInt(res.data[i].Class2Count);
                            class3 = class3 + parseInt(res.data[i].Class3Count);
                            class4 = class4 + parseInt(res.data[i].Class4Count);
                            class5 = class5 + parseInt(res.data[i].Class5Count);
                            class6 = class6 + parseInt(res.data[i].Class6Count);
                            class7 = class7 + parseInt(res.data[i].Class7Count);
                            class8 = class8 + parseInt(res.data[i].Class8Count);
                            class9 = class9 + parseInt(res.data[i].Class9Count);
                            class10 = class10 + parseInt(res.data[i].Class10Count);
                            class11 = class11 + parseInt(res.data[i].Class11Count);
                            class12 = class12 + parseInt(res.data[i].Class12Count);
                            class13 = class13 + parseInt(res.data[i].Class13Count);
                            class14 = class14 + parseInt(res.data[i].Class14Count);
                            class15 = class15 + parseInt(res.data[i].Class15Count);
                            class16 = class16 + parseInt(res.data[i].Class16Count);
                            class17 = class17 + parseInt(res.data[i].Class17Count);
                            class18 = class18 + parseInt(res.data[i].Class18Count);
                            class19 = class19 + parseInt(res.data[i].Class19Count);
                            class20 = class20 + parseInt(res.data[i].Class20Count);
                        }
                        google.charts.setOnLoadCallback(drawChart());
                        // $('.loader').hide();
                    }
                }
            },
            // complete: function (res) {
            //     google.charts.setOnLoadCallback(drawChart());
            // }

        })

        function drawChart() {
            var arrayobject = [];

            for (var pc = 0; pc < updatedClassData.length; pc++) {
                ['Class', 'Total FLow'],
              arrayobject.push([updatedClassData[pc].binName, 'class'+updatedClassData[pc].binNumber])
            }
            // console.log(arrayobject);


            var data = google.visualization.arrayToDataTable([
                ['Class', 'Total FLow'],
                [updatedClassData[0].binName, class0],
                [updatedClassData[1].binName, class1],
                [updatedClassData[2].binName, class2],
                [updatedClassData[3].binName, class3],
                [updatedClassData[4].binName, class4],
                [updatedClassData[5].binName, class5],
                [updatedClassData[6].binName, class6],
                [updatedClassData[7].binName, class7],
                [updatedClassData[8].binName, class8],
                [updatedClassData[9].binName, class9],
                [updatedClassData[10].binName, class10],
                [updatedClassData[11].binName, class11],
                [updatedClassData[12].binName, class12],
                [updatedClassData[13].binName, class13],
                [updatedClassData[14].binName, class14],
                [updatedClassData[15].binName, class15],
                [updatedClassData[16].binName, class16],
                [updatedClassData[17].binName, class17],
                [updatedClassData[18].binName, class18],
                [updatedClassData[19].binName, class19],
                [updatedClassData[20].binName, class20],

            ]);
        


            if (zones_select.length > 1 || zones_select[0] != "all") {
                var options = {
                    height: 700,
                    width: 700,
                    title: sdesc
                };
                var chart = new google.visualization.PieChart(document.getElementById(slickClass));
                chart.draw(data, options);
                c = c + 1;
                slickCarousel = "";
                class0 = 0, class1 = 0, class2 = 0, class3 = 0, class4 = 0, class5 = 0, class6 = 0, class7 = 0, class8 = 0, class9 = 0, class10 = 0, class11 = 0, class12 = 0, class13 = 0, class14 = 0, class15 = 0, class16 = 0, class17 = 0, class18 = 0, class19 = 0, class20 = 0;
            }
           else if (scn.length >= 1 && scn[0] != "all") {
                var options = {
                    height: 700,
                    width: 700,
                    title: syscdn
                };
                var chart = new google.visualization.PieChart(document.getElementById(slickClass));
                chart.draw(data, options);
                syscdn =''
                c = c + 1;
                slickCarousel = "";
                class0 = 0, class1 = 0, class2 = 0, class3 = 0, class4 = 0, class5 = 0, class6 = 0, class7 = 0, class8 = 0, class9 = 0, class10 = 0, class11 = 0, class12 = 0, class13 = 0, class14 = 0, class15 = 0, class16 = 0, class17 = 0, class18 = 0, class19 = 0, class20 = 0;
            }
            else if (scn[0] == "all" && zones_select[0] == "all") {
                var options = {
                    height: 700,
                    legend: {position: 'right', maxLines: 2},
                    width: 700,
                    title: syscdn
                };
                var chart = new google.visualization.PieChart(document.getElementById(slickClass));
                chart.draw(data, options);
                syscdn =''
                c = c + 1;
                slickCarousel = "";
                class0 = 0, class1 = 0, class2 = 0, class3 = 0, class4 = 0, class5 = 0, class6 = 0, class7 = 0, class8 = 0, class9 = 0, class10 = 0, class11 = 0, class12 = 0, class13 = 0, class14 = 0, class15 = 0, class16 = 0, class17 = 0, class18 = 0, class19 = 0, class20 = 0;
            }

            else {
                var options = {
                    height: 700,
                    legend: {position: 'top', maxLines: 3},
                    width: 700,
                };
                var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                chart.draw(data, options);
            }
            zonetitle = '';
        }
        google.charts.load('current', { 'packages': ['corechart'] });
    }

    $("#createReport").click(function () {
        slickClass ='';
        $('#slick_carousel div').empty();
        // $('.loader').show();
        $('#piechart').html();
        $("#piechart").hide()
        $(".container").hide()
       
        // $(".single-item").html('')
        if(slickDestroyCount > 0){
            $('.single-item').slick('unslick');
            slickDestroyCount--;
        }
        // $('.single-item').slick('unslick');
        get_dt()
        // $('.loader').hide();

    });





})
