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
          throw new  FetchError(`Request failed with status ${response.status}`);
        }

        let data;
        try{
          data = await response.json();
        }
        catch (jsonError){
          if (jsonError instanceof SyntaxError) {
            return jsonError;
          } else {
            throw Error("Other JSON error", jsonError);
          }
        }
        return data;
        
      } catch (error) {
        if (error instanceof FetchError){
          console.error(`Network Error: ${error.message}`)
        } else {
        console.error('Other Error:', error);
      }
      
    }
  }

  export class FetchError extends Error {
    constructor(message) {
      super(message);
      this.name = "FetchError";
    }
  }