$(document).ready(function(){
    detector_devices = [];
    $('#scns').append('<option value="all">All</option>')
    // $.ajax({
    //     url:'../../utils/cctv_raw.php',
    //     type:'POST',
    //     data:{
    //         type:'vehicle'
    //     },
    //     success:function(res){
    //         res = JSON.parse(res)
    //         $('#scns').append('<optgroup label="CCTV Detectors">')
    //         for(var i=0;i<res.length;i++){
    //             if(res[i].type == "detector")
    //                 $('#scns').append('<option value="'+res[i].SystemCodeNumber+'">'+res[i].SystemCodeNumber+'</option>')
    //         }
    //         $('#scns').append('</optgroup>')
    //         detector_devices = detector_devices.concat(res)
    //     }
    // })

    // $.ajax({
    //     url:'../../utils/atcc_devices.php',
    //     type:'POST',
    //     success:function(res){
    //         res = JSON.parse(res)
    //         $('#scns').append('<optgroup label="ATCC Detectors">')
    //         for(var i=0;i<res.length;i++){
    //             $('#scns').append('<option value="'+res[i].SystemCodeNumber+'">'+res[i].SystemCodeNumber+'</option>')
    //         }
    //         $('#scns').append('</optgroup>')
    //         detector_devices = detector_devices.concat(res)
    //     }
    // })

    // $.ajax({
    //     url:'../../utils/detector_devices.php',
    //     type:'POST',
    //     data:{
    //         type: 'report'
    //     },
    //     success:function(res){
    //         res = JSON.parse(res)
    //         for(var k=0;k<res.length;k++){
    //             var scns = res[k].SCNS.split(',')
    //             // $('#scns').append('<optgroup label="'+res[k].TypeDescription+' Detectors">')
    //             for(var i=0;i<scns.length;i++){
    //                 detector_devices = detector_devices.concat(scns[i])
    //                 $('#scns').append('<option value="'+scns[i]+'" signalscn="'+scns[i].split('_')[0]+'">'+scns[i]+'</option>')
    //             }
    //             $('#scns').append('</optgroup>')
    //         }
            
    //     }
    // })

    $.ajax({
        url:'../../../models/utils/group_details.hh',
        type:'POST',
        data:{
            groupscn: ''
        },
        success:function(res){
            res = JSON.parse(res)
            var groups = '<option value="all">All</option>', signals = '<option value="all">All</option>'

            for(var k=0;k<res.length;k++){
                var signalscns = res[k].SignalSCN.split(',')
                var signaldesc = res[k].ShortDescription.split('^')
                
                groups += '<option value="'+res[k].SCN+'" signalscns="'+res[k].SignalSCN+'">'+res[k].Name+'</option>'
                
                for(var i=0;i<signalscns.length;i++){
                    signals += '<option value="'+signalscns[i]+'" groupscn="'+res[k].SCN+'">'+signaldesc[i]+'</option>'
                }

            }

            $('#groups').html(groups)
            $('#signals').html(signals)

            bind_click()

            $('#groups').trigger('change')
            
        }
    })
});


function disableInput(){

    var param = document.getElementById("createdBy").options[document.getElementById("createdBy").selectedIndex].text;

    if(param == "Manual"){
        document.getElementById("username").removeAttribute("disabled");
    } else {
        document.getElementById("username").setAttribute("disabled", true);
    }

}

