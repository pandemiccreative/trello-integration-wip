require('normalize-css');
require('../less/styles.less');
// const trello = require('./modules/trello');
const Trello = require('./modules/trello-sans-jq').Trello;

const opts = {
    "version": 1,
    "apiEndpoint": "https://api.trello.com",
    "authEndpoint": "https://trello.com",
    "intentEndpoint": "https://trello.com",
    "key": "c0c7e7483944cf85c83607cfb59e5b1e"
};

const tr = new Trello(opts);
console.log(tr.collections);

document.querySelector('.trello--deAuth').addEventListener('click', tr.deauthorize);

document.querySelector('.trello--auth').addEventListener('click', function(){
  tr.authorize({
    type: 'popup',
    name: 'CW Trello',
    scope: {
      read: true,
      write: true
    },
    expiration: 'never',
    success: loadBoards,
    error: function(){
      console.log('Auth failed.')
    }
  })
})

// window.jQuery = window.$ = require('jquery');
//
// const opts = {
//         "version": 1,
//         "apiEndpoint": "https://api.trello.com",
//         "authEndpoint": "https://trello.com",
//         "intentEndpoint": "https://trello.com",
//         "key": "c0c7e7483944cf85c83607cfb59e5b1e"
//     };
//
// trello.wrapper(window, jQuery, opts);
//
// console.log(Trello);
//
const loadedBoards = function(boards){
  const listSelect = document.querySelector('.trello--boardsSelect');
  boards.forEach(b => {
    if(!b.closed){
      const listOpt = document.createElement('option');
      listOpt.setAttribute('value', b.name);
      listOpt.innerHTML = b.name;
      listSelect.appendChild(listOpt);
    }
  });
}

const loadBoards = function(){
  // Get the user's boards
  tr.collections.boards.get(
    '/members/me/boards',
    loadedBoards,
    function(){ console.log('You dun fucked up.') }
  )
}
//
// Trello.authorize({
//   type: 'popup',
//   name: 'CW Trello',
//   scope: {
//     read: true,
//     write: false
//   },
//   expiration: 'never',
//   success: loadBoards,
//   error: function(){ console.log('Failed authentication'); }
// });
