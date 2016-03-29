<template>
	<div class="container">
		<h2 class="poll-question">{{question}}</h2>
		<p v-if="settings.multiSelect === 'single'" class="sub-heading">Select <strong>one</strong> option below:</p>
		<p v-if="settings.multiSelect === 'multi'" class="sub-heading">Select <strong>one or more</strong> options below:</p>
		<div class="options-list">
			<label v-for="option in options" class="option-label" for="option{{$index}}" checked="false">
				<input type="{{inputType}}" id="option{{$index}}" v-model="picked" name="vote" value="{{$index}}" v-on:change="toggleChecked">
				{{option.title}}
			</label>
		</div>

		<button
			type="button"
			class="btn btn-primary btn-jumbo"
			id="voteBtn"
			:disabled="voteBtnDisabled"
			v-on:click="handleVoteClick"
		>
			Vote
		</button>

		<p id="view-results"><a v-link="{ name: 'results', params: { id: $route.params.id }}">View results</a></p>
	</div>
</template>

<script type="text/ecmascript-6">
import {store, fetchPoll, saveVote} from '../store'

export default {
	data() {
		return {
			question: '',
			options: {},
			settings: {},
			picked: [],
			selectedRadio: null,
			voteBtnDisabled: false
		}
	},

	computed: {
		inputType() {
			return ( this.settings.multiSelect === "single" ? "radio" : "checkbox" );
		}
	},

	methods: {
		toggleChecked( event ) {
			var inputElement = event.target;
			var parentLabel = inputElement.parentElement;
			parentLabel.setAttribute( "checked", inputElement.checked );

			if( this.inputType === "radio" ) {
				if ( this.selectedRadio ) {
					this.selectedRadio.parentElement.setAttribute( "checked", "false" )
				}
				this.selectedRadio = inputElement;
			}
		},
		vote() {
			saveVote( this.$route.params.id, this.picked )
				.then( () => {
					console.log("vote saved");
					router.go({ name: 'results', params: { id: this.$route.params.id }});
				})
				.catch( () => {
					this.voteBtnDisabled = false;
				})
		},
		handleVoteClick() {
			this.voteBtnDisabled = true;
			this.vote();
		}
	},

	route: {
		data(transition) {
			return fetchPoll( transition.to.params.id )
				.then( poll => {
					return	{
						question: poll.question,
						options: poll.options,
						settings: poll.settings
					}
				})
		}
	}
}
</script>