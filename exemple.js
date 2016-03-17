var crawler = require('./index.js');


var nbPageParcouru = 0;

function getInfos(numeroCrawler,cb) {
    var sites = [{
        url: 'www.amazon.fr',
        path: '/gp/aw/search/ref=sr_adv_d/?__mk_fr_FR=%C5M%C5Z%D5%D1&search-alias=stripbooks&sort=relevancerank&page=1&low-price=2&high-price=2',
        isValid: function(codeSource) {
              return (codeSource.indexOf("que vous voyez ci-dessous") <= -1);
        }
    }];

    if (nbPageParcouru >= 100000) {
        sites = [];
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
    var actuel = new Date().getTime() - begin;
    actuel /= 1000;
    console.log(nbPageParcouru / actuel);
    console.log(nbPageParcouru);
    cb(null, info);
}
crawler(8,getInfos,traiterPage,true);
