situationSCN = "";

function js_yyyy_mm_dd_hh_mm_ss () {
    now = new Date();
    year = "" + now.getFullYear();
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

    getData = function (year, isPrint = false) {
        $.ajax({
            url: '../../../models/situation/get_accidenttypes.hh',
            method: 'POST',
            success: function (res) {
                var accident_types = JSON.parse(res);
                $.ajax({
                    url: '../../../models/situation/get_irca4_data.hh',
                    method: 'POST',
                    data: { year: year, isPrint: isPrint },
                    success: function (res) {
                        res = JSON.parse(res)
                        for(var m=1;m<13;m++){
                            for(var ch=2;ch<(accident_types.length+2);ch++){
                                $('#table1 tbody #month_' + m + ' td:nth-child(' +ch + ')').html('0')
                            }
                        }
                        for(var m=0;m<24;m++){
                            for(var ch=2;ch<(accident_types.length+2)*2;ch++){
                                $('#typeofarea tbody #hour_' + m + ' td:nth-child(' +ch + ')').html('0')
                            }
                        }
                        for(var m=1;m<8;m++){
                            for(var ch=2;ch<(accident_types.length+3);ch++){
                                $('#typeofroad tbody #road_' + m + ' td:nth-child(' +ch + ')').html('0')
                            }
                        }
                        for(var m=1;m<8;m++){
                            for(var ch=2;ch<(accident_types.length+3);ch++){
                                $('#typeofcollision tbody #collision_' + m + ' td:nth-child(' +ch + ')').html('0')
                            }
                        }
                        for(var m=1;m<5;m++){
                            for(var ch=2;ch<(accident_types.length+3);ch++){
                                $('#typeofweather tbody #weather_' + m + ' td:nth-child(' +ch + ')').html('0')
                            }
                        }
                        for(var m=1;m<5;m++){
                            for(var ch=2;ch<(accident_types.length+3);ch++){
                                $('#typeofaccidentspot tbody #accidentspot_' + m + ' td:nth-child(' +ch + ')').html('0')
                            }
                        }
                        for(var m=1;m<=5;m++){
                            for(var ch=2;ch<(accident_types.length+3);ch++){
                                $('#trafficviolation_'+m+' td:nth-child(' +ch + ')').html('0')
                            }
                        }
                        for(var m=1;m<5;m++){
                            for(var ch=2;ch<(accident_types.length+3);ch++){
                                $('#loadcondition_'+m+' td:nth-child(' +ch + ')').html('0')
                            }
                        }
                        for(var m=1;m<10;m++){
                            for(var ch=2;ch<(accident_types.length+3);ch++){
                                $('#vehicle_'+m+' td:nth-child(' +ch + ')').html('0')
                            }
                        }
                        for(var ch=2;ch<(accident_types.length+3);ch++){
                            $('#sex_Male td:nth-child(' +ch + ')').html('0')
                            $('#sex_Female td:nth-child(' +ch + ')').html('0')
                            $('#age_18 td:nth-child(' +ch + ')').html('0')
                            $('#age_18-25 td:nth-child(' +ch + ')').html('0')
                            $('#age_25-40 td:nth-child(' +ch + ')').html('0')
                            $('#age_40-60 td:nth-child(' +ch + ')').html('0')
                            $('#age_60 td:nth-child(' +ch + ')').html('0')
                            $('#alcohol_yes td:nth-child(' +ch + ')').html('0')
                            $('#alcohol_no td:nth-child(' +ch + ')').html('0')
                            $('#alcohol_unknown td:nth-child(' +ch + ')').html('0')
                            $('#requisite_yes td:nth-child(' +ch + ')').html('0')
                            $('#requisite_no td:nth-child(' +ch + ')').html('0')
                            $('#requisite_unknown td:nth-child(' +ch + ')').html('0')
                            $('#victim_1_18 td:nth-child(' +ch + ')').html('0')
                            $('#victim_1_18-25 td:nth-child(' +ch + ')').html('0')
                            $('#victim_1_25-40 td:nth-child(' +ch + ')').html('0')
                            $('#victim_1_40-60 td:nth-child(' +ch + ')').html('0')
                            $('#victim_1_60 td:nth-child(' +ch + ')').html('0')
                            $('#victim_2_18 td:nth-child(' +ch + ')').html('0')
                            $('#victim_2_18-25 td:nth-child(' +ch + ')').html('0')
                            $('#victim_2_25-40 td:nth-child(' +ch + ')').html('0')
                            $('#victim_2_40-60 td:nth-child(' +ch + ')').html('0')
                            $('#victim_2_60 td:nth-child(' +ch + ')').html('0')
                            $('#victim_3_18 td:nth-child(' +ch + ')').html('0')
                            $('#victim_3_18-25 td:nth-child(' +ch + ')').html('0')
                            $('#victim_3_25-40 td:nth-child(' +ch + ')').html('0')
                            $('#victim_3_40-60 td:nth-child(' +ch + ')').html('0')
                            $('#victim_3_60 td:nth-child(' +ch + ')').html('0')
                            $('#victim_4_18 td:nth-child(' +ch + ')').html('0')
                            $('#victim_4_18-25 td:nth-child(' +ch + ')').html('0')
                            $('#victim_4_25-40 td:nth-child(' +ch + ')').html('0')
                            $('#victim_4_40-60 td:nth-child(' +ch + ')').html('0')
                            $('#victim_4_60 td:nth-child(' +ch + ')').html('0')
                            $('#typeofpresence_total_col td:nth-child(' +ch + ')').html('0')
                            $('#typeofpresence_total_col td:nth-child(' +ch + ')').html('0')
                            $('#typeofpresence_total_col td:nth-child(' +ch + ')').html('0')
                            $('#typeofpresence_total_col td:nth-child(' +ch + ')').html('0')
                            $('#typeofpresence_total_col td:nth-child(' +ch + ')').html('0')
                            $('#typeofpresence_total_col td:nth-child(' +ch + ')').html('0')
                            $('#typeofpresence_total_col td:nth-child(' +ch + ')').html('0')
                        }
                        var table1 = res.table1,
                            typeofarea = res.typeofarea,
                            typeofcollision = res.typeofcollision,
                            typeofweather = res.typeofweather,
                            typeofaccidentspot = res.typeofaccidentspot,
                            typeoftrafficviolation = res.typeoftrafficviolation,
                            typeofloadcondition = res.typeofloadcondition,
                            typeofvehicle = res.typeofvehicle,
                            typeofvictimprofile = res.typeofvictimprofile,
                            typeofpresence = res.typeofpresence,
                            typeofvictim = res.typeofvictim,
                            typeofroad = res.typeofroad
                        for (var i = 0; i < table1.length; i++) {
                            $('#table1 tbody #month_' + table1[i].month + ' td:nth-child(' + (parseInt(table1[i].accidenttype_id) + 1) + ')').html(table1[i].total);
                        }
                        $('#table1 tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })
                        for (var i = 2; i < accident_types.length+3; i++) {
                            var total = 0
                            for (var j = 1; j < $('#table1 table tbody').children().length; j++) {
                                total += parseInt($('#table1 tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#table1 tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }



                        for (var i = 0; i < typeofarea.length; i++) {
                            var childno = (typeofarea[i].TypeOfArea == "Urban") ? (parseInt(typeofarea[i].accidenttype_id) + 1) : (parseInt(typeofarea[i].accidenttype_id) + (accident_types.length+2))
                            $('#typeofarea tbody #hour_' + typeofarea[i].hour + ' td:nth-child(' + (childno) + ')').html(typeofarea[i].total)
                        }
                        $('#typeofarea tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)

                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+accident_types.length+3)+')', obj).html());
                            $('td:nth-child('+(((accident_types.length+2)*2)-1)+')', obj).html(t)
                        })



                        for (var i = 0; i < typeofroad.length; i++) {
                            $('#typeofroad tbody #road_' + typeofroad[i].RoadType + ' td:nth-child(' + (parseInt(typeofroad[i].accidenttype_id) + 1) + ')').html(typeofroad[i].total)
                        }
                        $('#typeofroad tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })
                        for (var i = 2; i < 7; i++) {
                            var total = 0
                            for (var j = 1; j < $('#typeofroad tbody').children().length; j++) {
                                total += parseInt($('#typeofroad tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#typeofroad tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }



                        for (var i = 0; i < typeofcollision.length; i++) {
                            $('#typeofcollision tbody #collision_' + typeofcollision[i].TypeOfCollision + ' td:nth-child(' + (parseInt(typeofcollision[i].accidenttype_id) + 1) + ')').html(typeofcollision[i].total)
                        }
                        $('#typeofcollision tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })
                        for (var i = 2; i < 7; i++) {
                            var total = 0
                            for (var j = 1; j < $('#typeofcollision tbody').children().length; j++) {
                                total += parseInt($('#typeofcollision tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#typeofcollision tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }



                        for (var i = 0; i < typeofweather.length; i++) {
                            $('#typeofweather tbody #weather_' + typeofweather[i].TypeOfWeather + ' td:nth-child(' + (parseInt(typeofweather[i].accidenttype_id) + 1) + ')').html(typeofweather[i].total)
                        }
                        $('#typeofweather tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })
                        for (var i = 2; i < 7; i++) {
                            var total = 0
                            for (var j = 1; j < $('#typeofweather tbody').children().length; j++) {
                                total += parseInt($('#typeofweather tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#typeofweather tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }



                        for (var i = 0; i < typeofaccidentspot.length; i++) {
                            $('#typeofaccidentspot tbody #accidentspot_' + typeofaccidentspot[i].AccidentSpot + ' td:nth-child(' + (parseInt(typeofaccidentspot[i].accidenttype_id) + 1) + ')').html(typeofaccidentspot[i].total)
                        }
                        $('#typeofaccidentspot tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })
                        for (var i = 2; i < 7; i++) {
                            var total = 0
                            for (var j = 1; j < $('#typeofaccidentspot tbody').children().length; j++) {
                                total += parseInt($('#typeofaccidentspot tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#typeofaccidentspot tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }



                        for (var i = 0; i < typeoftrafficviolation.length; i++) {
                            $('#typeoftrafficviolation tbody #trafficviolation_' + typeoftrafficviolation[i].TrafficViolation + ' td:nth-child(' + (parseInt(typeoftrafficviolation[i].accidenttype_id) + 1) + ')').html(typeoftrafficviolation[i].total)
                        }
                        $('#typeoftrafficviolation tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })
                        for (var i = 2; i < 7; i++) {
                            var total = 0
                            for (var j = 1; j < $('#typeoftrafficviolation tbody').children().length; j++) {
                                total += parseInt($('#typeoftrafficviolation tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#typeoftrafficviolation tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }



                        for (var i = 0; i < typeofloadcondition.length; i++) {
                            $('#typeofloadcondition tbody #loadcondition_' + typeofloadcondition[i].LoadCondition + ' td:nth-child(' + (parseInt(typeofloadcondition[i].accidenttype_id) + 1) + ')').html(typeofloadcondition[i].total)
                        }
                        $('#typeofloadcondition tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })
                        for (var i = 2; i < 7; i++) {
                            var total = 0
                            for (var j = 1; j < $('#typeofloadcondition tbody').children().length; j++) {
                                total += parseInt($('#typeofloadcondition tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#typeofloadcondition tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }



                        for (var i = 0; i < typeofvehicle.length; i++) {
                            $('#typeofvehicle tbody #vehicle_' + typeofvehicle[i].vehicle_type_id + ' td:nth-child(' + (parseInt(typeofvehicle[i].accidenttype_id) + 1) + ')').html(typeofvehicle[i].total)
                        }
                        $('#typeofvehicle tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })
                        for (var i = 2; i < 7; i++) {
                            var total = 0
                            for (var j = 1; j < $('#typeofvehicle tbody').children().length; j++) {
                                total += parseInt($('#typeofvehicle tbody tr:nth-child(' + j + ') td:nth-child(' + i + ')').html())
                            }
                            $('#typeofvehicle tbody tr:last-child td:nth-child(' + i + ')').html(total)
                        }



                        for (var i = 0; i < typeofvictimprofile.sex.length; i++) {
                            $('#typeofprofile tbody #sex_' + typeofvictimprofile.sex[i].Sex + ' td:nth-child(' + (parseInt(typeofvictimprofile.sex[i].accidenttype_id) + 1) + ')').html(typeofvictimprofile.sex[i].total)
                        }

                        for (var i = 0; i < typeofvictimprofile.age.length; i++) {
                            $('#typeofprofile tbody #age_' + typeofvictimprofile.age[i].agetype + ' td:nth-child(' + (parseInt(typeofvictimprofile.age[i].accidenttype_id) + 1) + ')').html(typeofvictimprofile.age[i].total)
                        }
                        $('#typeofprofile tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })



                        for (var i = 0; i < typeofpresence.alcohol.length; i++) {
                            $('#typeofpresence tbody #alcohol_' + typeofpresence.alcohol[i].PresenceOfAlcohol + ' td:nth-child(' + (parseInt(typeofpresence.alcohol[i].accidenttype_id) + 1) + ')').html(typeofpresence.alcohol[i].total)
                        }

                        for (var i = 0; i < typeofpresence.safety.length; i++) {
                            $('#typeofpresence tbody #requisite_' + typeofpresence.safety[i].RequisiteSafetyDevice + ' td:nth-child(' + (parseInt(typeofpresence.safety[i].accidenttype_id) + 1) + ')').html(typeofpresence.safety[i].total)
                        }
                        $('#typeofpresence tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })
                        for (var i = 2; i < 7; i++) {
                            var total = parseInt($('#typeofpresence tbody tr:nth-child(2) td:nth-child(' + i + ')').html()) + parseInt($('#typeofpresence tbody tr:nth-child(3) td:nth-child(' + i + ')').html()) + parseInt($('#typeofpresence tbody tr:nth-child(4) td:nth-child(' + i + ')').html())
                            var total1 = parseInt($('#typeofpresence tbody tr:nth-child(7) td:nth-child(' + i + ')').html()) + parseInt($('#typeofpresence tbody tr:nth-child(8) td:nth-child(' + i + ')').html()) + parseInt($('#typeofpresence tbody tr:nth-child(9) td:nth-child(' + i + ')').html())

                            $('#typeofpresence tbody tr:nth-child(5) td:nth-child(' + i + ')').html(total)
                            $('#typeofpresence tbody tr:nth-child(10) td:nth-child(' + i + ')').html(total1)
                        }


                        for (var i = 0; i < typeofvictim.length; i++) {
                            $('#typeofvictim tbody #victim_' + typeofvictim[i].Type + '_' + typeofvictim[i].agetype + ' td:nth-child(' + (parseInt(typeofvictim[i].accidenttype_id) + 1) + ')').html(typeofvictim[i].total)
                        }
                        $('#typeofvictim tbody tr').each(function (i, obj) {
                            var t = 0;
                            for(var accident_type=0;accident_type<accident_types.length;accident_type++)
                                t+= parseInt($('td:nth-child('+(accident_type+2)+')', obj).html());
                            $('td:nth-child('+(accident_types.length+2)+')', obj).html(t)
                        })
                        for (var i = 2; i < 7; i++) {
                            var total_18 = parseInt($('#typeofvictim tbody tr:nth-child(2) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(8) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(14) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(20) td:nth-child(' + i + ')').html())

                            var total_1825 = parseInt($('#typeofvictim tbody tr:nth-child(3) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(9) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(15) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(21) td:nth-child(' + i + ')').html())

                            var total_2540 = parseInt($('#typeofvictim tbody tr:nth-child(4) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(10) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(16) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(22) td:nth-child(' + i + ')').html())

                            var total_4060 = parseInt($('#typeofvictim tbody tr:nth-child(5) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(11) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(17) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(23) td:nth-child(' + i + ')').html())

                            var total_60 = parseInt($('#typeofvictim tbody tr:nth-child(6) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(12) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(18) td:nth-child(' + i + ')').html()) + parseInt($('#typeofvictim tbody tr:nth-child(24) td:nth-child(' + i + ')').html())

                            $('#typeofvictim tbody tr:nth-child(26) td:nth-child(' + i + ')').html(total_18)
                            $('#typeofvictim tbody tr:nth-child(27) td:nth-child(' + i + ')').html(total_1825)
                            $('#typeofvictim tbody tr:nth-child(28) td:nth-child(' + i + ')').html(total_2540)
                            $('#typeofvictim tbody tr:nth-child(29) td:nth-child(' + i + ')').html(total_4060)
                            $('#typeofvictim tbody tr:nth-child(30) td:nth-child(' + i + ')').html(total_60)
                        }

                        if (isPrint) {
                            /*$('#ircUser').html($('#usernameGet').html());
                            $('#ircYear').html(year);
                            $('#ircTime').html(js_yyyy_mm_dd_hh_mm_ss());

                            window.print();*/
                            $.ajax({
                                url: '../../../models/utils/get_username.hh',
                                type: 'POST',
                                success: function (result) {
                                    result = JSON.parse(result);
                                    var username = result.user.trim();
                                    window.open("../../../models/situation/get_irca4_data_pdf.hh?year=" + year + '&username=' + username, '_blank');
                                }
                            });


                        }


                    }
                })
            }
        });
    }

    $.ajax({
        url: '../../../models/utils/get_username.hh',
        type: 'POST',
        success: function (result) {
            result = JSON.parse(result);
            /*if (result.length > 30) {
                window.location = "../index.html"
            }*/
            uname = result.user.trim();
        }

    });

    $.ajax({
        url: '../../../models/situation/get_irca1_types.hh',
        method: 'POST',
        success: function (res) {
            res = JSON.parse(res)

            var irc_accident_spot = res.irc_accident_spot,
                irc_collision_types = res.irc_collision_types,
                irc_load_condition = res.irc_load_condition,
                irc_roads_classification = res.irc_roads_classification,
                irc_traffic_violation = res.irc_traffic_violation,
                irc_victim_type = res.irc_victim_type,
                irc_weather_condition = res.irc_weather_condition,
                tis_vehicle_type = res.tis_vehicle_type,
                irc_accident_types = res.irc_accident_types,
                year = res.year
            for (var i = 0; i < year.length; i++)
                 $('#selectyear').append('<option value="' + year[i].year + '">' + year[i].year + '</option>')
            var html = '';
            var tb_html = '';
            for(var i=0;i<irc_accident_types.length;i++)
            {
                html += '<th>'+irc_accident_types[i].name+'</th>';
                tb_html += '<td>0</td>';
            }
            html += '<th>Total</th>';
            tb_html += '<td style="font-weight: bold;">0</td>';

            $('.table_sub_col').attr('colSpan',irc_accident_types.length+1);
            $('.table_double_sub_col').attr('colSpan',(irc_accident_types.length+1)*2);
            $('.table_cols').html(html);
            $('.table_double_cols').html(html+html);
            for(var i=1;i<=12;i++)
            {
                $('#month_'+i).append(tb_html);
            }
            $('#month_total').append(tb_html);
            for(var i=0;i<=23;i++)
            {
                $('#hour_'+i).append(tb_html+tb_html);
            }
            $('#sex_Male, #sex_Female, #age_18, #age_18-25, #age_25-40, #age_40-60, #age_60, #alcohol_yes, #alcohol_no, #alcohol_unknown, #requisite_yes, #requisite_no, #requisite_unknown, .typeofpresence_total_col').append(tb_html);

            typeofroad = '<div><p><b>3. ACCIDENTS ACCORDING TO CLASSIFICATION OF ROAD</b></p></div><table class="table table-bordered"><thead><tr><th rowspan="2">Classification of Road</th><th colspan="'+irc_accident_types.length+1+'">Number of Accidents</th></tr><tr>'+html+'</tr></thead><tbody class="update_acc_body">'

            typeofcollision = '<div><p><b>4. ACCIDENTS CLASSIFIED ACCORDING TO TYPE OF COLLISION</b></p></div><table class="table table-bordered"><thead><tr><th rowspan="2">Number of Fatalities</th><th colspan="'+irc_accident_types.length+1+'">Number of Accidents</th></tr><tr>'+html+'</tr></thead><tbody class="update_acc_body">'

            typeofweather = '<div><p><b>5. ACCIDENTS CLASSIFIED ACCORDING TO WEATHER CONDITIONS</b></p></div><table class="table table-bordered"><thead><tr><th rowspan="2">Location</th><th colspan="'+irc_accident_types.length+1+'">Number of Accidents</th></tr><tr>'+html+'</tr></thead><tbody class="update_acc_body">'

            typeofaccidentspot = '<div><p><b>6. ACCIDENTS CLASSIFIED ACCORDING TO LOCATION OF ACCIDENT SPOT</b></p></div><table class="table table-bordered"><thead><tr><th rowspan="2">Driver Details</th><th colspan="'+irc_accident_types.length+1+'">Number of Accidents</th></tr><tr>'+html+'</tr></thead><tbody class="update_acc_body">'

            typeofvictim = '<div><p><b>9. ACCIDENTS CLASSIFIED ACCORDING TO TYPE OF VICTIM, AGE AND GENDER</b></p></div><table class="table table-bordered"><thead><tr><th rowspan="2">Type of Victim</th><th colspan="'+irc_accident_types.length+1+'">Number of Accidents</th></tr><tr>'+html+'</tr></thead><tbody class="update_acc_body">'

            typeoftrafficviolation = '<div><p><b>10. ACCIDENTS CLASSIFIED ACCORDING TO NATURE OF TRAFFIC VIOLATIONS</b></p></div><table class="table table-bordered"><thead><tr><th rowspan="2">Traffic Violations by Involved Vehicle(s)</th><th colspan="'+irc_accident_types.length+1+'">Number of Accidents</th></tr><tr>'+html+'</tr></thead><tbody class="update_acc_body">'

            typeofloadcondition = '<div><p><b>11. ACCIDENTS CLASSIFIED ACCORDING TO LOAD CONDITION OF INVOLVED VEHICLES</b></p></div><table class="table table-bordered"><thead><tr><th rowspan="2">Location</th><th colspan="'+irc_accident_types.length+1+'">Number of Accidents</th></tr><tr>'+html+'</tr></thead><tbody class="update_acc_body">'

            typeofvehicle = '<div><p><b>12. ACCIDENTS CLASSIFIED ACCORDING TO TYPE OF VEHICLE INVOLVED IN ACCIDENT</b></p></div><table class="table table-bordered"><thead><tr><th rowspan="2">Type of Vehicle</th><th colspan="'+irc_accident_types.length+1+'">Number of Accidents</th></tr><tr>'+html+'</tr></thead><tbody class="update_acc_body">'

            for (var i = 0; i < irc_accident_spot.length; i++) {
                typeofaccidentspot += '<tr id="accidentspot_' + irc_accident_spot[i].id + '"><td>' + irc_accident_spot[i].name + '</td>'+tb_html+'</tr>'
            }

            for (var i = 0; i < irc_collision_types.length; i++) {
                typeofcollision += '<tr id="collision_' + irc_collision_types[i].id + '"><td>' + irc_collision_types[i].name + '</td>'+tb_html+'</tr>'
            }

            for (var i = 0; i < irc_load_condition.length; i++) {
                typeofloadcondition += '<tr id="loadcondition_' + irc_load_condition[i].id + '"><td>' + irc_load_condition[i].name + '</td>'+tb_html+'</tr>'
            }

            for (var i = 0; i < irc_roads_classification.length; i++) {
                typeofroad += '<tr id="road_' + irc_roads_classification[i].id + '"><td>' + irc_roads_classification[i].name + '</td>'+tb_html+'</tr>'
            }

            for (var i = 0; i < irc_traffic_violation.length; i++) {
                typeoftrafficviolation += '<tr id="trafficviolation_' + irc_traffic_violation[i].id + '"><td>' + irc_traffic_violation[i].name + '</td>'+tb_html+'</tr>'
            }

            for (var i = 0; i < irc_victim_type.length; i++) {
                typeofvictim += '<tr><td><b>' + irc_victim_type[i].name + '<b></td></tr><tr id="victim_' + irc_victim_type[i].id + '_18"><td>\< 18 years</td>'+tb_html+'</tr><tr id="victim_' + irc_victim_type[i].id + '_18-25"><td>18 - 25 years</td>'+tb_html+'</tr><tr id="victim_' + irc_victim_type[i].id + '_25-40"><td>25 - 40 years</td>'+tb_html+'</tr><tr id="victim_' + irc_victim_type[i].id + '_40-60"><td>40 - 60 years</td>'+tb_html+'</tr><tr id="victim_' + irc_victim_type[i].id + '_60"><td>\> 60 years</td>'+tb_html+'</tr>'
            }

            for (var i = 0; i < irc_weather_condition.length; i++) {
                typeofweather += '<tr id="weather_' + irc_weather_condition[i].id + '"><td>' + irc_weather_condition[i].name + '</td>'+tb_html+'</tr>'
            }

            for (var i = 0; i < tis_vehicle_type.length; i++) {
                typeofvehicle += '<tr id="vehicle_' + tis_vehicle_type[i].id + '"><td>' + tis_vehicle_type[i].vehicle_type + '</td>'+tb_html+'</tr>'
            }

            typeofroad += '<tr style="font-weight:bold"><td>Total</td>'+tb_html+'</tr></tbody></table>'
            typeofcollision += '<tr style="font-weight:bold"><td>Total</td>'+tb_html+'</tr></tbody></table>'
            typeofweather += '<tr style="font-weight:bold"><td>Total</td>'+tb_html+'</tr></tbody></table>'
            typeofaccidentspot += '<tr style="font-weight:bold"><td>Total</td>'+tb_html+'</tr></tbody></table>'
            typeoftrafficviolation += '<tr style="font-weight:bold"><td>Total</td>'+tb_html+'</tr></tbody></table>'
            typeofloadcondition += '<tr style="font-weight:bold"><td>Total</td>'+tb_html+'</tr></tbody></table>'
            typeofvehicle += '<tr style="font-weight:bold"><td>Total</td>'+tb_html+'</tr></tbody></table>'
            typeofvictim += '<tr style="font-weight:bold"><td>Total</td></tr><tr style="font-weight:bold"><td>\< 18 years</td>'+tb_html+'</tr><tr style="font-weight:bold"><td>18 - 25 years</td>'+tb_html+'</tr><tr style="font-weight:bold"><td>25 - 40 years</td>'+tb_html+'</tr><tr style="font-weight:bold"><td>40 - 60 years</td>'+tb_html+'</tr><tr style="font-weight:bold"><td>\> 60 years</td>'+tb_html+'</tr></tbody></table>'

            $('#typeofroad').append(typeofroad)
            $('#typeofcollision').append(typeofcollision)
            $('#typeofweather').append(typeofweather)
            $('#typeofaccidentspot').append(typeofaccidentspot)
            $('#typeoftrafficviolation').append(typeoftrafficviolation)
            $('#typeofloadcondition').append(typeofloadcondition)
            $('#typeofvehicle').append(typeofvehicle)
            $('#typeofvictim').append(typeofvictim)
            getData(sanitize($('#selectyear').val()))
        }
    })

    $('.submitbtn').click(function () {
        getData(sanitize($('.selectyear').val()))
    })

    $('.downloadPdf').click(function () {
        getData(sanitize($('.selectyear').val()), true);
    });
    bind_click = function () {
        $('.delete_row').unbind('click').click(function () {
            $(this).parent().parent().remove()
        })
    }
    
    bind_click()


})