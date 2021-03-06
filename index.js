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

function compararUrls(line){
    fs.readFile("./urls.txt",'utf-8',(err,result) => {
        if(err){
            console.log(err);
        } else {
            var data = result.split("\n");
            if(data.indexOf(line) >= 0){
                console.log("linea duplicada");
            } else {
                write("./urls.txt", line);
                console.log( line);
            }
        }
    })
}

function verificar(a,url){
    var arr = a.split("\n")
    arr.map((item,index) => {

        var line =  url + " => " + item;

        if(/KMS/.test(item)){
            compararUrls(line)
        } else if(/KMS/.test(item)){
            compararUrls(line)
        } else if(/kms/.test(item)){
            compararUrls(line)
        } else if(/Kms/.test(item)){
            compararUrls(line)
        } else if(/Kilómetro/.test(item)){
            compararUrls(line)
        } else if(/KILÓMETRO/.test(item)){
            compararUrls(line)
        } else if(/kilómetro/.test(item)){
            compararUrls(line)
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