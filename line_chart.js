var allDeviceList = [];
var res;
var zones_select = [];
var scn = [];
flag=0;
// var scope =[];
$(document).ready(function () {
    // $(".frame-view").slick('unslick');

    var dates = getCurrentStartNEndDate();
    $("#start_date").val(
        getFormattedDate(dates[0], "Y-m-d H:m:s", "d-m-y H:m:s").split(" ")[0]
    );
    $("#end_date").val(
        getFormattedDate(dates[1], "Y-m-d H:m:s", "d-m-y H:m:s").split(" ")[0]
    );

    // setStartAndEndDate('#start_date', '#end_date', 365, true);

    var detector_types_arr = [];
    var class_head_arr = [];
    var device_zones_arr = [];
    var devices_arr = [];
    var make_modal_arr = [];

    $.ajax({
        url: "../../../models/detector/detector_report_filters.hh",
        type: "POST",
        success: function (result) {
            var result = JSON.parse(result);
            // console.log(result);
            detector_types_arr = result.detector_types;
            class_head_arr = result.class_head;
            device_zones_arr = result.device_zones;
            devices_arr = result.devices;
            make_modal_arr = result.make_model;
            setTimeout(()=>{
                if(devices_arr.devices_types[$("#device_type").val()]==undefined){
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
        },1000)
            if (detector_types_arr.length < 1) {
                $.alert({
                    type: "red",
                    title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                    content: '<div class="fw-bold">No detector type added</div>',
                });
                $("#device_type").empty();
            } else {
                devicetable_tbody = "";
                for (var i = 0; i < detector_types_arr.length; i++) {
                    devicetable_tbody +=
                        '<option value="' +
                        detector_types_arr[i].TypeID +
                        '">' +
                        detector_types_arr[i].TypeDescription +
                        "</option>";
                }
                $("#device_type").html(devicetable_tbody);
                $("#device_type").trigger("change");
            }
        },
    });

    $("#device_type").on("change", function () {
        var type = $(this).val();

        if ($("#report_type").val() == "classified") {
            $(".atcc_filter_content").hide();
            $(".non-vbv").show();
            //populateMakeModel();
        } else {
            $(".atcc_filter_content").hide();
            $(".non-vbv").show();
            //getDeviceScns($(this).val());
            //populateMakeModel();
        }
        var scns = devices_arr.devices_types[type];
        var scn_zone = [];
        var makemodal = make_modal_arr[type];
        var makemodalarr = [];
        for (const key in makemodal) {
            if (key != undefined) {
                makemodalarr.push(makemodal[key]);
            }
        }
        $("#make_model").empty();
        $("#devicetable_tbody").html("");
        $("#zones_select").html("");
        $("#vehicle_class").html("");
        for (var i = 0; i < makemodalarr.length; i++) {
            $("#make_model").append(
                '<option value="' +
                makemodalarr[i].ID +
                '">' +
                makemodalarr[i].Make +
                " - " +
                makemodalarr[i].Model +
                "</option>"
            );
        }
        $("#make_model").change();
    });

    $("#make_model").on("change", function () {
        var make_model = $("#make_model").val();
        var nscns = devices_arr.devices_make_model[make_model];
        if (nscns != undefined && nscns != "") {
            var scns = [];
            for (const key in nscns) {
                if (key != undefined) {
                    scns.push(nscns[key]);
                }
            }
            var scn_zone = [];
            devicetable_tbody = '<option value="all" selected>All devices</option>';
            allDeviceList = scns;
            for (var i = 0; i < scns.length; i++) {
                scn_zone[i] = scns[i].SystemCodeNumber;
                devicetable_tbody +=
                    '<option value="' +
                    scns[i].SystemCodeNumber +
                    '">' +
                    scns[i].Place +
                    " - " +
                    scns[i].ShortDescription +
                    "</option>";
            }
            $("#devicetable_tbody").html(devicetable_tbody);
            var selectzones = '<option value="all" selected>All</option>';
            for (var z = 0; z < scn_zone.length; z++) {
                var zonearr = device_zones_arr[scn_zone[z]];
                var newzones = [];
                if (zonearr != undefined) {
                    for (const key in zonearr) {
                        if (key != undefined) {
                            newzones.push(zonearr[key]);
                        }
                    }
                    for (var d = 0; d < newzones.length; d++) {
                        selectzones +=
                            '<option value="' +
                            newzones[d].ZoneSCN +
                            '">' +
                            newzones[d].ZoneName +
                            "</option>";
                    }
                }
            }
            $("#zones_select").html(selectzones);

            var newclass_heads = class_head_arr[make_model];
            var class_heads = [];
            if (newclass_heads != undefined && newclass_heads != "") {
                for (const key in newclass_heads) {
                    if (key != undefined) {
                        class_heads.push(newclass_heads[key]);
                    }
                }
                var vehicle_class = '<option value="all" selected>All</option>';
                for (var c = 0; c < class_heads.length; c++) {
                    vehicle_class +=
                        '<option value="' +
                        class_heads[c].binName +
                        '">' +
                        class_heads[c].binName +
                        "</option>";
                }
                $("#vehicle_class").html(vehicle_class);
            } else {
                $("#vehicle_class").html("");
            }
        } else {
            $("#devicetable_tbody").html("");
            $("#zones_select").html("");
            $("#vehicle_class").html("");
        }
    });

    $("#devicetable_tbody").on("change", function () {
        var selectedscn = $("#devicetable_tbody").val();
        var selectzones = '<option value="all" selected>All</option>';
        if (selectedscn == null) {
            $("#devicetable_tbody > option").each(function () {
                var optval = $(this).val();

                if (optval != "all") {
                    var zonearr = device_zones_arr[optval];
                    var newzones = [];
                    for (const key in zonearr) {
                        if (key != undefined) {
                            newzones.push(zonearr[key]);
                        }
                    }
                    for (var d = 0; d < newzones.length; d++) {
                        selectzones +=
                            '<option value="' +
                            newzones[d].ZoneSCN +
                            '">' +
                            newzones[d].ZoneName +
                            "</option>";
                    }
                }
            });
        } else {
            if (selectedscn.includes("all")) {
                $("#devicetable_tbody > option").each(function () {
                    var optval = $(this).val();
                    if (optval != "all") {
                        var zonearr = device_zones_arr[optval];
                        var newzones = [];
                        for (const key in zonearr) {
                            if (key != undefined) {
                                newzones.push(zonearr[key]);
                            }
                        }
                        for (var d = 0; d < newzones.length; d++) {
                            selectzones +=
                                '<option value="' +
                                newzones[d].ZoneSCN +
                                '">' +
                                newzones[d].ZoneName +
                                "</option>";
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
                            newzones.push(zonearr[key]);
                        }
                    }
                    for (var d = 0; d < newzones.length; d++) {
                        selectzones +=
                            '<option value="' +
                            newzones[d].ZoneSCN +
                            '">' +
                            newzones[d].ZoneName +
                            "</option>";
                    }
                }
            }
        }

        $("#zones_select").html(selectzones);
    });

    $("#report_type").on("change", function () {
        if ($(this).val() == "vbv" && $("#device_type").val() == "4") {
            $(".vbv_filter_content").show();
            $(".atcc_filter_content").show();
            $(".drection_lbl").hide();
            $(".drection_col").hide();
            $(".error_lbl").hide();
            $(".error_col").hide();
            $(".classified_data_content").hide();
            //populateMakeModel();
        } else if ($(this).val() == "vbv") {
            $(".vbv_filter_content").show();
            $(".classified_data_content").hide();
            $(".non-vbv").hide();
            //populateMakeModel();
        } else if ($(this).val() == "aggregate") {
            $(".vbv_filter_content").hide();
            $(".atcc_filter_content").hide();
            $(".classified_data_content").hide();
            $(".non-vbv").show();
            //populateMakeModel();
        } else {
            $(".vbv_filter_content").show();
            $(".atcc_filter_content").hide();
            $(".classified_data_content").show();
            $(".non-vbv").show();
            //populateMakeModel();
        }
        $("#device_type").trigger("change");
    });
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

    $("input[name=profile]").change(function () {
        var profile = $("input[name=profile]:checked").val();
        if (profile == "on") {
            $(".pcurow").removeClass("hide");
            $("input[type=radio][name=pcuOff]").attr("checked", true);
        } else {
            $("input[type=radio][name=pcuOff]").prop("checked", true);
            $("input[type=radio][name=pcuOn]").prop("checked", false);
            $(".pcurow").addClass("hide");
        }
        // if(profile == "off"){
        //     // $('input[name=pcu]').prop('checked', false);
        //     // $('input[name=pcu]', this).prop('checked', false)
        //     $("input[type=radio][name=pcuOff]").attr('checked', true);
        // }
        // else{
        //     $("input[type=radio][name=pcuOn]").attr('checked', true);
        // }
    });
});

$(document).ready(function () {
    $(".slick-carousel").hide();

    var slickDestroyCount = 0;
    var pcu_data = [];
    var slickdivid = 1;
    var sdesc;
    var slickCarousel;
    var slickClass;
    var updatedClassData = [];
    var deviceZone;

    function get_dt() {
        var chartDiv = document.getElementById("chart_div");
        // var carouselDiv = document.getElementById('slick_carousel');
        // var profile = sanitize($("input[name=profile]:checked").val());
        // var pcu = sanitize($("input[name=pcu]:checked").val());

        // if(profile == "off"){
        //     $("input[type=radio][name=pcu]").prop('checked', false);
        //     // $('input[name=pcu]').prop('checked', false);
        //     // $('input[name=pcu]', this).prop('checked', false)
        // }

        var FromDate = sanitize(
            getFormattedDate($("#start_date").val(), "d-m-y", "Y-m-d")
        );
        var ToDate = sanitize(
            getFormattedDate($("#end_date").val(), "d-m-y", "Y-m-d")
        );
        var fromTime = sanitize($("#from_time").val());
        var toTime = sanitize($("#to_time").val());

        var fromDate = FromDate + " " + fromTime;
        var toDate = ToDate + " " + toTime;

        if (
            $("#devicetable_tbody").val() == "" ||
            $("#devicetable_tbody").val() == null
        ) {
            $.alert({
                type: "red",
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select Devices</div>',
            });
            return;
        }

        scn = $("#devicetable_tbody").val();
        var device_type = sanitize($("#device_type :selected").val());
        var report_type = sanitize($("#report_type :selected").val());
        var direction = sanitize($("#direction :selected").val());
        // var lane = sanitize($("#lane :selected").val());
        var error = sanitize($("#error :selected").val());
        var vehicle_class = $("#vehicle_class").val();
        var order_by = sanitize($("#order_by :selected").val());
        zones_select = $("#zones_select").val();
        var day_type = $("input[name=data_type]:checked").val();
        var aggregation = $("input[name=aggregation]:checked").val();
        if (fromDate > toDate) {
            $.alert({
                type: "red",
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content:
                    '<div class="fw-bold">From Date should be less than To Date</div>',
            });
            return;
        }
        if (vehicle_class == null || vehicle_class == "") {
            $.alert({
                type: "red",
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select vehicle class</div>',
            });
            return;
        }
        var chartData = [];
        var classMap = {};

        $.ajax({
            url: "../../../models/detector/get_detector_class_head.hh",
            method: "POST",
            data: {
                makeid: $("#make_model").val(),
                // scn: scn
            },
            success: function (res) {
                pcu_data = jQuery.parseJSON(res);
                for (pc = 0; pc < pcu_data.length; pc++) {
                    var pcuClassObj = pcu_data[pc];
                    if (pcuClassObj && pcuClassObj.binNumber) {
                        classMap[pcuClassObj.binNumber] = pcuClassObj;
                    }
                }

                for (i = 0; i < 21; i++) {
                    var updatedobj = {};
                    if (classMap["" + i]) {
                        updatedobj.binName = classMap["" + i].binName;
                        updatedobj.binNumber = classMap["" + i].binNumber;
                    } else {
                        updatedobj.binName = "";
                        updatedobj.binNumber = i + "";
                    }
                    updatedClassData.push(updatedobj);
                    // console.log(updatedClassData);
                }
            },
        });

        $.ajax({
            url: "../../../models/detector/createreport_detector.hh",
            type: "POST",
            data: {
                makeid: $("#make_model").val(),
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
                order_by: order_by,
            },
            success: function (res) {
                $("#chart_div").html("");

                if (res.length == 2) {
                    // console.log("hhhhh")
                    $.alert({
                        type: "red",
                        title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">No Data Available</div>',
                    });
                    return;
                } else {
                    // console.log("iiiii")
                    res = JSON.parse(res);

                    if (res.length == 0 || res.data.length == undefined) {
                        $.alert({
                            type: "red",
                            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                            content: '<div class="fw-bold">No Data Available</div>',
                        });
                        return;
                    } else {
                        // console.log("jjjjj")
                        viewLineChart(res);
                    }
                }
            },
        });
    }
    function viewLineChart(res) {
        var profile = sanitize($("input[name=profile]:checked").val());
        var pcu = sanitize($("input[name=pcu]:checked").val());

        if (zones_select[0] == "all" && scn[0] == "all") {
            for (scnsvar = 0; scnsvar < allDeviceList.length; scnsvar++) {
                var pcuClassCountList = setDefaultClassCount(pcu_data);
                var chartData = [];
                slickCarousel =
                    '<div"><span  id="slickdiv' + slickdivid + '"></span></div>';
                slickClass = "slickdiv" + slickdivid;
                $("#slick_carousel").append(slickCarousel);
                zonetitle = allDeviceList[scnsvar].SystemCodeNumber;

                var lengthDevice = allDeviceList.length;
                deviceZone = allDeviceList[lengthDevice - 1];

                var data = new google.visualization.DataTable();
                var columnsArray = [];
                data.addColumn("datetime", "Date");
                data.addColumn("number", "Total flow");
                if (profile == "on" && pcu == "off") {
                    for (j = 0; j < pcuClassCountList.length; j++) {
                        var pcuObj = pcuClassCountList[j];
                        data.addColumn("number", pcuObj.binName);
                    }
                } else if (profile == "on" && pcu == "on") {
                    for (j = 0; j < pcuClassCountList.length; j++) {
                        var pcuObj = pcuClassCountList[j];
                        data.addColumn("number", "PCU" + "-" + pcuObj.binName);
                    }
                }

                for (var i = 0; i < res.data.length; i++) {
                    $(".container").removeClass("hide");
                    pcuClassCountList = setDefaultClassCount(pcu_data);
                    if (res.data[i].SystemCodeNumber.includes(zonetitle)) {
                        title = allDeviceList[scnsvar].Place + "-" + zonetitle;
                        if (profile == "off") {
                            var fin = [];
                            var dfin = [];
                            dfin.push(getDate(res.data[i]));
                            var totalflow = parseFloat(res.data[i].TotalFlow);
                            dfin.push(totalflow);
                            // fin.push(dfin);
                            chartData.push(dfin);
                        } else if (profile == "on") {
                            for (k = 0; k < pcuClassCountList.length; k++) {
                                var pcuClassCountObj = pcuClassCountList[k];
                                if (
                                    res.data[i]["Class" + pcuClassCountObj.binNumber + "Count"]
                                ) {
                                    pcuClassCountObj.count = parseInt(
                                        res.data[i]["Class" + pcuClassCountObj.binNumber + "Count"]
                                    );
                                    if (pcu == "on") {
                                        pcuClassCountObj.count =
                                            pcuClassCountObj.count * parseInt(pcuClassCountObj.PCU);
                                    }
                                }
                            }
                            var fin = [];
                            var dfin = [];
                            dfin.push(getDate(res.data[i]));
                            var totalflow = parseFloat(res.data[i].TotalFlow);
                            dfin.push(totalflow);
                            for (l = 0; l < pcuClassCountList.length; l++) {
                                var pcuClassCountObj = pcuClassCountList[l];
                                dfin.push(pcuClassCountObj.count);
                            }
                            // fin.push(dfin);
                            chartData.push(dfin);
                        }
                    }
                }
                data.addRows(chartData);
                var materialOptions = getMaterialOptions(title);
                if (scn.length >= 1 && scn[0] == "all") {
                    drawCarouselClassicChart(slickClass, materialOptions, data);

                    slickdivid = slickdivid + 1;

                    if (scnsvar == allDeviceList.length - 1) {
                        $(".single-item").slick({
                            dots: true,
                            arrows: false,
                        });
                        slickDestroyCount++;
                    }

                    slickCarousel = "";
                } else {
                    drawClassicChart(chartDiv, materialOptions, data);
                }
            }
        } else if (zones_select[0] == "all" && scn[0] != "all") {
            var selectedDeviceList = [];
            for (scnd = 0; scnd < scn.length; scnd++) {
                for (scnsvar = 0; scnsvar < allDeviceList.length; scnsvar++) {
                    if (scn[scnd] == allDeviceList[scnsvar].SystemCodeNumber) {
                        selectedDeviceList.push(allDeviceList[scnsvar]);
                        break;
                    }
                }
            }

            for (scnd = 0; scnd < selectedDeviceList.length; scnd++) {
                var pcuClassCountList = setDefaultClassCount(pcu_data);
                var chartData = [];
                slickCarousel =
                    '<div"><span  id="slickdiv' + slickdivid + '"></span></div>';
                slickClass = "slickdiv" + slickdivid;
                $("#slick_carousel").append(slickCarousel);
                zonetitle = selectedDeviceList[scnd].SystemCodeNumber;

                var lengthDevice = selectedDeviceList.length;
                deviceZone = selectedDeviceList[lengthDevice - 1];

                var data = new google.visualization.DataTable();
                var columnsArray = [];
                data.addColumn("datetime", "Date");
                data.addColumn("number", "Total flow");
                if (profile == "on" && pcu == "off") {
                    for (j = 0; j < pcuClassCountList.length; j++) {
                        var pcuObj = pcuClassCountList[j];
                        data.addColumn("number", pcuObj.binName);
                    }
                } else if (profile == "on" && pcu == "on") {
                    for (j = 0; j < pcuClassCountList.length; j++) {
                        var pcuObj = pcuClassCountList[j];
                        data.addColumn("number", "PCU" + "-" + pcuObj.binName);
                    }
                }
                for (var i = 0; i < res.data.length; i++) {
                    $(".container").removeClass("hide");
                    pcuClassCountList = setDefaultClassCount(pcu_data);
                    if (res.data[i].SystemCodeNumber.includes(zonetitle)) {
                        title = selectedDeviceList[scnd].Place + "-" + zonetitle;
                        if (profile == "off") {
                            var fin = [];
                            var dfin = [];
                            dfin.push(getDate(res.data[i]));
                            var totalflow = parseFloat(res.data[i].TotalFlow);
                            dfin.push(totalflow);
                            // fin.push(dfin);
                            chartData.push(dfin);
                        } else if (profile == "on") {
                            for (k = 0; k < pcuClassCountList.length; k++) {
                                var pcuClassCountObj = pcuClassCountList[k];
                                if (
                                    res.data[i]["Class" + pcuClassCountObj.binNumber + "Count"]
                                ) {
                                    pcuClassCountObj.count = parseInt(
                                        res.data[i]["Class" + pcuClassCountObj.binNumber + "Count"]
                                    );
                                    if (pcu == "on") {
                                        pcuClassCountObj.count =
                                            pcuClassCountObj.count * parseInt(pcuClassCountObj.PCU);
                                    }
                                }
                            }
                            var fin = [];
                            var dfin = [];
                            dfin.push(getDate(res.data[i]));
                            var totalflow = parseFloat(res.data[i].TotalFlow);
                            dfin.push(totalflow);
                            for (l = 0; l < pcuClassCountList.length; l++) {
                                var pcuClassCountObj = pcuClassCountList[l];
                                dfin.push(pcuClassCountObj.count);
                            }
                            // fin.push(dfin);
                            chartData.push(dfin);
                        }
                    }
                }
                data.addRows(chartData);
                var materialOptions = getMaterialOptions(title);
                if (scn.length >= 1) {
                    drawCarouselClassicChart(slickClass, materialOptions, data);

                    slickdivid = slickdivid + 1;

                    if (scnd == selectedDeviceList.length - 1) {
                        $(".single-item").slick({
                            dots: true,
                            arrows: false,
                        });
                        slickDestroyCount++;
                    }
                    slickCarousel = "";
                } else {
                    drawClassicChart(chartDiv, materialOptions, data);
                }
            }
        } else {
            var selectedDeviceList = [];

            for (zone = 0; zone < zones_select.length; zone++) {
                // var devicezone = zones_select[zone];
                var title = "";

                var pcuClassCountList = setDefaultClassCount(pcu_data);
                var chartData = [];
                slickCarousel =
                    '<div"><span  id="slickdiv' + slickdivid + '"></span></div>';
                slickClass = "slickdiv" + slickdivid;
                $("#slick_carousel").append(slickCarousel);
                var zoneScn = zones_select[zone];

                // var lengthDevice = selectedDeviceList.length;
                // deviceZone = selectedDeviceList[lengthDevice - 1];

                var data = new google.visualization.DataTable();
                var columnsArray = [];
                data.addColumn("datetime", "Date");
                data.addColumn("number", "Total flow");
                if (profile == "on" && pcu == "off") {
                    for (j = 0; j < pcuClassCountList.length; j++) {
                        var pcuObj = pcuClassCountList[j];
                        data.addColumn("number", pcuObj.binName);
                    }
                } else if (profile == "on" && pcu == "on") {
                    for (j = 0; j < pcuClassCountList.length; j++) {
                        var pcuObj = pcuClassCountList[j];
                        data.addColumn("number", "PCU" + "-" + pcuObj.binName);
                    }
                }
                for (var i = 0; i < res.data.length; i++) {
                    $(".container").removeClass("hide");
                    pcuClassCountList = setDefaultClassCount(pcu_data);
                    if (res.data[i].SystemCodeNumber.includes(zoneScn)) {
                        title = res.data[i].ShortDescription;

                        // title = selectedDeviceList[scnd].Place + '-' + zoneName;

                        if (profile == "off") {
                            var fin = [];
                            var dfin = [];
                            dfin.push(getDate(res.data[i]));
                            var totalflow = parseFloat(res.data[i].TotalFlow);
                            dfin.push(totalflow);
                            // fin.push(dfin);
                            chartData.push(dfin);
                        } else if (profile == "on") {
                            for (k = 0; k < pcuClassCountList.length; k++) {
                                var pcuClassCountObj = pcuClassCountList[k];
                                if (
                                    res.data[i]["Class" + pcuClassCountObj.binNumber + "Count"]
                                ) {
                                    pcuClassCountObj.count = parseInt(
                                        res.data[i]["Class" + pcuClassCountObj.binNumber + "Count"]
                                    );
                                    if (pcu == "on") {
                                        pcuClassCountObj.count =
                                            pcuClassCountObj.count * parseInt(pcuClassCountObj.PCU);
                                    }
                                }
                            }
                            var fin = [];
                            var dfin = [];
                            dfin.push(getDate(res.data[i]));
                            var totalflow = parseFloat(res.data[i].TotalFlow);
                            dfin.push(totalflow);
                            for (l = 0; l < pcuClassCountList.length; l++) {
                                var pcuClassCountObj = pcuClassCountList[l];
                                dfin.push(pcuClassCountObj.count);
                            }
                            // fin.push(dfin);
                            chartData.push(dfin);
                        }
                    }
                }
                data.addRows(chartData);
                var materialOptions = getMaterialOptions(title);
                if (scn.length >= 1) {
                    drawCarouselClassicChart(slickClass, materialOptions, data);

                    slickdivid = slickdivid + 1;

                    if (zone == zones_select.length - 1) {
                        $(".single-item").slick({
                            dots: true,
                            arrows: false,
                        });
                        slickDestroyCount++;
                    }

                    slickCarousel = "";
                } else {
                    drawClassicChart(chartDiv, materialOptions, data);
                }
            }
        }
    }

    function drawCarouselClassicChart(slickClass, materialOptions, data) {
        var classicChart = new google.visualization.LineChart(
            document.getElementById(slickClass)
        );
        classicChart.draw(data, google.charts.Line.convertOptions(materialOptions));
        chartData = [];
        sdesc = "";
    }

    function drawClassicChart(chartDiv, materialOptions, data) {
        var classicChart = new google.visualization.LineChart(chartDiv);
        classicChart.draw(data, google.charts.Line.convertOptions(materialOptions));
    }

    function setDefaultClassCount(pcu_data) {
        var pcuClassCountList = [];
        for (pc = 0; pc < pcu_data.length; pc++) {
            var pcuClassObj = pcu_data[pc];
            if (pcuClassObj && pcuClassObj.binNumber) {
                var classCountMap = {};
                classCountMap.binNumber = pcuClassObj.binNumber;
                classCountMap.count = 0;
                classCountMap.binName = pcuClassObj.binName;
                classCountMap.PCU = pcuClassObj.PCU;
                pcuClassCountList.push(classCountMap);
            }
        }
        return pcuClassCountList;
    }

    function getMaterialOptions(title) {
        var materialOptions = {
            curveType: "function",
            width: 1300,
            height: 500,
            hAxis: {
                title: title,
                // textStyle: {color: 'black', fontName: 'Arial Black',fontSize: 10},
                titleTextStyle: {
                    color: "#000000",
                    fontSize: 20,
                    fontName: "Arial",
                    bold: true,
                    italic: false,
                },
            },
            // hAxis: {
            //     title: 'Time'
            //   },
            vAxis: {
                viewWindowMode: "explicit",
                viewWindow: { min: 0 },
                title: "Flow (No. of Vehicles)",
                // legend: 'none',
                titleTextStyle: {
                    color: "#000000",
                    fontSize: 20,
                    fontName: "Arial",
                    bold: true,
                    italic: false,
                },
            },
            interpolateNulls: true,
            axes: {
                y: [
                    {
                        stacked: true,
                        all: {
                            range: {
                                min: 0,
                            },
                        },
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
            explorer: {
                axis: "horizontal",
                // actions: ['dragToZoom', 'rightClickToReset'],
                keepInBounds: true,
                maxZoomIn: 20.0,
            },
        };
        return materialOptions;
    }

    function getDate(dataObj) {
        var gdate = dataObj.LastUpdated;

        var dateIn = new Date(
            gdate.split("-")[0] +
            "/" +
            gdate.split("-")[1] +
            "/" +
            gdate.split("-")[2]
        );
        var y = dateIn.getFullYear();
        var m =
            dateIn.getMonth() >= 10 ? dateIn.getMonth() : "0" + dateIn.getMonth();
        var d = dateIn.getDate() >= 10 ? dateIn.getDate() : "0" + dateIn.getDate();
        var dateTime = gdate.split(" ");
        var hour = dateTime[1].split(":")[0];
        var minutes = dateTime[1].split(":")[1];
        var seconds = dateTime[1].split(":")[2];
        return new Date(y, m, d, hour, minutes, seconds);
    }
    $("#createReport").click(function () {
        updatedClassData = [];
        slickdivid = 1;
        slickCarousel = "";
        $("#slick_carousel").html("");
        $("#chart_div").empty();
        $(".container").addClass("hide");
        $("#chart_div").addClass("hide");

        if (slickDestroyCount != 0) {
            $(".single-item").slick("unslick");
            slickDestroyCount--;
        }

        google.charts.load("current", { packages: ["corechart", "line"] });
        google.charts.setOnLoadCallback(get_dt);
        $(".single-item").slick("unslick");
    });

    $("input[type=radio][name=profile]").change(function () {
        updatedClassData = [];
        slickdivid = 1;
        $("#slick_carousel").html("");
        $("#chart_div").empty();
        $(".container").addClass("hide");
        $("#chart_div").addClass("hide");
        if (slickDestroyCount != 0) {
            $(".single-item").slick("unslick");
            slickDestroyCount--;
        }
        google.charts.load("current", { packages: ["corechart", "line"] });
        google.charts.setOnLoadCallback(get_dt);
        $(".single-item").slick("unslick");
    });
    $("input[type=radio][name=pcu]").change(function () {
        updatedClassData = [];
        slickdivid = 1;
        $("#slick_carousel").html("");
        $("#chart_div").empty();
        $(".container").addClass("hide");
        $("#chart_div").addClass("hide");

        if (slickDestroyCount != 0) {
            $(".single-item").slick("unslick");
            slickDestroyCount--;
        }
        google.charts.load("current", { packages: ["corechart", "line"] });
        google.charts.setOnLoadCallback(get_dt);
        $(".single-item").slick("unslick");
    });
});