function createGraph(id, data){

    $('#graph_container').append('<svg width="960" height="500" id="'+id+'" style="margin-bottom:5vh"></svg>')

    var svg = d3.select('#'+id),
      margin = { top: 20, right: 50, bottom: 30, left: 50 },
      width = +svg.attr('width') - margin.left - margin.right - 100,
      height = +svg.attr('height') - margin.top - margin.bottom,
      g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    // Graph title
    g.append('text')
      .attr('x', (width / 2))             
      .attr('y', 0 - (margin.top / 3))
      .attr('text-anchor', 'middle')  
      .style('font-size', '16px') 
      .text('Detector TotalFlow for ' + id);
    // Function to convert a string into a time
    var parseTime = d3.time.format('%Y-%m-%d %H:%M:%S').parse;
    // Function to show specific time format
    var formatTime = d3.time.format('%H %M');

    // Set the X scale
    var x = d3.time.scale().range([0, width], 0.5);
    // Set the Y scale
    var y = d3.scale.linear().range([height, 0]);
    // Set the color scale
    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var line = d3.svg.line()
    // .interpolate("basis")
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.worth);
    });
      // console.log(data)
      // load the data
    // d3.json(result, function(error, data) {
      // Select the important columns
      // console.log(data)
      color.domain(d3.keys(data[0]).filter(function(key) {
          return key !== "timestamp";
      }));
      // Correct the types
      data.forEach(function(d) {
        d.date = parseTime(d.timestamp);
      });
      // console.log(data);

      var currencies = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {
              date: d.date,
              worth: +d[name]
            };
          })
        };
      });
      // console.log(currencies)
      // Set the X domain
      x.domain(d3.extent(data, function(d) {
        return d.date;
      }));
      // Set the Y domain
      y.domain([
        d3.min(currencies, function(c) {
          return d3.min(c.values, function(v) {
            return v.worth;
          });
        }),
        d3.max(currencies, function(c) {
          return d3.max(c.values, function(v) {
            return v.worth;
          });
        })
      ]);
      // Set the X axis
      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      // Set the Y axis
      g.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Flow");

      // Draw the lines
      var currency = g.selectAll(".currency")
        .data(currencies)
        .enter().append("g")
        .attr("class", "currency");

      currency.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
          return line(d.values);
        })
        .style("stroke", function(d) {
          return color(d.name);
        });
      // Add the circles
      currency.append("g").selectAll("circle")
        .data(function(d){return d.values})
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("cx", function(dd){return x(dd.date)})
        .attr("cy", function(dd){return y(dd.worth)})
        .attr("fill", "none")
        .attr("stroke", function(d){return color(this.parentNode.__data__.name)});
      // Add label to the end of the line
      currency.append("text")
        .attr("class", "label")
        .datum(function (d) {
          return {
            name: d.name,
            value: d.values[d.values.length - 1]
          };
        })
        .attr("transform", function (d) {
          return "translate(" + x(d.value.date) + "," + y(d.value.worth) + ")";
        })
        .attr("x", 3)
        .attr("dy", ".35em")
        .style('font-size', '16px')
        .text(function (d) {
          return d.name;
        });

    // Add the mouse line
    var mouseG = g.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path")
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(currencies)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function (d) {
        return color(d.name);
      })
      .style("fill", "none")
      .style("stroke-width", "2px")
      .style("opacity", "0");

    mousePerLine.append("text")
        .attr("class", "hover-text")
        .attr("dy", "-1em")
        .attr("transform", "translate(10,3)");

    // Append a rect to catch mouse movements on canvas
    mouseG.append('svg:rect') 
      .attr('width', width) 
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function () { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function () { // mouse moving over canvas
        var mouse = d3.mouse(this);

        d3.selectAll(".mouse-per-line")
          .attr("transform", function (d, i) {

            var xDate = x.invert(mouse[0]),
              bisect = d3.bisector(function (d) { return d.date; }).left;
            idx = bisect(d.values, xDate);

            d3.select(this).select('text')
              .text(y.invert(y(d.values[idx].worth)).toFixed(2));

            d3.select(".mouse-line")
              .attr("d", function () {
                var data = "M" + x(d.values[idx].date) + "," + height;
                data += " " + x(d.values[idx].date) + "," + 0;
                return data;
              });
            return "translate(" + x(d.values[idx].date) + "," + y(d.values[idx].worth) + ")";
          });
      });
        

    // });
}

