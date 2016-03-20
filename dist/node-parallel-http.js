var async   = require("async");
var Promise = require("promise");
var http;


function checkInfos(infos) {
    return new Promise(function (resolve, reject) {
        if(!infos) {
         reject("no info");
     }else if(!infos.sites){
        reject("no site in info");
    }
    resolve(infos);
});
}

function processOnePage(numero, getInfos, processPageData) {

    return new Promise(function (resolve, reject) {
       getInfos(numero)
       .then(checkInfos)
       .then(function(infos) {
        if (infos.sites.length === 0) {
            resolve("Finish");
        } else {
            traiterInfo(infos, getInfos, processPageData)
            .then(function() {
                return processOnePage(numero, getInfos, processPageData);
            })
            .then(function(result){
                resolve(result);
            })
        }
    }).catch(function(err){
        console.log("Err: " + err);
        reject("Err: " + err,null);
    });
});

}


function traiterInfo(infos, getInfos, traiterPageP) {
    return new Promise(function (resolve, reject) {
        getPage(infos)
        .then(function(pageAndInfo) {
            return traiterPageP(pageAndInfo[0], pageAndInfo[1]);
        })
        .then(function(info) {
            if (info.pageIndex == info.sites.length) {
                resolve(null, null);
            } else {
                traiterInfo(info, getInfos, traiterPageP)
                .then(function(result){
                    resolve(null,result);
                });
            }
        });
    });
    
}

function createListParallelCurl(simultaneousCurl, getInfosFunction, processPageFunction) {
    var getInfosPromise    = Promise.denodeify(getInfosFunction);
    var processPagePromise = Promise.denodeify(processPageFunction);

    var listParellelCurl = [];
    for (var curlIndex = 0 ; curlIndex < simultaneousCurl ; curlIndex++) {
        listParellelCurl[listParellelCurl.length] = function(curlIndex) {
            return function(callback) {
                processOnePage(curlIndex, getInfosPromise, processPagePromise)
                .then(function(result){
                 callback(null, {index:curlIndex,content:result});
             })
                .catch(function(err){
                    callback(err,null); 
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

function launchEachCurlParallel(curlsFunction) {
    return new Promise(function (resolve, reject) {
        asyncParallel =  Promise.denodeify(async.parallel);
        asyncParallel(curlsFunction)
        .then(function(result) {
            resolve(result);
        }).catch(function(err) {
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
            if (!infos.sites[infos.pageIndex - 1].isValid(page)) {
                infos.pageIndex--;
                getPage(infos, cb);
            }else{
                cb(err, [page, infos]);
            }
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