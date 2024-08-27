<template>
  <div :style="{ height: computedHeight + 'px' }">
    <BarChart :data="chartData" :options="options" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("dashboard", ["graficoPorEstado"]),
    chartData() {
      return this.graficoPorEstado;
    },
    computedHeight() {
      const itemCount = this.chartData.labels.length;
      const baseHeight = 200; // Altura base mínima para o gráfico
      const itemHeight = 30; // Altura adicional por item (estado)
      return baseHeight + itemCount * itemHeight;
    },
    options() {
      return {
        responsive: true,
        indexAxis: "y", // Muda o eixo para barras horizontais
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
            datasets: {
              barThickness: 10, // Define a espessura das barras em 10px
            },
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
