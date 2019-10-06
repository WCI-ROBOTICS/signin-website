// Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                return true;
            },
            uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: '/',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ]
    };

    function toggle(className, displayState) {
        var elements = document.getElementsByClassName(className)
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = displayState;
        }
    }

    var uid = null;
    var tokens = document.getElementsByName("firebase_encoded_id_token");
    var forum_frame = document.getElementById("input_forum");
    let goOut = false

    firebase.auth().onAuthStateChanged(function (user) {
        //if (firebase.auth().currentUser.metadata.creationTime === 
          //  firebase.auth().currentUser.metadata.lastSignInTime){
            if (!user.email.endsWith("@wrdsb.ca" && !goOut)){
                alert("Please sign in with your WRDSB email");
                firebase.auth().signOut();
                goOut = true
            } else {
            goOut = false
            }
        //}
        if (user && !goOut) {
            uid = user.uid;
            toggle('logged_in', 'flex');
            toggle('logged_out', 'flex');
            
            firebase.database().ref("weekly_codes").on('value', function(val){
                let allCodes = val.val() || [];
                firebase.database().ref("user_codes/"+uid).on('value', function(val){
                    let submitted = val.val() || [];
                    let count = 0;
                    var accounted = [];
                    for (var o = 0; submitted.length > o;o++){
                        currentCode = submitted[o]["code_submitted"];
                        currentTime = submitted[o]["time"];
                        if (currentCode in allCodes && 
                            !(currentCode in accounted)){
                            let matchingCode = allCodes[currentCode];
                            if (currentTime >= matchingCode["startTime"] &&
                                currentTime <= matchingCode["endTime"]){
                                accounted.push(currentCode);
                                count++;
                            }
                        }
                    }

                    document.getElementById('r1').innerText = 'Signed in as: ' +
                                 (user.display_name || user.email + "\nAttendance Count: " +
                                 count);
                });
            });
            forum_frame.src = "./frm.html";
            var names = document.getElementsByName('display_name')
            for (var j = 0; j < names.length; j++) {
                console.log(j)

                names[j].value = (user.display_name || user.email);
            }
            user.getIdToken(true).then(function (idToken) {
                for (var j = 0; j < tokens.length; j++) {
                    tokens[j].value = idToken;
                    tokens[j].innerText = idToken
                }
            }).catch(function (error) {
                console.log(error)
            });

            document.getElementById('loader').style.display = 'none';
        } else {
            toggle('logged_in', 'none');
            toggle('logged_out', 'flex');
            for (var j = 0; j < tokens.length; j++) {
                tokens[j].value = "";
            }
            document.getElementById('r1').innerText = 'NOT SIGNED IN';
            forum_frame.src = "";
            forum_frame.style.display = "none";
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    });
    document.getElementById('signOut').addEventListener('click', function (event) {
        firebase.auth().signOut();
    });
    document.getElementById('memberCount').addEventListener('click', function (event) {
        window.location.href = "/members";
    });
    document.getElementById('signOut').style.display = 'none';
