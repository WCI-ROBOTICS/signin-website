//Reference for form collection(3)
let formMessage = firebase.database().ref('user_codes');

//listen for submit event//(1)
document
  .getElementById('registrationform')
  .addEventListener('submit', formSubmit);

//Submit form(1.2)
function formSubmit(e) {
  e.preventDefault();
  // Get Values from the DOM
  let sicode = document.querySelector('#code').value;

  //send message values
  sendMessage(sicode);

  //Form Reset After Submission(7)
  document.getElementById('registrationform').reset();
}

//Send Message to Firebase(4)

function sendMessage(code) {
  let uuid = firebase.auth().currentUser.uid;
  let newFormMessage = formMessage.child(uuid);
  newFormMessage.once('value').then(function(val){
  var data = val.val() || [];
  data.push({
   code_submitted: code,
   time: +new Date()})
  newFormMessage.set(data);
  window.top.location.reload();
  });
}
