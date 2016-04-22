<template>
	<div class="container" v-show="!pollCreated">
		<fluid-textarea
				id="question"
				placeholder="Enter poll question here."
				:value="question"
				v-on:new-value="editQuestion">
		</fluid-textarea>
		<dynamic-list
				poll-option-input-id="poll-option-input"
				placeholder="Enter poll option here, then press Enter."
				:items="items"
				v-on:add="addOption"
				v-on:remove="removeItem"
				v-on:edit="editItem"
		>
		</dynamic-list>
	</div>
	<div class="container" v-show="!pollCreated">
		<h2 class="section-heading">Settings</h2>
		<div class="row">
			<div class="col-md-6">
				<h3>Single-select or Multi-select</h3>
				<input type="radio"
					   value="single"
					   id="single"
					   v-model="multiSelect"
					   v-on:change="MultiSelectChange"
				/>
				<label for="single">Only one option can be selected</label>
				<br/>
				<input type="radio"
					   value="multi"
					   id="multi"
					   v-model="multiSelect"
					   v-on:change="MultiSelectChange"
				/>
				<label for="multi">Multiple options can be selected</label>
			</div>
			<div class="col-md-6">
				<h3>Prevent multiple votes</h3>
				<input type="radio" name="multiVote" value="strict" id="strict" v-model="multiVote" v-on:change="MultiVoteChange"/>
				<label for="strict">Strict</label>
				<br/>
				<input type="radio" name="multiVote" value="normal" id="normal" v-model="multiVote" v-on:change="MultiVoteChange"/>
				<label for="normal">Normal</label>
				<br/>
				<input type="radio" name="multiVote" value="none" id="none" v-model="multiVote" v-on:change="MultiVoteChange"/>
				<label for="none">None</label>
			</div>
		</div>
		<button type="button" class="btn btn-primary btn-jumbo" id="createPoll" v-on:click="submit">Create Poll</button>
	</div>
	<div class="container" v-show="pollCreated">
		<div class="createdMessage">
			<p>Your poll was created at the following URL:</p>
			<a v-link="{ path: '/'+pollURL }">{{hostName}}/{{pollURL}}</a>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import {store, saveToDatabase} from '../store'
	import DynamicList from './DynamicList.vue'
	import FluidTextarea from './FluidTextarea.vue'

	const { editQuestion, addOption, removeItem, editItem, editMultiSelect, editMultiVote, clearState, addAlert } = store.actions;

	export default {
		components: {
			DynamicList,
			FluidTextarea
		},

		data() {
			return {
				pollCreated: false,
				pollURL: ''
			}
		},

		computed: {
			question() {
				return store.state.question
			},
			items() {
				return store.state.options
			},
			multiSelect() {
				return store.state.settings.multiSelect
			},
			multiVote() {
				return store.state.settings.multiVote
			},
			hostName() {
				return window.location.host
			}
		},

		methods: {
			editQuestion,
			addOption,
			removeItem,
			editItem,
			editMultiSelect,
			editMultiVote,
			clearState,
			MultiSelectChange(event) {
				this.editMultiSelect(event.target.value)
			},
			MultiVoteChange(event) {
				this.editMultiVote(event.target.value)
			},
			submit() {
				saveToDatabase()
					.then( message => {
						this.pollURL = message.url;
						this.pollCreated = true;
						clearState();
					})
			}
		}
	}
</script>