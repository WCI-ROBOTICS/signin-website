firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    firebase.database().ref("admins").once('value').then(function(val){
        if (!val.val()[user.email.replace('.', '%2E')]){
            window.location.href = "/";
        }else{
        firebase.database().ref("weekly_codes").once('value').then(function(val){
            let currentCode = null
            let allCodes = val.val() || []
            Object.keys(allCodes).forEach(function(key){
                scanCode = allCodes[key]
                timeNow= +new Date()
                if (scanCode["startTime"] <= timeNow &
                    timeNow <= scanCode["endTime"]){
                    currentCode = key; 
                }
            });
            document.getElementById('code').innerText=currentCode
            endTime = allCodes[currentCode]["endTime"] || +new Date;
            var x = setInterval(function(){
                var dist = +endTime - (+new Date);
                var days = Math.floor(dist / (1000 * 60 * 60 * 24));
                var hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((dist % (1000 * 60)) / 1000);
                
                var string = ""
                if (days > 0) string+= days + "d ";
                if (days > 0 || hours > 0) string+= hours + "h ";
                if (days > 0 || hours > 0 || minutes > 0) string+= minutes + "m ";
                document.getElementById("timeRemaining").innerHTML ="Time left: " + 
                                                            string + seconds + "s ";
                
                if (dist < 0) {
                  clearInterval(x);
                  document.getElementById("timeRemaining").innerHTML = null;
                  document.getElementById("code").innerHTML = null;
                }
            }, 1000);
            
        });
       }
   }); 
  } else {
    window.location.href = "/";
  }
});

