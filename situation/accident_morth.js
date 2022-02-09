var roaduser_types;

function js_yyyy_mm_dd_hh_mm_ss() {
    now = new Date();
    var year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }

    var hours = now.getHours();
    hours = (hours + 24 - 2) % 24;

    return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second + ((hours < 12) ? 'am' : 'pm');
}

$(document).ready(function () {
    get_parameter_by_name = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);

        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $('.nav li').each(function (i, obj) {
        var href = $('a', obj).attr('href') + "?module=" + get_parameter_by_name('module') + "&id=" + get_parameter_by_name('id')
        $('a', obj).attr('href', href)
    })

    $('.downloadPdf').click(function(){
        var year = $('.selectyear').val();
        $.ajax({
            url: '../../../models/utils/get_username.hh',
            type: 'POST',
            success: function(result_username) {
                var username = JSON.parse(result_username).user;
                window.open("../../../models/situation/get_morth_data_pdf.hh?year=" + year +"&username="+username,'_blank');
            }
        });
    })

    getData = function (year, isPrint = false) {
        
        $.ajax({
            url: '../../../models/situation/get_morth_types.hh',
            method: 'POST',
            success: function (result) {
                var result = JSON.parse(result);
                accident_types = result.morth_accident_type;
                $.ajax({
                    url: '../../../models/situation/get_morth_data.hh',
                    method: 'POST',
                    data: { year: year, isPrint: isPrint },
                    success: function (res) {
                        res = JSON.parse(res)
                        accident_month = res.accident_month;
                        typeofarea_urban = res.typeofarea_urban;
                        typeofarea_rural = res.typeofarea_rural
                        typeofweather = res.typeofweather
                        typeofroadclassification = res.typeofroadclassification
                        typeofaccidentspot = res.typeofaccidentspot
                        roadfeatures = res.roadfeatures
                        junctiontype = res.junctiontype
                        trafficcontrol = res.trafficcontrol
                        impacting_vehicle = res.impacting_vehicle
                        ageofvehicle = res.ageofvehicle
                        typeofloadcondition = res.typeofloadcondition
                        typeofcollisionA = res.typeofcollisionA
                        typeoftrafficviolation = res.typeoftrafficviolation
                        typeoflicence = res.typeoflicence
                        pedestrian = res.pedestrian
                        typeofcollisionB = res.typeofcollisionB

                        useofreqsafetydevice = res.useofreqsafetydevice
                        typeofvictim_age_gender = res.typeofvictim_age_gender
                        typeofroadusers = res.typeofroadusers
                        morth_person_types = res.morth_person_types;
                        morth_accident_types = {};
                        for(var i=0;i<res.morth_accident_types.length;i++)
                            morth_accident_types[res.morth_accident_types[i].id] = res.morth_accident_types[i].accident_type;
                        
                        
                        // Table 1
                        for(var i=1;i<=12;i++)
                        {
                            for(var j=1;j<=Object.keys(morth_accident_types).length;j++)
                            {
                                $('#table1 tbody #month_' + i + ' td:nth-child(' + (j+1) + ')').html('0');
                            }
                            for(var j=1;j<=Object.keys(morth_person_types).length;j++)
                            {
                                $('#table1 tbody #month_' + i + ' td:nth-child(' + (Object.keys(morth_accident_types).length+j+3) + ')').html('0');
                            }
                        }
                        for (i = 0; i < accident_month.accident.length; i++) {
                            $('#table1 tbody #month_' + accident_month.accident[i].month + ' td:nth-child(' + (parseInt(accident_month.accident[i].accidenttype_id) + 1) + ')').html(accident_month.accident[i].total);
                        }
                        $('#table1 tbody tr').each(function (i, obj) {
                            var t = 0;
                            for (var accident_type = 0; accident_type < accident_types.length; accident_type++)
                                t += parseInt($('td:nth-child(' + (accident_type + 2) + ')', obj).html());
                            $('td:nth-child(' + (accident_types.length + 2) + ')', obj).html(t)
                        })
                        for (var i = 2; i < accident_types.length + 3; i++) {
                            var total = 0
                            for (var j = 1; j < $('#table1 table tbody').children().length; j++) {
                                total += parseInt($('#table1 tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#table1 tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }
                        for (i = 0; i < accident_month.persons.length; i++) {
                            $.each(accident_month.persons[i], function (key, value) {
                                if (key == "Fatal") {
                                    $('#table1 tbody #month_' + accident_month.persons[i].month + ' td:nth-child(' + (parseInt(0 + 1) + 6) + ')').html(accident_month.persons[i].Fatal);
                                }
                                if (key == "NoOfInjuredNeedingHospitalisation") {
                                    $('#table1 tbody #month_' + accident_month.persons[i].month + ' td:nth-child(' + (parseInt(0 + 1) + 7) + ')').html(accident_month.persons[i].NoOfInjuredNeedingHospitalisation);
                                }
                                if (key == "NoOfInjuredNotNeedingHospitalisation") {
                                    $('#table1 tbody #month_' + accident_month.persons[i].month + ' td:nth-child(' + (parseInt(0 + 1) + 8) + ')').html(accident_month.persons[i].NoOfInjuredNotNeedingHospitalisation);
                                }
                                if (key == "total") {
                                    $('#table1 tbody #month_' + accident_month.persons[i].month + ' td:nth-child(' + (parseInt(0 + 1) + 9) + ')').html(accident_month.persons[i].total);
                                }
                            });
                        }
                        for (var i = 6; i < 8 + 3; i++) {
                            var total = 0
                            for (var j = 1; j < $('#table1 table tbody').children().length; j++) {
                                total += parseInt($('#table1 tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#table1 tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }


                        // Table 2
                        var tableData = typeofarea_urban;
                        var times = [6,9,12,15,18,21,0,3];
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_arr = {};
                        var per_arr = {};
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        for(var timesKey=0;timesKey<times.length;timesKey++)
                        {
                            acc_arr[times[timesKey]] = [];
                            per_arr[times[timesKey]] = {};
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_arr[times[timesKey]][morth_person_typesValue]=0;
                                per_total[morth_person_typesValue]=0;
                            });
                        }
                        for(var acc_data_key=0;acc_data_key<acc_data.length;acc_data_key++)
                        {
                            for(var timesKey=0;timesKey<times.length;timesKey++)
                            {
                                if(acc_data[acc_data_key]['Urban']=='1'&&acc_data[acc_data_key]['hour_id']>=times[timesKey]&&acc_data[acc_data_key]['hour_id']<times[timesKey]+1)
                                {
                                    acc_arr[times[timesKey]].push(acc_data[acc_data_key]);
                                }
                            }
                        }
                        for(var per_data_key=0;per_data_key<per_data.length;per_data_key++)
                        {
                            for(var timesKey=0;timesKey<times.length;timesKey++)
                            {
                                if(per_data[per_data_key]['Urban']=='1'&&per_data[per_data_key]['hour_id']>=times[timesKey]&&per_data[per_data_key]['hour_id']<times[timesKey]+1)
                                {
                                    $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                        per_arr[times[timesKey]][morth_person_typesValue]=+per_data[per_data_key][morth_person_typesValue];
                                    });
                                }
                            }
                        }
                        for(var timesKey=0;timesKey<times.length;timesKey++)
                        {
                            var total=0;
                            for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                            {
                                var t = 0;
                                for(var acc_data_key=0;acc_data_key<acc_arr[times[timesKey]].length;acc_data_key++)
                                {
                                    if(parseInt(acc_arr[times[timesKey]][acc_data_key].accidenttype_id)==morth_accident_types_key)
                                        t+=parseInt(acc_arr[times[timesKey]][acc_data_key].total);
                                }
                                acc_total[morth_accident_types_key] += t;
                                total+=t;
                                var childno = (parseInt(morth_accident_types_key))
                                $('#typeofarea_urban tbody #urban_hour_' + times[timesKey] + ' td:nth-child(' + (childno + 1) + ')').html(t);
                            }
                            var childno = (parseInt(Object.keys(morth_accident_types).length))
                            $('#typeofarea_urban tbody #urban_hour_' + times[timesKey] + ' td:nth-child(' + (childno + 2) + ')').html(total);
                            t=0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#typeofarea_urban tbody #urban_hour_' + times[timesKey] + ' td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_arr[times[timesKey]][morth_person_typesValue]);
                                t+=per_arr[times[timesKey]][morth_person_typesValue];
                                per_total[morth_person_typesValue] += per_arr[times[timesKey]][morth_person_typesValue];
                            });
                            $('#typeofarea_urban tbody #urban_hour_' + times[timesKey] + ' td:nth-child(' + (Object.keys(morth_person_types).length + (Object.keys(morth_accident_types).length+3)) + ')').html(t);
                        }
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#typeofarea_urban tbody #urban_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#typeofarea_urban tbody #urban_total td:nth-child(' + (Object.keys(morth_accident_types).length+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#typeofarea_urban tbody #urban_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#typeofarea_urban tbody #urban_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);





                        var tableData = typeofarea_rural;
                        var times = [6,9,12,15,18,21,0,3];
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_arr = {};
                        var per_arr = {};
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        for(var timesKey=0;timesKey<times.length;timesKey++)
                        {
                            acc_arr[times[timesKey]] = [];
                            per_arr[times[timesKey]] = {};
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_arr[times[timesKey]][morth_person_typesValue]=0;
                                per_total[morth_person_typesValue]=0;
                            });
                        }
                        for(var acc_data_key=0;acc_data_key<acc_data.length;acc_data_key++)
                        {
                            for(var timesKey=0;timesKey<times.length;timesKey++)
                            {
                                if(acc_data[acc_data_key]['Rural']=='1'&&acc_data[acc_data_key]['hour_id']>=times[timesKey]&&acc_data[acc_data_key]['hour_id']<times[timesKey]+1)
                                {
                                    acc_arr[times[timesKey]].push(acc_data[acc_data_key]);
                                }
                            }
                        }


                        
                        for(var per_data_key=0;per_data_key<per_data.length;per_data_key++)
                        {
                            for(var timesKey=0;timesKey<times.length;timesKey++)
                            {
                                if(per_data[per_data_key]['Rural']=='1'&&per_data[per_data_key]['hour_id']>=times[timesKey]&&per_data[per_data_key]['hour_id']<times[timesKey]+1)
                                {
                                    $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                        per_arr[times[timesKey]][morth_person_typesValue]=+per_data[per_data_key][morth_person_typesValue];
                                    });
                                }
                            }
                        }
                        for(var timesKey=0;timesKey<times.length;timesKey++)
                        {
                            var total=0;
                            for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                            {
                                var t = 0;
                                for(var acc_data_key=0;acc_data_key<acc_arr[times[timesKey]].length;acc_data_key++)
                                {
                                    if(parseInt(acc_arr[times[timesKey]][acc_data_key].accidenttype_id)==morth_accident_types_key)
                                        t+=parseInt(acc_arr[times[timesKey]][acc_data_key].total);
                                }
                                acc_total[morth_accident_types_key] += t;
                                total+=t;
                                var childno = (parseInt(morth_accident_types_key))
                                $('#typeofarea_rural tbody #rural_hour_' + times[timesKey] + ' td:nth-child(' + (childno + 1) + ')').html(t);
                            }
                            var childno = (parseInt(Object.keys(morth_accident_types).length))
                            $('#typeofarea_rural tbody #rural_hour_' + times[timesKey] + ' td:nth-child(' + (childno + 2) + ')').html(total);
                            t=0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#typeofarea_rural tbody #rural_hour_' + times[timesKey] + ' td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_arr[times[timesKey]][morth_person_typesValue]);
                                t+=per_arr[times[timesKey]][morth_person_typesValue];
                                per_total[morth_person_typesValue] += per_arr[times[timesKey]][morth_person_typesValue];
                            });
                            $('#typeofarea_rural tbody #rural_hour_' + times[timesKey] + ' td:nth-child(' + (Object.keys(morth_person_types).length + (Object.keys(morth_accident_types).length+3)) + ')').html(t);
                        }
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#typeofarea_rural tbody #rural_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#typeofarea_rural tbody #rural_total td:nth-child(' + (Object.keys(morth_accident_types).length+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#typeofarea_rural tbody #rural_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#typeofarea_rural tbody #rural_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);

                        // Table 3
                        for(var i=1;i<=5;i++)
                        {
                            for(var j=1;j<=Object.keys(morth_accident_types).length;j++)
                            {
                                $('#typeofweather tbody #weather_' + i + ' td:nth-child(' + (j+1) + ')').html('0');
                            }
                            for(var j=1;j<=Object.keys(morth_person_types).length;j++)
                            {
                                $('#typeofweather tbody #weather_' + i + ' td:nth-child(' + (Object.keys(morth_accident_types).length+j+3) + ')').html('0');
                            }
                        }
                        for (var i = 0; i < typeofweather.accident.length; i++) {
                            $('#typeofweather tbody #weather_' + typeofweather.accident[i].TypeOfWeather + ' td:nth-child(' + (parseInt(typeofweather.accident[i].accidenttype_id) + 1) + ')').html(typeofweather.accident[i].total)
                        }
                        $('#typeofweather tbody tr').each(function (i, obj) {
                            var t = 0;
                            for (var accident_type = 0; accident_type < accident_types.length; accident_type++)
                                t += parseInt($('td:nth-child(' + (accident_type + 2) + ')', obj).html());
                            $('td:nth-child(' + (accident_types.length + 2) + ')', obj).html(t)
                        })
                        for (var i = 2; i < 7; i++) {
                            var total = 0
                            for (var j = 1; j < $('#typeofweather tbody').children().length; j++) {
                                total += parseInt($('#typeofweather tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#typeofweather tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }

                        for (i = 0; i < typeofweather.persons.length; i++) {
                            $.each(typeofweather.persons[i], function (key, value) {
                                if (key == "Fatal") {
                                    $('#typeofweather tbody #weather_' + typeofweather.persons[i].TypeOfWeather + ' td:nth-child(' + (parseInt(0 + 1) + 6) + ')').html(typeofweather.persons[i].Fatal);
                                }
                                if (key == "NoOfInjuredNeedingHospitalisation") {
                                    $('#typeofweather tbody #weather_' + typeofweather.persons[i].TypeOfWeather + ' td:nth-child(' + (parseInt(0 + 1) + 7) + ')').html(typeofweather.persons[i].NoOfInjuredNeedingHospitalisation);
                                }
                                if (key == "NoOfInjuredNotNeedingHospitalisation") {
                                    $('#typeofweather tbody #weather_' + typeofweather.persons[i].TypeOfWeather + ' td:nth-child(' + (parseInt(0 + 1) + 8) + ')').html(typeofweather.persons[i].NoOfInjuredNotNeedingHospitalisation);
                                }
                                if (key == "total") {
                                    $('#typeofweather tbody #weather_' + typeofweather.persons[i].TypeOfWeather + ' td:nth-child(' + (parseInt(0 + 1) + 9) + ')').html(typeofweather.persons[i].total);
                                }
                            });
                        }
                        for (var i = 6; i < 8 + 3; i++) {
                            var total = 0
                            for (var j = 1; j < $('#typeofweather table tbody').children().length; j++) {
                                total += parseInt($('#typeofweather tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#typeofweather tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }



                        // Table 4
                        var tableData = typeofroadclassification;
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        rows = {
                            '1':'Expressway',
                            '2':'National Highway',
                            '3':'State Highway',
                            '4':'Other Roads'
                        };
                        $.each(rows, function (rowKey, rowValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#typeofroad tbody #road_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html('0');
                                $.each(acc_data, function (key, value) {
                                    if(value['RoadType']==rowKey&&value['accidenttype_id']==morth_accident_typesKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value['Accidents']);
                                            total+=parseInt(value['Accidents']);
                                            acc_total[morth_accident_typesKey]+=parseInt(value['Accidents']);
                                        }
                                        $('#typeofroad tbody #road_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(t);
                                    }
                                });
                            });
                            $('#typeofroad tbody #road_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#typeofroad tbody #road_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html('0');
                                $.each(per_data, function (key, value) {
                                    if(value['RoadType']==rowKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value[morth_person_typesValue]);
                                            total+=parseInt(value[morth_person_typesValue]);
                                            per_total[morth_person_typesValue]+=parseInt(value[morth_person_typesValue]);
                                        }
                                        $('#typeofroad tbody #road_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(t);
                                    }
                                });
                            });
                            $('#typeofroad tbody #road_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#typeofroad tbody #road_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#typeofroad tbody #road_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#typeofroad tbody #road_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#typeofroad tbody #road_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);



                        // Table 5
                        var tableData = typeofaccidentspot;
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        rows = {
                            '1':'Residential Area',
                            '2':'Institutional Area',
                            '3':'Market/ Commercial Area',
                            '4':'Open',
                            '5':'Others'
                                
                        };
                        $.each(rows, function (rowKey, rowValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#typeofaccidentspot tbody #accident_spot_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html('0');
                                $.each(acc_data, function (key, value) {
                                    if(value['AccidentSpot']==rowKey&&value['accidenttype_id']==morth_accident_typesKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value['Accidents']);
                                            total+=parseInt(value['Accidents']);
                                            acc_total[morth_accident_typesKey]+=parseInt(value['Accidents']);
                                        }
                                        $('#typeofaccidentspot tbody #accident_spot_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(t);
                                    }
                                });
                            });
                            $('#typeofaccidentspot tbody #accident_spot_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#typeofaccidentspot tbody #accident_spot_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html('0');
                                $.each(per_data, function (key, value) {
                                    if(value['AccidentSpot']==rowKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value[morth_person_typesValue]);
                                            total+=parseInt(value[morth_person_typesValue]);
                                            per_total[morth_person_typesValue]+=parseInt(value[morth_person_typesValue]);
                                        }
                                        $('#typeofaccidentspot tbody #accident_spot_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(t);
                                    }
                                });
                            });
                            $('#typeofaccidentspot tbody #accident_spot_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#typeofaccidentspot tbody #spot_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#typeofaccidentspot tbody #spot_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#typeofaccidentspot tbody #spot_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#typeofaccidentspot tbody #spot_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);





                        // Table 6

                        var tableData = roadfeatures;
                        var final_data = {};
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        types = {
                            '1':'Straight Road',
                            '2':'Curved Road',
                            '3':'Bridge',
                            '4':'Culvert',
                            '5':'Pot Holes',
                            '6':'Steep Grade',
                            '7':'Ongoing Road-works/ Construction',
                            '8':'Others'
                                
                        };
                        $.each(types, function (typesKey, typesValue) {
                            final_data[typesValue] = {};
                            final_data[typesValue]['accidents'] = {};
                            final_data[typesValue]['persons'] = {};
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                final_data[typesValue]['accidents'][morth_accident_typesKey] = 0;
                            });
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                final_data[typesValue]['persons'][morth_person_typesValue] = 0;
                            });
                        });
                        $.each(tableData, function (key, value) {
                            final_data[value['Type']]['persons']['Fatal'] += parseInt(value['Fatal']);
                            final_data[value['Type']]['persons']['NoOfInjuredNeedingHospitalisation'] += parseInt(value['NoOfInjuredNeedingHospitalisation']);
                            final_data[value['Type']]['persons']['NoOfInjuredNotNeedingHospitalisation'] += parseInt(value['NoOfInjuredNotNeedingHospitalisation']);
                            final_data[value['Type']]['accidents'][value['TypeOfAccident']]++;
                        });
                        $.each(types, function (typesKey, typesValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                
                                $('#roadfeatures tbody #road_features_' + typesValue.split(' ').join('_').split('/').join('_') + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(final_data[typesValue]['accidents'][morth_accident_typesKey]);
                                total += final_data[typesValue]['accidents'][morth_accident_typesKey];
                                acc_total[morth_accident_typesKey] += final_data[typesValue]['accidents'][morth_accident_typesKey];

                            });
                            $('#roadfeatures tbody #road_features_' + typesValue.split(' ').join('_').split('/').join('_') + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                
                                $('#roadfeatures tbody #road_features_' + typesValue.split(' ').join('_').split('/').join('_') + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(final_data[typesValue]['persons'][morth_person_typesValue]);
                                total += final_data[typesValue]['persons'][morth_person_typesValue];
                                per_total[morth_person_typesValue] += final_data[typesValue]['persons'][morth_person_typesValue];

                            });
                            $('#roadfeatures tbody #road_features_' + typesValue.split(' ').join('_').split('/').join('_') + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            $('#roadfeatures tbody #road_features_total td:nth-child(' + (parseInt(morth_accident_typesKey)+1) + ')').html(acc_total[morth_accident_typesKey]);
                            t+=acc_total[morth_accident_typesKey];
                        });
                        $('#roadfeatures tbody #road_features_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#roadfeatures tbody #road_features_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#roadfeatures tbody #road_features_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);



                        // Table 7
                        var tableData = junctiontype;
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        rows = {
                            '1':'T Junction',
                            '2':'Y Junction',
                            '3':'Four Arm Junction',
                            '4':'Staggered Junction',
                            '5':'Roundabout'
                                
                        };
                        $.each(rows, function (rowKey, rowValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#junctiontype tbody #junction_type_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html('0');
                                $.each(acc_data, function (key, value) {
                                    if(value['RoadJunction']==rowKey&&value['accidenttype_id']==morth_accident_typesKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value['Accidents']);
                                            total+=parseInt(value['Accidents']);
                                            acc_total[morth_accident_typesKey]+=parseInt(value['Accidents']);
                                        }
                                        $('#junctiontype tbody #junction_type_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(t);
                                    }
                                });
                            });
                            $('#junctiontype tbody #junction_type_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#junctiontype tbody #junction_type_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html('0');
                                $.each(per_data, function (key, value) {
                                    if(value['RoadJunction']==rowKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value[morth_person_typesValue]);
                                            total+=parseInt(value[morth_person_typesValue]);
                                            per_total[morth_person_typesValue]+=parseInt(value[morth_person_typesValue]);
                                        }
                                        $('#junctiontype tbody #junction_type_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(t);
                                    }
                                });
                            });
                            $('#junctiontype tbody #junction_type_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#junctiontype tbody #junction_type_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#junctiontype tbody #junction_type_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#junctiontype tbody #junction_type_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#junctiontype tbody #junction_type_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);





                        // Table 8
                        var tableData = trafficcontrol;
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        rows = {
                            '1':'Traffic Light Signal',
                            '2':'Police Control',
                            '3':'Stop Sign',
                            '4':'Flashing Signal/Blinker',
                            '5':'Uncontrolled'
                                
                        };
                        $.each(rows, function (rowKey, rowValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#trafficcontrol tbody #traffic_control_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html('0');
                                $.each(acc_data, function (key, value) {
                                    if(value['TypeofTrafficControl']==rowKey&&value['accidenttype_id']==morth_accident_typesKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value['Accidents']);
                                            total+=parseInt(value['Accidents']);
                                            acc_total[morth_accident_typesKey]+=parseInt(value['Accidents']);
                                        }
                                        $('#trafficcontrol tbody #traffic_control_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(t);
                                    }
                                });
                            });
                            $('#trafficcontrol tbody #traffic_control_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#trafficcontrol tbody #traffic_control_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html('0');
                                $.each(per_data, function (key, value) {
                                    if(value['TypeOfTrafficControl']==rowKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value[morth_person_typesValue]);
                                            total+=parseInt(value[morth_person_typesValue]);
                                            per_total[morth_person_typesValue]+=parseInt(value[morth_person_typesValue]);
                                        }
                                        $('#trafficcontrol tbody #traffic_control_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(t);
                                    }
                                });
                            });
                            $('#trafficcontrol tbody #traffic_control_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#trafficcontrol tbody #traffic_control_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#trafficcontrol tbody #traffic_control_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#trafficcontrol tbody #traffic_control_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#trafficcontrol tbody #traffic_control_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);


                        // Table 9
                        var tableData = pedestrian;
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        rows = {
                            '1':'Zebra Crossing',
                            '2':'Foot Bridge/ Subway',
                            '3':'Footpath',
                            '4':'None'
                                
                        };
                        $.each(rows, function (rowKey, rowValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#pedestriancontrol tbody #pedestriancontrol_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html('0');
                                $.each(acc_data, function (key, value) {
                                    if(value['ID']==rowKey&&value['accidenttype_id']==morth_accident_typesKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value['total']);
                                            total+=parseInt(value['total']);
                                            acc_total[morth_accident_typesKey]+=parseInt(value['total']);
                                        }
                                        $('#pedestriancontrol tbody #pedestriancontrol_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(t);
                                    }
                                });
                            });
                            $('#pedestriancontrol tbody #pedestriancontrol_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#pedestriancontrol tbody #pedestriancontrol_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html('0');
                                $.each(per_data, function (key, value) {
                                    if(value['ID']==rowKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value[morth_person_typesValue]);
                                            total+=parseInt(value[morth_person_typesValue]);
                                            per_total[morth_person_typesValue]+=parseInt(value[morth_person_typesValue]);
                                        }
                                        $('#pedestriancontrol tbody #pedestriancontrol_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(t);
                                    }
                                });
                            });
                            $('#pedestriancontrol tbody #pedestriancontrol_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#pedestriancontrol tbody #pedestriancontrol_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#pedestriancontrol tbody #pedestriancontrol_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#pedestriancontrol tbody #pedestriancontrol_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#pedestriancontrol tbody #pedestriancontrol_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);



                        // Table 10
                        var tableData = impacting_vehicle;
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        rows = {
                            '1':'Motorised Two Wheeler',
                            '2':'Auto Rickshaw',
                            '3':'Car /Jeep /Van /Taxi',
                            '4':'Bus',
                            '5':'Truck/ Lorry',
                            '6':'Heavy Articulated Vehicle/ Trolly',
                            '7':'Tempo/ Tractor',
                            '8':'Bicycle',
                            '9':'Cycle/ Rickshaw',
                            '10':'Hand Drawn Cart',
                            '11':'Animal Drawn Cart',
                            '12':'Other'
                                
                        };
                        $.each(rows, function (rowKey, rowValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#typeofvehicle tbody #vehicle_type_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html('0');
                                $.each(acc_data, function (key, value) {
                                    if(value['VehicleType']==rowKey&&value['accidenttype_id']==morth_accident_typesKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value['total']);
                                            total+=parseInt(value['total']);
                                            acc_total[morth_accident_typesKey]+=parseInt(value['total']);
                                        }
                                        $('#typeofvehicle tbody #vehicle_type_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(t);
                                    }
                                });
                            });
                            $('#typeofvehicle tbody #vehicle_type_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#typeofvehicle tbody #vehicle_type_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html('0');
                                $.each(per_data, function (key, value) {
                                    if(value['VehicleType']==rowKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value[morth_person_typesValue]);
                                            total+=parseInt(value[morth_person_typesValue]);
                                            per_total[morth_person_typesValue]+=parseInt(value[morth_person_typesValue]);
                                        }
                                        $('#typeofvehicle tbody #vehicle_type_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(t);
                                    }
                                });
                            });
                            $('#typeofvehicle tbody #vehicle_type_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#typeofvehicle tbody #vehicle_type_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#typeofvehicle tbody #vehicle_type_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#typeofvehicle tbody #vehicle_type_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#typeofvehicle tbody #vehicle_type_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);





                        // Table 11

                        var tableData = ageofvehicle;
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        rows = {
                            '1':'Less than 5 years',
                            '2':'5 to 10 years',
                            '3':'10.1 - 15 years',
                            '4':'Greater than 15 years',
                            '5':'Age Not Known'
                                
                        };
                        $.each(rows, function (rowKey, rowValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#ageofvehicle tbody #ageofvehicle_' + (parseInt(rowKey)) + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html('0');
                                $.each(acc_data, function (key, value) {
                                    if(value['agetype']==rowKey&&value['accidenttype_id']==morth_accident_typesKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value['total']);
                                            total+=parseInt(value['total']);
                                            acc_total[morth_accident_typesKey]+=parseInt(value['total']);
                                        }
                                        $('#ageofvehicle tbody #ageofvehicle_' + (parseInt(rowKey)) + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(t);
                                    }
                                });
                            });
                            $('#ageofvehicle tbody #ageofvehicle_' + (parseInt(rowKey)) + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#ageofvehicle tbody #ageofvehicle_' + (parseInt(rowKey)) + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html('0');
                                $.each(per_data, function (key, value) {
                                    if(value['agetype']==rowKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value[morth_person_typesValue]);
                                            total+=parseInt(value[morth_person_typesValue]);
                                            per_total[morth_person_typesValue]+=parseInt(value[morth_person_typesValue]);
                                        }
                                        $('#ageofvehicle tbody #ageofvehicle_' + (parseInt(rowKey)) + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(t);
                                    }
                                });
                            });
                            $('#ageofvehicle tbody #ageofvehicle_' + (parseInt(rowKey)) + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#ageofvehicle tbody #ageofvehicle_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#ageofvehicle tbody #ageofvehicle_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#ageofvehicle tbody #ageofvehicle_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#ageofvehicle tbody #ageofvehicle_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);



                        // Table 12

                        var tableData = typeofloadcondition;
                        var final_data = {};
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        types = {
                            '1' : 'Normally Loaded',
                            '2' : 'Overloaded/Hanging',
                            '3' : 'Empty',
                            '4' : 'Not Known',
                                
                        };
                        subTypes = {
                            'a' : 'Passenger',
                            'b' : 'Goods'
                                
                        };
                        $.each(types, function (typesKey, typesValue) {
                            final_data[typesKey] = {};
                            $.each(subTypes, function (subTypesKey, subTypesValue) {
                                final_data[typesKey][subTypesValue] = {};
                                final_data[typesKey][subTypesValue]['accidents'] = {};
                                final_data[typesKey][subTypesValue]['persons'] = {};
                                $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                    final_data[typesKey][subTypesValue]['accidents'][morth_accident_typesKey] = 0;
                                });
                                $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                    final_data[typesKey][subTypesValue]['persons'][morth_person_typesValue] = 0;
                                });
                            });
                        });
                        $.each(tableData, function (key, value) {
                            final_data[value['typeId']][value['TYPE']]['persons']['Fatal'] += parseInt(value['Fatal']);
                            final_data[value['typeId']][value['TYPE']]['persons']['NoOfInjuredNeedingHospitalisation'] += parseInt(value['NoOfInjuredNeedingHospitalisation']);
                            final_data[value['typeId']][value['TYPE']]['persons']['NoOfInjuredNotNeedingHospitalisation'] += parseInt(value['NoOfInjuredNotNeedingHospitalisation']);
                            final_data[value['typeId']][value['TYPE']]['accidents'][value['TypeOfAccident']]++;
                        });
                        $.each(types, function (typesKey, typesValue) {
                            $.each(subTypes, function (subTypesKey, subTypesValue) {
                                var total = 0;
                                $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                    
                                    $('#loadcondition tbody #LoadCondition'+subTypesValue+'_' + typesKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(final_data[typesKey][subTypesValue]['accidents'][morth_accident_typesKey]);
                                    total += final_data[typesKey][subTypesValue]['accidents'][morth_accident_typesKey];
                                    acc_total[morth_accident_typesKey] += final_data[typesKey][subTypesValue]['accidents'][morth_accident_typesKey];

                                });
                                $('#loadcondition tbody #LoadCondition'+subTypesValue+'_' + typesKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                                var total = 0;
                                $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                    
                                    $('#loadcondition tbody #LoadCondition'+subTypesValue+'_' + typesKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(final_data[typesKey][subTypesValue]['persons'][morth_person_typesValue]);
                                    total += final_data[typesKey][subTypesValue]['persons'][morth_person_typesValue];
                                    per_total[morth_person_typesValue] += final_data[typesKey][subTypesValue]['persons'][morth_person_typesValue];

                                });
                                $('#loadcondition tbody #LoadCondition'+subTypesValue+'_' + typesKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                            });
                        });
                        t=0;
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            $('#loadcondition tbody #LoadCondition_total td:nth-child(' + (parseInt(morth_accident_typesKey)+1) + ')').html(acc_total[morth_accident_typesKey]);
                            t+=acc_total[morth_accident_typesKey];
                        });
                        $('#loadcondition tbody #LoadCondition_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#loadcondition tbody #LoadCondition_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#loadcondition tbody #LoadCondition_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);
                       




                        // Table 13
                        var tableData = typeofcollisionA;
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        rows = {
                            '1':'Vehicle To Vehicle',
                            '2':'Vehicle To Pedestrian',
                            '3':'Vehicle To Bicycle/Others',
                            '4':'Vehicle To Animal', 
                            '5':'Hit Parked Vehicle', 
                            '6':'Hit Fixed/Stationary Objects'
                                
                        };
                        $.each(rows, function (rowKey, rowValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#collision_a tbody #vehicle_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html('0');
                                $.each(acc_data, function (key, value) {
                                    if(value['collisionType']==rowKey&&value['TypeOfAccident']==morth_accident_typesKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value['total']);
                                            total+=parseInt(value['total']);
                                            acc_total[morth_accident_typesKey]+=parseInt(value['total']);
                                        }
                                        $('#collision_a tbody #vehicle_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(t);
                                    }
                                });
                            });
                            $('#collision_a tbody #vehicle_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#collision_a tbody #vehicle_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html('0');
                                $.each(per_data, function (key, value) {
                                    if(value['collisionType']==rowKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value[morth_person_typesValue]);
                                            total+=parseInt(value[morth_person_typesValue]);
                                            per_total[morth_person_typesValue]+=parseInt(value[morth_person_typesValue]);
                                        }
                                        $('#collision_a tbody #vehicle_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(t);
                                    }
                                });
                            });
                            $('#collision_a tbody #vehicle_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#collision_a tbody #natureofaccident_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#collision_a tbody #natureofaccident_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#collision_a tbody #natureofaccident_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#collision_a tbody #natureofaccident_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);


                        var tableData = typeofcollisionB;
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        rows = {
                            // '1':'Hit and Run',
                            '1':'With Parked Vehicle',
                            '2':'Hit from Back',
                            '3':'Hit from Side',
                            '4':'Run Off-road',
                            '5':'Fixed Object',
                            '6':'Vehicle Overturned',
                            '7':'Head-on Collision',
                            '8':'Others'
                                
                        };
                        $.each(rows, function (rowKey, rowValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#collision_b tbody #collision_b_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html('0');
                                $.each(acc_data, function (key, value) {
                                    if(value['ID']==rowKey&&value['TypeOfAccident']==morth_accident_typesKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value['total']);
                                            total+=parseInt(value['total']);
                                            acc_total[morth_accident_typesKey]+=parseInt(value['total']);
                                        }
                                        $('#collision_b tbody #collision_b_' + rowKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(t);
                                    }
                                });
                            });
                            $('#collision_b tbody #collision_b_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#collision_b tbody #collision_b_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html('0');
                                $.each(per_data, function (key, value) {
                                    if(value['ID']==rowKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value[morth_person_typesValue]);
                                            total+=parseInt(value[morth_person_typesValue]);
                                            per_total[morth_person_typesValue]+=parseInt(value[morth_person_typesValue]);
                                        }
                                        $('#collision_b tbody #collision_b_' + rowKey + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(t);
                                    }
                                });
                            });
                            $('#collision_b tbody #collision_b_' + rowKey + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#collision_b tbody #collision_b_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#collision_b tbody #collision_b_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#collision_b tbody #collision_b_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#collision_b tbody #collision_b_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);



                        

                        // Table 14
                        var tableData = typeoftrafficviolation;
                        var acc_data = tableData.accident;
                        var per_data = tableData.persons;
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        rows = {
                            '1':'Overspeeding',
                            '2':'Jumping Red Light',
                            '3':'Driving on Wrong Side',
                            '4':'Drunken Driving',
                            '5':'Use of Mobile Phone',
                            '6':'Non Violation'
                                
                        };
                        $.each(rows, function (rowKey, rowValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#typeoftrafficviolation tbody #traffic_violation_' + (parseInt(rowKey)) + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html('0');
                                $.each(acc_data, function (key, value) {
                                    if(value['TrafficViolation']==rowKey&&value['accidenttype_id']==morth_accident_typesKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value['total']);
                                            total+=parseInt(value['total']);
                                            acc_total[morth_accident_typesKey]+=parseInt(value['total']);
                                        }
                                        $('#typeoftrafficviolation tbody #traffic_violation_' + (parseInt(rowKey)) + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(t);
                                    }
                                });
                            });
                            $('#typeoftrafficviolation tbody #traffic_violation_' + (parseInt(rowKey)) + ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                            var total = 0;
                            $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                $('#typeoftrafficviolation tbody #traffic_violation_' + (parseInt(rowKey)) + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html('0');
                                $.each(per_data, function (key, value) {
                                    if(value['TrafficViolation']==rowKey)
                                    {
                                        if(Object.keys(value).length==0) t=0; else{
                                            t=parseInt(value[morth_person_typesValue]);
                                            total+=parseInt(value[morth_person_typesValue]);
                                            per_total[morth_person_typesValue]+=parseInt(value[morth_person_typesValue]);
                                        }
                                        $('#typeoftrafficviolation tbody #traffic_violation_' + (parseInt(rowKey)) + ' td:nth-child(' + (parseInt(morth_person_typesKey)+Object.keys(morth_accident_types).length + 3) + ')').html(t);
                                    }
                                });
                            });
                            $('#typeoftrafficviolation tbody #traffic_violation_' + (parseInt(rowKey)) + ' td:nth-child(' + (Object.keys(morth_accident_types).length+Object.keys(morth_person_types).length + 3) + ')').html(total);
                        });
                        t=0;
                        for(var morth_accident_types_key=1;morth_accident_types_key<=Object.keys(morth_accident_types).length;morth_accident_types_key++)
                        {
                            $('#typeoftrafficviolation tbody #traffic_violation_total td:nth-child(' + (parseInt(morth_accident_types_key) + 1) + ')').html(acc_total[morth_accident_types_key]);
                            t+=acc_total[morth_accident_types_key];
                        }
                        $('#typeoftrafficviolation tbody #traffic_violation_total td:nth-child(' + (parseInt(Object.keys(morth_accident_types).length)+2) + ')').html(t);
                        t=0;
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                        
                            $('#typeoftrafficviolation tbody #traffic_violation_total td:nth-child(' + (parseInt(morth_person_typesKey) + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(per_total[morth_person_typesValue]);
                            t+=per_total[morth_person_typesValue];
                        });
                        $('#typeoftrafficviolation tbody #traffic_violation_total td:nth-child(' + (Object.keys(morth_person_types).length + parseInt(Object.keys(morth_accident_types).length)+3) + ')').html(t);






                        // Table 15

                        var tableData = useofreqsafetydevice;
                        var final_data = {};
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        types = {
                            '1' : 'Wearing of Seat Belts',
                            '2' : 'Wearing of Helmets',
                            '3' : 'Not Applicable',
                            '4' : 'Not known',
                                
                        };
                        subTypes = {
                            'a' : 'Driver',
                            'b' : 'Passenger',
                                
                        };
                        $.each(types, function (typesKey, typesValue) {
                            final_data[typesKey] = {};
                            if(typesKey=='4')
                            {
                                final_data[typesKey] = {};
                                $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                    final_data[typesKey][morth_accident_typesKey] = 0;
                                });
                            }else{
                                $.each(subTypes, function (subTypesKey, subTypesValue) {
                                    final_data[typesKey][subTypesValue] = {};
                                    $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                        final_data[typesKey][subTypesValue][morth_accident_typesKey] = 0;
                                    });
                                });
                            }
                            
                        });
                        $.each(tableData, function (key, value) {
                            if(value['RequisiteSafetyDevice']=='4')
                            {
                                final_data[value['RequisiteSafetyDevice']][value['TypeOfAccident']]++;
                            }else{
                                final_data[value['RequisiteSafetyDevice']][value['Type']][value['TypeOfAccident']]++;
                            }
                        });
                        $.each(types, function (typesKey, typesValue) {
                            if(typesKey=='4')
                            {
                                $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                    
                                    $('#useofrequisitedevices tbody #useofrequisitedevices_'+typesKey+ ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(final_data[typesKey][morth_accident_typesKey]);
                                    acc_total[morth_accident_typesKey] += final_data[typesKey][morth_accident_typesKey];

                                });
                            }else{
                                $.each(subTypes, function (subTypesKey, subTypesValue) {
                                    $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                        
                                        $('#useofrequisitedevices tbody #useofrequisitedevices_'+typesKey+'_' + subTypesValue + ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(final_data[typesKey][subTypesValue][morth_accident_typesKey]);
                                        acc_total[morth_accident_typesKey] += final_data[typesKey][subTypesValue][morth_accident_typesKey];

                                    });
                                });
                            }
                            
                        });
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            $('#useofrequisitedevices tbody #useofrequisitedevices_total td:nth-child(' + (parseInt(morth_accident_typesKey)+1) + ')').html(acc_total[morth_accident_typesKey]);
                        });




                         // Table 16

                        var tableData = typeoflicence;
                        var final_data = {};
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]=0;
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        types = {
                            '1' : 'Valid Permanent licence',
                            '2' : 'Learner licence',
                            '3' : 'Without licence',
                            '4' : 'Not known',
                            '5' : 'Not Applicable',
                                
                        };
                        $.each(types, function (typesKey, typesValue) {
                            final_data[typesKey] = {};
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                final_data[typesKey][morth_accident_typesKey] = 0;
                            });
                            
                        });
                        $.each(tableData, function (key, value) {
                            final_data[value['LicenceType']][value['TypeOfAccident']]++;
                        });
                        $.each(types, function (typesKey, typesValue) {
                            var total = 0;
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                    
                                $('#typeoflicence tbody #typeoflicence_'+(parseInt(typesKey))+ ' td:nth-child(' + (parseInt(morth_accident_typesKey) + 1) + ')').html(final_data[typesKey][morth_accident_typesKey]);
                                acc_total[morth_accident_typesKey] += final_data[typesKey][morth_accident_typesKey];
                                total += final_data[typesKey][morth_accident_typesKey];

                            });
                            $('#typeoflicence tbody #typeoflicence_'+(parseInt(typesKey))+ ' td:nth-child(' + (Object.keys(morth_accident_types).length + 2) + ')').html(total);
                        });
                        var t = 0;
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            $('#typeoflicence tbody #typeoflicence_total td:nth-child(' + (parseInt(morth_accident_typesKey)+1) + ')').html(acc_total[morth_accident_typesKey]);
                            t+=acc_total[morth_accident_typesKey];
                        });
                        $('#typeoflicence tbody #typeoflicence_total td:nth-child(' + ((Object.keys(morth_accident_types).length + 2)) + ')').html(t);





                        // Table 17

                        var tableData = typeofroadusers;
                        var final_data = {};
                        var acc_total = {};
                        var per_total = {};
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            if(morth_accident_typesValue)
                                acc_total[morth_accident_typesKey]={'Driver':{'1':0,'0':0},'Passenger':{'1':0,'0':0}};
                        });
                        $.each(morth_person_types, function (morth_person_typesKey, morth_person_typesValue) {
                                per_total[morth_person_typesValue]=0;
                        });
                        types = {
                            '8' : 'Pedestrians',
                            '0' : 'Bicycles',
                            '1' : 'Motorised Two Wheeler',
                            '2' : 'Auto Rickshaws',
                            '3' : 'Cars/Taxi/Van/LMV',
                            '4' : 'Buses',
                            '5' : 'Trucks/Lorries',
                            '6' : 'Other Motor Vehicles',
                            '7' : 'Other Non Motorized Vehicles',
                                
                        };
                        subTypes = {
                            'a' : 'Driver',
                            'b' : 'Passenger',
                                
                        };
                        $.each(types, function (typesKey, typesValue) {
                            final_data[typesKey] = {};
                            if(typesKey=='8')
                            {
                                final_data[typesKey] = {};
                                $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                    final_data[typesKey][morth_accident_typesKey] = {'1':0,'0':0};
                                });
                            }else{
                                $.each(subTypes, function (subTypesKey, subTypesValue) {
                                    final_data[typesKey][subTypesValue] = {};
                                    $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                        final_data[typesKey][subTypesValue][morth_accident_typesKey] = {'1':0,'0':0};
                                    });
                                });
                            }
                            
                        });
                        $.each(tableData.pedestrian, function (key, value) {
                            final_data[value['VehicleType']][value['accidenttype_id']][value['Gender']]+=parseInt(value['total']);
                        });
                        $.each(tableData.driver, function (key, value) {
                            final_data[value['VehicleType']]['Driver'][value['accidenttype_id']][value['Gender']]+=parseInt(value['total']);
                            acc_total[value['accidenttype_id']]['Driver'][value['Gender']]+=parseInt(value['total']);
                        });
                        $.each(tableData.passenger, function (key, value) {
                            final_data[value['VehicleType']]['Passenger'][value['accidenttype_id']][value['Gender']]+=parseInt(value['total']);
                            acc_total[value['accidenttype_id']]['Passenger'][value['Gender']]+=parseInt(value['total']);
                        });
                        $.each(tableData.otherMotor.driverOtherMotor, function (key, value) {
                            final_data[value['VehicleType']]['Driver'][value['accidenttype_id']][value['Gender']]+=parseInt(value['total']);
                            acc_total[value['accidenttype_id']]['Driver'][value['Gender']]+=parseInt(value['total']);
                        });
                        $.each(tableData.otherMotor.passengerOtherMotor, function (key, value) {
                            final_data[value['VehicleType']]['Passenger'][value['accidenttype_id']][value['Gender']]+=parseInt(value['total']);
                            acc_total[value['accidenttype_id']]['Passenger'][value['Gender']]+=parseInt(value['total']);
                        });
                        $.each(tableData.otherNonMotor.driverOtherNonMotor, function (key, value) {
                            final_data[value['VehicleType']]['Driver'][value['accidenttype_id']][value['Gender']]+=parseInt(value['total']);
                            acc_total[value['accidenttype_id']]['Driver'][value['Gender']]+=parseInt(value['total']);
                        });
                        $.each(tableData.otherNonMotor.passengerOtherNonMotor, function (key, value) {
                            final_data[value['VehicleType']]['Passenger'][value['accidenttype_id']][value['Gender']]+=parseInt(value['total']);
                            acc_total[value['accidenttype_id']]['Passenger'][value['Gender']]+=parseInt(value['total']);
                        });
                        $.each(types, function (typesKey, typesValue) {
                            if(typesKey=='8')
                            {
                                $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                    
                                    $('#typeofroaduser tbody #roaduser_'+typesKey+ ' td:nth-child(' + (parseInt(morth_accident_typesKey)*2) + ')').html(final_data[typesKey][morth_accident_typesKey]['1']);
                                    $('#typeofroaduser tbody #roaduser_'+typesKey+ ' td:nth-child(' + (parseInt(morth_accident_typesKey)*2 + 1) + ')').html(final_data[typesKey][morth_accident_typesKey]['0']);

                                });
                            }else{
                                $.each(subTypes, function (subTypesKey, subTypesValue) {
                                    $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                        
                                        $('#typeofroaduser tbody #roaduser_'+typesKey+'_' + subTypesValue + ' td:nth-child(' + (parseInt(morth_accident_typesKey)*2) + ')').html(final_data[typesKey][subTypesValue][morth_accident_typesKey]['1']);
                                        $('#typeofroaduser tbody #roaduser_'+typesKey+'_' + subTypesValue + ' td:nth-child(' + (parseInt(morth_accident_typesKey)*2 + 1) + ')').html(final_data[typesKey][subTypesValue][morth_accident_typesKey]['0']);

                                    });
                                });
                            }
                            
                        });
                        $.each(subTypes, function (subTypesKey, subTypesValue) {
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#typeofroaduser tbody #totalroadusers_'+subTypesValue+' td:nth-child(' + (parseInt(morth_accident_typesKey)*2) + ')').html(acc_total[morth_accident_typesKey][subTypesValue]['1']);
                                $('#typeofroaduser tbody #totalroadusers_'+subTypesValue+' td:nth-child(' + (parseInt(morth_accident_typesKey)*2 + 1) + ')').html(acc_total[morth_accident_typesKey][subTypesValue]['0']);
                            });
                        });







                        // Table 18

                        var tableData = typeofvictim_age_gender.data;
                        var final_data = {};
                        var acc_total = {};
                        
                        types = {
                            '1' : 'Driver',
                            '2' : 'Passenger',
                            '3' : 'Pedestrian',
                            '4' : 'Cyclist'
                        };
                        subTypes = {
                            'a':'Less than 18 years',
                            'b':'18 - 25 years',
                            'c':'25 - 35 years',
                            'd':'35 - 45 years',
                            'e':'45 - 60 years',
                            'f':'60 years and above',
                                
                        };
                        $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                            acc_total[morth_accident_typesKey] = {};
                            $.each(subTypes, function (subTypesKey, subTypesValue) {
                                if(morth_accident_typesValue)
                                    acc_total[morth_accident_typesKey][subTypesKey]={'Male':0,'Female':0};
                            });
                        });
                        $.each(types, function (typesKey, typesValue) {
                            final_data[typesValue] = {};
                            $.each(subTypes, function (subTypesKey, subTypesValue) {
                                final_data[typesValue][subTypesKey] = {};
                                $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                    final_data[typesValue][subTypesKey][morth_accident_typesKey] = {'Male':0,'Female':0};
                                });
                            });
                            
                        });
                        $.each(tableData, function (key, value) {
                            final_data[value['VictimType']][value['age_group']][value['TypeofInjury']][value['gender_type']]++;
                        });
                        $.each(types, function (typesKey, typesValue) {
                            $.each(subTypes, function (subTypesKey, subTypesValue) {
                                $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                    
                                    $('#typeofvictimage tbody #victims_'+typesValue+'_' + subTypesKey + ' td:nth-child(' + (parseInt(morth_accident_typesKey)*2) + ')').html(final_data[typesValue][subTypesKey][morth_accident_typesKey]['Male']);
                                    $('#typeofvictimage tbody #victims_'+typesKey+'_' + subTypesValue + ' td:nth-child(' + (parseInt(morth_accident_typesKey)*2 + 1) + ')').html(final_data[typesValue][subTypesKey][morth_accident_typesKey]['Female']);
                                    acc_total[morth_accident_typesKey][subTypesKey]['Male']+=final_data[typesValue][subTypesKey][morth_accident_typesKey]['Male'];
                                    acc_total[morth_accident_typesKey][subTypesKey]['Female']+=final_data[typesValue][subTypesKey][morth_accident_typesKey]['Female'];

                                });
                            });
                        });
                        $.each(subTypes, function (subTypesKey, subTypesValue) {
                            $.each(morth_accident_types, function (morth_accident_typesKey, morth_accident_typesValue) {
                                $('#typeofvictimage tbody #victims_Total_'+subTypesKey+' td:nth-child(' + (parseInt(morth_accident_typesKey)*2) + ')').html(acc_total[morth_accident_typesKey][subTypesKey]['Male']);
                                $('#typeofvictimage tbody #victims_Total_'+subTypesKey+' td:nth-child(' + (parseInt(morth_accident_typesKey)*2 + 1) + ')').html(acc_total[morth_accident_typesKey][subTypesKey]['Female']);
                            });
                        });


                    }
                })
            }
        });


      
    }

    $.ajax({
        url: '../../../models/situation/get_morth_types.hh',
        method: 'POST',
        success: function (res) {
            res = JSON.parse(res)
            year = res.year
            roaduser_types = res.morth_vehicle_type;
            for (var i = 0; i < year.length; i++)
                $('#selectyear').append('<option value="' + year[i].year + '">' + year[i].year + '</option>')

            typeofweather = '<div><p><b>3. ACCIDENTS CLASSIFIED ACCORDING TO WEATHER CONDITIONS</b></p></div><table class="table table-bordered"><thead><tr><th rowspan="2">Weather Condition</th><th colspan="5">Number of Accidents</th><th colspan="5">Number of Persons (Based on Accident Type)</th></tr><tr><th>Fatal</th><th>Injury Needing Hospitalisation</th><th>Injury Not Needing Hospitalisation</th><th>No Injury</th><th>Total</th><th>Killed</th><th>Injury Needing Hospitalisation</th><th>Injury Not Needing Hospitalisation</th><th>Total</th></tr></thead><tbody class="update_acc_body">'

            typeofroad = '<div> <p><b>4. ACCIDENTS ACCORDING TO CLASSIFICATION OF ROAD</b></p> </div> <table class="table table-bordered"> <thead> <tr> <th rowspan="2">Classification of Road</th> <th colspan="5">Number of Accidents</th> <th colspan="4">Number of Persons (Based on Accident Type)</th> </tr> <tr> <th>Fatal</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>No Injury</th> <th>Total</th> <th>Killed</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>Total</th> </tr> </thead> <tbody class="update_acc_body">'

            typeofaccidentspot = '<div> <p><b>5. ACCIDENTS ACCORDING TO ROAD ENVIRONMENT</b></p> </div> <table class="table table-bordered"> <thead> <tr> <th rowspan="2">Accident Spot</th> <th colspan="5">Number of Accidents</th> <th colspan="4">Number of Persons (Based on Accident Type)</th> </tr> <tr> <th>Fatal</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>No Injury</th> <th>Total</th> <th>Killed</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>Total</th> </tr> </thead> <tbody class="update_acc_body">'

            roadfeatures = '<div> <p><b>6. ACCIDENTS ACCORDING TO ROAD FEATURES</b></p> </div> <table class="table table-bordered"> <thead> <tr> <th rowspan="2">Road Features</th> <th colspan="5">Number of Accidents</th> <th colspan="4">Number of Persons (Based on Accident Type)</th> </tr> <tr> <th>Fatal</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>No Injury</th> <th>Total</th> <th>Killed</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>Total</th> </tr> </thead> <tbody class="update_acc_body">'

            junctiontype = '<div> <p><b>7. ACCIDENTS ACCORDING TO JUNCTION TYPE</b></p> </div> <table class="table table-bordered"> <thead> <tr> <th rowspan="2">Junction Type</th> <th colspan="5">Number of Accidents</th> <th colspan="4">Number of Persons (Based on Accident Type)</th> </tr> <tr> <th>Fatal</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>No Injury</th> <th>Total</th> <th>Killed</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>Total</th> </tr> </thead> <tbody class="update_acc_body">'

            trafficcontrol = '<div> <p><b>8. ACCIDENTS ACCORDING TO TRAFFIC CONTROL AT JUNCTION</b></p> </div> <table class="table table-bordered"> <thead> <tr> <th rowspan="2">Traffic Control</th> <th colspan="5">Number of Accidents</th> <th colspan="4">Number of Persons (Based on Accident Type)</th> </tr> <tr> <th>Fatal</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>No Injury</th> <th>Total</th> <th>Killed</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>Total</th> </tr> </thead> <tbody class="update_acc_body">'

            typeofvehicle = '<div> <p><b>10. ACCIDENTS ACCORDING TO TYPE OF IMPACTING VEHICLE/OBJECTS</b></p> </div> <table class="table table-bordered"> <thead> <tr> <th rowspan="2">Type of Vehicle</th> <th colspan="5">Number of Accidents</th> <th colspan="4">Number of Persons (Based on Accident Type)</th> </tr> <tr> <th>Fatal</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>No Injury</th> <th>Total</th> <th>Killed</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>Total</th> </tr> </thead> <tbody class="update_acc_body">'

            typeoftrafficviolation = '<div> <p><b>14. ACCIDENTS ACCORDING TO TYPE OF TRAFFIC VIOLATION</b></p> </div> <table class="table table-bordered"> <thead> <tr> <th rowspan="2">Type of Traffic Violations</th> <th colspan="5">Number of Accidents</th> <th colspan="4">Number of Persons (Based on Accident Type)</th> </tr> <tr> <th>Fatal</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>No Injury</th> <th>Total</th> <th>Killed</th> <th>Injury Needing Hospitalisation</th> <th>Injury Not Needing Hospitalisation</th> <th>Total</th> </tr> </thead> <tbody class="update_acc_body">'

            typeofroaduser = '<div id="useofrequisitedevices"> <div> <p><b>16. ACCIDENTS CLASSIFIED ACCORDING TO USE/NON-USE OF SAFETY DEVICE BY VICTIM</b></p> </div> <table class="table table-bordered "> <thead> <tr> <th rowspan="2">Use of Requisite Safety Devices</th> <th colspan="10">Number of Persons (Based on Accident Type)</th> </tr> <tr> <th colspan="2">Killed</th> <th colspan="2">Injury Needing Hospitalisation</th> <th colspan="2">Injury Not Needing Hospitalisation</th> <th colspan="2">Non Injury</th> </tr> <tr> <th colspan="1"></th> <th colspan="1">Yes</th> <th colspan="1">No</th> <th colspan="1">Yes</th> <th colspan="1">No</th> <th colspan="1">Yes</th> <th colspan="1">No</th> <th colspan="1">Yes</th> <th colspan="1">No</th> </tr> </thead> <tbody> <tr id="vehicle_to_vehicle" > <td align="left">1. Vehicle to Vehicle</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> <tr id="vehicle_to_pedestrian"> <td align="left">2. Vehicle to Pedestrian</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> <tr id="vehicle_to_bicycle"> <td align="left">3. Vehicle to Bicycle/others</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> <tr id="vehicle_to_animal"> <td align="left">4. Vehicle to Animal</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> <tr id="natureofaccident_total" style="font-weight:bold"> <td align="left">Total</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr> </tbody> </table> </div>'


            for (var i = 0; i < res.morth_weather_condition.length; i++) {
                typeofweather += '<tr id="weather_' + res.morth_weather_condition[i].id + '"><td>' + res.morth_weather_condition[i].weather_condition + '</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'
            }
            for (var i = 0; i < res.morth_road_type_A.length; i++) {
                typeofroad += '<tr id="road_' + res.morth_road_type_A[i].id + '"><td>' + res.morth_road_type_A[i].road_type + '</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'
            }

            for (var i = 0; i < res.morth_accident_spot.length; i++) {
                typeofaccidentspot += '<tr id="accident_spot_' + res.morth_accident_spot[i].id + '"><td>' + res.morth_accident_spot[i].accident_spot + '</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'
            }

            for (var i = 0; i < res.morth_road_features_A.length; i++) {
                roadfeatures += '<tr id="road_features_' + res.morth_road_features_A[i].road_features.split(' ').join('_').split('/').join('_') + '"><td>' + res.morth_road_features_A[i].road_features + '</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'
            }
            for (var i = 0; i < res.morth_road_features_B.length - 1; i++) {
                roadfeatures += '<tr id="road_features_' + res.morth_road_features_B[i].road_features.split(' ').join('_').split('/').join('_') + '"><td>' + res.morth_road_features_B[i].road_features + '</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'
            }
            roadfeatures += '<tr id="road_features_Pot_Holes"><td>Pot Holes</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr id="road_features_Steep_Grade"><td>Steep Grade</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr id="road_features_Ongoing_Road-works___Construction"><td>Ongoing Road-works / Construction</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr id="road_features_Others"><td>Others</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'


            for (var i = 0; i < res.morth_roads_junction.length - 1; i++) {
                junctiontype += '<tr id="junction_type_' + res.morth_roads_junction[i].id + '"><td>' + res.morth_roads_junction[i].junction + '</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'
            }

            for (var i = 0; i < res.morth_traffic_control.length - 1; i++) {
                trafficcontrol += '<tr id="traffic_control_' + res.morth_traffic_control[i].id + '"><td>' + res.morth_traffic_control[i].traffic_control + '</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'
            }

            for (var i = 0; i < res.morth_vehicle_type.length - 1; i++) {
                typeofvehicle += '<tr id="vehicle_type_' + res.morth_vehicle_type[i].id + '"><td>' + res.morth_vehicle_type[i].vehicle_type + '</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'
            }
            typeoftrafficviolation
            for (var i = 0; i < res.morth_traffic_violation.length - 1; i++) {
                typeoftrafficviolation += '<tr id="traffic_violation_' + res.morth_traffic_violation[i].id + '"><td>' + res.morth_traffic_violation[i].traffic_violation + '</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'
            }


            typeofweather += '<tr style="font-weight:bold"><td>Total</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody></table>'
            typeofroad += '<tr style="font-weight:bold" id="road_total"><td>Total</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody></table>'
            typeofaccidentspot += '<tr style="font-weight:bold" id="spot_total"><td>Total</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody></table>'
            roadfeatures += '<tr style="font-weight:bold" id="road_features_total"><td>Total</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody></table>'
            junctiontype += '<tr style="font-weight:bold" id="junction_type_total"><td>Total</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody></table>'
            trafficcontrol += '<tr style="font-weight:bold" id="traffic_control_total"><td>Total</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody></table>'

            typeofvehicle += '<tr style="font-weight:bold" id="vehicle_type_total"><td>Total</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody></table>'
            typeoftrafficviolation += '<tr style="font-weight:bold" id="traffic_violation_total"><td>Total</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr></tbody></table>'

            $('#typeofweather').append(typeofweather)
            $('#typeofroad').append(typeofroad)
            $('#typeofaccidentspot').append(typeofaccidentspot)
            $('#roadfeatures').append(roadfeatures)
            $('#junctiontype').append(junctiontype)
            $('#trafficcontrol').append(trafficcontrol)
            $('#typeofvehicle').append(typeofvehicle)
            $('#typeoftrafficviolation').append(typeoftrafficviolation)
        }
    })
    $('.submitbtn').click(function () {
        getData(sanitize($('.selectyear').val()))
    })
});