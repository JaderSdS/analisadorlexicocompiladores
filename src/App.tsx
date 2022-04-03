import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, ButtonGroup, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from '@mui/x-data-grid';
import './validacoes/commentary';
import './validacoes/number';
import './validacoes/reservedWord';
import './validacoes/variable';
import Commentary from './validacoes/commentary';
import Variables from './validacoes/variable';
import ReservedWord from './validacoes/reservedWord';
import Numbers from './validacoes/number';
import { setTokenSourceMapRange } from 'typescript';

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


  const fileReader = (event: any) => {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = function () {
      const allReadText = reader.result;
      let allText: any = document.getElementById('text')
      debugger
      if (allText) {
        setAllText(allText)
        allText.value = allReadText ? allReadText : '';
      }
    };
    reader.readAsText(input.files[0]);
  }

  const handleChange = (event: any) => {
    const input = event.target;
    debugger
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
      if (!!validatedArray && (validatedArray[index].symbol == word)) {
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
    debugger
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
    setAllValidated(allValidated)
    setAllUnvalidated(allUnvalidated)
    setAllSymbols(allSymbols)
  }

  //monta os dados para a tabala de tokens
  useEffect(() => {
    let row: {}
    let rows: any[] = []
    if (allValidated && allValidated.length > 0) {
      allValidated.map((word: any, index: number) => {
        row = { id: word.line, token: word.token, symbol: word.symbol }
        if (index > 0)
          rows.push(row)
      })
      setTokenRows(rows)
    }
  }, [allValidated])

  //monta os dados para a tabala de invalidos
  useEffect(() => {
    // //linhas da tabala de invalidos
    // const invalidRows: GridRowsProp = [
    //   { id: 1, symbol: 'simboloInvalido1', error: 'erro1' },
    //   { id: 2, symbol: 'simboloInvalido2', error: 'erro2' },
    //   { id: 3, symbol: 'simboloInvalido3', error: 'erro3' },
    // ];
    let row: {}
    let rows: any[] = []
    if (allUnvalidated && allUnvalidated.length > 0) {
      debugger;
      allUnvalidated.map((word: any, index: number) => {
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
    // //linhas da tabala de simbolos
    // const symbolsRows: GridRowsProp = [
    //   { id: 1, symbol: 'simbolo1' },
    //   { id: 2, symbol: 'simbolo2' },
    //   { id: 3, symbol: 'simbolo3' },
    // ];
    let row: {}
    let rows: any[] = []
    if (allSymbols && allSymbols.length > 0) {
      debugger;
      allSymbols.map((word: any, index: number) => {
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
    debugger;
    console.log('todas validas->', allValidated)
    console.log('todas ivvalidas->', allUnvalidated)
    console.log('todas simbols->', allSymbols)
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
        <h1>Nosso analisador léxico em React</h1>
        <img width="50" src={logo} className="App-logo" alt="logo" />
      </header>
      <body style={{ backgroundColor: '#FaFaFa' }}>
        <div className="container">
          <h4>Insira seu documento de texto</h4>
          <input style={{ marginBottom: '20px' }} type="file" id="file" accept='text/plain' onChange={(event) => fileReader(event)} />
          <div className="container-textarea">
            <TextField
            onChange={(event) =>{handleChange(event)}}
              id="text"
              multiline
              rows={10}
              style={{ width: '500px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              onClick={() => { analizerText() }}
              style={{ margin: '20px' }}
              variant="contained">Analisar</Button>
            <Button
              onClick={() => { removeText() }}
              style={{ margin: '20px' }}
              variant="contained">Apagar</Button>
          </div>
          {tokenRows && tokenRows.length > 0 && invalidRows && invalidRows.length > 0 && symbolsRows && symbolsRows.length > 0 &&
            <div style={{ height: 1000, width: '100%', display: 'flex', justifyContent: 'center' }}>
              {tokenRows && tokenRows.length > 0 &&
                <div style={{ height: 1000, width: '33%', justifyContent: 'center' }}>
                  <span>Tokens de entrada</span>
                  <DataGrid
                    disableColumnMenu
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
