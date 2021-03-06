function updateinput () {
    var arr = $("#sortsonglist").sortable("toArray");
    var idstr = "";
    var len = 0;
    for (id  in arr) {
        idstr = idstr + arr[id].replace("song-", "") + ",";
        len = len + parseInt($("#"+arr[id]).attr("songlength"));
    }
    $("#songsinput").val(idstr.slice(0,-1));
    $("#timelength").text(hms(len));
}

var QueryURL = "/demovibes/ajax/songinfo/";

function hms(secs){
    secs = secs % 86400;
    var time = [0,0,secs];
    for(var i=2;i>0;i--){
        time[i-1]=Math.floor(time[i]/60);
        time[i]=time[i]%/**/60;
        if(time[i]<10)
        time[i]='0'+time[i];
    }
    return time.join(':')
}

function addsongs (target, data) {
                target.empty();
                target.hide();
                $.each(data, function (i, sdata) {

                    var li = $("<li class='songli'></li>");
                    var kill = $("<span class='songlirm'>[x]</span>");
                    kill.click(function () {
                        li.slideUp(170, function () {li.remove(); updateinput();});
                    });
                    li.html("<a href='"+sdata.url+"' target='songinfo'>"+sdata.title + "</a> by " + sdata.artists + " ");
                    li.attr("id", "song-"+sdata.id);
                    li.attr("songlength", sdata.slength);
                    li.append(kill);
                    li.appendTo(target);
                    updateinput();
                });
                target.slideDown(100);
}

  $(document).ready(function() {

    $("#sortsongsearchlist").sortable({
        "connectWith": "#sortsonglist",
        "containment": "#dragarea"
    });
    $("#sortsonglist").sortable({
        "containment": "#dragarea",
        "update": function (event, ui) {
            updateinput();
        }
    });
    $("#addsongform").submit( function() {
        var songval = $("#songid").val();
        $.getJSON(QueryURL, {"q": songval}, function(data) {
            if (data.error) {
                $("#errr").text(data.error).stop(true, true).show().fadeOut(3000);
            } else {
                addsongs($("#sortsongsearchlist"), data);
            }
        });
        return false;
    });

    $("#compilationsubmitform").submit( function(i) {
        if (!$("#songsinput").val()) {
            i.preventDefault();
            alert("Quite a short compilation you got there, buddy!\n\n(Hint... Add some songs maybe?)");
        }
    });

    var loadstr = $("#songsinput").val();
    if (loadstr) {
        $.getJSON(QueryURL, {"q": loadstr}, function(data) {
            addsongs($("#sortsonglist"), data);
            updateinput();
        });
    }
  });
