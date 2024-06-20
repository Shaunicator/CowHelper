//Data Requests

class DataRQ{

constructor(url, query, method, contentType  ){
  this.url=url;
  this.query = query;
  this.method = method;
    //when uploading data don't set the Content-Type header
    //The Media type of the body of the request (used with POST and PUT requests).
  this.contentType = {'Content-Type':contentType};


}

setRqOptions(method, mode, creds){

}
getData(request){

  
  fetch(request.url)
  .then(response => response.json())
  .then(data => {
    dataObject = data;
  }).then(()=>{
    //populate object with data
  })
}
}

/* export async function getData(url, query) {

  return fetch(`${url}${query}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Fetch response error");
      }
      return response.json()
    })
} */
    export async function getData(url, query) {
      try {
        const response = await fetch(`${url}${query}`);
        if (!response.ok) {
          throw new Error("Fetch response error");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementsByClassName("infoCard")[0].style.display = "none";
        alert(`Unable to get data - likely cause, data doesn't exist in the dataset yet.\n${error}`);        
        throw error; // Re-throw the error if you want to handle it further up the call stack
      }
    }







/*
//Notes ==================================================
try {
    const result = fetch(url);
       // do something after request succeeds
} catch (exception) {
    // log error
           // notify user something went wrong
catch (exception){
    console.error(exception);
    alert(exception.message);
    document.getElementsByClassName("infoCard")[0].style.display = "none"
async function handleResponse(response) {
    if (response.status === 204) {
      return Promise.resolve({});
    } else if (response.status >= 200 && response.status < 300) {
      const json = await response.json();
      return Promise.resolve(json);
    } else {
      const error = await response.json();
      return Promise.reject(error);
    }
  }
    */