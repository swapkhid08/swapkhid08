$(document).ready(function () {
    // $.ajax({
    //     url: '../../../models/detector/detector_devices.hh',
    //     type: 'POST',
    //     success: function (res) {
    //         var detectors = jQuery.parseJSON(res);
    //         // console.log(detectors);
    //         var template = '';
    //         for (var i = 0; i < detectors.length; i++) {
    //             template += '<option value="' + detectors[i].SystemCodeNumber + '" name="' + detectors[i].ShortDescription + '">' + detectors[i].Place + " - " + detectors[i].ShortDescription + '</option>';
    //         }
    //         $('#scn').html(template);
    //     }
    // });

    $.ajax({
        url: '../../../models/detector/get_detector_prediction_filter.hh',
        type: 'POST',
        success: function (res) {
            var reslt = jQuery.parseJSON(res);
            var detectors = reslt.detectors;
            var algorithms = reslt.algorithms;
            // console.log(detectors);
            var template = '';
            for (var i = 0; i < detectors.length; i++) {
                template += '<option value="' + detectors[i].SystemCodeNumber + '" name="' + detectors[i].ShortDescription + '">' + detectors[i].Place + " - " + detectors[i].ShortDescription + '</option>';
            }
            $('#scn').html(template);

            var algorithmType = '<option value="">Select Algorithm type</option>';
            for (var i = 0; i < algorithms.length; i++) {
                algorithmType += '<option value="' + algorithms[i].TypeID + '">' + algorithms[i].TypeDescription.trim() + '</option>';
            }
            $('#algorithmType').html(algorithmType);
            $('#comparealgorithmType').html(algorithmType);
        }
    });

    $('#getProfile').click(function () {
        var template = "<img src='../../images/loading.gif'>"
        $("#graph").html(template);
        var column = $('#column').val();
        var scn = $('#scn').val();
        var algorithmType = $('#algorithmType').val();
        var startTime = $('#startTime').val();
        var endTime = $('#endTime').val();
        var dayType = $('#dayType').val();
        var name = $('#scn option:selected').attr('name')

        var type = $('input[name=graph]:checked').val()
        if(column == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select day parameter</div>'
            });
            $("#graph").html('');
            return;
        }
        if(algorithmType == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select algorithm type</div>'
            });
            $("#graph").html('');
            return;
        }
        if(dayType == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select day type</div>'
            });
            $("#graph").html('');
            return;
        }
        $.ajax({
            url: '../../../models/detector/get_detector_prediction.hh',
            data: { column: column, scn: scn, startTime: startTime, endTime: endTime, dayType: dayType, algorithmType: algorithmType },
            type: 'POST',
            success: function (result) {
                var res = JSON.parse(result);
                //console.log(res.data, res.peakintervals)
                //console.log(JSON.parse(res.data))

                var profiledata = res.data
                var peakdata = JSON.parse(res.peakintervals)
                var today = new Date();
                if(profiledata.length == undefined || profiledata.length < 1){
                    $('#graph').html('');
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">No Data Available</div>'
                    });
                    return;
                }
                var data = "[";
                for (var i = 0; i < profiledata.length; i++) {

                    if (i == 0) {
                        data += '{"time":"' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + profiledata[i].times + '","Prediction":"' + profiledata[i].Prediction + '"}';
                    } else {
                        data += ',{"time":"' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + profiledata[i].times + '","Prediction":"' + profiledata[i].Prediction + '"}';
                    }

                }
                data += "]";
                if (type == "line") {
                    $('#graph').html('')
                    $('#labels').css('display', 'none')
                    var csvdata = JSON2CSV(data);
                    // console.log(data);
                    createLineGraph(csvdata, name, column)
                }else{
                    $('#labels').css('display', 'block')
                    $('#graph').html('<svg width="660" height="700" class="my_bar"></svg>')
                    data = JSON.parse(data)
                    createBarGraph(data)
                }
               

                $('#peak_container').html('')

                if (Object.keys(peakdata).length == 0) return

                peakdata = peakdata[Object.keys(peakdata)[0]]
                peakdata = peakdata.substring(1, peakdata.length - 1).split(',')

                var ele = "<h3>Peak Time Intervals</h3><table class='table table-bordered'>"
                var ctr = 0
                for (var i = 0; i < peakdata.length; i++) {
                    if (ctr == 0) ele += '<tr>'

                    var temp = peakdata[i].trim()

                    ele += '<td>' + temp.substring(1, temp.length - 1) + '</td>'

                    if (ctr == 7 || ctr == peakdata.length - 1) {
                        ele += '</tr>'
                        ctr = 0
                    }
                    else {
                        ctr = ctr + 1
                    }
                }

                ele += "</table>"

                $('#peak_container').html(ele)
            }
        });
    });

    $('#compare').click(function () {
        var template = "<img src='../../images/loading.gif'>"
        $("#graph").html(template);
        var column = $('#column').val();
        var scn = $('#scn').val();
        var algorithmType = $('#algorithmType').val();
        var dayType = $('#dayType').val();        
        var name = $('#scn option:selected').attr('name');
        var comparedayType = $('#comparedayType').val();
        var dayTypename = $('#dayType option:selected').text();
        var comparedayTypename = $('#comparedayType option:selected' ).text();
        var comparealgorithmType = $('#comparealgorithmType').val();
        var algorithmTypeName = $('#algorithmType option:selected' ).text();
        var comparealgorithmTypeName = $('#comparealgorithmType option:selected' ).text();
        var type = $('input[name=graph]:checked').val();
        if(column == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select day parameter</div>'
            });
            $("#graph").html('');
            return;
        }
        if(algorithmType == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select algorithm type</div>'
            });
            $("#graph").html('');
            return;
        }

        if(dayType == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select day type</div>'
            });
            $("#graph").html('');
            return;
        }

        if(comparealgorithmType == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select new algorithm type</div>'
            });
            $("#graph").html('');
            return;
        }

        if(comparedayType == ''){
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select new day type</div>'
            });
            $("#graph").html('');
            return;
        }
        if(dayType == comparedayType && algorithmType == comparealgorithmType){
            $("#graph").html('');
            return;
        }
        $.ajax({
            url: '../../../models/detector/get_detector_prediction_compare.hh',
            data: { column: column, scn: scn, dayType: dayType, algorithmType: algorithmType,comparedayType:comparedayType,comparealgorithmType:comparealgorithmType },
            type: 'POST',
            success: function (result) {
                var res = JSON.parse(result);

                var PredictionId1 = scn.trim()+'_0'+dayType;
                var PredictionId2 = scn.trim()+'_0'+comparedayType;
                //console.log(res.data, res.peakintervals)
                //console.log(JSON.parse(res.data))

                var profiledata = res.data
                //console.log(profiledata)
                var peakdata = JSON.parse(res.peakintervals)
                var today = new Date();
                if(profiledata.length == undefined || profiledata.length < 1){
                    $('#graph').html('');
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">No Data Available</div>'
                    });
                    return;
                }
                var data = "[";
                var bardata = "[";
                for (var i = 0; i < profiledata.length; i++) {
                    console.log(profiledata[i])
                    //console.log(profiledata[i].PredictionId)
                    if (i == 0) {
                        data += '{"time":"' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + profiledata[i].times + '"';
                        bardata += '{"time":"' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + profiledata[i].times + '"';
                        if(PredictionId1 != PredictionId2 && algorithmType != comparealgorithmType){
                            
                            if(PredictionId1 == profiledata[i].PredictionId){
                                data += ',"'+dayTypename+' - '+algorithmTypeName+'":"' + profiledata[i].Prediction + '","'+comparedayTypename+' - '+comparealgorithmTypeName+'":""';
                                bardata += ',"'+dayTypename+' - '+algorithmTypeName+'":"' + profiledata[i].Prediction + '","'+comparedayTypename+' - '+comparealgorithmTypeName+'":"0"';
                            }else{
                                data += ',"'+dayTypename+' - '+algorithmTypeName+'":"","'+comparedayTypename+' - '+comparealgorithmTypeName+'":"' + profiledata[i].Prediction + '"';
                                bardata += ',"'+dayTypename+' - '+algorithmTypeName+'":"0","'+comparedayTypename+' - '+comparealgorithmTypeName+'":"' + profiledata[i].Prediction + '"';
                            }
                        }else{
                            if(PredictionId1 != PredictionId2){                            
                                if(PredictionId1 == profiledata[i].PredictionId){
                                    data += ',"'+dayTypename+'":"' + profiledata[i].Prediction + '","'+comparedayTypename+'":""';
                                    bardata += ',"'+dayTypename+'":"' + profiledata[i].Prediction + '","'+comparedayTypename+'":"0"';
                                }else{
                                    data += ',"'+dayTypename+'":"","'+comparedayTypename+'":"' + profiledata[i].Prediction + '"';
                                    bardata += ',"'+dayTypename+'":"0","'+comparedayTypename+'":"' + profiledata[i].Prediction + '"';
                                }
                            }
                            if(algorithmType != comparealgorithmType && algorithmType != '' && comparealgorithmType != ''){
                                if(algorithmType == profiledata[i].AlgorithmType){
                                    data += ',"'+algorithmTypeName+'":"' + profiledata[i].Prediction + '","'+comparealgorithmTypeName+'":""';
                                    bardata += ',"'+algorithmTypeName+'":"' + profiledata[i].Prediction + '","'+comparealgorithmTypeName+'":"0"';                                                                
                                }else if(comparealgorithmType == profiledata[i].AlgorithmType){
                                    data += ',"'+algorithmTypeName+'":"","'+comparealgorithmTypeName+'":"' + profiledata[i].Prediction + '"';
                                    bardata += ',"'+algorithmTypeName+'":"0","'+comparealgorithmTypeName+'":"' + profiledata[i].Prediction + '"';
                                }
                            }
                        }
                        
                        data += '}';
                        bardata += '}';
                    }else{
                        data += ',';
                        bardata += ',';
                        data += '{"time":"' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + profiledata[i].times + '"';
                        bardata += '{"time":"' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + profiledata[i].times + '"';
                        if(PredictionId1 != PredictionId2 && algorithmType != comparealgorithmType){
                            if(PredictionId1 == profiledata[i].PredictionId){                            
                                data += ',"'+dayTypename+' - '+algorithmTypeName+'":"' + profiledata[i].Prediction + '","'+comparedayTypename+' - '+comparealgorithmTypeName+'":""';
                                bardata += ',"'+dayTypename+' - '+algorithmTypeName+'":"' + profiledata[i].Prediction + '","'+comparedayTypename+' - '+comparealgorithmTypeName+'":"0"';
                            }else{
                                data += ',"'+dayTypename+' - '+algorithmTypeName+'":"","'+comparedayTypename+' - '+comparealgorithmTypeName+'":"' + profiledata[i].Prediction + '"';
                                bardata += ',"'+dayTypename+' - '+algorithmTypeName+'":"0","'+comparedayTypename+' - '+comparealgorithmTypeName+'":"' + profiledata[i].Prediction + '"';
                            }
                        }else{
                            if(PredictionId1 != PredictionId2){
                                if(PredictionId1 == profiledata[i].PredictionId){
                                    data += ',"'+dayTypename+'":"' + profiledata[i].Prediction + '","'+comparedayTypename+'":""';
                                    bardata += ',"'+dayTypename+'":"' + profiledata[i].Prediction + '","'+comparedayTypename+'":"0"';
                                }else{
                                    data += ',"'+dayTypename+'":"","'+comparedayTypename+'":"' + profiledata[i].Prediction + '"';
                                    bardata += ',"'+dayTypename+'":"0","'+comparedayTypename+'":"' + profiledata[i].Prediction + '"';
                                }
                            }
                            if(algorithmType != comparealgorithmType && algorithmType != '' && comparealgorithmType != ''){
                                if(algorithmType != '' && algorithmType == profiledata[i].AlgorithmType){
                                    data += ',"'+algorithmTypeName+'":"' + profiledata[i].Prediction + '","'+comparealgorithmTypeName+'":""';
                                    bardata += ',"'+algorithmTypeName+'":"' + profiledata[i].Prediction + '","'+comparealgorithmTypeName+'":"0"';                                                                        
                                }else if(comparealgorithmType == profiledata[i].AlgorithmType){
                                    data += ',"'+algorithmTypeName+'":"","'+comparealgorithmTypeName+'":"' + profiledata[i].Prediction + '"';
                                    bardata += ',"'+algorithmTypeName+'":"0","'+comparealgorithmTypeName+'":"' + profiledata[i].Prediction + '"';                                    
                                }
                            }
                        }
                        
                        data += '}';
                        bardata += '}';
                    }
                }
                data += "]";
                bardata += "]";
                $('#graph').html('')
                if (type == "line") {
                    $('#labels').css('display', 'none')
                    var csvdata = JSON2CSV(data);
                    console.log(data);
                    ComparecreateLineGraph(csvdata, name, column);
                }
                else {
                    $('#labels').css('display', 'block')
                    $('#graph').html('<svg width="660" height="700" class="my_bar"></svg>')
                    data = JSON.parse(bardata)
                    ComparecreateBarGraph(data)
                }

                $('#peak_container').html('')

                if (Object.keys(peakdata).length == 0) return

                peakdata = peakdata[Object.keys(peakdata)[0]]
                peakdata = peakdata.substring(1, peakdata.length - 1).split(',')

                var ele = "<h3>Peak Time Intervals</h3><table class='table table-bordered'>"
                var ctr = 0
                for (var i = 0; i < peakdata.length; i++) {
                    if (ctr == 0) ele += '<tr>'

                    var temp = peakdata[i].trim()

                    ele += '<td>' + temp.substring(1, temp.length - 1) + '</td>'

                    if (ctr == 7 || ctr == peakdata.length - 1) {
                        ele += '</tr>'
                        ctr = 0
                    }
                    else {
                        ctr = ctr + 1
                    }
                }

                ele += "</table>"

                $('#peak_container').html(ele)
            }
        });
    });

    $('#showfilter').click(function(){
        $('.compbtntd').attr('colspan','2');
        $('#showfilter').hide();
        $('#profilesub').hide();
        $('#hidefilter').show();
        $('.comparefilter').show();
        $('#comparebtn').show();
    })

    $('#hidefilter').click(function(){
        $('.compbtntd').attr('colspan','6');
        $('#showfilter').show();
        $('#profilesub').show();
        $('#hidefilter').hide();
        $('.comparefilter').hide();
        $('#comparebtn').hide();
    })
});
function ComparecreateLineGraph (data, name, column) {
    var dayTypename = $('#dayType option:selected').text();
    var comparedayTypename = $('#comparedayType option:selected' ).text();
    g2 = new Dygraph(
        document.getElementById("graph"),
        data, // path to CSV file
        {
            title: name,
            ylabel: column + ' (No. of vehicles)',
            xlabel: 'Time (HH:MM)',
            legend: 'always',
            showRangeSelector: true,
            connectSeparatedPoints: true,
            colors: ['#253654', 'red', 'green', 'yellow'],
            strokeWidth: 1
        }
    );
}


