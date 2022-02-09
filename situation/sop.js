var sopParameters;
var faultid;
var sop_id;
var CreationDate;
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
faultid = getUrlParameter('faultid');
function getCreationDate(d)
{
	CreationDate = d;
}
function getAlertData()
{
	$.ajax({
		url: '../../../models/home/get_fault_data.hh',
		type: 'POST',
		data: {faultid:faultid},
		success: function(result) {
			res = JSON.parse(result);
			console.log(res,res.FaultID);
			getCreationDate(res.CreationDate);
			$('#faultID').html(res.FaultID);
			$('#faultDescription').html(res.ShortDescription);
			$('#longDescription').html(res.LongDescription);
			$('#location').html(res.Northing+','+res.Easting);

			getSopHistory(res.CreationDate);
		}
	});
}
getAlertData();

function getSopHistory(da)
{
	var close_sop = 0;
	$.ajax({
		url: '../../../models/home/get_sop_history.hh',
		type: 'POST',
		data: {fault_scn:faultid},
		success: function(result) {
			res = JSON.parse(result);
			console.log(res);
			sop_id = res[0].sop_id;
			var temp = '';
			var options = '';
			var sopParameter_index = 0;
			for(var i=0;i<res.length;i++)
			{
				if(res[i].status==1)
				{
					temp += '<tr style="background: #e3e3e3;">';
					if(res[i].sop_parameters_id==0)
						temp += '<th>'+res[i].sop_parameter+'</th>';
					else
						temp += '<th>'+res[i].sop+'</th>';
					temp += '<th>'+res[i].notes+'</th>';
					temp += '<th>'+res[i].completed_time+'</th>';
					temp += '<th>Updated by : '+res[i].user_name+'</th>';
					temp += '</tr>';
				}else if(res[i].status==2)
				{
					temp += '<tr style="background: #cccccc;">';
					if(res[i].sop_parameters_id==0)
						temp += '<th>'+res[i].sop_parameter+'</th>';
					else
						temp += '<th>'+res[i].sop+'</th>';
					temp += '<th>'+res[i].notes+'</th>';
					temp += '<th>'+res[i].completed_time+'</th>';
					temp += '<th>Updated by : '+res[i].user_name+'</th>';
					temp += '</tr>';
				}else if(sopParameter_index==0)
				{
					options += '<option value="'+(i+1)+'">Before Step : ';
					if(res[i].sop_parameters_id==0)
						options += res[i].sop_parameter+'</option>';
					else
						options += res[i].sop+'</option>';
					+(i+1)+'</option>';
					options += '<option value="'+(i+2)+'">After Step : ';
					if(res[i].sop_parameters_id==0)
						options += res[i].sop_parameter+'</option>';
					else
						options += res[i].sop+'</option>';
					close_sop = 1;
					temp += '<tr>';
					if(res[i].sop_parameters_id==0)
						temp += '<th>'+res[i].sop_parameter+'</th>';
					else
						temp += '<th>'+res[i].sop+'</th>';
					temp += '<th colspan="2"><button class="btn btn-primary execute" onclick="execute_container()">Execute</button>&nbsp;&nbsp;';
					temp += '<button class="btn btn-primary skip" onclick="skip_container()">Skip</button>&nbsp;&nbsp;';
					temp += '<br><br><span id="comment_container" class="dis-none">';
					temp += '<input type="text" id="notes" placeholder="Remarks" style="width: 50%">&nbsp;&nbsp;';
					if(i==0)
					{
						temp += '<button class="btn btn-primary" id="submitComment" onclick="submitComment()" sop_parameters_id="'+res[i].sop_parameters_id+'" last_time="'+da+'" sequence="'+res[i].sequence+'">Submit</button>';
					}else
					{
						temp += '<button class="btn btn-primary" id="submitComment" onclick="submitComment()" sop_parameters_id="'+res[i].sop_parameters_id+'" last_time="'+res[i-1].completed_time+'" sequence="'+res[i].sequence+'">Submit</button>';
					}
					temp += '</span>';
					temp += '</th>';
					sopParameter_index++;
				}else{
					options += '<option value="'+(i+2)+'">After Step : ';
					if(res[i].sop_parameters_id==0)
						options += res[i].sop_parameter+'</option>';
					else
						options += res[i].sop+'</option>';
					close_sop = 1;
					temp += '<tr>';
					if(res[i].sop_parameters_id==0)
						temp += '<th>'+res[i].sop_parameter+'</th>';
					else
						temp += '<th>'+res[i].sop+'</th>';
					temp += '<th colspan="2">';
					temp += '<button class="btn btn-primary execute" disabled="">Execute</button>&nbsp;&nbsp;';
					temp += '<button class="btn btn-primary skip" disabled="">Skip</button>&nbsp;&nbsp;';
					temp += '</th>';
				}
			}
			if(close_sop==0)
			{
				temp += '<tr>';
				temp += '<th colspan="3"><button class="btn btn-primary close_btn" onclick="closeAlert()" situvation_SCN="'+res[0].situvation_SCN+'">Close</button></th>';
			}
			$('#sop').html(temp);
			$('#options').html(options);


		}
	});
}


