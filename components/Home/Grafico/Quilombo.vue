<template>
  <div>
    <PieChart :data="graficoData" :options="graficoOptions" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("dashboard", ["graficoQuilombo"]),
    graficoData() {
      return {
        labels: this.graficoQuilombo.label,
        datasets: [
          {
            backgroundColor: this.graficoQuilombo.cores,
            data: this.graficoQuilombo.dados,
          },
        ],
      };
    },
    graficoOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom", // Legenda na parte inferior
            labels: {
              usePointStyle: true, // Tentar forçar o uso de bolinhas
              generateLabels: (chart) => {
                const labels = chart.data.labels;
                const dataset = chart.data.datasets[0];
                return labels.map((label, i) => ({
                  text: label,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.backgroundColor[i],
                  lineCap: "round",
                  pointStyle: "circle", // Garante que o estilo seja círculo
                  hidden: false,
                }));
              },
            },
          },
          tooltip: {
            callbacks: {
              title: () => (""),
              label: function (tooltipItem) {
                const value = tooltipItem.raw;
                const total = tooltipItem.chart.data.datasets[0].data.reduce(
                  (a, b) => a + b,
                  0
                );
                const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                return ` ${percentage}% `;
              },
            },
            displayColors: false,
          },
        },
      };
    },
  },
};
</script>