function ComparecreateBarGraph (cdata) {
    // sizing information, including margins so there is space for labels, etc    

    var margin = { top: 20, right: 20, bottom: 100, left: 40 },
        width = 1260 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        marginOverview = { top: 530, right: margin.right, bottom: 20, left: margin.left },
        heightOverview = 600 - marginOverview.top - marginOverview.bottom;

    // set up a date parsing function for future use
    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

    // some colours to use for the bars
    var colour = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "red", "#253654", "green", "#ff8c00"]);

    // mathematical scales for the x and y axes
    var x = d3.time.scale()
        .range([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);
    var xOverview = d3.time.scale()
        .range([0, width]);
    var yOverview = d3.scale.linear()
        .range([heightOverview, 0]);

    // rendering for the x and y axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    var xAxisOverview = d3.svg.axis()
        .scale(xOverview)
        .orient("bottom");

    // something for us to render the chart into
    var svg = d3.select(".my_bar") // the overall space
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    var main = svg.append("g")
        .attr("class", "main")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var overview = svg.append("g")
        .attr("class", "overview")
        .attr("transform", "translate(" + marginOverview.left + "," + marginOverview.top + ")");

    // brush tool to let us zoom and pan using the overview chart
    var brush = d3.svg.brush()
        .x(xOverview)
        .on("brush", brushed);

    // setup complete, let's get some data!

    // cdata = cdata.split('\n')
    data = []
    for (var i = 0; i < Object.keys(cdata).length; i++) {
        data.push(parsed(cdata[i]))
    }
    // data = parsed(cdata)
    //console.log(data)
    // d3.csv(cdata, parse, function(data) {

    // data ranges for the x and y axes
    x.domain(d3.extent(data, function (d) { return d.time; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]);
    xOverview.domain(x.domain());
    yOverview.domain(y.domain());

    // data range for the bar colours
    // (essentially maps attribute names to colour values)
    colour.domain(d3.keys(data[0]));

    // draw the axes now that they are fully set up
    main.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    main.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Flow");

    overview.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightOverview + ")")
        .call(xAxisOverview);

    // draw the bars
    main.append("g")
        .attr("class", "bars")
        // a group for each stack of bars, positioned in the correct x position
        .selectAll(".bar.stack")
        .data(data)
        .enter().append("g")
        .attr("class", "bar stack")
        .attr("transform", function (d) { return "translate(" + x(d.time) + ",0)"; })
        // a bar for each value in the stack, positioned in the correct y positions
        .selectAll("rect")
        .data(function (d) { return d.counts; })
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", 7)
        .attr("y", function (d) { return y(d.y1); })
        .attr("height", function (d) { return y(d.y0) - y(d.y1); })
        .style("fill", function (d) { return colour(d.name); });

    overview.append("g")
        .attr("class", "bars")
        .selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xOverview(d.time) - 3; })
        .attr("width", 7)
        .attr("y", function (d) { return yOverview(d.total); })
        .attr("height", function (d) { return heightOverview - yOverview(d.total); });

    // add the brush target area on the overview chart
    overview.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        // -6 is magic number to offset positions for styling/interaction to feel right
        .attr("y", -6)
        // need to manually set the height because the brush has
        // no y scale, i.e. we should see the extent being marked
        // over the full height of the overview chart
        .attr("height", heightOverview + 7);  // +7 is magic number for styling

    // });


    // by habit, cleaning/parsing the data and return a new object to ensure/clarify data object structure
    function parsed (d) {
        // console.log(d)
        var value = { time: parseDate(d.time) }; // turn the date string into a date object

        // adding calculated data to each count in preparation for stacking
        var y0 = 0; // keeps track of where the "previous" value "ended"
        var dayTypename = $('#dayType option:selected').text();
        var comparedayTypename = $('#comparedayType option:selected' ).text();
        var algorithmType = $('#algorithmType').val();
        var comparealgorithmType = $('#comparealgorithmType').val();
        var algorithmTypeName = $('#algorithmType option:selected' ).text();
        var comparealgorithmTypeName = $('#comparealgorithmType option:selected' ).text();
        var profilearr = [];
        if(dayTypename != comparedayTypename && algorithmType != comparealgorithmType && algorithmType != '' && comparealgorithmType != ''){
            var grp1 = dayTypename+' - '+algorithmTypeName;
            var grp2 = comparedayTypename+' - '+comparealgorithmTypeName;
            profilearr.push(grp1);
            profilearr.push(grp2);
        }else{
            if(dayTypename != comparedayTypename){
                profilearr.push(dayTypename);
                profilearr.push(comparedayTypename);
            }
            if(algorithmType != comparealgorithmType){
                if(algorithmType != '' && comparealgorithmType != ''){
                    profilearr.push(algorithmTypeName);
                    profilearr.push(comparealgorithmTypeName);
                }
            }
        }
        value.counts = profilearr.map(function (name) {
            return {
                name: name,
                y0: 0,
                // add this count on to the previous "end" to create a range, and update the "previous end" for the next iteration
                y1: parseFloat(d[name]), //y0 += +d[name],
                y2: y0 += +d[name]
            };
        });
        // quick way to get the total from the previous calculations
        value.total = value.counts[value.counts.length - 1].y2;
        return value;
    }

    // zooming/panning behaviour for overview chart
    function brushed () {
        // update the main chart's x axis data range
        x.domain(brush.empty() ? xOverview.domain() : brush.extent());
        // redraw the bars on the main chart
        main.selectAll(".bar.stack")
            .attr("transform", function (d) { return "translate(" + x(d.time) + ",0)"; })
        // redraw the x axis of the main chart
        main.select(".x.axis").call(xAxis);
    }


}


