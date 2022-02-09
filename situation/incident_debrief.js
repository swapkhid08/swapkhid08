
$(document).ready(function () {
    $("#downloadPdf").click(function () {
        if ($('#startDate').val() == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter from date</div>'
			});
			return;
		}
		if ($('.accEDate').val() == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter to date</div>'
			});
			return;
		}
        // var fromDate = sanitize($('#startDate').val())+' 00:00:00';
        var fromDate=sanitize(getFormattedDate($('#startDate').val(),'d-m-y','Y-m-d'))+ ' 00:00:00';
        // var toDate = sanitize($('#endDate').val())+' 23:59:59';
        var toDate=sanitize(getFormattedDate($('.accEDate').val(),'d-m-y','Y-m-d'))+ ' 23:59:59';
        var accidentScn = sanitize($("#accident_SCN").val());        

        if (fromDate > toDate) {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">From Date should be less than To Date</div>'
            });
            return;
        }
        $.ajax({
            url: '../../../models/utils/get_username.hh',
            type: 'POST',
            success: function (result) {
                
                result = JSON.parse(result);
                var username = result.user.trim();
                $.ajax({
                    url: '../../../models/situation/incident_debrief_download.hh',
                    method: 'POST',
                    data: {
                        fromDate: fromDate, toDate: toDate, accidentScn: accidentScn, username: username
                    },
                    success: function (res) {
                        if(res.length == 2){
                            $.alert({
                                type: 'red',
                                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                                content: '<div class="fw-bold">No Data Available</div>'
                            });
                            return;
                            return;
                        }
                        json_to_csv(res, "Incident Report - Situation", true, fromDate, toDate, 'incident_debrief');
                    }
                })
            }
        })


        /*$.ajax({
            url: '../../../models/utils/get_username.hh',
            success: function(result_username) {
                var username = result_username;
                window.open(`../../../models/situation/incident_debrief_download.hh?
                fromDate=${fromDate}&toDate=${toDate}&accidentScn=${accidentScn}&username=${username}`,'_blank');	
            }
        });*/

    });
})
function json_to_csv (json_data, title, label, fromDate, toDate, filename) {
    //Json  Parser
    // console.log("fromDate = "+fromDate+", toDate = "+toDate)
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
            row += '"' + arr_data[i][index] + '",';
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
    var file_name = filename + fromDate + "_" + toDate;
    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = file_name + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}