$(document).ready(function(){

    bind_click = function(){
        $('#groups').on('change',function(){
            $('#signals option:not([value=All])').css('display','none')
            $('#signals option[groupscn='+$(this).val()+']').css('display','block')
            // $('#signals').val('All')
            // $('#scns').val('All')

            $('#signals').trigger('change')
            // $('#scns').trigger('change')
        })

        $('#signals').on('change',function(){
            $('#scns option:not([value=All])').css('display','none')
            $('#scns option[signalscn='+$(this).val()+']').css('display','block')
            // $('#scns').trigger('change')
        })
    }

    pagenation = function(page_number){
        $('#nms_vms').empty();
         $('#searchResult').empty();
        // var header = '<tr><td bgcolor="#253654"><font color="white">Status</td><td bgcolor="#253654"><font color="white">SCN</td><td bgcolor="#253654" align="center"><font color="white">Slide</td><td bgcolor="#253654" align="center"><font color="white">Message Text</td><td bgcolor="#253654" align="center"><font color="white">Time</td><td bgcolor="#253654"><font color="white">Created By</td><td bgcolor="#253654"><font color="white">Deleted By</td><td bgcolor="#253654"><font color="white">Created On</td><td bgcolor="#253654"><font color="white">Updated On</td><td bgcolor="#253654"><font color="white">Deleted On</td></tr>';
        // $('#searchResult').append(header);
        // if(document.getElementById("des").checked == true){
        //     initial_value = Math.min(page_number*10, data_queried.length-1);
        //     for(i=(page_number-1)*10; i<=initial_value;i++){
                
        //         var status=null;
        //         // if(data_queried[data_queried.length-1-i].active == 1){
        //         //     status = "Active";
        //         // } else status = "Removed";

        //         // var deletionUser=data_queried[data_queried.length-1-i].deletionUser;
        //         // if(deletionUser == null){
        //         //     deletionUser = '-';
        //         // }

        //         // var deletionTime=data_queried[data_queried.length-1-i].DeletionTime;
        //         // if(deletionTime == null){
        //         //     deletionTime = '-';
        //         // }

        //         append = '<tr>'
        //         // append += '<td>'+status+'</td>'
        //         append += '<td>'+data_queried[data_queried.length-1-i].SystemCodeNumber+'</td>'
        //         append += '<td>'+data_queried[data_queried.length-1-i].TotalFlow+'</td>'
        //         append += '<td>'+data_queried[data_queried.length-1-i].FlowInterval+'</td>'
        //         append += '<td>'+data_queried[data_queried.length-1-i].LastUpdated+'</td>'
        //         append += '</tr>'
                
        //         $('#searchResult').append(append);
        //     }
        // }
        // else{
            initial_value = Math.min(page_number*10, data_queried.length-1);
            for(i=(page_number-1)*10; i<=initial_value;i++){
                
                var status=null;
                // if(data_queried[i].active == 1){
                //     status = "Active";
                // } else status = "Removed";

                // var deletionUser=data_queried[i].deletionUser;
                // if(deletionUser == null){
                //     deletionUser = '-';
                // }

                // var deletionTime=data_queried[i].DeletionTime;
                // if(deletionTime == null){
                //     deletionTime = '-';
                // }

                append = '<tr>'
                append += '<td>'+data_queried[i].TimeStamp+'</td>'
                append += '<td>'+data_queried[i].SCN+'</td>'
                append += '<td>'+data_queried[i].Speed+'</td>'
                append += '<td>'+data_queried[i].binName+'</td>'
                // append += '<td>'+data_queried[i].FlowInterval+'</td>'
                // append += '<td>'+data_queried[i].LastUpdated+'</td>'
                append += '</tr>'
                
                $('#nms_vms').append(append);
            }
        //}
        append = '<tr>'
        append += '<td colspan"7">&nbsp</td>';
        //<td>&nbsp</td><td>&nbsp</td><td>&nbsp</td><td>&nbsp</td><td>&nbsp</td><td>&nbsp</td><td>&nbsp</td><td>&nbsp</td><td>&nbsp</td>'
        append += '</tr>'
        var max_value = Math.min(page_number+9, Math.ceil(data_queried.length/10));
        max_value = Math.min(page_number+5, max_value);
        if(page_number-4>0){
            var min_value = page_number-4;
        }else{
            var min_value = 1;
        }
        if(max_value-min_value<10){
            max_value = min_value+9;
        }
        if(max_value>Math.ceil(data_queried.length/10)){
            max_value=Math.ceil(data_queried.length/10);
            min_value = max_value-9;
            if (min_value < 1) min_value = 1;
        }
        $('#searchResult').append(append);
        var buttons_numbers = [];
        for(i=min_value;i<=max_value;i++){
            buttons_numbers.push(i);
        }
        add_buttons(buttons_numbers, page_number);
    }
    add_buttons = function(buttons_number, page_number){
        append = '<tr><td>&nbsp</td><td  colspan="9">'

        append += '<ul id="data_nav" class="pagination pagination-md">'
        if(page_number==1){
            append +=  '<li class="disabled"><a style="cursor: pointer" onclick=pagenation(1)>First</a></li>';
            append +=  '<li class="disabled"><a style="cursor: pointer" onclick=pagenation(1)><<</a></li>';
            append +=  '<li class="disabled"><a style="cursor: pointer" onclick=pagenation(1)><</a></li>';
        }
        else{
            append +=  '<li><a onclick=pagenation(1)>First</a></li>';
            if(page_number-10 < 1){
                append +=  '<li><a onclick=pagenation(1)><<</a></li>';
            }else{
                append +=  '<li><a style="cursor: pointer" onclick=pagenation('+(page_number-10)+')><<</a></li>';   
            }
            append +=  '<li><a style="cursor: pointer" onclick=pagenation('+(page_number-1)+')><</a></li>';
        }
        for(i=0; i<buttons_number.length;i++){
            if(buttons_number[i] == page_number){
                append +=  '<li class="active"><a onclick=pagenation('+buttons_number[i]+')>'+buttons_number[i]+'</a></li>';
            }
            else{
                append +=  '<li><a style="cursor: pointer" onclick=pagenation('+buttons_number[i]+')>'+buttons_number[i]+'</a></li>';
            }
        }
        if(page_number==Math.ceil(data_queried.length/10)){
            append +=  '<li class="disabled"><a style="cursor: pointer" onclick=pagenation('+(page_number)+')>></a></li>';
            append +=  '<li class="disabled"><a style="cursor: pointer" onclick=pagenation('+(page_number)+')>>></a></li>';
            append +=  '<li class="disabled"><a style="cursor: pointer" onclick=pagenation('+Math.ceil(data_queried.length/10)+')>Last</a></li>';
        }
        else{
            append +=  '<li><a style="cursor: pointer" onclick=pagenation('+(page_number+1)+')>></a></li>';
            if(page_number+10 > Math.ceil(data_queried.length/10)){
                append +=  '<li><a style="cursor: pointer" onclick=pagenation('+Math.ceil(data_queried.length/10)+')>>></a></li>';  
            }else{
                append +=  '<li><a style="cursor: pointer" onclick=pagenation('+(page_number+10)+')>>></a></li>';   
            }
            append +=  '<li><a style="cursor: pointer" onclick=pagenation('+Math.ceil(data_queried.length/10)+')>Last</a></li>';
        }
        append += '</ul></td></tr>'
        $('#searchResult').append(append);
        
    }

    create_report = function(){
        var fromDate=$('#from').val();
        var toDate=$('#to').val();
        if(fromDate == ""){
            alert("Please Enter From Date");
            return;
        }
        if(toDate == ""){
            alert("Please Enter To Date");
            return;
        }

        var fromTime=$('#fromTime').val();
        var toTime=$('#toTime').val();
        if(fromTime == ""){
            fromTime = "00:00:00"
        }
        if(toTime == ""){
            toTime = "23:59:59"
        }
        var data_type = $('input[name=data_type]:checked').val().toLowerCase()

        var groups = $('#groups').val()
        var signals = $('#signals').val()        
        var scn = "All"//$("#scns").val();

        if(groups != 'All' && signals == 'All'){
            scn = $('#groups option:selected').attr('signalscns')
        }
        else if(signals != 'All'){ // && scn == 'All'){
            scn = $('#signals').val()
        }
        
        var flow=$("#flow").val();
        // var username=$('#username').html().trim();

                   
        $.ajax({
            url: '../../utils/createreport_vbv_detector.php',
            data :{fromDate:fromDate,toDate:toDate,scn:scn,flow:flow,fromTime:fromTime,toTime:toTime,data_type:data_type},
            type: 'POST',
            success: function(result) {
                if(result.length == 2){
                    alert("Connection Error please try again");
                }
                else{
                    var devices_set = jQuery.parseJSON(result);
                    var count = 0;
                    console.log(devices_set.length)
                    if(devices_set.length != 0){
                        data_queried = jQuery.parseJSON(result);
                        pagenation(1);
                    }else{
                        $('#nms_vms').empty();
                        $('#searchResult').empty();
                        append = '<tr><td colspan=10>No results</td></tr>'
                        $('#searchResult').append(append);
                    }
                    
                }
            }
        });
        
    }

    create_reportOnLoad = function(){
        
        var scn='All';
        var username='All';

        var current = new Date();

        var year = current.getFullYear();
        var month = current.getMonth() + 1;
        var date = current.getDate();
        //var date1 = current.getDate()+1;
        var hour = current.getHours();
        var minute = current.getMinutes();
        var seconds = current.getSeconds();
        
        if(month.toString().length==1) month="0"+month;
        if(date.toString().length==1) date="0"+date;
        if(hour.toString().length==1) hour="0"+hour;
        if(minute.toString().length==1) minute="0"+minute;
        if(seconds.toString().length==1) seconds="0"+seconds;

        formatted_toDate = year+"-"+month+"-"+date+" "+hour+":"+minute+":"+seconds;
        formatted_fromDate = year+"-"+month+"-"+date+" "+"00:00:00";
        
        $.ajax({
            url: '../../utils/createreport_vbv_detector.php',
            data :{fromDate:formatted_fromDate,toDate:formatted_toDate,scn:scn,flow:null,fromTime:"00:00:00",toTime:"23:59:59",data_type:"all"},
            type: 'POST',
            success: function(result) {
                if(result.length == 2){
                    // alert("Connection Error please try again");
                }
                else{
                    var devices_set = jQuery.parseJSON(result);
                    var count = 0;
                    if(devices_set.length != 0){
                        data_queried = jQuery.parseJSON(result);
                        pagenation(1);
                    }else{
                        $('#searchResult').empty();
                        append = '<tr><td colspan=10>No results</td></tr>'
                        $('#searchResult').append(append);
                    }
                    
                }
            }
        });
    }


    $("#createReport").click(function() {
            create_report();
    });
    create_reportOnLoad();

    $('#viewGraph').click(function(){
      var fromDate=$('#from').val();
      var toDate=$('#to').val();
      if(fromDate == ""){
          alert("Please Enter From Date");
          return;
      }
      if(toDate == ""){
          alert("Please Enter To Date");
          return;
      }

      var groups = $('#groups').val()
      var signals = $('#signals').val()
      var scn = "All"//$("#scns").val();

      if(groups != 'All' && signals == 'All'){
          scn = $('#groups option:selected').attr('signalscns')
      }
      else if(signals != 'All'){ // && scn == 'All'){
          scn = $('#signals').val()
      }

      if(groups == 'All' || signals == 'All'){
        alert('Please select a signal to analyse');
        return
      }


      $.ajax({
          url:'../../utils/get_detector_graphdata.php',
          method:'POST',
          data:{
              fromDate: fromDate,
              toDate: toDate,
              scn: scn,
          },
          success:function(res){
              // console.log(JSON.parse(res))
              res = JSON.parse(res)

              $('#graph_container').html('')
              for(var i=0; i<res.length; i++){
                  // console.log(res[i].name,res[i].data)
                  createGraph(res[i].name,res[i].data, $('#signals option:selected').val())
              }
          }
      })
    })
});


