function getDateRangeOfWeek(weekNo){
    var monthNames = [ "","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    var dates = []
    var d1 = new Date();

    numOfdaysPastSinceLastSunday = eval(d1.getDay());
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastSunday);
    var weekNoToday = d1.getWeek();
    var weeksInTheFuture = eval( weekNo - weekNoToday );
    
    d1.setDate(d1.getDate() + eval( 7 * weeksInTheFuture ));
    var rangeIsFrom = eval(d1.getMonth()+1) +"-" + d1.getDate() + "-" + d1.getFullYear();
    dates.push({
        "day":dayNames[d1.getDay()],
        "date":d1.getDate(),
        "month":monthNames[eval(d1.getMonth()+1)],
        "year":d1.getFullYear()
    })
    
    for(var i=0;i<6;i++){
        d1.setDate(d1.getDate() + 1);
        rangeIsTo = eval(d1.getMonth()+1) +"-" + d1.getDate() + "-" + d1.getFullYear() ;    

        dates.push({
            "day":dayNames[d1.getDay()],
            "date":d1.getDate(),
            "month":monthNames[eval(d1.getMonth()+1)],
            "year":d1.getFullYear()
        })
    }
    
    insertData(dates)
    // return rangeIsFrom + " to "+rangeIsTo;
};

function insertData(data){
    var ele = ''
    for(var i=0;i<data.length;i++){
        ele += '<div class="col-lg-12 item_container"><div class="col-lg-4 left"><span class="day">'+data[i].day+'</span><span class="date">'+data[i].date+'</span><span class="month">'+data[i].month+'</span></div><div class="col-lg-8 right"><span class="time">08:00 AM</span><span class="time">09:00 AM</span><span class="time booked">10:00 AM</span><span class="time">11:00 AM</span><span class="time">12:00 PM</span><span class="time booked">01:00 PM</span></div></div>'
    }
    $('.table_container').append(ele)

    bind_click()
}

function bind_click(){
    $('.time').click(function(){
        if(!$(this).hasClass('booked'))
            $(this).toggleClass('selected')
    })
}
$(document).ready(function(){
    Date.prototype.getWeek = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    weekNo = 1;

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    var today = yyyy+'-'+mm+'-'+dd;

    var myDate = new Date(today);
    weekNo = myDate.getWeek();
    var currentWeek = weekNo
    
    getDateRangeOfWeek(currentWeek)

    $('.reset_btn').click(function(){
        $('.table_container').html('')
        getDateRangeOfWeek(currentWeek)
    })

    $('.next_btn').click(function(){
        $('.table_container').html('')
        weekNo = weekNo + 1
        getDateRangeOfWeek(weekNo)
    })

    $('.previous_btn').click(function(){
        $('.table_container').html('')
        weekNo = weekNo - 1
        getDateRangeOfWeek(weekNo)
    })



	$('#add-form').on("submit",function(formdata){
        formdata.preventDefault();
        var myFormData = new FormData();
        myFormData.append("title","scn")
        for(var i=0;i<$('#images').prop('files').length;i++){
            myFormData.append('imageFiles[]', $('#images').prop('files')[i]);
        }
      
        console.log(myFormData)
        $.ajax({
            url:'../../../background/test.php',
            method:'POST',
            processData: false,
            contentType: false,
            data:myFormData,
            success:function(res){
                
            }
        });
            
	})

    // console.log(getDateRangeOfWeek())
})