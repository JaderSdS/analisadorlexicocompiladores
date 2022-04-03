import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './validacoes/commentary';
import './validacoes/number';
import './validacoes/reservedWord';
import './validacoes/variable';
import Commentary from './validacoes/commentary';
import Variables from './validacoes/variable';
import ReservedWord from './validacoes/reservedWord';
import Numbers from './validacoes/number';

function App() {
  const commentary = new Commentary();
  const variables = new Variables();
  const reservedWords = new ReservedWord();
  const numbers = new Numbers();

  const [allText, setAllText] = useState<any>();
  const [allValidated, setAllValidated] = useState<any>();
  const [allUnvalidated, setAllUnvalidated] = useState<any[]>();
  const [allSymbols, setAllSymbols] = useState<any[]>();
  const [tokenRows, setTokenRows] = useState<any>();
  const [invalidRows, setInvalidRows] = useState<any>();
  const [symbolsRows, setSymbolsRows] = useState<any>();
  const [showTable, setShowTable] = useState(false);

  const fileReader = (event: any) => {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = function () {
      const allReadText = reader.result;
      let allText: any = document.getElementById('text')

      if (allText) {
        setAllText(allText)
        allText.value = allReadText ? allReadText : '';
      }
    };
    reader.readAsText(input.files[0]);
  }

  //ao alterar o texto direto na textarea ele adiciona na variavel que fica as linhas 
  const handleChange = (event: any) => {
    const input = event.target;

    setTokenRows([])
    setInvalidRows([])
    setSymbolsRows([])
    setAllText(input)
  }

  //Recebe uma palavra e a array com as palavras já validadas. 
  //Caso já a palavra já apareça em um token da array, retorna o token em questão.
  //caso contrário, retorna false
  const checkRepeated = (word: any, validatedArray: any[]) => {
    for (let index = 0; index < validatedArray.length; index++) {
      if (!!validatedArray && (validatedArray[index].symbol === word)) {
        return validatedArray[index];
      }
    }
    return false;
  }

  //Recebe uma string
  //Retora um array composto da mesma string, separada em linhas
  const splitLine = (allText: any) => {
    return allText.split(/\n/)
  }

  //Função responsável por verificar o texto linha a linha, 
  //separando-o em 3 objetos: um de tokens válidos, um de erros e um com os símbolos únicos
  function analizerText() {

    const allLineSplited = splitLine(allText.value);
    const allValidated = [{}];
    const allUnvalidated = [{}];
    const allSymbols = [{}];
    let count = 1;
    let symbolCount = 1;
    for (let index = 0; index < allLineSplited.length; index++) {
      let word = allLineSplited[index];
      let repeated = checkRepeated(word, allValidated);

      //Verifica se a palavra atual já foi validada anteriormente.
      if (!!repeated) {
        let copy = Object.assign({}, repeated);
        copy.line = count;
        allValidated.push(copy);
        count++;
      } else {
        const reservedWord = reservedWords.handleReservedWord(word, count);
        const isNumber = numbers.handleNumber(word, count, symbolCount)
        const variable = variables.isVariable(word, count, symbolCount);
        const comentary = commentary.handleCommentary(word, count)

        //Verifica se a palavra atual é uma palavra reservada
        if (reservedWord) {
          allValidated.push(reservedWord)

          //Caso não seja uma palavra reservada, verifica se é um comentário
        } else if ((/^\/\//.test(word) || /^\-\-/.test(word)) && !!comentary) {
          if (!!comentary.errors[0]) {
            allUnvalidated.push(comentary)
            //push para array de inválidos
          } else {
            allValidated.push(comentary)
            //push para array de válidos
          }

          //Caso não seja um comentário, verifica se é um número
        } else if (!!isNumber && !word.match(/[a-z]/i)) {
          if (!!isNumber.errors[0]) {
            allUnvalidated.push(isNumber)
            //push para array de inválidos
          } else {
            allValidated.push(isNumber);
            allSymbols.push(word)
            symbolCount++;
            //push para array de válidos
          }

          //Caso não seja um número, verifica se é uma variável
        } else if (!!variable) {
          if (!!variable.errors[0]) {
            allUnvalidated.push(variable)
            //push para array de inválidos
          } else {
            allValidated.push(variable);
            allSymbols.push(word)
            symbolCount++;
            //push para array de válidos
          }
        }
        count++;
      }
    }
    //passa todos os tokens válidos para o array de tokens
    setAllValidated(allValidated)
    //passa todos os tokens invalidos para o array de tokens
    setAllUnvalidated(allUnvalidated)
    //passa todos os símbolos únicos para o array de tokens
    setAllSymbols(allSymbols)
  }

  //monta os dados para a tabala de tokens
  useEffect(() => {
    let row: {}
    let rows: any[] = []
    if (allValidated && allValidated.length > 0) {

      allValidated.map((word: any, index: number) => {
        //passa por todos os itens do array e monta uma linha para cada token
        row = { id: word.line, token: word.token, symbol: word.symbol }
        if (index > 0)
          rows.push(row)
      })
      setTokenRows(rows)
    }
  }, [allValidated])

  //monta os dados para a tabala de invalidos
  useEffect(() => {

    let row: {}
    let rows: any[] = []
    if (allUnvalidated && allUnvalidated.length > 0) {
      ;
      allUnvalidated.map((word: any, index: number) => {
        //passa por todos os itens do array e monta uma linha para cada erro
        if (index > 0) {
          row = { id: word.line, symbol: word.symbol }
          rows.push(row)
        }
      })
      setInvalidRows(rows)
    }

  }, [allUnvalidated])



  //monta os dados para a tabela de simbolos
  useEffect(() => {
    let row: {}
    let rows: any[] = []
    if (allSymbols && allSymbols.length > 0) {
      ;
      allSymbols.map((word: any, index: number) => {
        //passa por todos os itens do array e monta uma linha para cada simbolo
        if (index > 0) {
          row = { id: index, symbol: word }
          rows.push(row)
        }
      })
      setSymbolsRows(rows)
    }

  }, [allSymbols])


  //colunas da tabala de tokens
  const tokenColumns: GridColDef[] = [
    { field: 'id', headerName: 'Linha', width: 70 },
    { field: 'token', headerName: 'Token', width: 200 },
    { field: 'symbol', headerName: 'Símbolo', width: 130 },
  ];


  //colunas da tabela de invalidos
  const invalidColumns: GridColDef[] = [
    { field: 'id', headerName: 'Linha', width: 70 },
    { field: 'symbol', headerName: 'Simbolo', width: 130 },
  ];


  //colunas da tabela de simbolos
  const symbolsColumns: GridColDef[] = [
    { field: 'id', headerName: 'Identificador', width: 110 },
    { field: 'symbol', headerName: 'Símbolo', width: 100 },
  ];


  //Função que limpa a textarea e esconder as tabelas
  const removeText = () => {
    let allText: any = document.getElementById('text')
    if (allText) {
      setAllText('')
      allText.value = '';
    }
    let file: any = document.getElementById('file')
    if (file) {
      file.value = '';
    }
    setTokenRows([])
    setInvalidRows([])
    setSymbolsRows([])
    setAllValidated([]);
    setAllUnvalidated([]);
    setAllSymbols([]);
  }


  return (
    <div className="App">
      <header className='App-header' style={{ display: 'flex', justifyContent: 'center' }} >
        <h1> Analisador léxico com React</h1>
        <h3> Eduardo Solka e Jader Silva</h3>
      </header>
      <body style={{ backgroundColor: '#FAFAFA' }}>
        <div className="container">
          <h4>Insira seu documento de texto</h4>
          <input style={{ marginBottom: '20px' }} type="file" id="file" accept='text/plain' onChange={(event) => fileReader(event)} />
          <div className="container-textarea">
            <TextField
              onChange={(event) => { handleChange(event) }}
              id="text"
              multiline
              rows={10}
              style={{ width: '500px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              onClick={() => { setShowTable(true); analizerText() }}
              style={{ margin: '20px' }}
              variant="contained">Analisar</Button>
            <Button
              onClick={() => { setShowTable(false); removeText() }}
              style={{ margin: '20px' }}
              variant="contained">Apagar</Button>
          </div>
          {showTable &&
            <div style={{ height: 1000, width: '100%', display: 'flex', justifyContent: 'center' }}>
              {tokenRows && tokenRows.length > 0 &&
                <div style={{ height: 1000, width: '33%', justifyContent: 'center' }}>
                  <span>Tokens de entrada</span>
                  <DataGrid
                    disableColumnMenu
                    disableColumnFilter
                    rows={tokenRows}
                    columns={tokenColumns}
                    pageSize={tokenRows.length}
                  />
                </div>
              }
              {invalidRows && invalidRows.length > 0 &&
                <div style={{ height: 1000, width: '33%', justifyContent: 'center' }}>
                  <span>Erros nas linhas</span>

                  <DataGrid
                    disableColumnMenu
                    disableColumnFilter
                    rows={invalidRows}
                    columns={invalidColumns}
                    pageSize={invalidRows.length}
                  />
                </div>
              }
              {symbolsRows && symbolsRows.length > 0 &&
                <div style={{ height: 1000, width: '33%', justifyContent: 'center' }}>
                  <span>Tabela de símbolos</span>
                  <DataGrid
                    disableColumnMenu
                    disableColumnFilter
                    rows={symbolsRows}
                    columns={symbolsColumns}
                    pageSize={symbolsRows.length}
                  />
                </div>
              }
            </div>
          }
        </div>
      </body>
    </div>
  );
}
export default App;
