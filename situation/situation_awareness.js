var kms = 1;
$(document).ready(function(){
	$('#toggleIcons').click(function(){
        $('.right-icons').toggleClass('minimize');
        $('#toggleIcons i').toggleClass('fa-angle-down');
        $('#toggleIcons i').toggleClass('fa-angle-up');
    });

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    var map = L.map('situation_awareness_map').setView(GLOBAL.COORD.LAT_LON, 10);
    markers=[],markers_array=[],markers_group = L.featureGroup(),icons=[]

    icons['cctv'] = L.icon({iconUrl: '../../images/cctvOn.png',iconSize:[25,30],iconAnchor:[12.5,15]});
    icons['vids'] = L.icon({iconUrl: '../../images/vidsOn.png',iconSize:[25,30],iconAnchor:[12.5,15]});
    icons['event'] = L.icon({iconUrl: '../../images/event.png',iconSize:[25,25],iconAnchor:[18,5]});
    icons['crime'] = L.icon({iconUrl: '../../images/crime.png',iconSize:[25,25],iconAnchor:[18,5]});
    icons['incident'] = L.icon({iconUrl: '../../images/incident.png',iconSize:[25,25],iconAnchor:[18,5]});
    icons['roadwork'] = L.icon({iconUrl: '../../images/roadwork.png',iconSize:[25,25],iconAnchor:[18,5]});
    icons['accident'] = L.icon({iconUrl: '../../images/accident.png',iconSize:[25,25],iconAnchor:[18,5]});
    icons['vms'] = L.icon({iconUrl: '../../images/vmsOn.png',iconSize:[25,30],iconAnchor:[12.5,30]});
    icons['signal'] = L.icon({iconUrl: '../../images/signal.png',iconSize:[25,30],iconAnchor:[12.5,30]});
    var accidentIcon = L.icon({iconUrl: '../../images/accident.png',iconSize:[30,30],iconAnchor:[15,15]});
    var eventIcon = L.icon({iconUrl: '../../images/event.png',iconSize:[25,25],iconAnchor:[12.5,12.5]});
    var incidentIcon = L.icon({iconUrl: '../../images/incident.png',iconSize:[25,25],iconAnchor:[12.5,12.5]});
    var crimeIcon = L.icon({iconUrl: '../../images/crime.png',iconSize:[25,25],iconAnchor:[12.5,12.5]});
    var roadworkIcon = L.icon({iconUrl: '../../images/roadwork.png',iconSize:[25,25],iconAnchor:[12.5,12.5]});
  

    // map.fitBounds(markers_group.getBounds().pad(0.05));
    mapLink = 
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
    }).addTo(map);

    function getColor(value) {
     return 'rgb('+(parseFloat(value) *2.56)+','+(100-parseFloat(value)*2.56)+',0)';
    }
    
    function getSituationDevices(deviceTypes)
    {
        if (markers) { 
            map.removeLayer(markers_group);
            markers=[],markers_array=[],markers_group = L.featureGroup()
        }
        // var startDate = $('#startDate').val();
        // var endDate = $('#endDate').val();
        var scn = getUrlParameter('scn');
        var situation_type = getUrlParameter('type');
        var currentdate = new Date(); 
        var date = currentdate.getFullYear() + "-"+ (currentdate.getMonth()+1) + "-" 
            + currentdate.getDate() + " "  + currentdate.getHours() + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        $.ajax({
            url: '../../../models/situation/getSituationDevices.hh',
            type: 'POST',
            data: {deviceTypes:deviceTypes,scn:scn,type:situation_type,current_time:date,kms:kms},
            success: function(result){
                result = JSON.parse(result);
                var markers_array = [];
                var situation = result.situation;
                var scn = situation.SystemCodeNumber;
                var mid = situation.Type;
                var nor = situation.Northing;
                var eas = situation.Easting;
                $('#situation_scn').html(scn);
                $('#situation_type').html(mid.toUpperCase());
                $('#situation_subtype').html(situation.accident_type);
                $('#situation_accident_time').html(getFormattedDate(situation.AccidentTime,'Y-m-d H:m:s','d/m/y H:m:s'));
                $('#situation_short_desc').html(situation.ShortDescription);
                $('#situation_long_desc').html(situation.LongDescription);
                $('#situation_severity').html(situation.Severity);
                $('#situation_reported_by').html(situation.CreatedBy);
                if(situation.ImagePath != ""){
                    var images = situation.ImagePath.split(';')
                    if(images.length != 0){
                        for(var i=0;i<images.length;i++){
                            var html_template = '';
                            html_template += '<div class="item">';
                            html_template += '<div class="pad15">';
                            html_template += '<img src="'+images[i]+'">';
                            html_template += '</div>';
                            html_template += '</div>';
                        }
                        $('.situation_images_list').html(html_template);
                        $('#situation_images').show();
                    }else{
                        $('#situation_images').hide();
                    }
                    
                }else{
                    $('#situation_images').hide();
                }
                var html_template = '';
                for(var j=0;j<result['vms'].length;j++)
                {
                    html_template += '<tr>';
                    html_template += '<td>'+result['vms'][j].ShortDescription+'</td>';
                    html_template += '<td>'+result['vms'][j].MessageName+'</td>';
                    html_template += '</tr>';

                }
                $('#vms_details_list').html(html_template);
                
                $.ajax({
                    url: '../../../models/cctv/get_cctv_login.hh',
                    type: 'POST',
                    success: function(result2){
                        res2 = JSON.parse(result2);
                        for(var j=0;j<(result['cctv'].length>=2?2:result['cctv'].length);j++)
                        {
                            // var html_template = '<video id="hls-video-'+j+'"  class="video-js vjs-default-skin"  controls="controls" autoplay muted style="margin:0.2em auto 0.2em auto; width:98%;" height="100%"> </video>';
                            // html_template += '<object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921" codebase="./axvlc.cab" id="vlc" events="True" height="100%" width="100%">';
                            // html_template += '<param name="Src" value="rtsp://'+res2[0].login+':'+res2[0].pass+'@'+result['cctv'][j].NVRIPAddress.split(":")[0]+'/cam/realmonitor?channel='+result['cctv'][j].NVRIPAddress+'&subtype=1" />';
                            // html_template += '<param name="ShowDisplay" value="True" />';
                            // html_template += '<param name="AutoLoop" value="False" />';
                            // html_template += '<param name="AutoPlay" value="True" />';
                            // html_template += '</object>';
                            // console.log('j= '+j);
                            var links = result['cctv'];
                            
                            var link = result['cctv'][j].LiveLink;
                            var PublicLiveLink = result['cctv'][j].PublicLiveLink;
                            var ip = result['cctv'][j].IPAddress;
                            var publicip = result['cctv'][j].PublicIPAddress;
                            var port = result['cctv'][j].Port;
                            var scn = result['cctv'][j].SystemCodeNumber
                            // console.log(link)
                            var nvrip = links[j].NVRIPAddress;
                            var channel = links[j].Channel;
                            // console.log(PublicLiveLink)
                            $('#camera-'+j).html(result['cctv'][j].SystemCodeNumber+' - '+result['cctv'][j].ShortDescription);
                            // document.querySelector('#videoTag').innerHTML = `<img src="${link}" style="margin:0.2em auto 0.2em auto; width:98%;height:500px;" onerror="this.onerror=null;this.src='../../images/imagenotfound.png'"/>`                      
                            
                            // var html_template = `<video controls="" autoplay="" loop name="media" style="width:100%;"><source src="${result['cctv'][j].LiveLink}" type="video/mp4"></video>`

                            // var html_template = `<img src="${result['cctv'][j].LiveLink}" style="margin:0.2em auto 0.2em auto; width:98%;height:500px;" onerror="this.onerror=null;this.src='../../images/imagenotfound.png'"/>`
                            // $('.stream-'+j).html(html_template);


                            var camera_image1 = "http://"+ip+"/"+link;
                            document.querySelector('.stream-'+j).innerHTML = `<img src="${camera_image1}" id="cctv_image_${scn}" style="margin:0.2em auto 0.2em auto; width:98%;height:inherit;" data-idx="${j}"/>`
                            
                            document.getElementById('cctv_image_'+scn).onload = function() { 
                                    
                            }

                            document.getElementById('cctv_image_'+scn).onerror = function() { 
                                // console.log(PublicLiveLink)
                                var camera_image2 = "http://"+publicip+":"+port+"/"+PublicLiveLink; 
                                // $('.object_container object').remove()
                                var idx = $(this).attr('data-idx')
                                document.querySelector('.stream-'+idx).innerHTML = `<img src="${camera_image2}" id="cctv_image_${scn}" style="margin:0.2em auto 0.2em auto; width:98%;height:inherit;" onerror="this.onerror=null;this.src='../../images/imagenotfound.png'"/>`;
                            }
                            
                        }
                    }
                });
                
                
                var table = '<table class="map_table" id="' + situation.SystemCodeNumber + '">';
                table += '<tr><th>Key</th><th>Value</th></tr>';
                $.each(situation, function(k,v) {
                    
                    if(k =='CreationDate' || k == 'EndDate' || k == 'ShortDescription' || k == 'LongDescription' || k == ' EndDate' || k == 'CreatedBy' || k == 'isold' || k == 'id' || k == 'Checklist' || k == 'Checklist_type' || k == 'Checklist_extra' || k == 'Informed' || k == 'Informed_time' || k == 'Arrived' || k == 'Arrived_time' || k == 'Resolved_time' || k == 'Resolved')
                        return true;
                    else if(k=='AccidentTime')
                        table += "<tr><td>AccidentTime</td><td>" + getFormattedDate(v,'Y-m-d H:m:s','d/m/y H:m:s') + "</td></tr>"
                    else
                        table += "<tr><td>" + k + "</td><td>" + (v==null?'--':v) + "</td></tr>"
                });
                if (situation.isold == '0') {
                    // for (var i = 0; i < res_rel.length; i++) {
                        var name = situation.Checklist_type,
                        informed = situation.Informed,
                        arrived = situation.Arrived,
                        resolved = situation.Resolved;
                        ////console.log(name);
                        if (informed == "true" && name !="Nearest Camera" && name != "Nearest VMS") {
                            table += "<tr><td>" + name+"</td>";
                            if (arrived == "false") {
                                table += "<td><button mid='"+mid+"' scn='"+scn+"' chk_type='"+name+"' class='set_time btn btn-primary' style='background:#253654'>Arrived</button> &nbsp; &nbsp;";
                            }
                            else{
                                table += "<td><button class='btn btn-success' disabled>Arrived</button> &nbsp; &nbsp;";
                            }
                            if (resolved == "false") {
                                table += "<button mid='"+mid+"' scn='"+scn+"' chk_type='"+name+"' class='set_time btn btn-primary' style='background:#253654'>Resolved</button></td>";
                            }
                            else{
                                table += "<button class='btn btn-success' disabled>Resolved</button></td>";
                            }
                        }
                        // else if(name=="Nearest Camera" || name== "Nearest VMS"){
                        //     table += "<tr><td>" + name+"</td>";
                        //     table += "<td><button mid='"+mid+"' scn='"+scn+"' nor='"+nor+"' eas='"+eas+"' chk_type='"+name+"' class='do_action btn btn-primary' style='background:#253654'>View</button> &nbsp; &nbsp;";
                        // }
                        // else{
                        //     table += "<tr><td>" + name+"</td>";
                        //     table += "<td><button mid='"+mid+"' scn='"+scn+"' nor='"+nor+"' eas='"+eas+"' chk_type='"+name+"' class='do_action btn btn-primary' style='background:#253654'>View</button> &nbsp; &nbsp;";
                        // }
                    // }
                    table += '</table>';
                    table += "<button mid='"+mid+"' scn='"+scn+"' chk_type='"+name+"' stime='"+situation.AccidentTime+"' ldesc='"+escape(situation.LongDescription)+"' class='resolve_sit btn btn-primary' style='background:#253654;margin: 0 auto;display: block;margin-top: 5px;'>Resolve Situation</button>";
                }
                else{
                    table += "<tr><td>Report</td><td mid='"+mid+"' scn='"+scn+"' style='color:blue;'' class='view_report' >View Report</td></tr>";
                    table += '</table>';
                }
                var typeIcon=accidentIcon;
                if(mid == "accident")
                    typeIcon = accidentIcon
                else if(mid == "event")
                    typeIcon = eventIcon
                else if(mid == "crime")
                    typeIcon = crimeIcon
                else if(mid == "incident")
                    typeIcon = incidentIcon
                else if(mid == "roadwork")
                    typeIcon = roadworkIcon 
                markers_array.push(new L.marker([situation.Northing,situation.Easting]))
                marker = new L.marker([situation.Northing,situation.Easting],{icon: typeIcon}).bindPopup(table);
                marker.addTo(markers_group).on('click', function(e) {
                    $('.mapsection').removeClass('col-sm-12').addClass('col-sm-9')
                    $('.actionform').addClass('active');
                });;
                markers_group.addTo(map);
                for(var i=0;i<deviceTypes.length;i++)
                {
                    for(var j=0;j<result[deviceTypes[i]].length;j++)
                    {
                        markers_array.push(new L.marker([result[deviceTypes[i]][j].Northing,result[deviceTypes[i]][j].Easting]));
                        if(deviceTypes[i]=='cctv')
                        {   
                            // marker = new L.marker([result[deviceTypes[i]][j].Northing,result[deviceTypes[i]][j].Easting],{icon: icons[deviceTypes[i]]}).bindPopup('<div class="tets"><div class="tets2"><b>Place : </b>'+result[deviceTypes[i]][j].ShortDescription+'</div><br><div><table><tbody><tr><td><a class="btn btn-primary" href="javascript:void(0)" onclick="streamCCTV(\''+result[deviceTypes[i]][j].NVRIPAddress+'\',\''+result[deviceTypes[i]][j].Channel+'\',\''+result[deviceTypes[i]][j].LiveLink+'\')"><span class="glyphicon glyphicon-picture"></span>&nbsp;Live View</a></td></tr></tbody></table></div>')
                            var fault = result[deviceTypes[i]][j].fault
                            if (fault === "1" || fault === 1) {
                                btntxt = 'Live view';
                                is_offline = 0;
                            }else{
                                btntxt = 'Last recorded data';
                                // is_offline = 1;
                            }

                            marker = new L.marker([result[deviceTypes[i]][j].Northing,result[deviceTypes[i]][j].Easting],{icon: icons[deviceTypes[i]]}).bindPopup('<div class="tets fontOpenSansRegular"><div class="tets2"><b>Description : </b>' + result[deviceTypes[i]][j].ShortDescription + '</div><br><div style="display: flex;flex-direction: row;justify-content: space-around;"><button class="btn btn-customPrimary" data-toggle="modal" data-target="#liveModal" onClick=setLiveLink("' + result[deviceTypes[i]][j].SystemCodeNumber + '","'+fault+ '","'+result[deviceTypes[i]][j].IPAddress+ '","'+result[deviceTypes[i]][j].PublicIPAddress+ '","'+result[deviceTypes[i]][j].Port+ '","'+result[deviceTypes[i]][j].LiveLink+ '","'+result[deviceTypes[i]][j].PublicLiveLink+'");><span class="glyphicon glyphicon-picture nav-top-icon"></span>'+btntxt+'</button>'+((fault === "1" || fault === 1) && result[deviceTypes[i]][j].type == '1' ? '<button class="btn btn-customPrimary" style="margin-left:10px" onclick=streamCCTV("'+result[deviceTypes[i]][j].IPAddress+'","'+result[deviceTypes[i]][j].Channel+'","'+result[deviceTypes[i]][j].LiveLink+'","'+result[deviceTypes[i]][j].PublicLiveLink+'","'+result[deviceTypes[i]][j].PublicIPAddress+'","'+result[deviceTypes[i]][j].make_id+'","'+result[deviceTypes[i]][j].SystemCodeNumber+'")><i class="fas fa-external-link-alt"></i>&nbsp;Operate</button>' : '')+'</div>')
                        }
                        else if(deviceTypes[i]=='vms')
                        
                        { 
                            var view_url= '../vms/'+result[deviceTypes[i]][j].view_url;
                            if (result[deviceTypes[i]][j].LiveLink!=''&&result[deviceTypes[i]][j].LiveLink!=null) {
                                var showPreview = 1;
                            }
                            else { var showPreview = 0 }
            
                            if (result[deviceTypes[i]][j].LiveLink!=''&&result[deviceTypes[i]][j].LiveLink!=null) {
                                var cctvLink = result[deviceTypes[i]][j].LiveLink;
                            }
                            else { var cctvLink = '' }
                            is_offline = 1;
                            // return console.log("is_offline = "+is_offline)
                            var str ='';
                            str='<span><b>SCN : </b>'+result[deviceTypes[i]][j].SystemCodeNumber + ' - ' + result[deviceTypes[i]][j].ShortDescription+'</span><br><span><b>Location</b>: ' + result[deviceTypes[i]][j].Place + '</span><br><span><b>Message : </b>' + (result[deviceTypes[i]][j].MsgTxt == null ? '--' : result[deviceTypes[i]][j].MsgTxt) + '</span><br><span><b>Last updated : </b>' + (result[deviceTypes[i]][j].LastUpdated == null ? '--' : getFormattedDate(result[deviceTypes[i]][j].LastUpdated, 'Y-m-d H:m:s', 'd-m-y H:m:s')) + '</span><br><br><center>';
                            if(is_offline == "0")
                            str+='<span><b><a href="javascript:void(0)" onclick="displayOfflineMsg()">Set message</a></b></span>';
                            else
                            str += '<b><a href="' + view_url + '&showPreview=' + showPreview + '&cctvlink=' + cctvLink + '&vmstypeid=' + result[deviceTypes[i]][j].TypeID + '&scn=' + result[deviceTypes[i]][j].SystemCodeNumber + '" target="_blank">Set message</a></b>';
                            marker = new L.marker([result[deviceTypes[i]][j].Northing,result[deviceTypes[i]][j].Easting],{icon:icons[deviceTypes[i]]}).bindPopup(str)
                        }
                        else if(deviceTypes[i]=='vids')
                        {
                            marker = new L.marker([result[deviceTypes[i]][j].Northing,result[deviceTypes[i]][j].Easting],{icon: icons[deviceTypes[i]]}).bindPopup('<div class="tets"><div class="tets2"><b>Place : </b>'+result[deviceTypes[i]][j].ShortDescription+'</div><br><div><table><tbody><tr><td><a class="btn btn-primary" href="javascript:void(0)" onclick=streamVIDS("'+result[deviceTypes[i]][j].IPAddress+'","'+result[deviceTypes[i]][j].LiveLink+'","'+result[deviceTypes[i]][j].PublicLiveLink+'","'+result[deviceTypes[i]][j].Port+'","'+result[deviceTypes[i]][j].SystemCodeNumber+'","'+result[deviceTypes[i]][j].PublicIPAddress+'")><span class="glyphicon glyphicon-picture"></span>&nbsp;Live View</a></td></tr></tbody></table></div>')
                        }
                        // else if(deviceTypes[i]=='signal')
                        // {
                        //     marker = new L.marker([result[deviceTypes[i]][j].Latitude,result[deviceTypes[i]][j].Longitude],{icon:icons[deviceTypes[i]]}).bindPopup('<span><b>Name : </b>'+result[deviceTypes[i]][j].ShortDescription+'</span><br>')
                        //     for(var k=0;k<result['approaches'].length;k++)
                        //     {
                        //         var pointA = new L.LatLng(result['approaches'][k].Northing, result['approaches'][k].Easting);
                        //         var pointB = new L.LatLng(result['approaches'][k].NorthingEnd, result['approaches'][k].EastingEnd);
                        //         var pointList = [pointA, pointB];
                        //         if(result['approaches'][k].CongestionPercent!=null)
                        //         {
                        //             var color = getColor(result['approaches'][k].CongestionPercent);
                        //         }else
                        //             var color = 'blue';
                        //         var firstpolyline = new L.polyline(pointList, {
                        //             color: color,
                        //             weight: 10,
                        //             opacity: 0.7,
                        //             smoothFactor: 1

                        //         }).bindPopup('<span><b>Signal : </b>'+result[deviceTypes[i]][j].ShortDescription+'<br><b>Approach : </b>'+result['approaches'][k].ShortDescription+'</span><br><b>Congestion : </b>'+(result['approaches'][k].CongestionPercent==null?'--':result['approaches'][k].CongestionPercent)+'<br><b>Last Updated : </b>'+result['approaches'][k].LastUpdated);
                        //         firstpolyline.addTo(markers_group);;
                        //     }
                        // }
                        else
                        {
                            marker = new L.marker([result[deviceTypes[i]][j].Northing,result[deviceTypes[i]][j].Easting],{icon:icons[deviceTypes[i]]}).bindPopup(result[deviceTypes[i]][j].ShortDescription+'<br><b>Latitude:</b> '+result[deviceTypes[i]][j].Northing+' <br><b>Longitude:</b> '+result[deviceTypes[i]][j].Easting+'')
                        }
                        marker.addTo(markers_group);
                        markers_group.addTo(map);
                    }
                    if (fault === 1) {
                        $('#setMessage').unbind('click');
                        // $('#viewMessage').unbind('click');
                        $('.setMessageBtn').removeAttr('id');
                        // $('.viewMessageBtn').removeAttr('id');
                        $('.setMessageBtn').attr('onclick', 'displayOfflineMsg()');
                    } else {
                        $('.setMessageBtn').removeAttr('onclick');
                        // $('.setMessageBtn').attr('id', 'viewMessage');
                        // $('.viewMessageBtn').removeAttr('onclick');
                        // $('.viewMessageBtn').attr('id', 'viewMessage');
                    }
                    
                }

                map.fitBounds(markers_group.getBounds().pad(0.05));
            }
        });
    }
    $('input[name=mapmarker]').change(function(){
        getSituationTypes();
    });
    var timer = setInterval(function(){
        $('.situation_details').toggleClass('dis-none');
        $('.vms_details').toggleClass('dis-none');
        $('.situation_details_dot').toggleClass('activedot');
        $('.vms_details_dot').toggleClass('activedot');
    },5000);
    $('.containers').hover(function(ev){
        clearInterval(timer);
    }, function(ev){
        timer = setInterval(function(){
        $('.situation_details').toggleClass('dis-none');
        $('.vms_details').toggleClass('dis-none');
        $('.situation_details_dot').toggleClass('activedot');
        $('.vms_details_dot').toggleClass('activedot');
    },5000);
    });
    $('.prev_container').click(function(){
         $('.situation_details').toggleClass('dis-none');
         $('.vms_details').toggleClass('dis-none');
         $('.situation_details_dot').toggleClass('activedot');
        $('.vms_details_dot').toggleClass('activedot');
    });
    $('.next_container').click(function(){
         $('.situation_details').toggleClass('dis-none');
         $('.vms_details').toggleClass('dis-none');
         $('.situation_details_dot').toggleClass('activedot');
        $('.vms_details_dot').toggleClass('activedot');
    });
    $('.situation_details_dot').click(function(){
        $('.situation_details').removeClass('dis-none');
        $('.vms_details').addClass('dis-none');
        $('.situation_details_dot').addClass('activedot');
        $('.vms_details_dot').removeClass('activedot');
    });
     $('.vms_details_dot').click(function(){
        $('.situation_details').addClass('dis-none');
        $('.vms_details').removeClass('dis-none');
        $('.situation_details_dot').removeClass('activedot');
        $('.vms_details_dot').addClass('activedot');
    });
    function getSituationTypes()
    {
        var deviceTypes = [];
        if($('input[name=mapmarker][value=cctv]').prop('checked') == true)
        {
            deviceTypes.push('cctv');
            $('.cctv-img').attr('src','../../images/cctv.png');
            $('.cctv-txt').css({"color" : "#000"});
            $('input[name=mapmarker][value=cctv]').parent().css('background','rgba(219, 200, 200,0.9)')
        }else{
            $('.cctv-img').attr('src','../../images/cctv-grey.png');
            $('.cctv-txt').css({"color" : "#f7f7f7"});
            $('input[name=mapmarker][value=cctv]').parent().css('background','grey')
        }
        if($('input[name=mapmarker][value=vms]').prop('checked') == true)
        {
            deviceTypes.push('vms');
            $('.vms-img').attr('src','../../images/vms.png');
            $('.vms-txt').css({"color" : "#000"});
            $('input[name=mapmarker][value=vms]').parent().css('background','rgba(219, 200, 200,0.9)')
        }else{
            $('.vms-img').attr('src','../../images/vms-grey.png');
            $('.vms-txt').css({"color" : "#f7f7f7"});
            $('input[name=mapmarker][value=vms]').parent().css('background','grey')
        }
        if($('input[name=mapmarker][value=vids]').prop('checked') == true)
        {
            deviceTypes.push('vids');
            $('.vids-img').attr('src','../../images/vids.png');
            $('.vids-txt').css({"color" : "#000"});
            $('input[name=mapmarker][value=vids]').parent().css('background','rgba(219, 200, 200,0.9)')
        }else{
            $('.vids-img').attr('src','../../images/vids-grey.png');
            $('.vids-txt').css({"color" : "#f7f7f7"});
            $('input[name=mapmarker][value=vids]').parent().css('background','grey')
        }
        if($('input[name=mapmarker][value=signal]').prop('checked') == true)
        {
            deviceTypes.push('signal');
            $('.signal-img').attr('src','../../images/trafficSignal.png');
            $('.signal-txt').css({"color" : "#000"});
            $('input[name=mapmarker][value=signal]').parent().css('background','rgba(219, 200, 200,0.9)')
        }else{
            $('.signal-img').attr('src','../../images/trafficSignal-grey.png');
            $('.signal-txt').css({"color" : "#f7f7f7"});
            $('input[name=mapmarker][value=signal]').parent().css('background','grey')
        }
        // if($('input[name=mapmarker][value=events]').prop('checked') == true)
        // {
        //     deviceTypes.push('events');
        //     $('.events-img').attr('src','../../images/event-black.png');
        //     $('.events-txt').css({"color" : "#000"});
        //     $('input[name=mapmarker][value=events]').parent().css('background','rgba(219, 200, 200,0.9)')
        // }else{
        //     $('.events-img').attr('src','../../images/event-grey.png');
        //     $('.events-txt').css({"color" : "#f7f7f7"});
        //     $('input[name=mapmarker][value=events]').parent().css('background','grey')
        // }

        // if($('input[name=mapmarker][value=crime]').prop('checked') == true)
        // {
        //     deviceTypes.push('crime');
        //     $('.crime-img').attr('src','../../images/crime-black.png');
        //     $('.crime-txt').css({"color" : "#000"});
        //     $('input[name=mapmarker][value=crime]').parent().css('background','rgba(219, 200, 200,0.9)')
        // }else{
        //     $('.crime-img').attr('src','../../images/crime-grey.png');
        //     $('.crime-txt').css({"color" : "#f7f7f7"});
        //     $('input[name=mapmarker][value=crime]').parent().css('background','grey')
        // }

        // if($('input[name=mapmarker][value=incident]').prop('checked') == true)
        // {
        //     deviceTypes.push('incident');
        //     $('.incident-img').attr('src','../../images/incident-black.png');
        //     $('.incident-txt').css({"color" : "#000"});
        //     $('input[name=mapmarker][value=incident]').parent().css('background','rgba(219, 200, 200,0.9)')
        // }else{
        //     $('.incident-img').attr('src','../../images/incident-grey.png');
        //     $('.incident-txt').css({"color" : "#f7f7f7"});
        //     $('input[name=mapmarker][value=incident]').parent().css('background','grey')
        // }

        // if($('input[name=mapmarker][value=roadwork]').prop('checked') == true)
        // {
        //     deviceTypes.push('roadwork');
        //     $('.roadwork-img').attr('src','../../images/roadwork-black.png');
        //     $('.roadwork-txt').css({"color" : "#000"});
        //     $('input[name=mapmarker][value=roadwork]').parent().css('background','rgba(219, 200, 200,0.9)')
        // }else{
        //     $('.roadwork-img').attr('src','../../images/roadwork-grey.png');
        //     $('.roadwork-txt').css({"color" : "#f7f7f7"});
        //     $('input[name=mapmarker][value=roadwork]').parent().css('background','grey')
        // }

        // if($('input[name=mapmarker][value=accident]').prop('checked') == true)
        // {
        //     deviceTypes.push('accident');
        //     $('.accident-img').attr('src','../../images/accident.png');
        //     $('.accident-txt').css({"color" : "red"});
        //     $('input[name=mapmarker][value=accident]').parent().css('background','rgba(219, 200, 200,0.9)')
        // }else{
        //     $('.accident-img').attr('src','../../images/accident-grey.png');
        //     $('.accident-txt').css({"color" : "#f7f7f7"});
        //     $('input[name=mapmarker][value=accident]').parent().css('background','grey')
        // }
        
        getSituationDevices(deviceTypes);
    }
    getSituationTypes();
    $('.submitbtn').click(function(){
        getSituationTypes();
    });

    set_message = function(){
   			// var vms = document.getElementById("scns").options[document.getElementById("scns").selectedIndex].text;
			// var msg = document.getElementById("msg_texts").options[document.getElementById("msg_texts").selectedIndex].text;
			// var slide = document.getElementById("slide").options[document.getElementById("slide").selectedIndex].text;
			var time=$('#time').val();
			var vms_scn=$('#scn').html();
			var message=$('#message_list option:selected').text();
			var message_id=$('#message_list').val();
			var location = $('#shortDescription').html();
			var serial = $('#serialNumber').val();
			var textcolor = $('#textcolor').val();
			var bgcolor = $('#bgcolor').val();

			if(time == ''){
				alert('Please enter Time (in minutes)')
				return
			}

			// if(slide == "Slide Number"){
			// 	alert("Please enter Slide number");
			// 	return;
			// }
			// if(time == "time(in sec)"){
			// 	alert("Please enter time");
			// 	return;
			// }

			$.ajax({
                url: '../../../models/utils/get_username.hh',
                type: 'POST',
                success: function(result_username) {
					var username = result_username;
					$.ajax({
		                url: '../../utils/vms/set_vms_message.hh',
		                data :{vms_scn:vms_scn,vms_id:serial,message:message,time:time,location:location,username:username, message_id: message_id, textcolor:textcolor, bgcolor:bgcolor},
		                type: 'POST',
		                success: function(result) {
		                    //if(result.length == 2){
							// 	alert("Connection Error please try again");
							// }else if(result === "\nduplicate"){
							// 	alert("Please delete existing message on the device");
							// 	fetch_messages();
							// }else if(result === "\nMessageID"){
							// 	alert("Message is not selected properly");
							// 	fetch_messages();
							// }else{
							// 	alert("Your message has been set successfully");
							// 	fetch_messages();	
							// }
							// $('#dataTable').DataTable().destroy()
        					// get_dt()
		                }
		           });
				}
            });		
    }
    $("#set_message").click(function() {
            set_message();
    });


    $('#increaseRadius').click(function(){
        kms++;
        getSituationTypes();
    })
});
var SystemCodeNumber;
function openMessageModal(scn,shortDescription,serialNumber)
{
	SystemCodeNumber = scn;
	$('#messageModal').modal();
	$('#scn').html(scn);
	$('#shortDescription').html(shortDescription);
	$('#serialNumber').val(serialNumber);
}

