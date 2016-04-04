// import core css
//import './scss/theme.scss'

// import core libraries:
import Vue from 'vue'
import Router from 'vue-router'

// import components:
import App from './components/App.vue'
import DynamicList from './components/DynamicList.vue'
import FluidTextarea from './components/FluidTextarea.vue'
import PollCreator from './components/PollCreator.vue'
import Poll from './components/Poll.vue'
import PollVote from './components/PollVote.vue'
import Alert from './components/Alert.vue'
import PollResults from './components/PollResults.vue'

Vue.use(Router);
//Vue.config.debug = true;

// routing
var router = new Router({
	history: true,
	linkActiveClass: 'active'
});

window.router = router; //TODO: find out if there is a more canonical way to access the router object from a component than to declare it on the window object;

router.map({
	'/': {
		component: PollCreator
	},
	'/:id': {
		component: PollVote,
		name: "vote"
	},
	'/:id/results': {
		component: PollResults,
		name: "results"
	}
});

router.start(App, '#app');