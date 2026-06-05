const ErrorMessages = {
  CLIENT: {
    NOT_FOUND: "Client configuration not found.",
    NAME_REQUIRED: "Client name is required.",
    INVALID_UUID: "Invalid client code format.",
    CODE_REQUIRED: "Client code is required."
  },
  
  FORM: {
    SUBMISSION_FAILED: "Failed to save form data.",
    RECORD_NOT_FOUND: "Employee record not found.",
    INVALID_UUID: "Invalid employee code format.",
    CODE_REQUIRED: "Employee code is required."
  },
  
  VALIDATION: {
    FIRST_NAME_EMPTY: "First name is required.",
    MIDDLE_NAME_EMPTY: "Middle name is required.",
    LAST_NAME_EMPTY: "Last name is required.",
    EMAIL_INVALID: "Invalid email address.",
    EMAIL_REQUIRED: "Email address is required.",
    PHONE_EMPTY: "Phone number is required.",
    GENDER_REQUIRED: "Gender selection is required.",
    GENDER_INVALID: "Gender must be Male, Female, or Other.",
    
    SHOW_EMPLOYEE_ID_INVALID: "show_EmployeeID must be boolean.",
    SHOW_MIDDLE_NAME_INVALID: "show_Middlename must be boolean.",

    CLIENT_NAME_TOO_LONG: "Client name cannot exceed 100 characters.",
    NAME_TOO_LONG: "Name fields cannot exceed 50 characters.",
    EMAIL_TOO_LONG: "Email address cannot exceed 255 characters.",
    PHONE_TOO_LONG: "Phone number cannot exceed 20 characters."
  },
  
  SERVER: {
    INTERNAL: "Internal server error.",
    DB_FAIL: "Database connection failed.",
    CLIENT_SPECS_CREATE: "Failed to create client setup.",
    LAYOUT_FETCH: "Failed to load form layout.",
    EMPLOYEE_CREATE: "Failed to create employee.",
    EMPLOYEE_FETCH: "Failed to fetch employee details."
  }
};

module.exports = ErrorMessages;
