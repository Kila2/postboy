import QYCode from './qy';
import SVNClient from 'svn-spawn';
import schedule from 'node-schedule';
import XLSX from 'js-xlsx';
import MongoClient from 'mongodb';
import assert from 'assert';

import {exec} from "child_process";

const url = 'mongodb://localhost:27017';
const dbName = 'mockserverdb';

let db = null;

MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log('child Connected successfully to server');

    db = client.db(dbName);
    let contractFile = new ContractFile();
    contractFile.getContractFile(function () {
        contractFile.read();
    });
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
        schedule.scheduleJob('00 08 * * * *', function () {
            that.read();
        });
        schedule.scheduleJob('30 12 * * * *', function () {
            that.read();
        });
    }
    getContractFile(callback) {
        let that = this
        this.client.cmd(['checkout', '--depth=empty', this.url, '.'], function (rc) {
            that.updateContractFile(callback);
        });

    }
    updateContractFile(callback) {
        let that = this;
        this.client.cmd('cleanup', function (r) {
          exec("cd svn && LC_CTYPE=\"zh_CN.UTF-8\" svn update " + that.fileName,function (r) {
            callback();
          });
        });
    }
    read() {
        let workbook = undefined;
        try{
          workbook = XLSX.readFile(process.cwd() + '/svn/IF_支付_服务接口.xlsx');
        }
        catch(e){
            return
        }
        let qyCode = new QYCode(workbook);
        for (let i = 0; i < workbook.SheetNames.length; i++) {
            let servicecode = workbook.SheetNames[i].replace(/[^0-9]/ig, "");
            console.log(servicecode);
            if (servicecode !== "") {
                //let worksheet = workbook.Sheets[workbook.SheetNames[i]];
                try {
                    let res = qyCode.getResModel(workbook.SheetNames[i]);
                    let req = qyCode.getReqModel(workbook.SheetNames[i]);
                    let model = {
                        "servicecode": servicecode,
                        "request": req,
                        "response": res,
                        "requestname": qyCode.req.name,
                        "responsename": qyCode.res.name
                    };
                    db.collection('service').findOneAndUpdate({ "servicecode": servicecode },{$set:model},function(err,rc){
                        if(rc.lastErrorObject.updatedExisting === false){
                            db.collection('service').insert(model)
                        }
                    })
                }
                catch (e) {
                    if (e.code === 101) {
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