// Our labels along the x-axis
firebase.database().ref("weekly_codes").on("value", function(frame){
    var codes = updateX(frame.val());

// For drawing the lines
firebase.database().ref("user_codes").on("value", function(pals){
    var members = updateY(pals.val(), frame.val());

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: codes,
    datasets: [
      { 
  data: members,
  label: "Members",
  borderColor: "#3e95cd",
  fill: false
}]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    },
    legend: {
        display: false
    }
}
});
//myChart.update();
});
});

function updateX(vals){
    let o=[];
    let data = vals || {}
    data = sortVal(data, "startTime");
    Object.keys(data).forEach(function(key){
        o.push(new Date(data[key]["startTime"]).toISOString());
    });
    return o;
}

function updateY(vals, krys){
    let data = vals || {};
    let o = []
    let pints = krys || {};
    pints = sortVal(pints, "startTime");
    Object.keys(pints).forEach(function(key){
        let count = 0
        Object.keys(data).forEach(function(uid){
            for (var i=0; i < data[uid].length; i++){
                let matchingCode = pints[key];
                let currentTime = data[uid][i]["time"];
                if (currentTime >= matchingCode["startTime"] &&
                    currentTime <= matchingCode["endTime"]){
                    count++;
                    break;
                }
            }
        });
        o.push(count);
        count = 0;
    });
    return o;
}

function sortVal(dict,srtVl){
    var sorted = [];
    for(var key in dict) {
        sorted[sorted.length] = [key, dict[key][srtVl]];
    }
    sorted.sort(function(a,b){
        return a[1] - b[1];
    });

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i][0]] = dict[sorted[i][0]];
    }

    return tempDict;
}
//var x = setInterval(function(){
  //  members[1] = members[1]+1
    //myChart.update();
//    if (members[1] >= 100) {
  //      clearInterval(x);
    //}
//}, 1000);
