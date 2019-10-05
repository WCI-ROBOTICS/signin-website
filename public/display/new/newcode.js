document.getElementById('startdate').value = new Date().toISOString().slice(0, 11)+"14:25"
document.getElementById("enddate").value = new Date().toISOString().slice(0, 11)+"15:00"

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    firebase.database().ref("admins").once('value').then(function(val){
    if (val.val()[user.email.replace('.', '%2E')]){
        window.location.href = "/";
    }else{
    //Reference for form collection(3)
    let formMessage = firebase.database().ref('weekly_codes');

    //listen for submit event//(1)
    document
      .getElementById('newcodeform')
      .addEventListener('submit', formSubmit);

    //Submit form(1.2)
    function formSubmit(e) {
      e.preventDefault();
      // Get Values from the DOM
      let sicode = document.querySelector('#code').value;
      let startdate = document.querySelector('#startdate').value;
      let enddate = document.querySelector('#enddate').value;
      
      //send message values
      sendMessage(sicode, startdate, enddate);
    }

    //Send Message to Firebase(4)

    function sendMessage(code, startdate, enddate) {
      newFormMessage = formMessage.child(code);
      var data = {
       startTime: +new Date(startdate),
       endTime: +new Date(enddate)}
      formMessage.once('value').then(function(val){
          codes = val.val() || []
          if(codes[code]!= undefined){
            alert("This code is already in use");
          } 
          else{
            newFormMessage.set(data);
            window.location.href = "/display";
          }
       });
    }
    
    
    }});
  } else {
    window.location.href = "/";
  }
});

