import estados from '~/services/estados';

export const state = () => ({
  estados: [],
  estadosSelecionados: ['todos'],
  regiao: {
    sul: {
      nome: "Região Sul",
      estados: ['pr', 'sc', 'rs'],
      selected: false,
    },
    sudeste: {
      nome: "Região Sudeste",
      estados: ['sp', 'rj', 'mg', 'es'],
      selected: false,
    },
    centro_oeste: {
      nome: "Região Centro-Oeste",
      estados: ['mt', 'ms', 'go', 'df'],
      selected: false,
    },
    norte: {
      nome: "Região Norte",
      estados: ['ac', 'ap', 'am', 'pa', 'ro', 'rr', 'to'],
      selected: false,
    },
    nordeste: {
      nome: "Região Nordeste",
      estados: ['al', 'ba', 'ce', 'ma', 'pb', 'pe', 'pi', 'rn', 'se'],
      selected: false,
    },
  },
});

export const getters = {
  dashboard: (state) => state,
  dashboardEstado: (state) => (estado) => {
    if (typeof estado === undefined) return {}
    let key = state.estados.findIndex(i => i.estado === estado)
    return state.estados[key]
  },
  estadoProcessoQuilombo: (state) => (estado) => {

    if (typeof estado === undefined) return {}
    if (state.estados.length < 0) return {}

    let keyEstado = estados.findIndex(i => i.sigla === estado)
    let key = state.estados.findIndex(i => i.estado === estado)

    if (typeof state.estados[key] === undefined) return {}
    if (typeof state.estados[key].total === undefined) return {}
    if (typeof state.estados[key].total.processo === undefined) return {}
    if (typeof state.estados[key].total.quilombo === undefined) return {}

    return {
      estado: estados[keyEstado].nome,
      processo: state.estados[key].total?.processo || 0,
      quilombo: state.estados[key].total?.quilombo || 0,
    }
  },
  graficoQuilombo: ({ estados, estadosSelecionados }) => {
    const [totalAtivo, totalPassivo] = estadosSelecionados.reduce(
      ([ativo, passivo], estadoSelecionado) => {
        const estado = estados.find(e => e.estado === estadoSelecionado) || {};
        return [
          ativo + (estado.polo?.ativo || 0),
          passivo + (estado.polo?.passivo || 0)
        ];
      },
      [0, 0]
    );

    return {
      label: [` Ativo: ${totalAtivo} `, ` Passivo: ${totalPassivo} `],
      cores: ["#5A3E85", "#BA5A36"],
      dados: [totalAtivo, totalPassivo],
    };
  },
  graficoSentenca: ({ estados, estadosSelecionados }) => {
    const totalSentencas = {
      procedente: 0,
      acordo: 0,
      improcedente: 0,
      parcialmente_procedente: 0,
      embargos_acolhidos: 0,
      sem_merito: 0,
      sem_informacao: 0
    };

    estadosSelecionados.forEach(estadoSelecionado => {
      const estado = estados.find(e => e.estado === estadoSelecionado) || {};

      totalSentencas.procedente += estado.sentenca?.procedente || 0;
      totalSentencas.acordo += estado.sentenca?.acordo || 0;
      totalSentencas.improcedente += estado.sentenca?.improcedente || 0;
      totalSentencas.parcialmente_procedente += estado.sentenca?.parcialmente_procedente || 0;
      totalSentencas.embargos_acolhidos += estado.sentenca?.embargos_acolhidos || 0;
      totalSentencas.sem_merito += estado.sentenca?.sem_merito || 0;
      totalSentencas.sem_informacao += estado.sentenca?.sem_informacao || 0;
    });

    return {
      label: [
        ` Procedente: ${totalSentencas.procedente} `,
        ` Acordo: ${totalSentencas.acordo} `,
        ` Improcedente: ${totalSentencas.improcedente} `,
        ` Parcialmente Procedente: ${totalSentencas.parcialmente_procedente} `,
        ` Embargos Acolhidos: ${totalSentencas.embargos_acolhidos} `,
        ` Sem Mérito: ${totalSentencas.sem_merito} `,
        ` Sem Informação: ${totalSentencas.sem_informacao} `
      ],
      cores: [
        "#5A3E85", // Procedente
        "#BA5A36", // Acordo
        "#F3C775", // Improcedente
        "#191919", // Parcialmente procedente
        "#28A745", // Embargos acolhidos
        "#7F8C8D", // Sem mérito
        "#5BC0EB", // Sem informação
      ],
      dados: [
        totalSentencas.procedente,
        totalSentencas.acordo,
        totalSentencas.improcedente,
        totalSentencas.parcialmente_procedente,
        totalSentencas.embargos_acolhidos,
        totalSentencas.sem_merito,
        totalSentencas.sem_informacao
      ]
    };
  },
  graficoMicroRegiao: ({ estados, estadosSelecionados }) => {
    const totalProcesso = { trf1: 0, trf2: 0, trf3: 0, trf4: 0, trf5: 0 };
    const totalQuilombo = { trf1: 0, trf2: 0, trf3: 0, trf4: 0, trf5: 0 };

    estadosSelecionados.forEach(estadoSelecionado => {
      const estado = estados.find(e => e.estado === estadoSelecionado) || {};

      totalProcesso.trf1 += estado.processo?.trf1 || 0;
      totalProcesso.trf2 += estado.processo?.trf2 || 0;
      totalProcesso.trf3 += estado.processo?.trf3 || 0;
      totalProcesso.trf4 += estado.processo?.trf4 || 0;
      totalProcesso.trf5 += estado.processo?.trf5 || 0;

      totalQuilombo.trf1 += estado.quilombo?.trf1 || 0;
      totalQuilombo.trf2 += estado.quilombo?.trf2 || 0;
      totalQuilombo.trf3 += estado.quilombo?.trf3 || 0;
      totalQuilombo.trf4 += estado.quilombo?.trf4 || 0;
      totalQuilombo.trf5 += estado.quilombo?.trf5 || 0;
    });

    return {
      labels: ['TRF1', 'TRF2', 'TRF3', 'TRF4', 'TRF5'],
      datasets: [
        {
          label: 'Processos',
          backgroundColor: '#5BC0EB',
          data: [totalProcesso.trf1, totalProcesso.trf2, totalProcesso.trf3, totalProcesso.trf4, totalProcesso.trf5]
        },
        {
          label: 'Quilombos',
          backgroundColor: '#F3C775',
          data: [totalQuilombo.trf1, totalQuilombo.trf2, totalQuilombo.trf3, totalQuilombo.trf4, totalQuilombo.trf5]
        }
      ]
    };
  },
  graficoPorEstado: ({ estados, estadosSelecionados }) => {
    const selectedEstados = estadosSelecionados.includes('todos')
      ? estados
      : estados.filter(e => estadosSelecionados.includes(e.estado));

    const labels = selectedEstados
      .map(e => e.estado)
      .filter(estado => estado !== 'todos');

    const processosData = selectedEstados.map(e => e.total.processo || 0);
    const quilombosData = selectedEstados.map(e => e.total.quilombo || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Processos',
          backgroundColor: '#5BC0EB',
          data: processosData,
        },
        {
          label: 'Quilombos',
          backgroundColor: '#F3C775',
          data: quilombosData,
        }
      ]
    };
  }
}

