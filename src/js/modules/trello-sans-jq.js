// If localStorage API doesnt exist, default to empty function.
let readStorage = writeStorage = function(){};

// Make slice method available
const slice = [].slice;

const runAjax = function(opts){
  console.log(opts);
  const request = new XMLHttpRequest();
  switch(opts.type){
    case 'GET':
      console.log('GETTING')
      const theParams = Object.keys(opts.data).map((k) => { return encodeURIComponent(k) + '=' + encodeURIComponent(opts.data[k]); }).join('&');
      request.open(opts.type, encodeURI(opts.url + '?' + theParams));
      request.onload = function(){
        if(request.status === 200){
          // console.log('Goal')
          // console.log(request.responseText);
          opts.success(JSON.parse(request.responseText));
        } else{
          opts.error();
        }
      }
      request.send();
      break;
    case 'PUT':
      break;
    case 'POST':
      break;
    case 'DELETE':
      break;
    default:
      break;
  }
};

/**
 * Merges two or more objects
 * @param {boolean} T: Deep Merge F: Shallow Merge (Default: F)
 * @param {Object} Object to extend
 * @param {...Object} Objects to merge into extended Object
 */
const extend = function(){
  // Initialize empty object for results
  const extended = {};
  // Default deep merge to false
  let deep = false;
  // Counter variable
  let i = 0;
  // Number of arguments, used to track number of objects being merged
  const length = arguments.length;

  // Call the Obj method toString on the first argument, check if boolean
  if(Object.prototype.toString.call( arguments[0] ) === '[object Boolean]'){
    // Set the value of deep to the boolean value of the first argument
    deep = arguments[0];
    // Increment counter to skip boolean when merge begins
    i++;
  }

  /**
   * Merge the object into the extended object
   * @param {Object} obj - Object to be merged into extended
   */
  const merge = function(obj){
    // iterate over the properties in the passed in object
    for( let prop in obj ){
      // Call the Obj method hasOwnProperty on obj to check if prop exists
      if(Object.prototype.hasOwnProperty.call( obj, prop )){
        // Check if deep merging and if prop is an object
        if(deep && Object.prototype.toString.call(obj[prop]) === '[object Object]'){
          // Merge the two objects and add to extended
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          // Replace existing property value with new value
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Iterate over each object passed in as arguments
  for( ; i < length; i++){
    // Hold current object
    const obj = arguments[i];
    // Run merge on current object
    merge(obj);
  }

  // Return the final extended object
  return extended;
};

// Create object to hold deferred functions
const deferred = {},
// Create object to hold ready values
      ready = {};

/**
 * waitUntil - Defers execution of fx until name appears in ready object
 *
 * @param  {string}   name Name of the event being waited on
 * @param  {function} fx   Function to run when event is ready
 */
const waitUntil = function(name, fx){
  if(ready[name] != null){
    return fx(ready[name]);
  } else {
    return (deferred[name] != null ? deferred[name] : deferred[name] = []).push(fx);
  }
};


/**
 * isReady - Declares an event as complete and runs any deferred functions
 *
 * @param  {string} name  Name of the event that is ready
 * @param  {*} value value to be passed to any deferred functions
 */
const isReady = function(name, value){
  // Assigns the name and value as KV pair on the ready object
  ready[name] = value;
  // Checks if any functions were deferred for this event
  if(deferred[name]){
    // Holds deferred functions
    const fxs = deferred[name];
    // Deletes the functions held on the deferred object
    delete deferred[name];
    // Iterates over the functions deferred
    for(let i = 0, len = fxs.length; i < len; i++){
      // Holds the current function
      fx = fxs[i];
      // Executes the function with the value for the event
      fx(value);
    }
  }
};

// Shortcut to localStorage api
const localStorage = window.localStorage;
// Checks if localStorage api is supported by browser
if(localStorage != null){
  // Prefix for storing values in localStorage api
  const storagePrefix = 'trello_';

  /**
   * readStorage - Read values saved in localStorage
   *
   * @param  {string} key Key to reference in localStorage
   * @return {string}     Returns value of the Key currently in localStorage
   */
  readStorage = function(key){
    return localStorage[storagePrefix + key];
  };

  /**
   * writeStorage - Writes value to key in localStorage
   *
   * @param  {string} key   Key to reference in localStorage
   * @param  {*}      value Value to write to key
   * @return {type}       Returns the value saved to key
   */
  writeStorage = function(key, value){
    if(value === null){
      // If no value, delete current KV pair
      return delete localStorage[storagePrefix + key];
    } else {
      // Save and return KV pair
      return localStorage[storagePrefix + key] = value;
    }
  }
}

/**
 * isFunction - Returns true if val is a function
 *
 * @param  {*} val Value to check if function
 * @return {boolean}     True if value is a function
 */
const isFunction = function(val){
  return typeof val === 'function';
}

/**
 * Trello - Creates the Trello object
 *
 * @param  {Object} opts KV Pairs of Options for Trello Object
 */
const Trello = function(opts){
  // Store options in an object
  const options = {
    key:            opts.key,
    token:          opts.token,
    apiEndpoint:    opts.apiEndpoint,
    authEndpoint:   opts.authEndpoint,
    intentEndpoint: opts.intentEndpoint,
    version:        opts.version,
    baseURL:        opts.apiEndpoint + '/' + opts.version + '/',
    location:       window.location
  }


  /**
   * version - Returns the Version number
   *
   * @return {number}  Version number of the Trello API being used
   */
  const version = function(){
    return options.version;
  }

  /**
   * key - Returns the Key for the application
   *
   * @return {string}  Identifying key for the application
   */
  const key = function(){
    return options.key;
  }


  /**
   * setKey - Sets the Key for the application
   *
   * @param  {string} newKey New Key for the application
   */
  const setKey = function(newKey){
    options.key = newKey;
  }

  /**
   * token - Returns the authorization token
   *
   * @return {string}  Authorization token
   */
  const token = function(){
    return options.token;
  }

  /**
   * setToken - Sets the authorization token
   *
   * @param  {string} newToken Authorization token to be set
   */
  const setToken = function(newToken){
    options.token = newToken;
  }

  const rest = function(){
    console.log(arguments);
    const method = arguments[0],
          args = 2 <= arguments.length ? slice.call(arguments, 1) : [],
          ref = parseRestArgs(args),
          path = ref[0],
          params = ref[1],
          success = ref[2],
          error = ref[3]
          opts = {
            url: '' + options.baseURL + path,
            type: method,
            data: {},
            dataType: 'json',
            success: success,
            error: error
          };

      if(!XMLHttpRequest.withCredentials){
        opts.dataType = 'jsonp';
        if(method !== "GET"){
          opts.type = "GET";
          extend(opts.data, { _method: method });
        }
      }
      if(options.key){
        opts.data.key = options.key;
      }
      if(options.token){
        opts.data.token = options.token;
      }
      if(params != null){
        extend(opts.data, params);
      }
      console.log(opts);
      return runAjax(opts);
  }

  let makeCall = [];
  let collections = [];

  let ref = ['GET', 'PUT', 'POST', 'DELETE'];
  const fn = function(type){
    return makeCall[type.toLowerCase()] = function(){
      console.log('Make Call')
      console.log(arguments);
      return rest.apply(this, [type].concat(slice.call(arguments)));
    };
  };
  fn("GET");
  let ref1 = ['actions', 'cards', 'checklists', 'boards', 'lists', 'members', 'organizations', 'lists'];
  const fn1 = function(collection){
    return collections[collection] = {
      get: function(id, params, success, error){
        return makeCall.get(id, params, success, error);
      }
    };
  };

  for(j = 0, len1 = ref1.length; j < len1; j++){
    const collection = ref1[j];
    fn1(collection);
  }

  /**
   * authorized - Returns true if Authorization token exists
   *
   * @return {boolean}  True if Authorization Token exists
   */
  const authorized = function(){
    return options.token != null;
  }

  /**
   * deauthorize - Sets the authorization token value to null, deletes token in local storage
   */
  const deauthorize = function(){
    options.token = null;
    writeStorage('token', options.token);
  }

  /**
   * authorize - Communicates with Trello API to authorize application on user's account
   *
   * @param  {Object} userOpts Object of KV Pairs setting options for the application
   */
  const authorize = function(userOpts){
    // Deep merge the standard options with the userOpts
    let opts = extend(true, {
      type: 'redirect',
      persist: true,
      interactive: true,
      scope: {
        read: true,
        write: false,
        account: false
      },
      expiration: '30days'
    }, userOpts);

    // regex matching Token parameter in url
    const regexToken = /[&#]?token=([0-9a-f]{64})/;

    /**
     * persistToken - Keeps the Authorization Token in localStorage
     */
    const persistToken = function(){
      // Checks if options are set to Persist Token and that Authorization Token is present
      if(opts.persist && (options.token != null)){
        // Write token to localStorage
        return writeStorage('token', options.token);
      }
    };

    // Checks if set to persist Authorization Token
    if(opts.persist){
      // Checks if current instance has Authorization Token
      if(options.token == null){
        // If no token exists check if token is saved to localStorage
        options.token = readStorage('token');
      }
    }
    // If no token exists in instance or in localStorage
    if(options.token == null){
      // Check if token was passed as parameter in the url
      options.token = (ref = regexToken.exec(options.location.hash)) != null ? ref[1] : void 0;
    }
    // Check if Authorization Token ultimately exists
    if(this.authorized()){
      // Write the token to localStorage
      persistToken();
      // Remove the token from the url
      options.location.hash = options.location.hash.replace(regexToken, '');
      // If success method exists execute
      return typeof opts.success === 'function' ? opts.success() : void 0;
    }
    // Checks if interactive is set to false
    if(!opts.interactive){
      // If error method exists, execute
      return typeof opts.error === 'function' ? opts.error() : void 0;
    }
    // Creates and holds a comma seperated string of scope values for the application (read, write, etc)
    const scope = ((function(){
      // Holds the current value of scope
      const ref1 = opts.scope;
      // Initiates an empty array to hold the results
      const results = [];
      // Iterates over the scope values
      for (k in ref1){
        // Holds the current value
        v = ref1[k];
        // Checks if value exists
        if(v){
          // Pushes value to results array
          results.push(k);
        }
      }
      // Returns the array
      return results;
      // Joins the array into a string seperated by commas
    })()).join(',');
    // Branches based on the type value
    switch(opts.type){
      // If set to popup
      case 'popup':
        // IIFE to declare a function that will wait until an authorized event emits
        (function(){
          waitUntil('authorized', (function(_this){
            // When authorized event emits return function accepting the value of the authorization event
            return function(isAuthorized){
              // If the authorization event returns true
              if(isAuthorized){
                // Write the authorization token to localStorage
                persistToken();
                // If a success method exists, execute
                return typeof opts.success === 'function' ? opts.success() : void 0;
              } else {
                // If an error method exists, execute
                return typeof opts.error === 'function' ? opts.error() : void 0;
              }
            };
          })(this));
          // Create options necessary for popup window
          const width = 420,
                height = 470,
                left = window.screenX + (window.innerWidth - width) / 2;
                top = window.screenY + (window.innerHeight - height) / 2;
                origin = (ref1 = /^[a-z]+:\/\/[^\/]*/.exec(options.location)) != null ? ref1[0] : void[0];
                authWindow = window.open(authorizeURL({
                  return_url: origin,
                  callback_method: 'postMessage',
                  scope: scope,
                  expiration: opts.expiration,
                  name: opts.name
                }), 'trello', 'width=' + width + 'height=' + height + ',left=' + left + ',top=' + top);

          /**
           * receiveMessage - Creates function to run when window receives the message event from Trello
           *
           * @param  {Object} event Event object passed by Trello message event
           */
          const receiveMessage = function(event){
            // Initialize variable to hold reference url
            var ref2;
            // Checks if the origin of the event matches the authorization endpoint for the application
            if(event.origin !== options.authEndpoint || event.source !== authWindow){
              // If it doesnt then return
              return;
            }
            // Sets ref2 to the source of the event and checks that its not equal to null
            if((ref2 = event.source) != null){
              // If not then close the popup window
              ref2.close();
            }
            // Checks that the event data is present and that a token exists in the data
            if((event.data != null) && /[0-9a-f]{64}/.test(event.data)){
              // Saves the token to the instance
              options.token = event.data;
            } else{
              // Deletes the token from the instance
              options.token = null;
            }
            // Checks if removeEventListener is supported by the browser
            if(typeof window.removeEventListener === 'function'){
              // Removes the event listener for receiveMessage
              window.removeEventListener('message', receiveMessage, false);
            }
            // Emits the event that the application has been authorized and passes the result of the authorized function as value
            isReady('authorized', authorized());
          };
          // Checks if the browser supports addEventListener, if so adds the message eventListener to the window
          return typeof window.addEventListener === 'function' ? window.addEventListener('message', receiveMessage, false) : void 0;
        })();
        // Ends the branch
        break;
      // Default branch if no other check matched
      default:
        // Redirects the current window to the authroization url
        window.location = authorizeURL({
          redirect_uri: options.location.href,
          callback_method: 'fragment',
          scope: scope,
          expiration: opts.expiration,
          name: opts.name
        });
    }
  }

  /**
   * authorizeURL - Creates the appropriate url to redirect and authorize
   *
   * @param  {Object} args Options for the url
   * @return {string}      Returns the url for authorization
   */
  const authorizeURL = function(args){
    // Sets the default options
    const baseArgs = {
      response_type: 'token',
      key: options.key
    };
    // Merges the default options with the options passed in
    const params = extend(baseArgs, args);
    // Forms the url and returns
    return options.authEndpoint + '/' + options.version + '/authorize?' + Object.keys(params).map((k) => { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
  }

  // Reveals the necessary functions
  return{
    version,
    key,
    setKey,
    authorized,
    deauthorize,
    authorize,
    makeCall,
    collections
  }
}

const parseRestArgs = function(arg){
  console.log(arg);
  let path = arg[0],
        params = arg[1],
        success = arg[2],
        error = arg[3];
  if(isFunction(params)){
    error = success;
    success = params;
    params = {};
  }
  path = path.replace(/^\/*/, '');
  return [path, params, success, error];
}

module.exports = {
  Trello
}