$(document).ready(function(){
    download_report = function(){

        var downloadPermission = false;

        $.ajax({
            url: '../../utils/get_roles.hh',
            type: 'POST',
            success: function(result) {
                var id_set = jQuery.parseJSON(result);
                /*for(i=0; i<id_set.length;i++){
                    if((id_set[i].role.indexOf("Manager") > -1) || (id_set[i].role.indexOf("Admin") > -1)){
                        downloadPermission = true;
                    }
                        
                }*/
                downloadPermission = true;

                if(downloadPermission){

                    var fromDate=$('#from').val();
                    var toDate=$('#to').val();
                    
                    if(fromDate == "" && toDate == ""){
                        var current = new Date();

                        var year = current.getFullYear();
                        var month = current.getMonth() + 1;
                        var date = current.getDate();
                        //var date1 = current.getDate()+1;
                        var hour = current.getHours();
                        var minute = current.getMinutes();
                        var seconds = current.getSeconds();
                        
                        if(month.toString().length==1) month="0"+month;
                        if(date.toString().length==1) date="0"+date;
                        if(hour.toString().length==1) hour="0"+hour;
                        if(minute.toString().length==1) minute="0"+minute;
                        if(seconds.toString().length==1) seconds="0"+seconds;

                        toDate = year+"-"+month+"-"+date+" "+hour+":"+minute+":"+seconds;
                        fromDate = year+"-"+month+"-"+date+" "+"00:00:00";
                    }

                    if(fromDate == ""){
                        alert("Please Enter From Date");
                        return;
                    }
                    if(toDate == ""){
                        alert("Please Enter To Date");
                        return;
                    }
                    var groups = $('#groups').val()
                    var signals = $('#signals').val()
                    var scn = "All"//$("#scns").val();

                    var fromTime=$('#fromTime').val();
                    var toTime=$('#toTime').val();
                    if(fromTime == ""){
                        fromTime = "00:00:00"
                    }
                    if(toTime == ""){
                        toTime = "23:59:59"
                    }
                    var data_type = $('input[name=data_type]:checked').val().toLowerCase()

                    if(groups != 'All' && signals == 'All'){
                        scn = $('#groups option:selected').attr('signalscns')
                    }
                    else if(signals != 'All'){ // && scn == 'All'){
                        scn = $('#signals').val()
                    }
                    var flow=$("#flow").val();
                    // var username=$('#username').val().trim();

                                            
                    $.ajax({
                        url: '../../utils/createreport_vbv_detector.php',
                        data :{fromDate:fromDate,toDate:toDate,scn:scn,flow:flow,fromTime:fromTime,toTime:toTime,data_type:data_type},
                        type: 'POST',
                        success: function(result) {
                            if(result.length == 2){
                                alert("Connection Error please try again");
                            }
                            else{
                                // $.ajax({
                                //     url: '../../utils/get_detectors.php',
                                //     success: function(result_devices) {

                                        $.ajax({
                                            url: '../../utils/get_username.hh',
                                            type: 'POST',
                                            success: function(result_username) {
                                                var username = result_username;
                                                var currentdate = new Date(); 
                                                var ts = "Downloaded at: " + currentdate.getDate() + "/"
                                                                + (currentdate.getMonth()+1)  + "/" 
                                                                + currentdate.getFullYear() + " @ "  
                                                                + currentdate.getHours() + ":"  
                                                                + currentdate.getMinutes() + ":" 
                                                                + currentdate.getSeconds();

                                                json_to_csv(result,"Detector Report",true,fromDate,toDate,detector_devices,username,ts);
                                            }
                                        });
                                //     }
                                // });

                            }
                        }
                    });
                    
                } else{
                    alert("Permission denied. Please contact your administrator");
                }
            }
        });
    }
    $("#downloadReport").click(function() {
            download_report();
    });
});


