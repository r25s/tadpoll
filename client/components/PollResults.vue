<style>

</style>

<template>
	<div class="container">
		<h2 class="poll-question">{{question}}</h2>
		<p class="sub-heading">Real-time poll results:</p>

		<div class="bar-chart">
			<template v-for="option in options" track-by="$index">
				<div class="row" :class="{'most-votes': isMost($index)}">
					<div class="col-md-6 title-col chart-col">
						<p class="option-title" title="{{option.title}}">{{option.title}}</p>
					</div>
					<div class="col-md-6 bar-col chart-col">
						<div class="bar" :style="{width: getBarWidth($index) + 'px'}"></div>
						<p class="option-votes">{{option.votes}}</p>
					</div>
				</div>
			</template>
		</div>

		<p id="total-votes" class="sub-heading">Total: {{totalVotes}} votes</p>

		<canvas id="pie-chart" width="400" height="400"></canvas>
	</div>
</template>


<script type="text/ecmascript-6">

	import randomColor from 'randomcolor'
	import {fetchInitData} from '../store'
	import simpleRound from '../lib/simpleRound'
	var io = require('socket.io-client'); //TODO: find out why "import io from 'socket.io-client'" is different and throws error
	require("../lib/chart.js/Chart.min.js");

	export default {
		data() {
			return {
				question: '',
				options: [],
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
			},

			getBarWidth( index ) {
				return this.options[index].votes * this.unitWidth;
			},

			isMost( index ) {
				return this.mostVotes > 0 && this.options[index].votes === this.mostVotes;
			}
		},

		computed: {
			mostVotes() {
				var most = 0;
				this.options.forEach( function(current) {
					if(current.votes > most)	{
						most = current.votes;
					}
				});

				return most;
			},

			unitWidth() {
				return simpleRound(250 / this.mostVotes, 3);
			},

			totalVotes() {
				var total = 0;
				this.options.forEach( function(current) {
					total += current.votes;
				});

				return total;
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

				//TODO: UPDATE THIS.OPTIONS[INDEX].VOTES WITH NEW VOTE VALUES FOUND IN DATA.UPDATEDATA
				this.options.forEach( function(current, index) {
					current.votes = data.updateData[index];
				})
			});
		},

		route: {
			data(transition) {
				fetchInitData( transition.to.params.id )
					.then( poll => {
						this.question = poll.question;
						this.options = poll.options;
						poll.options.forEach((option) => {
							let color = randomColor();

							this.pieChartData.labels.push(option.title);
							this.pieChartData.datasets[0].data.push(option.votes);
							this.pieChartData.datasets[0].backgroundColor.push(color);
						});

						this.initializeCharts();
						transition.next();
					})
			}
		}
	}
</script>