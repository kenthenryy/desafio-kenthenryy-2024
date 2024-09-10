class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animaisExistentes: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animaisExistentes: [] },
            { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animaisExistentes: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animaisExistentes: [] },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animaisExistentes: [{ especie: "LEAO", quantidade: 1 }] }
        ];

        this.animais = {
            LEAO: { tamanho: 3, bioma: ["savana"], carnivoro: true },
            LEOPARDO: { tamanho: 2, bioma: ["savana"], carnivoro: true },
            CROCODILO: { tamanho: 3, bioma: ["rio"], carnivoro: true },
            MACACO: { tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
            GAZELA: { tamanho: 2, bioma: ["savana"], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, bioma: ["savana", "rio"], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const recintosViaveis = this.recintos
            .filter(recinto => this.recintoPodeReceberAnimal(recinto, animal, quantidade))
            .map(recinto => {
                const espacoLivre = this.calcularEspacoLivre(recinto, animal, quantidade);
                return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
            });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }

    recintoPodeReceberAnimal(recinto, animal, quantidade) {
        const animalInfo = this.animais[animal];
        const espacoNecessario = animalInfo.tamanho * quantidade;
        const espacoDisponivel = this.calcularEspacoLivre(recinto);

        if (espacoDisponivel < espacoNecessario) {
            console.log(`Recinto ${recinto.numero} rejeitado por falta de espaço`);
            return false;
        }

        if (!animalInfo.bioma.some(b => recinto.bioma.includes(b))) {
            console.log(`Recinto ${recinto.numero} rejeitado por bioma incompatível`);
            return false;
        }

        if (animalInfo.carnivoro && recinto.animaisExistentes.some(a => a.especie !== animal)) {
            console.log(`Recinto ${recinto.numero} rejeitado por conter outros animais`);
            return false;
        }

        if (!animalInfo.carnivoro && recinto.animaisExistentes.some(a => this.animais[a.especie].carnivoro)) {
            console.log(`Recinto ${recinto.numero} rejeitado por conter animais carnívoros`);
            return false;
        }

        return true;
    }

    calcularEspacoLivre(recinto, novoAnimal = null, novaQuantidade = 0) {
        const espacoOcupado = recinto.animaisExistentes.reduce((total, animal) => {
            return total + this.animais[animal.especie].tamanho * animal.quantidade;
        }, 0);

        const espacoNovoAnimal = novoAnimal ? this.animais[novoAnimal].tamanho * novaQuantidade : 0;

        const espacoExtra = (recinto.animaisExistentes.length > 0 && novoAnimal && recinto.animaisExistentes.some(a => a.especie !== novoAnimal)) ||
                            (recinto.animaisExistentes.length > 1 && novoAnimal === null) ? 1 : 0;

        return recinto.tamanhoTotal - espacoOcupado - espacoNovoAnimal - espacoExtra;
    }
}

export { RecintosZoo as RecintosZoo };

