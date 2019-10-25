var config = {
    apiKey: "AIzaSyAXBaJBi_qb_pQaOCyjsctmzFn792KiMRM",
    authDomain: "train-scheduler-6669b.firebaseapp.com",
    databaseURL: "https://train-scheduler-6669b.firebaseio.com",
    storageBucket: "train-scheduler-6669b.appspot.com"
};
firebase.initializeApp(config);
var database = firebase.database();

function trainUpdate() {

    event.preventDefault();
    name = $("#trainInput").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#timeInput").val().trim();
    frequency = $("#frequencyInput").val().trim();

    trainData = {
        trainName: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        TimeStamp: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref().push(trainData);
};

database.ref().on("child_added", function (childSnapshot) {
    var name = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTrain = childSnapshot.val().firstTrain;

    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    $("#table-info").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" +
        moment(nextTrain).format("hh:mm a") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});
$(document).on("click", ".btn", trainUpdate);