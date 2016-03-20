var async   = require("async");
var Promise = require("promise");
var http;



function processOnePage(numero, getInfos, processPageData, cbFinal) {

    getInfos(numero)
    .then(Promise.denodeify(function(infos, cbFinall) {
        if(!infos) {
            throw new Error("no info");
        }else if(!infos.sites){
           throw new Error("no site in info")
       }
       if (infos.sites.length === 0) {
        cbFinal(null, "Finish");
    } else {
        traiterInfo(infos, getInfos, processPageData, cbFinall);
    }
}))
    .then(function() {
        processOnePage(numero, getInfos, processPageData, cbFinal);

    }).catch(function(err){
        console.log("Err: " + err);
        cbFinal("Err: " + err,null);
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

function createListParallelCurl(simultaneousCurl, getInfosFunction, processPageFunction) {
    var getInfosPromise    = Promise.denodeify(getInfosFunction);
    var processPagePromise = Promise.denodeify(processPageFunction);

    var listParellelCurl = [];
    for (var curlIndex = 0 ; curlIndex < simultaneousCurl ; curlIndex++) {
        listParellelCurl[listParellelCurl.length] = function(curlIndex) {
            return function(callback) {
                processOnePage(curlIndex, getInfosPromise, processPagePromise, function(err, texte) {
                    callback(null, {index:curlIndex,content:texte});
                });
            };
        }(curlIndex);
    }
    return listParellelCurl;
}

function start(simultaneousCurl, getInfosFunction, processPageFunction, isProxy,cb) {
    return new Promise(function (resolve, reject) {
        //todo
        http  = selectHttpEngine(isProxy);

        var curlsFunction = createListParallelCurl(simultaneousCurl, getInfosFunction, processPageFunction);  

        launchEachCurlParallel(curlsFunction)
        .then(function(resultat){
            resolve(resultat);
        })
        .catch(function(err){
            reject(err);
        });
    });

}

function launchEachCurlParallel(curlsFunction){
    return new Promise(function (resolve, reject) {
        asyncParallel =  Promise.denodeify(async.parallel);
        asyncParallel(curlsFunction)
        .then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });    
}

function selectHttpEngine(isProxy) {
    //TODO HTTPS
    if (typeof isProxy === 'undefined' || !isProxy) {
        return require("http");
    } else {
        return require("socks5-http-client");
    }
}


module.exports = start;

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