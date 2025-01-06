<template>
    <Wizard>
        <v-dialog v-model="dialog" width="500px">
            <div class="finalizar" v-if="jaFinalizou">
                <div id="animation-container">
                    <img id="machado" src="@/assets/dashboard/machado.png" />
                    <img id="check" src="@/assets/dashboard/check.png" />
                </div>
                <div>
                    <h1 class="lexend">Processo salvo com sucesso!</h1>
                </div>
                <div>
                    <v-btn class="botao lexend btBranco" color="amarelo_mostarda" depressed
                        @click.prevent="novoCadastro">Registrar novo
                        processo</v-btn>
                    <v-btn class="botao lexend btBranco" color="roxo" depressed
                        @click.prevent="irParaPainelDeControle">Ir para o painel de controle</v-btn>
                </div>
            </div>
            <div class="finalizar" v-else>
                <div>
                    <h1 class="lexend">{{ msgFinal }}</h1>
                </div>
            </div>
        </v-dialog>
    </Wizard>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
    data() {
        return {
            dialog: true,
            jaFinalizou: false,
            msgFinal: "Carregando o processo"
        }
    },
    computed: {
        ...mapGetters("auth", ["isAdmin", "token", "usuarioID"]),
        ...mapGetters("processo", ["allprocesso"]),
        objQuilomboProcessoParte() {
            const formData = new FormData();
            formData.append('token', this.token);
            formData.append('obj', JSON.stringify(this.allprocesso));
            return formData;
        }
    },
    watch: {
        dialog(v) {
            if (!v) {
                this.restartProcesso()
                this.$router.push({ name: `dashboard-processos-wizard` })
            }
        }
    },
    mounted() {
        this.submitProcessos()
    },
    methods: {
        ...mapActions('processo', ['restartProcesso']),
        async submitProcessos() {
            try {
                const response = await this.$axios.post('/api/importar_processo', this.objQuilomboProcessoParte);
                this.jaFinalizou = true
            } catch (error) {
                this.msgFinal = "Processo não pode ser salvo"
            }
        },
        novoCadastro() {
            this.restartProcesso()
            this.$router.push({ name: `dashboard-processos-wizard` })
        },
        irParaPainelDeControle() {
            this.restartProcesso()
            this.$router.push({ name: `dashboard` })
        }
    }
}
</script>

<style scoped>
.finalizar {
    background: var(--v-branco-base);
    border-radius: 15px;
    padding: 30px 100px;
}

h1 {
    color: var(--v-roxo-base);
    text-align: center;
}

.btBranco {
    color: var(--v-branco-base);
    font-weight: 600;
}

.finalizar>*:nth-child(3) {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 20px;
}

#animation-container {
    position: relative;
    width: 200px;
    height: 200px;
}

#machado {
    position: absolute;
    top: 0;
    left: 130px;
    transform: translateX(-50%);
    animation: swing 1s ease-in-out forwards;
}

#check {
    position: absolute;
    top: 150px;
    left: 200px;
    transform: translate(-50%, -50%);
    opacity: 0;
    animation: appear 1s ease-in-out forwards;
    animation-delay: 1s;
}

@keyframes swing {
    0% {
        transform: translateX(-50%) rotate(0deg);
    }

    50% {
        transform: translateX(-50%) rotate(90deg);
        top: 100px;
    }

    100% {
        transform: translateX(-50%) rotate(0deg);
        top: 0;
    }
}

@keyframes appear {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>