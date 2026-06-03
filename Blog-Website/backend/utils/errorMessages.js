const ErrorMessages = {
  AUTH: {
    NO_TOKEN: "Access denied. No token provided.",
    INVALID_FORMAT: "Invalid token format. Must be a Bearer token.",
    INVALID_TOKEN: "Your session is invalid or expired. Please log in again.",
    ADMIN_REQUIRED: "Access denied. Administrator clearance is required.",
    ALREADY_ADMIN: "You are already an administrator.",
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_ALREADY_EXISTS: "User already exists",
    UNAUTHORIZED_NOTIF_CONTEXT: "Unauthorized access. User contextual identifier is missing.",
    ROLE_VIOLATION: "Security Policy Restriction: Standard accounts cannot elevate clearance metrics.",
    OTHER_PROFILE_VIOLATION: "Access Denied. You do not have permissions to modify this profile."
  },
  
  VALIDATION: {
    NAME_EMPTY: "Name is required.",
    EMAIL_INVALID: "Please provide a valid email address.",
    EMAIL_EXISTS: "Email address is already registered.",
    PASSWORD_SHORT: "Password must be at least 8 characters long.",
    PASSWORD_REQUIRED: "Current password is required to verify identity before saving a new password.",
    PASSWORD_INCORRECT: "Incorrect current password.",
    SEARCH_EMPTY: "Search parameter 'q' cannot be empty.",
    INVALID_ROLE: "Invalid role assignment type value.",
    
    CATEGORY_INPUT_REQUIRED: "Please provide category name(s)",
    INTEREST_SELECTION_REQUIRED: "Please select at least one interest",
    COMMENT_CONTENT_REQUIRED: "Comment content is required.",
    REPLY_CONTENT_REQUIRED: "Reply content is required.",
    REACTION_TYPE_REQUIRED: "reaction_type is required.",
    FEEDBACK_REQUIRED: "Feedback content is required when sending a blog back for recheck.",
    WRITE_FIELDS_REQUIRED: "Title, content, and category name are required.",

    EMAIL_REQUIRED: "Email address is required to process request.",
    ASSWORD_REQUIRED: "A new password is required.",
    CONFIRM_PASSWORD_REQUIRED: "Please confirm your new password.",
    PASSWORD_MISMATCH: "Password confirmation does not match.",
    TOKEN_REQUIRED: "Password reset token parameter is missing."
  },
  
  RESOURCE: {
    USER_NOT_FOUND: "User not found",
    PROFILE_NOT_FOUND: "User profile not found.",
    TARGET_PROFILE_NOT_FOUND: "Target profile not found.",
    BLOG_NOT_FOUND: "Blog post not found",
    BLOG_NOT_FOUND_DOT: "Blog post not found.",
    BLOG_RECORD_NOT_FOUND: "Blog post record could not be found.",
    TARGET_BLOG_NOT_FOUND: "Target blog post could not be found.",
    COMMENT_NOT_FOUND: "Comment not found.",
    TARGET_COMMENT_NOT_FOUND: "Target comment not found.",
    CATEGORIES_NOT_EXIST: "None of the provided categories exist",
    NO_FEEDBACK_FOUND: "No admin feedback has been submitted for this blog post yet.",
    USER_EMAIL_NOT_FOUND: "No account matching that email address could be located."
  },
  
  STATE: {
    NOT_PENDING_RECHECK: "Cannot recheck a blog that is currently in ",
    NOT_PENDING_APPROVE: "Cannot approve a blog that is currently in ",
    BLOG_NOT_PUBLISHED: "You can only react to published blog posts.",
    FOLLOW_SELF_VIOLATION: "You cannot follow yourself",
    ALREADY_FOLLOWING: "You are already following this user",
    INVALID_REACTION_TYPE: "Invalid reaction type. Allowed reactions are: ",
    TOKEN_INVALID_EXPIRED: "The password reset token is invalid or has expired.",
    
    CANNOT_EDIT_STATUS: "Action denied. You can only edit drafts, pending, or recheck posts. Current status is ",
    CANNOT_SUBMIT_STATUS: "Cannot submit. Only 'draft' posts can be sent for approval. Current status is ",
    CANNOT_PUBLISH_STATUS: "Cannot submit. Only approved posts can be published. Current status is "
  },
  
  SERVER: {
    INTERNAL: "An unexpected error occurred on our server. Please try again later.",
    DEV_DB_FAIL: "Database connection failed or timed out.",
    
    GENERIC_INTERNAL: "Internal server error",
    AUTH_REGISTRATION: "Server error during registration",
    AUTH_LOGIN: "Server error during login",
    CATEGORY_CREATE: "Error creating category",
    CATEGORY_FETCH: "Error fetching categories",
    COMMENT_SERVER_ERR: "Server error",
    FOLLOW_PROCESS: "Error processing follow request",
    FOLLOW_FEED_FETCH: "Error fetching featured feed",
    INTEREST_SAVE: "Error saving interests",
    INTEREST_FEED_FETCH: "Error fetching feed",
    USER_PROFILE_PROCESSING: "Server error while processing your request.",
    USER_PROFILE_ADJUSTMENT: "Internal server error processing profile adjustment execution loop.",
    SEARCH_FILTER_ERR: "Server error during filtering.",
    LOGOUT_SERVER_ERR: "Server error during logout",
    PARTICULAR_BLOG_FETCH: "Error retrieving the blog post"
  }
};

module.exports = ErrorMessages;
