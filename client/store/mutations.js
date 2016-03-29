export default {

	EDIT_QUESTION( state, question ) {
		state.question = question
	},

	ADD_OPTION( state, option ) {
		state.options.push(option)
	},

	REMOVE_ITEM( state, item ) {
		state.options.$remove(item)
	},

	EDIT_ITEM( state, item, title ) {
		item.title = title
	},

	EDIT_MULTISELECT( state, value ) {
		state.settings.multiSelect = value
	},

	EDIT_MULTIVOTE( state, value ) {
		state.settings.multiVote = value
	},

	CLEAR_STATE( state ) {
		state.question = '';
		state.options = [];
		state.settings = {
			multiSelect: 'single',
			multiVote: 'normal'
		}
	},

	ADD_ALERT( state, type, text ) {
		state.alerts.push({
			type: type,
			text: text
		})
	},

	REMOVE_ALERT( state, alert ) {
		state.alerts.$remove(alert);
	}
}