function getDiff(time1,time2)
{
	date1 = new Date( "Jan 1, 2019 "+time2 );
	date2 = new Date( "Jan 1, 2019 "+time1 );
	var res = Math.abs(date1 - date2) / 1000;
	var days = Math.floor(res / 86400);
	var hours = Math.floor(res / 3600) % 24;
	var minutes = Math.floor(res / 60) % 60;
	var seconds = res % 60;
	var time_taken = hours+':'+minutes+':'+seconds;

	// console.log(time_taken);
	return time_taken;
}


function skip_container()
{
	$('#comment_container').show();
	$('#submitComment').attr('onclick','skip()');
	$('#notes').attr('placeholder','Remarks');
}
function execute_container()
{
	$('#comment_container').show();
	$('#submitComment').attr('onclick','execute()');
	$('#notes').attr('placeholder','Remarks (Optional)');
}
function skip()
{
	date = new Date();
	var completed_time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	var last_time = $('#submitComment').attr('last_time');
	var time2 = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	var time1 = last_time.split(' ')[1];
	console.log(time1,time2)
	var time_taken = getDiff(time1,time2);
	var notes = 'Skipped: '+$('#notes').val();
	var sop_parameters_id = $('#submitComment').attr('sop_parameters_id');
	var sequence = $('#submitComment').attr('sequence');
	var user = $('#usernameGet').html();
	if(notes=='')
	{
		alert('Enter Remarks!');
	}else
	{
		$.ajax({
			url: '../../../models/home/add_sop_history.hh',
			type: 'POST',
			data: {user:user,fault_scn:faultid,completed_time:completed_time,time_taken:time_taken,status:2,sop_parameters_id:sop_parameters_id,remarks:notes,sequence:sequence},
			success: function(result) {
				if(result=='F')
					alert('Something went wrong!');
				else
					getSopHistory();
			}
		});
	}
}

function execute()
{
	date = new Date();
	var completed_time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	var last_time = $('#submitComment').attr('last_time');
	var time2 = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	var time1 = last_time.split(' ')[1];
	console.log(time1,time2)
	var time_taken = getDiff(time1,time2);
	var notes = 'Executed: '+$('#notes').val();
	var sop_parameters_id = $('#submitComment').attr('sop_parameters_id');
	var sequence = $('#submitComment').attr('sequence');
	var user = $('#usernameGet').html();
	$.ajax({
		url: '../../../models/home/add_sop_history.hh',
		type: 'POST',
		data: {user:user,fault_scn:faultid,completed_time:completed_time,time_taken:time_taken,status:1,sop_parameters_id:sop_parameters_id,remarks:notes,sequence:sequence},
		success: function(result) {
			if(result=='F')
				alert('Something went wrong!');
			else
				getSopHistory();
		}
	});
}


function closeAlert()
{
	var situvation_SCN = $('.close_btn').attr('situvation_SCN');
	$.ajax({
		url: '../../../models/home/close_sop.hh',
		type: 'POST',
		data: {fault_scn:faultid,situvation_SCN:situvation_SCN,sop_id:sop_id},
		success: function(result) {
			if(result=='F')
				alert('Something went wrong!');
			else
			{
				window.open('', '_self', ''); window.close();
			}
		}
	});
}

function addSopStep()
{
	var seq = $('#options').val();
	var sopStep = $('#sopStep').val();
	if(sopStep=='')
	{
		alert('Enter SOP Step!');
	}else{
		$.ajax({
			url: '../../../models/home/add_sop_step.hh',
			type: 'POST',
			data: {fault_scn:faultid,seq:seq,sopStep:sopStep},
			success: function(result) {
				if(result=='F')
					alert('Something went wrong!');
				else
				{
					getSopHistory();
				}
			}
		});
	}
}
