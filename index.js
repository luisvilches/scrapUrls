const express = require("express");
const app = express();
const request = require("request");
const cheerio = require("cheerio");
const multiparty = require("connect-multiparty");
const body = multiparty();
const fs = require("fs");

const urlMain = "http://santander74.cardumendev.cl";
const admin = 's4ntander';
const pass = 'ec0000';
const auth = "Basic " + new Buffer(admin + ":" + pass).toString("base64");

app.get("/",(req,res) => {
    console.log("Iniciando proceso");
    createFile("./urls.txt");
    createFile("./verificadas.txt");
    scrapUrl(urlMain);
})


function scrapUrl(url){
    console.log("Buscando coincidencias en ",url);
    request(url,{headers : { "Authorization" : auth }},(err,response,body) => {
        if(!err && response.statusCode == 200){
            var $ = cheerio.load(body);
            var html = $(this).html();
            verificar(body,url);
            if($("a").length > 1 ){
                $("a").each(function(){
                    var link = $(this).attr("href");
                    if(typeof link != "undefined"){
                        if(link.charAt(0) === "/"){
                            write("./verificadas.txt",urlMain + link + "\n");
                            scrapUrl(urlMain+link);
                        };
                    };
                });
            } else {
                console.log("proceso terminado");
            }
        } else {
            //console.log("url incorrecta");//err
        }
    });
}


function write(file,line){
    fs.appendFile(file, line, err => {
        if(err){
            console.log("Error: ",err);
        } else {
           //console.log("success add url");
        }
    })
}

function createFile(name){
    fs.writeFile(name,"", err => {
        if(err){
            console.log(err);
        } else {
            console.log("Documento "+name+" creado con exito");
        }
    });
}

function verificar(a,url){
    var arr = a.split("\n")
    arr.map((item,index) => {
        if(/KMS/.test(item)){
            write("./urls.txt",item + "=> " + url + "\n");
            console.log(item + "=> " + url + "\n");
        } else if(/KMS/.test(item)){
            write("./urls.txt",item + "=> " + url + "\n");
            console.log(item + "=> " + url + "\n");
        } else if(/kms/.test(item)){
            write("./urls.txt",item + "=> " + url + "\n");
            console.log(item + "=> " + url + "\n");
        } else if(/Kms/.test(item)){
            write("./urls.txt",item + "=> " + url + "\n");
            console.log(item + "=> " + url + "\n");
        } else if(/Kilómetros/.test(item)){
            write("./urls.txt",item + "=> " + url + "\n");
            console.log(item + "=> " + url + "\n");
        } else if(/KILÓMETROS/.test(item)){
            write("./urls.txt",item + "=> " + url + "\n");
            console.log(item + "=> " + url + "\n");
        } else if(/kilómetros/.test(item)){
            write("./urls.txt",item + "=> " + url + "\n");
            console.log(item + "=> " + url + "\n");
        } else {
            console.log("sin coincidencia" + "=> " + url + "\n");
        }
    })
}

app.listen(3000,err => {
    if(err){
        console.log(err);
    } else {
        console.log("server running in port 3000");
    }
});