$(document).ready(function(){
        download_pdf = function(){
            var downloadPermission = false;
            $.ajax({
                url: '../../utils/get_roles.hh',
                type: 'POST',
                success: function(result) {
                    var id_set = jQuery.parseJSON(result);
                    downloadPermission = true;

                    if(downloadPermission){

                        var fromDate=$('#from').val();
                        var toDate=$('#to').val();

                        if(fromDate == "" && toDate == ""){
                            var current = new Date();

                            var year = current.getFullYear();
                            var month = current.getMonth() + 1;
                            var date = current.getDate();
                            //var date1 = current.getDate()+1;
                            var hour = current.getHours();
                            var minute = current.getMinutes();
                            var seconds = current.getSeconds();
                            
                            if(month.toString().length==1) month="0"+month;
                            if(date.toString().length==1) date="0"+date;
                            if(hour.toString().length==1) hour="0"+hour;
                            if(minute.toString().length==1) minute="0"+minute;
                            if(seconds.toString().length==1) seconds="0"+seconds;

                            toDate = year+"-"+month+"-"+date+" "+hour+":"+minute+":"+seconds;
                            fromDate = year+"-"+month+"-"+date+" "+"00:00:00";
                        }
                        
                        if(fromDate == ""){
                            alert("Please Enter From Date");
                            return;
                        }
                        if(toDate == ""){
                            alert("Please Enter To Date");
                            return;
                        }

                        var fromTime=$('#fromTime').val();
                        var toTime=$('#toTime').val();
                        if(fromTime == ""){
                            fromTime = "00:00:00"
                        }
                        if(toTime == ""){
                            toTime = "23:59:59"
                        }
                        var data_type = $('input[name=data_type]:checked').val().toLowerCase()

                        var groups = $('#groups').val()
                        var signals = $('#signals').val()
                        var scn = "All"//$("#scns").val();

                        if(groups != 'All' && signals == 'All'){
                            scn = $('#groups option:selected').attr('signalscns')
                        }
                        else if(signals != 'All'){ // && scn == 'All'){
                            scn = $('#signals').val()
                        }
                        var flow=$("#flow").val();
                        // var username=$('#username').val().trim();
                        
                        $.ajax({
                            url: '../../utils/get_username.hh',
                            type: 'POST',
                            success: function(result_username) {
                                var username = result_username;
                                window.open("../../utils/createreport_vbv_detector_pdf.php?fromDate=" + fromDate +"&toDate=" + toDate + "&scn=" + scn+"&flow=" + flow+"&username="+$('#usernameGet').html().trim()+"&fromTime="+fromTime+"&toTime="+toTime+"&data_type="+data_type,'_blank');
                            }
                        });
                        
                    } else{
                        alert("Permission denied. Please contact your administrator");
                    }
                }
            });
        }
        $("#downloadPDF").click(function() {
                download_pdf();
        });
});


