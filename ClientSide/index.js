
const para = document.getElementById('hello');
  
const baseUrl = 'http://localhost:8383/'

//performs an HTTP request and returns a promise object containing an HTTP response
const responsePromise = fetch(`${baseUrl}api/recruits/`);

function promiseSuccess(response) {
    //set inner text to something in the response object

    //HTTP request/response cycle
    console.log("Success: " + response.status);
    //console.log(response);

    //print data from response object
    jsonPromise = response.json()
    jsonPromise.then(jsonPromiseFunction, jsonPromiseFunctionFailure);

}


function jsonPromiseFunction(data){
    console.log(data);
    //map creates a new array, applies a function to each 'item' in the array. better than for as it auto. creates new array of only name objects
    var namesString = data.message.map(function(item) {
        return item.Name;
    }).join(" ");

    console.log(namesString);
    //set para inner text to the data which has an array
    para.innerHTML = (namesString);

}

function jsonPromiseFunctionFailure(error){
    console.log(error);
}

function promiseFailure(error) {
    console.log("Failure: " + error.status);
    console.log(error);
}   

responsePromise.then(promiseSuccess, promiseFailure);


