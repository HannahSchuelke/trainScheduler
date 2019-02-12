// Initialize Firebase
var config = {
    apiKey: "AIzaSyCQXD-qPceFTSHljF40nP0LvbBmk60nx_Y",
    authDomain: "trainscheduler-337b8.firebaseapp.com",
    databaseURL: "https://trainscheduler-337b8.firebaseio.com",
    projectId: "trainscheduler-337b8",
    storageBucket: "",
    messagingSenderId: "400258383096"
  };
  firebase.initializeApp(config);
// creating a reference to our database
  const trainDB = firebase.database();
// creating a click event on the add train button so we can grab the values of the input fields and send them to the database
  $(document).on("click", "#train-submit", function(){
    const trainName = $("#train-name").val().trim();
    const trainDestinaton = $("#train-destination").val().trim();
    const trainFirstTime = $("#train-first-time").val().trim();
    const trainFrequency = $("#train-frequency").val().trim();
// creating the new train object that will be sent to the database 
    const newTrainObj = {
        trainName,
        trainDestinaton,
        trainFirstTime,
        trainFrequency
    };

    console.log(newTrainObj);
// storing the new train object in the database
    trainDB.ref().push(newTrainObj);
// this is where we empty out our input fields at the end of out on click function
    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-first-time").val("");
    $("#train-frequency").val("");
    
  });
// this is where we are creating a firebase event that will be run on page load for every item in the database and anytime something new is added to the database for that specific item
  trainDB.ref().on("child_added", function(childSnapshot, prevChildKey){
      console.log(childSnapshot.val());
// This is where we're creating variables from the database
      let trainName = childSnapshot.val().trainName;
      let trainDestinaton = childSnapshot.val().trainDestinaton;
      let trainFirstTime = childSnapshot.val().trainFirstTime;
      let trainFrequency = childSnapshot.val().trainFrequency;

//   momentjs time conversions:
    let timeArray = trainFirstTime.split(":");
    let timeArrayConverted = moment().hours(timeArray[0]).minutes(timeArray[1]);

    let maxMoment = moment.max(moment(), timeArrayConverted);
    let trainMin;
    let trainArrival;
// if the first train is later than right now, we will set the next arrival to the first train time
    if(maxMoment == timeArrayConverted){
        trainArrival = timeArrayConverted.format("hh:mm A");
        trainMin = timeArrayConverted.diff(moment(), "minutes");
    }else {
// computing minutes until the next arrival
        let timeDifference = moment().diff(timeArrayConverted, "minutes");
        let remainder = timeDifference % trainFrequency;

        trainMin = trainFrequency - remainder;
        trainArrival = moment().add(trainMin, "m").format("hh:mm A");
    }

    console.log("train name: " + trainName);
    console.log("train destination: " + trainDestinaton);
    console.log("First Train: " + trainFirstTime);
    console.log("train frequency: " + trainFrequency);
    console.log("next Arrival: " + trainArrival);
    console.log("Minutes away: " + trainMin);            

// appending the converted data to the table
    $("#train-table > tbody").append(`<tr><td>${trainName}</td><td>${trainDestinaton}</td><td>${trainFrequency}</td><td>${trainArrival}</td><td>${trainMin}</td></tr>`);
  })

  