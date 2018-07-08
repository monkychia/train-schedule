$(document).ready(function() {
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBaz4Ua6DG41Gdp84kTDV8DuhToAF2mOuM",
        authDomain: "trainschedule-937fd.firebaseapp.com",
        databaseURL: "https://trainschedule-937fd.firebaseio.com",
        projectId: "trainschedule-937fd",
        storageBucket: "trainschedule-937fd.appspot.com",
        messagingSenderId: "742017000152"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var name, destination, firstTrainTime, frequency, nextTrain, nextTrainFormatted, firstTimeConverted, diffTime, getKey, minutesAway, currentTime,tRemainder, miniutesToNextTrain, keyHolder;

    $("#submit").on("click", function(event) {
        event.preventDefault();
        name = $(".trainName").val().trim();
        destination = $(".destination").val().trim();
        firstTrainTime = $(".time").val().trim();
        frequency = $(".frequency").val().trim();
        firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        currentTime = moment();
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        tRemainder = diffTime % frequency;
        minutesTillTrain = frequency - tRemainder;
        nextTrain = moment().add(minutesTillTrain, "minutes");
        nextTrainFormatted = moment(nextTrain).format("hh:mm");

        // Code for the push
        database.ref().push({
            name: name,
            destination: destination,
            firstTrainTime: firstTrainTime,  
            frequency: frequency,
            nextTrainFormatted: nextTrainFormatted,
            minutesTillTrain: minutesTillTrain
        });

        $('.trainName').val('');
        $('.destination').val('');
        $('.time').val('');
        $('.frequency').val('');

        return false;
    });

    database.ref().on("child_added", function(childSnapshot) {
        
        const firebaseData = childSnapshot.val();
        minutesTillTrain = frequency - tRemainder;
        $('tbody').append("<tr class='table-row' id=" + "'" + childSnapshot.key + "'" + ">" +
                "<td class='col-xs-3'>" + firebaseData.name +
                "</td>" +
                "<td class='col-xs-2'>" + firebaseData.destination +
                "</td>" +
                "<td class='col-xs-2'>" + firebaseData.frequency +
                "</td>" +
                "<td class='col-xs-2'>" + firebaseData.nextTrainFormatted + 
                "</td>" +
                "<td class='col-xs-2'>" + firebaseData.minutesTillTrain + 
                "</td>" +
                "<td class='col-xs-1'>" + "<input type='submit' value='Remove Train' class='remove-train btn btn-primary btn-sm'>" + "</td>" +
            "</tr>");

            // Handle the errors
        }, function(errorObject){
            console.log("Errors handled: " + errorObject.code)
        }
    );
        
    // Remove Train button logic
    $("body").on("click", ".remove-train", function(){
            getKey = $(this).parent().parent().attr('id');
            database.ref().child(getKey).remove().then((res)=> {
                location.reload();
            });
    });
});
