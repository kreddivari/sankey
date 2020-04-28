//This file exists because downloadAjax - a function that resides in download.js - is called in search.js. This function
//makes the downloads become AJAX requests for logged in users and, therefore, download.js is only inserted into the
//HTML for logged in users. However, this would throw a reference error in search.js - so this file is inserted for non-
//logged in users so there exists a function named downloadAjax. This function does nothing. This is not an ideal
//solution, and might be changed in the future.

var downloadAjax = function(){
    console.warn("downloadAjax called despite user not being logged in, so this function is called. For the actual " +
    "function, look in download.js. This is likely not an actual issue.");
};
