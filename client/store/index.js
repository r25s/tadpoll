import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import middlewares from './middlewares'

Vue.use(Vuex);

export const STORAGE_KEY = 'tadpoll';

var storedState = JSON.parse(localStorage.getItem(STORAGE_KEY));

const state = storedState ? {
		question: storedState.question,
		options: storedState.options,
		settings: storedState.settings,
		alerts: []
	} :	{
		question: '',
		options: [],
		settings: {
			multiSelect: 'single',
			multiVote: 'normal'
		},
		alerts: []
	}

export var store = new Vuex.Store({
	state,
	actions,
	mutations,
	middlewares
});

export function saveToDatabase() {
	return new Promise(function(resolve, reject) {
		const request = new XMLHttpRequest();

		request.addEventListener("load", function() {
			if(this.status === 201) {
				resolve(JSON.parse(this.responseText));
			} else {
				var error = JSON.parse(this.responseText);
				store.actions.addAlert('danger', error.error);
				//reject();
			}

		});

		request.open('POST', '/new');
		request.setRequestHeader("Content-type", "application/json");
		request.send(JSON.stringify({
			question: store.state.question,
			options: store.state.options,
			settings: store.state.settings
		}));
	})
}

export function fetchPoll( id ) {
	return new Promise(function(resolve, reject) {
		const request = new XMLHttpRequest();

		request.addEventListener("load", function() {
			if(this.status === 200) {
				resolve(JSON.parse(this.responseText));
			} else {
				var error = JSON.parse(this.responseText);
				store.actions.addAlert('danger', error.error);
			}
		});

		request.open('GET', '/poll/' + id);
		request.send();
	});
}

export function fetchInitData( id ) {
	return new Promise(function(resolve, reject) {
		const request = new XMLHttpRequest();

		request.addEventListener("load", function() {
			if(this.status === 200) {
				resolve(JSON.parse(this.responseText));
			} else {
				var error = JSON.parse(this.responseText);
				store.actions.addAlert('danger', error.error);
			}
		});

		request.open('GET', '/poll/' + id + '/initData');
		request.send();
	});
}

export function saveVote( id, picked ) {
	return new Promise(function(resolve, reject) {
		const request = new XMLHttpRequest();

		request.addEventListener("load", function() {
			if(this.status === 200) {
				resolve();
			} else {
				var error = JSON.parse(this.responseText);
				store.actions.addAlert('danger', error.error);
				reject();
			}
		});


		request.open('PUT', '/poll/' + id);
		request.setRequestHeader("Content-type", "application/json");
		request.send(JSON.stringify({picked}));
	})
}