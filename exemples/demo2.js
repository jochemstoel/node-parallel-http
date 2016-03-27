var parallelHttp = require('../dist/node-parallel-http.min.js');

function getInfos(numeroCrawler,cb) {
   
   var sites = [{        
         url: 'www.this-page-intentionally-left-blank.org',  
        }];

    var infos = {
        sites:sites,
        numeroCrawler : numeroCrawler
    };

    cb(null, infos);
}

function processPage(page, info, cb) {
    console.log(page);
    cb(null, info);
}
parallelHttp(50,getInfos,processPage,false)
    .then(function(result){
        console.log(result)
    })
    .catch(function(err) {
        console.log("erreur");
        console.log(err);
    })