function getMessages()
{
	$.ajax({
		url: '../../../models/vms/get_vms_msgs.hh',
        type: 'POST',
		success: function(result) {
			if(result.length == 2){
				alert("No VMS Message added yet");
			}
			else{
				var scns = JSON.parse(result);
				var append = '';
				for(i=0;i<Object.keys(scns).length;i++){
					append += '<option value="'+scns[i].MessageID+'">'
					append += scns[i].MessageText
					append += '</option>'
				}
				$("#message_list").html(append);
			}
		}
    });
}
getMessages();

    function streamCCTV(ip,channel,livelink,PublicLiveLink,publicip,make_id,scn){
        window.open('../cctv/cctvWindow_'+make_id+'.html?ip='+ip+'&publicip='+publicip+'&channel='+channel+'&liveLink='+livelink+'&PublicLiveLink='+PublicLiveLink+'&scn='+scn, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width="+$(window).width()+",height="+$(window).height());
        return ;
    }
    function streamVIDS(ip,livelink,publiclivelink,port,scn,publicip){

        window.open(`../vids/vidsCctvWindow.html?ip=${ip}&publicip=${publicip}&scn=${scn}&port=${port}&liveLink=${livelink}&publicliveLink=${publiclivelink}`, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width="+$(window).width()+",height="+$(window).height())
    }
    function displayOfflineMsg() {
        $.alert({
            type: 'red',
            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
            content: '<div class="fw-bold">VMS Device is Offline!</div>'
        });
        return;
    }
    function openWindow(makemodelid, IPAddress, Channel, LiveLink, SystemCodeNumber){
        window.open(`../cctv/cctvWindow_${makemodelid}.html?ip=${IPAddress}&channel=${Channel}&liveLink=${LiveLink}&scn=${SystemCodeNumber}`, '_blank')
    }
    function setVIDSLiveLink()
    {
        $('#cctv_name_details').html($('option:selected', this).text())
        
        var camera_image1 = "http://"+ip+"/"+LiveLink;
        var camera_image2 = "http://"+publicip+":"+port+"/"+PublicLiveLink; 
        
        document.getElementById('preview_'+SystemCodeNumber).onload = function() { 
            document.querySelector('#videoTag').innerHTML = `<img src="${camera_image1}" id="preview_${SystemCodeNumber}" style="margin:0.2em auto 0.2em auto; width:98%;height:500px;"/>`     
        }

        document.getElementById('preview_'+SystemCodeNumber).onerror = function() { 
            // $('.object_container object').remove()
            document.querySelector('#videoTag').innerHTML = `<img src="${camera_image2}" id="preview_${SystemCodeNumber}" style="margin:0.2em auto 0.2em auto; width:98%;height:500px;" onerror="this.onerror=null;this.src='../../images/imagenotfound.png'"/>`;
        }
        refreshCam('#videoTag img',camera_image2,SystemCodeNumber,GLOBAL.ALT_URL_SEC);
    }
    function setLiveLink (SystemCodeNumber,fault, ip, publicip, port, LiveLink,PublicLiveLink) {

        $('#cctv_name_details').html($('option:selected', this).text())
        
        var camera_image1 = "http://"+ip+"/"+LiveLink;
        var camera_image2 = "http://"+publicip+":"+port+"/"+PublicLiveLink;
        document.querySelector('#videoTag').innerHTML = `<img src="${camera_image1}" id="preview_${SystemCodeNumber}" style="margin:0.2em auto 0.2em auto; width:98%;height:500px;"/>`     
        // document.getElementById('cctv_image_x'+SystemCodeNumber).onload = function() { 
        //     document.querySelector('#videoTag').innerHTML = `<img src="${camera_image1}" id="cctv_image_x${SystemCodeNumber}" style="margin:0.2em auto 0.2em auto; width:98%;height:500px;"/>`     
        // }

        document.getElementById('preview_'+SystemCodeNumber).onerror = function() { 
            var camera_image2 = "http://"+publicip+":"+port+"/"+PublicLiveLink; 
            // $('.object_container object').remove()
            document.querySelector('#videoTag').innerHTML = `<img src="${camera_image2}" id="preview_${SystemCodeNumber}" style="margin:0.2em auto 0.2em auto; width:98%;height:500px;" onerror="this.onerror=null;this.src='../../images/imagenotfound.png'"/>`;
        }
        refreshCam('#videoTag img',camera_image2,SystemCodeNumber,GLOBAL.ALT_URL_SEC);

    //     $.ajax({
    //         url: '../../../models/cctv/cctv_map_link.hh',
    //         type: 'POST',
    //         data: { SystemCodeNumber: SystemCodeNumber },
    //         success: function (result_cctv) {
    //             var links = jQuery.parseJSON(result_cctv);
    //             var link = links[0].LiveLink;
    //             var ip = links[0].NVRIPAddress;
    //             var channel = links[0].Channel;
    //             document.querySelector('#videoTag').innerHTML = `<img src="${link}" style="margin:0.2em auto 0.2em auto; width:98%;height:500px;" onerror="this.onerror=null;this.src='../../images/imagenotfound.png'"/>`   
    //             $('#cctv_name_details').html($('option:selected', this).text())
    // // document.getElementById('videoTag').innerHTML = '<video width="525" height="430px" style="width: 100%; height: 430px;" preload="none" autoplay="true" src="'+link+'" loop="true"></video>';
    //             $('#videoTag object').css('width', '100%')
    //             $('#liveModal').modal()
    //             $('#liveModal').on('shown.bs.modal', function (e) {
    //                 $('#videoTag object').css('width', '100%')
    //             })
    //             $('#videoTag object').css('width', '100%')
    //             if(fault == '1' || fault == 1){
    //                 $('#live_feed').html('Live Camera Feed');
    //             }else{
    //                 $('#live_feed').html('Last recorded data');
    //             }

    //         }
    //     });
    }
    function refreshCam(img,link,scn,sec){
        setTimeout(()=>{
            if(!IsImageOk(img)){
                $('#videoTag').html('');
                $(`#videoTag`).html(`<img src="${link}" id="preview_${scn}" style="margin:0.2em auto 0.2em auto; width:98%;height:500px;" onerror="this.onerror=null;this.src='../../images/imagenotfound.png'"/>`)
            }
        },sec)
    }