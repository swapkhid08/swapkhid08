list_types ="";
situationSCN = ""; //defined globally

coarray = []
classname = "t"

function ColorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }

  return rgb;
}

$(document).ready(function(){
    // var dates = getCurrentStartNEndDate();
    // $('.accSDate').val(getFormattedDate(dates[0],'Y-m-d H:m:s','d-m-y H:m:s'));
    // $('.accEDate').val(getFormattedDate(dates[1],'Y-m-d H:m:s','d-m-y H:m:s'));
    // var logic = function( currentDateTime ){
    //         if (currentDateTime && currentDateTime.getDay() == 6){
    //             this.setOptions({
    //                 minTime:'11:00'
    //             });
    //         }
    //         else
    //             this.setOptions({
    //                 minTime:'8:00'
    //             });
    //         };

    // $('.datepicker').datetimepicker({
    // onChangeDateTime:logic,
    // onShow:logic
    // });

    
    $('.graph_type .btn').click(function(){
        $('.graph_type .btn').removeClass('active')
        // $('#chart_div').html('');
        if($(this).hasClass('subtype')){
            $('.type_container').css('display','none')
            $('.subtype_container').css('display','block')
            $('#chartdiv').html('')
            classname = "st"
        }
        else{
            $('.type_container').css('display','block')
            $('.subtype_container').css('display','none')
            $('#chartdiv').html('')
            classname = "t"
        }
        $(this).addClass('active')
    })

    bind_click = function(){
        $('.sublist_container span').click(function(){
            $(this).toggleClass('active')
            if($(this).hasClass('active'))
                $(this).attr('title','Click to deselect this item')
            else
                $(this).attr('title','Click to select this item')
        })
    }


    // var a;
    $('#selectAll').click(function(){
        if ($(this).prop("checked")) {
            // console.log("checked")
            $(".sublist_container span").addClass('active')
        }
        else{
            // console.log("unchecked")
            $(".sublist_container span").removeClass('active')
        } 
    })

    subArray = []
    $('.situation_type').change(function(){
        $('#selectAll').prop("checked",true)
        $.ajax({
            url: '../../../models/situation/get_utmc_types.hh',
            method:'POST',
            data:{
                type:sanitize($(this).val())
            },
            success:function(res){
                // console.log(res)
                res = JSON.parse(res)
                $('.sublist_container span').remove()
                // subArray = []
                for(var i=0;i<Object.keys(res).length;i++){
                    $('.sublist_container').append('<span class="active" value="'+res[i].accident_type_id+'" title="Click to deselect this item">'+res[i].accident_type.toUpperCase()+'</span>')
                    // subArray.push(res[i].accident_type.toUpperCase())
                }
                bind_click()
            }
        })
    })

    $('.situation_type').trigger('change')
 
    function drawStuff() {

        var button = document.getElementById('change-chart');
        var chartDiv = document.getElementById('chart_div');
        
        
        var starttime=sanitize(getFormattedDate($('.accSDate.'+classname).val(),'d-m-y','Y-m-d'))+' 00:00:00'; 
        // console.log(starttime)
        var endtime=sanitize(getFormattedDate($('.accEDate.'+classname).val(),'d-m-y','Y-m-d'))+' 23:59:59';
        var all = '1',module = '',subtypes = ''

        if(classname == "st"){
            module = sanitize($('.situation_type').val())
            subArray = []
            $('.sublist_container span.active').each(function(i,obj){
                subtypes += $(obj).attr('value') + ","    
                subArray.push($(obj).html().trim())
            })
            subtypes = subtypes.substr(0,subtypes.length - 1)

            all = '0'
        }
        var selectedtypes = [];
        $('input[name=checkgrp]').each(function(){
            if($(this).prop('checked') == true){
                selectedtypes.push($(this).val());
            }
        })
        if(selectedtypes.length == 0){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select situation types</div>'
            });
            return;
        }

        if($('.accSDate.'+classname).val() == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter start time </div>'
            });
            return;
        }
        if($('.accEDate.'+classname).val() == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter end time</div>'
            });
            return;
        }
        if (starttime > endtime) {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Start date should be less than end date</div>'
            });
            return;
        }
        var chartData = [];
        $.ajax({
            url:'../../../models/situation/get_situation_analysis_data.hh',
            method:'POST',
            data:{
                starttime:starttime,
                endtime:endtime,
                all:all,
                module:module,
                subtype_list:subtypes,
                selectedtypes:selectedtypes
            },
            success:function(res){
                // $('#chart_div').html('');
                // console.log(res)
                // console.log(res[i].data)
                // console.log("res LENGTH= "+ (res).length)
                res = JSON.parse(res); 
                console.log(res)
                console.log("res length= "+ (res).length)
                // if(res.length == 2){
                //     $.alert({
                //         type: 'red',
                //         title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                //         content: '<div class="fw-bold">No Data Available</div>'
                //     });
                //     return;
                // }
                // else{
                    // console.log(res)
                    // res = JSON.parse(res); 
                    // console.log(res)
                    // console.log("res LENGTH= "+ (res).length)             
                    if(res.length==0){
                        $.alert({
                            type: 'red',
                            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                            content: '<div class="fw-bold">No Data Available</div>'
                        });
                        return;
                    }                    
                    else{
                        if(subtypes == ''){
                            // console.log("subtypes empty")
                            var data = new google.visualization.DataTable();
                            data.addColumn('date', 'Date');
                            var headarr = [];
                            $('input[name=checkgrp]').each(function(){
                                if($(this).prop('checked') == true){
                                    headarr.push($(this).val());
                                    data.addColumn('number', toTitleCase($(this).val()));
                                }
                            })
                            
                            for(var i=0;i<Object.keys(res).length;i++){
                                var fin = [];
                                var dfin = [];
                               
                                var x = JSON.parse(res[i].data)
                                //console.log(x)                    
                                gdate = x.AccidentTime;
                                var dateIn = new Date(gdate.split('-')[0]+'/'+gdate.split('-')[1]+'/'+gdate.split('-')[2]);
                                var y = dateIn.getFullYear();
                                var m = ((dateIn.getMonth())>=10)? (dateIn.getMonth()) : '0' + (dateIn.getMonth());
                                var d  = ((dateIn.getDate())>=10)? (dateIn.getDate()) : '0' + (dateIn.getDate());
                                var dateTime = gdate.split(" ");
                                var hour = dateTime[1].split(':')[0];
                                var minutes = dateTime[1].split(':')[1];
                                var seconds = dateTime[1].split(':')[2];
                                fin.push(new Date(y, m, d, hour, minutes,seconds));
                                var finlaopt =0;
                                for(var y=0; y<headarr.length;y++){
                                    if(x[headarr[y]] != undefined){
                                        fin.push(x[headarr[y]])
                                    }else{
                                        fin.push(null);
                                        finlaopt++;
                                    }
                                }
                                chartData.push(fin);
                                
                            }
                            data.addRows(chartData);
                            var materialOptions = {
                                //width: 1000,
                                height: 600,
                                interpolateNulls: true,
                                axes: {
                                    y: [{
                                        stacked: true,
                                        all: {
                                            range: {
                                                min: 0,
                                            }
                                        }
                                    }]
                                },
                                explorer : {
                                    axis: 'horizontal',
                                    actions: ['dragToZoom', 'rightClickToReset']
                                },
                            };
                        
                            var classicOptions = {
                                //width: 1000,
                                height: 800 ,
                                explorer : {
                                    axis: 'horizontal',
                                    actions: ['dragToZoom', 'rightClickToReset']
                                },                    
                            };
                    
                            function drawMaterialChart() {
                                var materialChart = new google.charts.Line(chartDiv);
                                materialChart.draw(data, google.charts.Line.convertOptions(materialOptions));
                                button.innerText = 'Change to Classic';
                                button.onclick = drawClassicChart;
                            }
                    
                            function drawClassicChart() {
                                var classicChart = new google.visualization.LineChart(chartDiv);
                                classicChart.draw(data, google.charts.Line.convertOptions(materialOptions));
                                button.innerText = 'Change to Material';
                                button.onclick = drawMaterialChart;
                            }            
                            drawClassicChart();
                            
                        }
                        else{

                            if(res.length<2){
                                $.alert({
                                    type: 'red',
                                    title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                                    content: '<div class="fw-bold">No Data Available</div>'
                                });
                                return;
                            } 
                            // console.log("subtypes present")
                            var data = new google.visualization.DataTable();
                            data.addColumn('date', 'Date');    
                            // var options = {
                            //     interpolateNulls: true
                            // };                
                            for(var j=0; j<subArray.length;j++){
                                data.addColumn('number', subArray[j]);
                            }
                            for(var i=0;i<Object.keys(res).length;i++){
                                var fin = [];
                                // console.log(res[i].data)
                                var x = JSON.parse(res[i].data)
                                gdate = x.AccidentTime;
                                var dateIn = new Date(gdate.split('-')[0]+'/'+gdate.split('-')[1]+'/'+gdate.split('-')[2]);
                                var y = dateIn.getFullYear();
                                // var m = ((dateIn.getMonth()+1)>=10)? (dateIn.getMonth()+1) : '0' + (dateIn.getMonth()+1);
                                var m = ((dateIn.getMonth())>=10)? (dateIn.getMonth()) : '0' + (dateIn.getMonth());
                                var d  = ((dateIn.getDate())>=10)? (dateIn.getDate()) : '0' + (dateIn.getDate());
                                var dateTime = gdate.split(" ");
                                var hour = dateTime[1].split(':')[0];
                                var minutes = dateTime[1].split(':')[1];
                                var seconds = dateTime[1].split(':')[2];
                                fin.push(new Date(y, m, d, hour, minutes,seconds));
                                for(var j=0; j<subArray.length;j++){                            
                                    if(x[subArray[j]] != undefined){
                                        fin.push(x[subArray[j]]);
                                    }else{
                                        fin.push(null);
                                    }
                                }
                                chartData.push(fin);
                            }
                            if(chartData.length < 2){
                                return;
                            }
                            data.addRows(chartData);
                            var materialOptions = {
                                //width: 1000,
                                height: 800
                            };
                        
                            var classicOptions = {
                                //width: 1000,
                                interpolateNulls: true,
                                height: 800,
                                explorer : {
                                    axis: 'horizontal',
                                    actions: ['dragToZoom', 'rightClickToReset']
                                    
                                },          
                            };
                    
                            function drawMaterialChart() {
                                var materialChart = new google.charts.Line(chartDiv);
                                materialChart.draw(data, google.charts.Line.convertOptions(materialOptions));
                                button.innerText = 'Change to Classic';
                                button.onclick = drawClassicChart;
                            }
                    
                            function drawClassicChart() {
                                var classicChart = new google.visualization.LineChart(chartDiv);
                                classicChart.draw(data, classicOptions);
                                button.innerText = 'Change to Material';
                                button.onclick = drawMaterialChart;
                            }            
                            drawClassicChart();
                            
                        }
                    }
                    
                // }
                
                
            }
        })
        
    };

    $('.submit').click(function(){
        var starttime=sanitize(getFormattedDate($('.accSDate.'+classname).val(),'d-m-y','Y-m-d'))+' 00:00:00';
        var endtime=sanitize(getFormattedDate($('.accEDate.'+classname).val(),'d-m-y','Y-m-d'))+' 23:59:59';

        if($(".sublist_container span").hasClass('active')){}
        else{
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select atleast one subtype!</div>'
            });
            return;
        }
        if(starttime == '' || endtime == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter start time and end time</div>'
            });
            return;
        }

        var all = '1',module = '',subtypes = ''

        if(classname == "st"){
            module = sanitize($('.situation_type').val())
            subArray = []
            $('.sublist_container span.active').each(function(i,obj){
                subtypes += $(obj).attr('value') + ","    
                subArray.push($(obj).html().trim())
            })
            subtypes = subtypes.substr(0,subtypes.length - 1)

            all = '0'
        }
        google.charts.setOnLoadCallback(drawStuff);
        //google.charts.setOnLoadCallback(drawChart);
        //drawChart();
        
        //displayGraph(all,starttime,endtime,module,subtypes)
    })

})


