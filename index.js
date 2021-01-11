#!/usr/bin/env node
'use strict';

const fetch = require('node-fetch');
const chalk = require('chalk');
const yargs = require('yargs');
const columnify = require('columnify');

const divider = '--------------------------------------------------------------------------------------------------------------';

const options = yargs
.default('c', 'ASII, BBCA, TLKM, INDF, UNVR' , 'Show top 20 IDX codes')
.usage('Usage: -c <code>')
.option('c', { alias: 'code', describe: 'IDX code (eg: BEN or multiple codes BEN,CBA,ATP)', type: 'string', demandOption: false })
.option('f', { alias: 'format', describe: 'format output (eg: price,change,volume)', type: 'string', demandOption: false })
.argv;

let code = `${options.code}`.split(',');

let codes = [], size = 10;

let format = `${options.format}`;
while (code.length > 0) {
  codes.push(code.splice(0, size));
}

let results = [];

console.clear();

function getData(idxCodes, $raw) {
  return new Promise((resolve, reject) => {
 
    idxCodes = idxCodes.trim();
    const response = fetch(`https://www.idx.co.id/umbraco/Surface/Home/GetStockInfo?code=${idxCodes}`)
    .then(response => response.text())
    .then(body => {
   
      var data = JSON.parse(body);
      var change = data['Change'] >= 0 ? false: true ;
    
      if($raw==false){
        results.push({
              code: chalk.bgHex('#333').hex('#fff').bold(idxCodes),
              price: chalk.hex('#fff')(data['Price']),
              '$+/-': change  ? chalk.hex('#e88388').bold(data['Change']) : chalk.hex('#a8cc8b').bold(data['Change']),
              '% chg': change  ? chalk.hex('#e88388').bold(data['Percent']) : chalk.hex('#a8cc8b').bold(data['Percent']),            
              value: chalk.hex('#fff')(data['Value']),
              frequency: chalk.hex('#fff')(data['Frequency']),
              volume: chalk.hex('#fff')(data['Volume'])
        });
      }else{
        results.push({
              code: idxCodes,
              price: data['Price'],
              '$+/-':data['Change'] ,
              '% chg': data['Percent'],            
              value: data['Value'],
              frequency: data['Frequency'] ,
              volume: data['Volume'] 
        });
      }
  
      resolve(results);
    })
  })
}



const getAllData = async () => {
  return Promise.all(codes[0].map(codes => {
    const idxCodes = codes.toString().replace(/,/g, '+');
    
    if (format == "undefined"){
      return getData(idxCodes, false);
    }else{
      return getData(idxCodes, true);
    }
  }))
}

getAllData().then((val) => {
  const tableOptions = {
    truncate: true,
    config: {
      code: { minWidth: 10 },
      last: { minWidth: 10 },
      '$+/-': { minWidth: 10 },
      '% chg': { minWidth: 10 },    
      value: { minWidth: 10 },
      frequency: { minWidth: 10 },
      volume: { minWidth: 10 }      
    }
  }
  const columns = columnify(results, tableOptions);
  if (format == "undefined"){
    if (results.length) {
      console.log(chalk.hex('#fff').bold(`\n$$$ IDX Ticker $$$`));
      console.log(columns);
      console.log(divider);
      console.log(`${divider}\n* prices are delayed up to 20 minutes\n`);
    }
  }else{
    if (results.length){
      if(format == 'price'){
        results.forEach(function(result, index){
          if (result.price  != 'undefined'){
            console.log(result.price);
          }
        });
      }
    }
  }
});
