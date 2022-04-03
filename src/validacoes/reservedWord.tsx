export default class ReservedWord {
    //Recebe uma palavra por parâmetro. Caso seja uma palavra reservada, retorna true.
    //Caso contrário, retorna false.
    isReservedWord(word: string) {
        if (/(^int)$/.test(word) || /(^float)$/.test(word) || /(^char)$/.test(word) || /(^double)$/.test(word) || /(^real)$/.test(word) ||
            /(^break)$/.test(word) || /(^case)$/.test(word) || /(^const)$/.test(word) || /(^continue)$/.test(word)) {
            return true
        } else {
            return false
        }
    }

    //Recebe uma palavra e a contagem de linhas como atributos.
    //Caso a palavra seja reservada, retora um token.
    //caso contrário, retorna false.
    handleReservedWord(word: string, count: number) {
        if (this.isReservedWord(word)) {
            return ({ token: word.toUpperCase(), symbol: word, id: count, errors: [] })
        }
        return false
    }
}