export const mutations = {
  SET_DASHBOARD(state, estados) {
    state.estados = estados
  },
  SET_DASHBOARD_ESTADOS(state, estados) {
    if (estados.length === 0) {
      estados = ['todos'];
    } else {
      // Se "todos" ou "TODOS" estiver no array e houver mais de um item, remova "todos" ou "TODOS"
      if ((estados.includes('todos') || estados.includes('TODOS')) && estados.length > 1) {
        estados = estados.filter(estado => estado !== 'todos' && estado !== 'TODOS');
      }
    }
    state.estadosSelecionados = estados;
  },
  SET_DASHBOARD_ESTADOS_REGIAO(state, regiao) {
    Object.keys(state.regiao).forEach(key => {
      state.regiao[key].selected = false;
    });
    state.regiao[regiao].selected = true
    let estados = state.regiao[regiao].estados.map((state) => state.toUpperCase());
    state.estadosSelecionados = estados;
  },
}

export const actions = {
  setDashboard({ commit }, estados) {

    const estadosComValoresAleatorios = estados.map(estado => {
      return {
        ...estado,
        total: {
          ...estado.total,
          processo: getRandomInt(10, 100),
          quilombo: getRandomInt(10, 100),
          tempo_meio: getRandomInt(10, 100),
        },
        processo: {
          trf1: getRandomInt(10, 100),
          trf2: getRandomInt(10, 100),
          trf3: getRandomInt(10, 100),
          trf4: getRandomInt(10, 100),
          trf5: getRandomInt(10, 100),
          trf6: getRandomInt(10, 100),
        },
        quilombo: {
          trf1: getRandomInt(10, 100),
          trf2: getRandomInt(10, 100),
          trf3: getRandomInt(10, 100),
          trf4: getRandomInt(10, 100),
          trf5: getRandomInt(10, 100),
          trf6: getRandomInt(10, 100),
        },
        polo: {
          passivo: getRandomInt(10, 100),
          ativo: getRandomInt(10, 100),
        },
        sentenca: {
          procedente: getRandomInt(10, 100),
          acordo: getRandomInt(10, 100),
          improcedente: getRandomInt(10, 100),
          parcialmente_procedente: getRandomInt(10, 100),
          embargos_acolhidos: getRandomInt(10, 100),
          sem_merito: getRandomInt(10, 100),
          sem_informacao: getRandomInt(10, 100)
        }
      };
    });
    commit("SET_DASHBOARD", estados)
    //commit("SET_DASHBOARD", estadosComValoresAleatorios)
  },
  setDashboardEstado({ commit }, estado) {
    commit("SET_DASHBOARD_ESTADOS", estado)
  },
  setDashboardRegiaoSelected({ commit }, regiao) {
    commit("SET_DASHBOARD_ESTADOS_REGIAO", regiao);
  },
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}