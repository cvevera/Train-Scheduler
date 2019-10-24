var config = {
    apiKey: "AIzaSyAXBaJBi_qb_pQaOCyjsctmzFn792KiMRM",
    authDomain: "train-scheduler-6669b.firebaseapp.com",
    databaseURL: "https://train-scheduler-6669b.firebaseio.com",
    storageBucket: "train-scheduler-6669b.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

function databaseUpdate () {

    event.preventDefault();
    name = $("#trainInput").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#timeInput").val().trim();
    frequency = $("#frequencyInput").val().trim();

    trainFirebaseData = {
        trainName: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        TimeStamp: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref().push(trainFirebaseData);
    

};

database.ref().on("child_added", function (childSnapshot) {
    var name = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTrain = childSnapshot.val().firstTrain;

    console.log(firstTrain)

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    $("#table-info").append("<tr><td>" + name +"</td><td>" + destination + "</td><td>" + frequency + "</td><td>" +
    moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");


});
$(document).on("click", ".btn", databaseUpdate);