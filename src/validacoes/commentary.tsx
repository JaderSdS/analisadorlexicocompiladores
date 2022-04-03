export default class Commentary {
    //Recebe um comentário como atributo, retorna true caso comece com "//"". retorna false caso comece com "--".
    isValidCommentary(word: string) {
        if (/^\/\//.test(word)) {
            return true
        } else if (/^\-\-/.test(word)) {
            return false
        }
    }

    //Recebe um comentário e a contagem de linhas como atributo. Retorna um token caso comentário seja válido ou um erro caso inválido.
    handleCommentary(word: string, count: number) {
        const isComentary = this.isValidCommentary(word)
        if (isComentary) {
            return ({ token: 'COMENTÁRIO', symbol: word, line: count, errors: [] })
        } else {
            return ({
                symbol: word,
                line: count,
                errors: [{ error: word, description: 'Comentário não pode começar com --' }]
            })
        }
    }

}