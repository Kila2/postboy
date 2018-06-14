import QYCode from './qy';
import SVNClient from 'svn-spawn';
import schedule from 'node-schedule';
import XLSX from 'js-xlsx';
import { MongoClient } from 'mongodb';
import { equal } from 'assert';
import {QYDecode,QYDecodeError} from './qy';

const url = 'mongodb://localhost:27017';
const dbName = 'mockserverdb';

let db = null;

MongoClient.connect(url, (err, client) => {
  equal(null, err);
  console.log('child Connected successfully to server');

  db = client.db(dbName);
  let contractFile = new ContractFile();
  contractFile.getContractFile(function (){
      console.log('read start');
      contractFile.read();
  });
});

process.on('message', function (m) {
    process.send({ message: process.pid + 'You love me' });
});

class ContractFile {
    constructor() {
        this.fileName = 'IF_支付_服务接口.xlsx';
        this.url = 'http://lijunliang@svn.dev.sh.ctripcorp.com/svn/svn_db/iFinance/System%20Design';
        this.client = new SVNClient({
            cwd: './svn',
            username: 'lijunliang',
            password: 'Ai2770147175',
            noAuthCache: true,
        });
        let that = this;
        schedule.scheduleJob('* 5/* * * * *', function () {
            //that.read();
        });
    }
    getContractFile(callback) {
        let that = this
        console.log('start checkout')
        this.client.cmd(['checkout','--depth=empty',this.url,'.'],function(){
            console.log('start update')
            that.updateContractFile(callback);
        });
        
    }
    updateContractFile(callback) {
        let that = this;
        console.log('start cleanup');
        this.client.cmd('cleanup',function(r){
            console.log('end cleanup' + r);
            that.client.update([that.fileName],function(){
                callback();    
            });
        });
    }
    read() {
        let workbook = XLSX.readFile(process.cwd() + '/svn/IF_支付_服务接口.xlsx');
        let qyCode = new QYCode(workbook);
        for (let i = 0; i < workbook.SheetNames.length; i++) {
            let servicecode = workbook.SheetNames[i].replace(/[^0-9]/ig, "");
            console.log(servicecode);
            if (servicecode !== "") {
                //let worksheet = workbook.Sheets[workbook.SheetNames[i]];
                try {
                    let res = qyCode.getResModel(workbook.SheetNames[i]);
                    db.collection('response').insert(res);
                    let req = qyCode.getReqModel(workbook.SheetNames[i]);
                    db.collection('request').insert(req);
                }
                catch (e) {
                    if(e.code === 101){
                        console.log(e.message)
                    }
                    else {
                        throw e;
                    }
                }
            }
        }
    }
}