function createLineGraph (data, name, column) {
    g2 = new Dygraph(
        document.getElementById("graph"),
        data, // path to CSV file
        {
            title: name,
            ylabel: column + ' (No. of vehicles)',
            xlabel: 'Time (HH:MM)',
            legend: 'always',
            showRangeSelector: true,
            connectSeparatedPoints: true,
            colors: ['#253654', 'red', 'green'],
            strokeWidth: 1,
            'Prediction': {
                strokeWidth: 2
            }
        }
    );
}
function createBarGraph (cdata) {
    // sizing information, including margins so there is space for labels, etc    

    var margin = { top: 20, right: 20, bottom: 100, left: 40 },
        width = 1260 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        marginOverview = { top: 530, right: margin.right, bottom: 20, left: margin.left },
        heightOverview = 600 - marginOverview.top - marginOverview.bottom;

    // set up a date parsing function for future use
    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

    // some colours to use for the bars
    var colour = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "red", "#253654", "green", "#ff8c00"]);

    // mathematical scales for the x and y axes
    var x = d3.time.scale()
        .range([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);
    var xOverview = d3.time.scale()
        .range([0, width]);
    var yOverview = d3.scale.linear()
        .range([heightOverview, 0]);

    // rendering for the x and y axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    var xAxisOverview = d3.svg.axis()
        .scale(xOverview)
        .orient("bottom");

    // something for us to render the chart into
    var svg = d3.select(".my_bar") // the overall space
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    var main = svg.append("g")
        .attr("class", "main")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var overview = svg.append("g")
        .attr("class", "overview")
        .attr("transform", "translate(" + marginOverview.left + "," + marginOverview.top + ")");

    // brush tool to let us zoom and pan using the overview chart
    var brush = d3.svg.brush()
        .x(xOverview)
        .on("brush", brushed);

    // setup complete, let's get some data!

    // cdata = cdata.split('\n')
    data = []
    for (var i = 0; i < Object.keys(cdata).length; i++) {
        data.push(parsed(cdata[i]))
    }
    // data = parsed(cdata)
    //console.log(data)
    // d3.csv(cdata, parse, function(data) {

    // data ranges for the x and y axes
    x.domain(d3.extent(data, function (d) { return d.time; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]);
    xOverview.domain(x.domain());
    yOverview.domain(y.domain());

    // data range for the bar colours
    // (essentially maps attribute names to colour values)
    colour.domain(d3.keys(data[0]));

    // draw the axes now that they are fully set up
    main.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    main.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Flow");

    overview.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightOverview + ")")
        .call(xAxisOverview);

    // draw the bars
    main.append("g")
        .attr("class", "bars")
        // a group for each stack of bars, positioned in the correct x position
        .selectAll(".bar.stack")
        .data(data)
        .enter().append("g")
        .attr("class", "bar stack")
        .attr("transform", function (d) { return "translate(" + x(d.time) + ",0)"; })
        // a bar for each value in the stack, positioned in the correct y positions
        .selectAll("rect")
        .data(function (d) { return d.counts; })
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", 7)
        .attr("y", function (d) { return y(d.y1); })
        .attr("height", function (d) { return y(d.y0) - y(d.y1); })
        .style("fill", function (d) { return colour(d.name); });

    overview.append("g")
        .attr("class", "bars")
        .selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xOverview(d.time) - 3; })
        .attr("width", 7)
        .attr("y", function (d) { return yOverview(d.total); })
        .attr("height", function (d) { return heightOverview - yOverview(d.total); });

    // add the brush target area on the overview chart
    overview.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        // -6 is magic number to offset positions for styling/interaction to feel right
        .attr("y", -6)
        // need to manually set the height because the brush has
        // no y scale, i.e. we should see the extent being marked
        // over the full height of the overview chart
        .attr("height", heightOverview + 7);  // +7 is magic number for styling

    // });


    // by habit, cleaning/parsing the data and return a new object to ensure/clarify data object structure
    function parsed (d) {
        // console.log(d)
        var value = { time: parseDate(d.time) }; // turn the date string into a date object

        // adding calculated data to each count in preparation for stacking
        var y0 = 0; // keeps track of where the "previous" value "ended"
        value.counts = ["Prediction"].map(function (name) {
            return {
                name: name,
                y0: 0,
                // add this count on to the previous "end" to create a range, and update the "previous end" for the next iteration
                y1: parseFloat(d[name]), //y0 += +d[name],
                y2: y0 += +d[name]
            };
        });
        // quick way to get the total from the previous calculations
        value.total = value.counts[value.counts.length - 1].y2;
        return value;
    }

    // zooming/panning behaviour for overview chart
    function brushed () {
        // update the main chart's x axis data range
        x.domain(brush.empty() ? xOverview.domain() : brush.extent());
        // redraw the bars on the main chart
        main.selectAll(".bar.stack")
            .attr("transform", function (d) { return "translate(" + x(d.time) + ",0)"; })
        // redraw the x axis of the main chart
        main.select(".x.axis").call(xAxis);
    }


}



function JSON2CSV (objArray) {
    var array = JSON.parse(objArray);
    var str = '';
    var line = '';

    var head = array[0];
    for (var index in array[0]) {
        line += index + ',';
    }

    line = line.slice(0, -1);
    str += line + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';

        for (var index in array[i]) {
            line += array[i][index] + ',';
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
    /*var file_name = "met_graph_data";  
    var uri = 'data:text/csv;charset=utf-8,' + escape(str);
    var link = document.createElement("a");    
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = file_name + ".csv";    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);*/
}


