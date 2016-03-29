<template>
	<div class="container">
		<h2 class="poll-question">{{poll.question}}</h2>
	</div>
	<router-view :poll="poll"></router-view>
</template>

<script type="text/ecmascript-6">
	import {fetchPoll} from '../store'

	export default {
		data() {
			return {
				poll: null
			}
		},

		route: {
			data(transition) {
				return fetchPoll( transition.to.params.id )
						.then( poll => {
							return	{
								poll: poll
							}
						})
						.catch( errors => { console.log(errors);
							errors.forEach( function( error ) {
								store.actions.addAlert('danger', error);
							})
						})
			}
		}
	}
</script>