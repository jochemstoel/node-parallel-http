var parallelHttp = require('../dist/node-parallel-http.min.js');

var nbPageParcouru = 0;
var dateDepart = Date.now();
function getInfos(numeroCrawler,cb) {
    var sites = [{
        url: 'www.this-page-intentionally-left-blank.org',
        path: '/',
        isValid: function(codeSource) {
              return (codeSource.indexOf("This Page Intentionally Left Blank") >=0);
        }
    }];

    if(nbPageParcouru>200) {
        sites = [] ;
    }

    var infos = {
        sites: sites,
        pageIndex: 0,
        numeroCrawler : numeroCrawler
    };

    cb(null, infos);
}

var begin = new Date().getTime();


function traiterPage(page, info, cb) {
    nbPageParcouru++;
    if(nbPageParcouru%100 ==0){
        var time = Date.now()-dateDepart;
        console.log(Math.round((nbPageParcouru/time)*1000)+" req / s");
    }
    cb(null, info);
}
parallelHttp(50,getInfos,traiterPage,false)
    .then(function(result){
        console.log(result)
    })