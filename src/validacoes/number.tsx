export default class Numbers {
    //Expressão regular que verifica se um número é um real válido
    realRegex = /^\d{1,2}\.\d{2}$/;

    //Recebe um número sem pontos por parâmetro. Retorna true se tiver no máximo 2 digitos
    //Caso contrário retorna false
    isInt(number: { toString: () => { (): any; new(): any; length: number; }; }) {
        if (number.toString().length > 0 && number.toString().length <= 2) {
            return true;
        }
        return false;
    }

    //Recebe um número que não é int. Retorna true se passar no regex de número real.
    //Caso contrário, retorna false.
    isReal(number: any) {
        return this.realRegex.test(number);
    }

    //Recebe um número como atributo. Retorna false caso possua algum "."
    //Caso contrário, retorna true.
    handleNoDots(number: { toString: () => any; }) {
        const verification = number.toString();
        for (let index = 1; index <= verification.length; index++) {
            if (verification[index] == '.') {
                return false
            }
        }
        return true
    }

    //Recebe um númerom a contagem de linhas e a contagem de símbolos como atributo.
    //Retorna o token de número inteiro.
    handleIntNumber(number: any, count: any, symbolCount: string) {
        return ({ token: 'NÚMERO INTEIRO [' + symbolCount + ']', symbol: number, id: count, errors: [] })
    }

    //Recebe um número e a contagem de linhas
    //Retorna o erro de int inválido
    handleNotIntNumber(number: any, count: any) {
        return ({
            symbol: number,
            id: count,
            errors: [{ error: number, description: 'Int inválido' }]
        })
    }

    //Recebe um númerom a contagem de linhas e a contagem de símbolos como atributo.
    //Retorna o token de número real.
    handleRealNumber(number: any, count: any, symbolCount: string) {
        return ({ token: 'NÚMERO REAL [' + symbolCount + ']', symbol: number, id: count, errors: [] })
    }

    //Recebe um número e a contagem de linhas
    //Retorna o erro de reaç inválido
    handleNotRealNumber(number: any, count: any) {
        return ({
            //token: 'REAL ' + countInvalid,
            symbol: number,
            id: count,
            errors: [{ error: number, description: 'Real inválido' }]
        })
    }

    //Função para lidar com números
    //Recebe uma palavra, a contagem de linhas e a contagem de símbolos como atributos
    //Caso a palavra não seja um número, retorna false
    //Caso a palavra seja um número válido, retorna o token adequado
    //Caso seja um número inválido, retorna o erro adequado
    handleNumber(number: any, count: any, symbolCount: any) {
        if (this.isInt(number)) {
            return this.handleIntNumber(number, count, symbolCount)
        } else {
            const isTheresDots = this.handleNoDots(number)
            if (!!isTheresDots) {
                return this.handleNotIntNumber(number, count)
            } else if (this.isReal(number)) {
                return this.handleRealNumber(number, count, symbolCount)
            } else if (!this.isInt(number)) {
                return this.handleNotRealNumber(number, count)
            }
        }
        return false
    }
}