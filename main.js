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

  const trainDB = firebase.database();

  $(document).on("click", "#train-submit", function(){
    const trainName = $("#train-name").val().trim();
    const trainDestinaton = $("#train-destination").val().trim();
    const trainFirstTime = $("#train-first-time").val().trim();
    const trainFrequency = $("#train-frequency").val().trim();
    
    const newTrainObj = {
        trainName,
        trainDestinaton,
        trainFirstTime,
        trainFrequency
    };

    console.log(newTrainObj);

    trainDB.ref().push(newTrainObj);

    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-first-time").val("");
    $("#train-frequency").val("");
    
  });

  trainDB.ref().on("child_added", function(childSnapshot, prevChildKey){
      console.log(childSnapshot.val());

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

    if(maxMoment == timeArrayConverted){
        trainArrival = timeArrayConverted.format("hh:mm A");
        trainMin = timeArrayConverted.diff(moment(), "minutes");
    }else {
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


    $("#train-table > tbody").append(`<tr><td>${trainName}</td><td>${trainDestinaton}</td><td>${trainFrequency}</td><td>${trainArrival}</td><td>${trainMin}</td></tr>`);
  })

  