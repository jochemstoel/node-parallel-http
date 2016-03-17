var async = require("async");
var Promise = require("promise");
var http = require("http");


function callbackHttp(response, cb) {
    var str = '';
    response.on('data', function(chunk) {
        str += chunk;
    });

    response.on('end', function() {
        cb(null, str);
    });

}

var getPage = Promise.denodeify(function getPageToPromise(infos, cb) {

    if (typeof infos.pageIndex === 'undefined') {
        infos.pageIndex = 0;
    }
    var options = {
        host: infos.sites[infos.pageIndex].url,
        path: infos.sites[infos.pageIndex].path,
        port: '80',
        socksPort: 9050
    };

    var req = http.request(options, function(response) {
        callbackHttp(response, function(err, page) {
            infos.pageIndex++;
            cb(err, [page, infos]);
        });
    });


    req.on('socket', function(socket) {
        socket.setTimeout(10000);
        socket.on('timeout', function() {
            req.abort();
        });
        socket.setMaxListeners(300);
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        getPageToPromise(infos, cb);

    });

    req.end();
});

function crawlerOnePage(numero, getInfos, traiterPag, cbFinal) {
    getInfos(numero)
        .then(Promise.denodeify(function(infos, cbFinall) {
            if (infos.sites.length === 0) {
                cbFinal(null, "fini");
            } else {
                traiterInfo(infos, getInfos, traiterPag, cbFinall);
            }
        }))
        .then(function() {
            crawlerOnePage(numero, getInfos, traiterPag, cbFinal);

        });
}

function traiterInfo(infos, getInfos, traiterPageP, cbFinal) {


    getPage(infos)
        .then(Promise.denodeify(function(pageAndInfo, cb1) {
            var info = pageAndInfo[1];
            if (!info.sites[info.pageIndex - 1].isValid(pageAndInfo[0])) {
                info.pageIndex--;
                traiterInfo(info, getInfos, traiterPageP, cbFinal);
            } else {
                traiterPageP(pageAndInfo[0], pageAndInfo[1], cb1);
            }
        }))
        .then(function(info, cb2) {
            if (info.pageIndex == info.sites.length) {
                cbFinal(null, null);
            } else {
                traiterInfo(info, getInfos, traiterPageP, cbFinal);
            }
        });
}

function creationListeCrawler(nombreSimulatenee, getInfosFunction, traiterPageFunction) {
    var getInfosPromise = Promise.denodeify(getInfosFunction);
    var traiterPagePromise = Promise.denodeify(traiterPageFunction);

    var ret = [];
    for (var i = 0; i < nombreSimulatenee; i++) {
        ret[ret.length] = function(i) {
            return function(callback) {
                crawlerOnePage(i, getInfosPromise, traiterPagePromise, function(err, texte) {
                    callback(null, i + " " + texte);
                });
            };
        }(i);
    }
    return ret;
}

function lancementCrawler(nombreSimulatenee, getInfosFunction, traiterPageFunction, proxy) {
    if (typeof proxy === 'undefined' || !proxy) {
        http = require("http");
    } else {
        http = require("socks5-http-client");
    }


    var listFunction = creationListeCrawler(nombreSimulatenee, getInfosFunction, traiterPageFunction);

    async.parallel(
        listFunction,
        function(err, results) {
            console.log(results);
        });
}


module.exports = lancementCrawler;