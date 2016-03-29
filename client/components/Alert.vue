<template>
	<div class="alert" :class="['alert-' + type, dismissable ? 'alert-dismissible' : '', animation ? 'fade' : '', animation  ? 'in' : '']" role="alert">
		<button v-if="dismissible" type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
			<span class="sr-only">Close</span>
		</button>
		<slot></slot>
	</div>
</template>

<script type="text/babel">
	// this component was adapted from https://github.com/Morgul/vueboot

	import '../../node_modules/bootstrap/dist/js/umd/alert'

	export default {
		props: {
			alert: {
				type: Object,
				required: true
			},
			dismissible: {
				type: Boolean,
				default: true
			},
			animation: {
				type: Boolean,
				default: true
			},
			timeout: {
				type: Number,
				default: -1
			}
		},

		data: function() {
			return {
				type: this.alert.type || 'info'
			}
		},

		methods: {
			dismiss: function()
			{
				$(this.$el).alert('close');
			}
		},

		ready: function()
		{
			if(this.timeout >= 0)
			{
				setTimeout(() => { this.dismiss() }, this.timeout)
			}

			$(this.$el).on('closed.bs.alert', () =>
			{
				this.$dispatch('close', this.alert);
			});
		}
	}
</script>