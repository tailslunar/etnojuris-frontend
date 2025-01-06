<template>
  <div :style="{ height: computedHeight + 'px' }">
    <BarChart :data="chartData" :options="options" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("dashboard", ["graficoVitoriaDerrota"]),
    chartData() {
      return this.graficoVitoriaDerrota;
    },
    computedHeight() {
      const itemCount = this.chartData.labels.length;
      const baseHeight = 150; // Altura base mínima para o gráfico
      const itemHeight = 20; // Altura adicional por item (estado)
      return baseHeight + itemCount * itemHeight;
    },
    options() {
      return {
        //responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y", // Muda o eixo para barras horizontais
        plugins: {
          legend: {
            position: "top",
            align: "end", // Alinha as legendas à esquerda
            labels: {
              boxWidth: 40,
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
