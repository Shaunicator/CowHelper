//custom errors and console loggers
class InformationError extends Error{
    constructor(message) {
        super(message); 
        this.name = "InformationError"
    }
}

class ValidationError extends Error {
    constructor(message) {
      super(message); 
      this.name = "ValidationError"; 
    }
  }