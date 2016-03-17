var crawler = require('../dist/node-parallel-http.min.js');

function getInfos(numeroCrawler,cb) {
    var sites = [{
        url: 'http://www.this-page-intentionally-left-blank.org',
        path: '/',
        isValid: function(codeSource) {
              return (codeSource.indexOf("que vous voyez ci-dessous") <= -1);
        }
    }];

    var infos = {
        sites: sites,
        pageIndex: 0,
        numeroCrawler : numeroCrawler
    };

    cb(null, infos);
}

var begin = new Date().getTime();


function traiterPage(page, info, cb) {
    console.log(page);
    cb(null, info);
}
crawler(8,getInfos,traiterPage,true);
