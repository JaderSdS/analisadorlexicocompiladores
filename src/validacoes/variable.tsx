export default class Variables {
    //Recebe uma palavra como atributo.
    //Caso a palavra contenha espaços, retorna true
    //Caso contrário, retorna false
    isSpace(characters: string) {
        for (let i = 0; i < characters.length; i++) {
            if (characters.charAt(i) === " ") {
                return true;
            }
        }
        return false
    }

    //Recebe uma palavra como atributo.
    //Caso a palavra contenha algum caracter especial, retorna true
    //Caso contrário, retorna false
    isSpecialCharacters(characters: string | any[]) {
        for (let index = 0; index < characters.length; index++) {
            if (characters[index] == '!' || characters[index] == '@' || characters[index] == '#' || characters[index] == '$' || characters[index] == '%'
                || characters[index] == '¨' || characters[index] == '&' || characters[index] == '*' || characters[index] == '?' || characters[index] == '_'
                || characters[index] == '-'
            ) return true
        }
        return false
    }

    //Recebe uma palavra como atributo
    //Caso o primeiro caracter seja uma letra, retorna true
    //caso contrário, retorna false
    isText(text: string) {
        return /^[a-zA-Z]/.test(text)
    }

    //Recebe uma palavra e a contagem de linhas como atributo
    //Retorna o erro indicando que variáveis não podem começar com números
    handleNumberErrorsArray(variable: any, count: any) {
        return ({
            symbol: variable,
            id: count,
            errors: [{ error: variable, description: 'Não pode começar variável com número' }]
        })

    }

    //Recebe uma palavra e a contagem de linhas como atributo
    //Retorna o erro indicando que variáveis não podem conter caracteres especiais
    handleCharactersErrorsArray(variable: any, count: any) {
        return ({
            symbol: variable,
            id: count,
            errors: [{ error: variable, description: 'Não pode ter caracteres especiais em uma variável' }]
        })
    }

    //Recebe uma palavra e a contagem de linhas como atributo
    //Retorna o erro indicando que variáveis não podem conter espaços
    handleSpaceErrorsArray(variable: any, count: any) {
        return ({
            symbol: variable,
            id: count,
            errors: [{ error: variable, description: 'Variáveis não podem conter espaços' }]
        })
    }

    //Função para lidar com variáveis
    //Recebe uma palavra, a contagem de linhas e a contagem de símbolos como atributos
    //Caso a palavra não inicie com número, não tenha caracteres especiais e não contenha espaços, retorna o token
    //Caso contrário, retorna o erro adequado
    isVariable(variable: any, count: any, symbolCount: number) {
        if (!this.isSpecialCharacters(variable) && this.isText(variable) && !this.isSpace(variable)) {
            return ({ token: 'IDENTIFICADOR [' + symbolCount + ']', symbol: variable, id: count, errors: [] })
        } else {
            if (this.isSpecialCharacters(variable)) {
                return this.handleCharactersErrorsArray(variable, count);
            }
            else if (!this.isText(variable)) {
                return this.handleNumberErrorsArray(variable, count);
            }
            else if (this.isSpace(variable)) {
                return this.handleSpaceErrorsArray(variable, count);
            }
        }
    }
}