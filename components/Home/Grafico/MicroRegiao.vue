<template>
  <div>
    <BarChart :data="chartData" :options="options" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("dashboard", ["graficoMicroRegiao"]),
    chartData() {
      return this.graficoMicroRegiao;
    },
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end", // Alinha as legendas à esquerda
            labels: {
              boxWidth: 20,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            callbacks: {
              title: () => "",
              label: function (tooltipItem) {
                return ` ${tooltipItem.raw} `;
              },
            },
            displayColors: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 50,
            },
          },
        },
      };
    },
  },
};
</script>
