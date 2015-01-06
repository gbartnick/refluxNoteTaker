/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	(function(global) {
	    var MyUtils = function () {
	        return{
	            get: function (endpoint) {
	                return new Promise(function(resolve, reject) {
	                    // Do the usual XHR stuff
	                    var req = new XMLHttpRequest();
	                    req.open('GET', endpoint);

	                    req.onload = function() {
	                        // This is called even on 404 etc
	                        // so check the status
	                        if (req.status == 200) {
	                            // Resolve the promise with the response text
	                            resolve(req.response);
	                        }
	                        else {
	                            // Otherwise reject with the status text
	                            // which will hopefully be a meaningful error
	                            reject(Error(req.statusText));
	                        }
	                    };

	                    // Handle network errors
	                    req.onerror = function() {
	                        reject(Error("Network Error"));
	                    };

	                    // Make the request
	                    req.send();
	                });
	            }
	        };
	    }
	    global.MyUtils = MyUtils();
	})(window);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	(function(Reflux, global) {
	    'use strict';

	    global.NotesActions = Reflux.createActions([
	        "addNote",
	        "editNote",
	        "deleteNote",
	        "toggleFavoriteNote"
	    ]);

	    global.UsersActions = Reflux.createActions([
	        "addUser",
	        "editUser",
	        "setCurrentUser"
	    ]);

	})(window.Reflux, window);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	(function(Reflux, NotesActions, UserActions, MyUtils, global) {
	    'use strict';

	    var noteCount = 0,
	        userCount = 0,
	        localNotesStorageKey = "notes",
	        localUsersStorageKey = "users";

	function getItemByKey(list, key){
	    var item = undefined;
	    list.forEach(function(itm){
	        if(itm.key === key){
	            item = itm;
	        }
	    });

	    return item;
	}

	global.NotesStore = Reflux.createStore({
	    listenables: [NotesActions],

	    onEditNote: function(itemKey, newContent){
	        var itm = getItemByKey(this.list, itemKey);
	        if(!itm){
	            return;
	        }
	        itm.text = newContent;
	        this.updateList(this.list);
	    },
	    onAddNote: function(newContent){
	        console.log(global.UsersStore.getCurrentUser());
	        var currentUser = global.UsersStore.getCurrentUser()[0].name;
	        noteCount++;
	        var currentDate = new Date().toLocaleDateString();

	        this.updateList([{
	            key: noteCount,
	            submittedDate: currentDate,
	            submittedBy:currentUser,
	            text: newContent
	        }].concat(this.list));

	    },

	    onDeleteNote: function(key){
	        var newList = this.list.filter(function(itm){
	            return itm.key !== key;
	        });
	        this.updateList(newList);
	    },

	    updateList: function(list){
	        localStorage.setItem(localNotesStorageKey, JSON.stringify(list));
	        this.list = list;
	        this.trigger(list);
	    },

	    getInitialState: function(){
	        //get stuff from server
	        var loadedList = localStorage.getItem(localNotesStorageKey);
	        if(!loadedList){
	            this.list = [];
	            MyUtils.get('/api/note/list').then(function(resp){
	                var notes = JSON.parse(resp);
	                noteCount = notes.length;
	                global.NotesStore.updateList(notes);
	            }, function(error){
	                console.error("Failure", error);
	            })
	        }
	        else{
	            this.list = JSON.parse(loadedList);
	            noteCount = this.list.length;
	        }
	        return this.list;
	    }
	});

	global.UsersStore = Reflux.createStore({
	    listenables: [UsersActions],

	    onEditUser: function(itemKey, userName){
	        var itm = getItemByKey(this.list, itemKey);
	        if(!itm){
	            return;
	        }
	        itm.text = newContent;
	        this.updateList(this.list);
	    },

	    onAddUser: function(newUser){

	        userCount++;

	        this.updateList([{
	            key: userCount,
	            name: newUser,
	            selected:false
	        }].concat(this.list));
	    },
	    updateList: function(list){
	        localStorage.setItem(localUsersStorageKey, JSON.stringify(list));
	        this.list = list;
	        this.trigger(list);
	    },
	    getCurrentUser:function(){
	        return this.list.filter(function(usr){
	            return usr.selected === true;
	        });
	    },
	    onSetCurrentUser:function(key){
	        this.list.forEach(function(usr){
	            if(usr.key == key){
	                usr.selected = true;
	            }
	            else{
	                usr.selected = false;
	            }
	        });
	    },
	    getInitialState: function(){
	        //get stuff from server
	        var loadedList = localStorage.getItem(localUsersStorageKey);
	        if(!loadedList){
	            this.list = [];

	            MyUtils.get('/api/user/list').then(function(resp){
	                var users = JSON.parse(resp);
	                userCount = users.length;
	                global.UsersStore.updateList(users);

	            }, function(error){
	                console.error("Failure", error);
	            })
	        }
	        else{
	            this.list = JSON.parse(loadedList);
	            userCount = this.list.length;
	        }

	        return this.list;
	    }

	});

	})(window.Reflux, window.NotesActions, window.UsersActions, window.MyUtils, window);



/***/ }
/******/ ])