function json_to_csv(json_data, title, label, fromDate, toDate, json_data_devices, username, timestamp) {
    //Json  Parser
    var arr_data = JSON.parse(json_data);
    var arr_data_devices = json_data_devices;
    var csv = '';
    csv += 'Downloaded by: '+username+'\r\n';
    csv += timestamp+'\r\n\n';
    csv += 'Device Details \r\n';


    
    if (label) {
        var row = "";
        for (var index in arr_data_devices[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        //new line
        csv += row + '\r\n';
    }

    //Traffic data extraction
    // if(document.getElementById("des").checked == true){
    //     for (var i = arr_data_devices.length-1; i >= 0; i--) {
    //         var row = "";        
    //         for (var index in arr_data_devices[i]) {
    //             row += '"' + arr_data_devices[i][index] + '",';
    //         }
    //         row.slice(0, row.length - 1);
    //         //add a line break after each row
    //         csv += row + '\r\n';
    //     }
    // }
    // else{
        for (var i = 0; i < arr_data_devices.length; i++) {
            var row = "";        
            for (var index in arr_data_devices[i]) {
                row += '"' + arr_data_devices[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            csv += row + '\r\n';
        }
    // }
    
    //Title of the csv file, utilize it if needed 
    csv += '\r\n\n'+title + '\r\n\n';
   
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
        for (var i=0; i < arr_data.length; i++) {
            var row = "";        
            for (var index in arr_data[i]) {
                row += '"' + arr_data[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            csv += row + '\r\n';
        }
    // }
    // else{
    //     for (var i = 0; i < arr_data.length; i++) {
    //         var row = "";        
    //         for (var index in arr_data[i]) {
    //             row += '"' + arr_data[i][index] + '",';
    //         }
    //         row.slice(0, row.length - 1);
    //         //add a line break after each row
    //         csv += row + '\r\n';
    //     }
    // }

    if (csv == '') {        
        alert("No data found");
        return;
    }   
    
    // file name declaration change accordingly
    var file_name = "detector_report_"+fromDate+"_"+toDate;  
    // var uri = 'data:text/csv;charset=utf-8,' + escape(csv);    
    var csvData = new Blob([csv], { type: 'text/csv' }); //new way
    var uri = URL.createObjectURL(csvData);
    var link = document.createElement("a");    
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = file_name + ".csv";    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
