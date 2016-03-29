<style>

</style>

<template>
	<div class="container">
		<h2 class="poll-question">{{question}}</h2>
		<p class="sub-heading">Real-time poll results:</p>
		<template v-for="option in options" track-by="$index">
			<p>{{option.title}}</p>
			<p>{{option.votes}}</p>
		</template>

		<canvas id="bar-chart" width="400" height="400"></canvas>
		<canvas id="pie-chart" width="400" height="400"></canvas>
	</div>
</template>


<script type="text/ecmascript-6">

	import randomColor from 'randomcolor'
	import {fetchInitData} from '../store'
	var io = require('socket.io-client'); //TODO: find out why "import io from 'socket.io-client'" is different and throws error
	require("../lib/chart.js/Chart.min.js");

	export default {
		data() {
			return {
				question: '',
				socket: null,
				pieChart: null,
				barChart: null,
				pieChartData: {
					labels: [],
					datasets: [
						{
							data: [],
							backgroundColor: []
						}
					]
				},
				barChartData: {
					labels: [],
					datasets: [
						{
							data: [],
							backgroundColor: []
						}
					]
				}
			}
		},

		methods: {
			initializeCharts() {
				var pieCtx = document.getElementById("pie-chart").getContext("2d");
				this.pieChart = new Chart(pieCtx, {
					type:'pie',
					data: this.pieChartData
				});

				var barCtx = document.getElementById("bar-chart").getContext("2d");
				this.barChart = new Chart(barCtx, {
					type:'bar',
					data: this.barChartData
				});
			}
		},

		ready() {
			this.socket = io.connect();

			this.socket.on('connect', () => {
				this.socket.emit('room', this.$route.params.id);
			});

			this.socket.on('error', () => {
				console.log("connection error"); //TODO: handle connection error
			});

			this.socket.on('disconnect', () => {
				//TODO: handle disconnection
			});

			this.socket.on('update_data', (data) => {
				this.pieChartData.datasets[0].data = data.updateData;
				this.pieChart.update(1000, true);
				this.barChartData.datasets[0].data = data.updateData;
				this.barChart.update(1000, true);
			});
		},

		route: {
			data(transition) {
				fetchInitData( transition.to.params.id )
					.then( poll => {
						this.question = poll.question;
						poll.options.forEach((option) => {
							let color = randomColor();

							this.pieChartData.labels.push(option.title);
							this.pieChartData.datasets[0].data.push(option.votes);
							this.pieChartData.datasets[0].backgroundColor.push(color);

							this.barChartData.labels.push(option.title);
							this.barChartData.datasets[0].data.push(option.votes);
							this.barChartData.datasets[0].backgroundColor.push(color);
						});

						this.initializeCharts();
						transition.next();
					})
			}
		}
	}
</script>