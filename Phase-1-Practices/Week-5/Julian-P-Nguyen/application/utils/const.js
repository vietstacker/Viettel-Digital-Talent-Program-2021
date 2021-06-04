/**
 * Collection of Error Message in Response 
 */
const errorDescription = {};

errorDescription.notAuthenticated = "Not Authenticated!"
errorDescription.undefinedRoute = "This route is not valid! Please return to valid routes"

errorDescription.permissionDenied = "Permission Denied!"
errorDescription.missingCredentials = "Missing credentials !";
errorDescription.wrongCredentials = "Wrong Credentials";

errorDescription.notFound = "Object Not Found!";

errorDescription.unableCreate = "Unable to Create";
errorDescription.unableDelete = "Unable to Delete";
errorDescription.unableUpdate = "Unable to Update";

/**
 * Description for Errors
 */
const errorMessage = {};

errorMessage.notAuthenticated = "Please authenticate yourself to continue!";
errorMessage.undefinedRoute = "Undefined Route!";

errorMessage.permissionDenied = "You don't have Permission to access! Please stay back!";
errorMessage.missingCredentials = "Please provide your username/password";
errorMessage.wrongCredentials = "Please re-enter your credentials";

errorMessage.notFound = "This Object doesn't exist or errors occur during search";

errorMessage.unableCreate = "Unable to create this time. Please try again!";
errorMessage.unableDelete = "Unable to delete this time. Please try again!";
errorMessage.unableUpdate = "Unable to update this time. Please try again!";



/**
 *  Collection of Success Messages
 */
const successMessage = {};

//User constants
successMessage.completeAuthentication = "Successfully Authenticated!";
successMessage.userSignedUpSuccess = "Successfully Signed Up!";
successMessage.userDeleted = "User has been deleted!";
successMessage.userUpdated = "User has been updated!";
successMessage.userFound = "Found User!";


//Board constants
successMessage.boardListFound = "Successfully found your Board list";
successMessage.boardFound = "Found your Board!";
successMessage.boardCreated = "New Board has been created!";
successMessage.boardUpdated = "Existing Board has been updated!";
successMessage.boardDeleted = "Your Board has been deleted!";

//Task constants
successMessage.taskListFound = "Successfully found your Task list";
successMessage.taskFound = "Found your Task!";
successMessage.taskCreated = "New task has been created!";
successMessage.taskUpdated = "Existing Task has been updated!";
successMessage.taskDeleted = "Your Task has been deleted!";


module.exports = {
    errorMessage,
    errorDescription,
    successMessage,
}