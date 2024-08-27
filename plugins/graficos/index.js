import Vue from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Pie, Bar } from 'vue-chartjs'

// Registrar componentes Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement)

// Registrar os componentes Pie e Bar globalmente
Vue.component('PieChart', Pie)
Vue.component('BarChart', Bar)
