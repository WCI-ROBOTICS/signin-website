firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    firebase.database().ref("admins").once('value').then(function(val){
    if (!val.val()[user.email.replace('.', '%2E')]){
        window.location.href = "/";
    }else{
    //Reference for form collection(3)
    let codesMess = firebase.database().ref('weekly_codes');
    let usersMess = firebase.database().ref('user_codes');
    let emId = firebase.database().ref("users");
    
    emId.on("value", function(users) {
        var emails = document.getElementById("emails");
        var length = emails.options.length;
        for (i = 0; i < length; i++) {
          emails.options[i] = null;
        }
        emailsList = users.val() || {};
        Object.keys(emailsList).forEach(function(key) {
            var opt = document.createElement("option");
            opt.value= key.replace("%2E",".");
            emails.appendChild(opt);
        });
    });
    
    codesMess.on("value", function(codes) {
        var cods = document.getElementById("codes");
        var length = cods.options.length;
        for (i = 0; i < length; i++) {
          cods.options[i] = null;
        }
        codeList = codes.val() || {};
        Object.keys(codeList).forEach(function(key) {
            var opt = document.createElement("option");
            opt.value= key;
            cods.appendChild(opt);
        });
    });

    //listen for submit event//(1)
    document
      .getElementById('newcodeform')
      .addEventListener('submit', formSubmit);

    //Submit form(1.2)
    function formSubmit(e) {
      e.preventDefault();
      // Get Values from the DOM
      let sicode = document.querySelector('#code').value;
      let email = document.querySelector('#email').value;
      emId.once("value").then(function(userRecord) {
        let eList = userRecord.val() || {};
        if (!(email.replace(".","%2E") in eList)) {alert("thats probably not a valid email");}
        else{
        let uid = eList[email.replace(".","%2E")];
        sendMessage(uid, sicode, e);
        } 
      });
      
    }

    //Send Message to Firebase(4)

    function sendMessage(uid, code,e) {
      let codeMess = codesMess.child(code);
      codeMess.once('value').then(function(val){
          codes = val.val() || []
          if(codes["startTime"]!= undefined){
              let userMess = usersMess.child(uid);
              userMess.once('value').then(function(val){
              var data = val.val() || [];
              data.push({
               code_submitted: code,
               time: codes["startTime"]+1})
              userMess.set(data);
              document.getElementById("grantcode").reset();
              });
          } 
          else{
            alert("This code is not valid");
          }
       });
    }
    
    
    }});
  } else {
    window.location.href = "/";
  }
});

