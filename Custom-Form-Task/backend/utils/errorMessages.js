const ErrorMessages = {
  CLIENT: {
    NOT_FOUND: "Client configuration not found.",
    NAME_REQUIRED: "Client name is required.",
    INVALID_UUID: "Invalid client configuration code format.",
    CODE_REQUIRED: "Client configuration code is required."
  },
  
  FORM: {
    SUBMISSION_FAILED: "Failed to save form data.",
    RECORD_NOT_FOUND: "Employee record not found.",
    INVALID_UUID: "Invalid employee code format.",
    CODE_REQUIRED: "Employee code is required."
  },
  
  VALIDATION: {
    NAME_EMPTY: "Name is a required field.",
    NAME_TOO_LONG: "Name cannot exceed 50 characters.",
    EMAIL_INVALID: "Please provide a valid email address.",
    EMAIL_REQUIRED: "Email address is a required field.",
    EMAIL_TOO_LONG: "Email address cannot exceed 255 characters.",
    
    CLIENT_NAME_TOO_LONG: "Client name cannot exceed 100 characters.",
    CONFIG_CODE_REQUIRED: "config_code is required in the parameters.",
    CUSTOM_VALUES_INVALID: "custom_values must be a valid data object structure.",

    UUID_INVALID: "Invalid unique identifier code format.",
    MODULE_CODE_REQUIRED: "module_code is required in the parameters.",
    CONFIG_NAME_REQUIRED: "Configuration name is required.",

    SECTION_NAME_REQUIRED: "Section name is required.",
    SECTION_ORDER_INVALID: "Section order must be a valid integer number.",
    AREA_NAME_REQUIRED: "Area name is required.",
    AREA_ORDER_INVALID: "Area order must be a valid integer number.",

    FIELD_ARRAY_BASE: "Fields parameters must be provided inside a structured list array.",
    FIELD_ARRAY_MIN: "You must configure at least one dynamic column field parameter row.",
    
    FIELD_KEY_REQUIRED: "Field key is required.",
    FIELD_KEY_INVALID: "Field key must be lowercase, alphanumeric, and can only contain underscores.",
    FIELD_KEY_TOO_LONG: "Field key cannot exceed 100 characters.",
    
    FIELD_LABEL_REQUIRED: "Field label is required.",
    FIELD_LABEL_TOO_LONG: "Field label cannot exceed 100 characters.",
    
    FIELD_TYPE_REQUIRED: "Field type is required.",
    FIELD_REQUIRED_FLAG_INVALID: "is_required parameter must be a valid boolean.",
    
    FIELD_LENGTH_BASE: "Length constraint must be a valid number.",
    FIELD_LENGTH_INTEGER: "Length constraint must be an integer value.",
    FIELD_ORDER_INVALID: "Field sequence order must be a valid integer number."
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
