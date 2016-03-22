var async = require("async");
var Promise = require("promise");
var http;


function checkInfos(infos) {
    return new Promise(function(resolve, reject) {
        if (!infos) {
            reject("Function getInfos need to return infos");
        }

        if (!infos.sites) {
            infos.sites = [];
        }
        resolve(infos);
    });
}

function processAllPages(numero, getInfos, processPageData) {

    return new Promise(function(resolve, reject) {

        if (!getInfos) {
            reject("processAllPages : missing getInfos");
            return;
        }
        getInfos(numero)
            .then(checkInfos)
            .then(function(infos) {

                if (infos.sites.length === 0) {
                    resolve("Finish");

                } else {

                    getPages(infos, getInfos, processPageData)
                        .then(function() {
                            return processAllPages(numero, getInfos, processPageData);
                        })
                        .then(function(result) {
                            resolve(result);
                        })
                        .catch(function(err) {
                            reject(err);
                        })
                }
            }).catch(function(err) {
                reject(err);
            });
    });

}


function getPages(infos, getInfos, processPageData) {
    return new Promise(function(resolve, reject) {
        getPage(infos)
            .then(function(pageAndInfo) {
                var page = pageAndInfo[0];
                var info = pageAndInfo[1];
                return processPageData(page, info);
            })
            .then(function(info) {
                if (info.pageIndex == info.sites.length) {
                    resolve(null, null);
                } else {
                    getPages(info, getInfos, processPageData)
                        .then(function(result) {
                            resolve(null, result);
                        });
                }
            });
    });

}

function createListParallelCurl(simultaneousCurl, getInfosFunction, processPageFunction) {
    var getInfosPromise = Promise.denodeify(getInfosFunction);
    var processPagePromise = Promise.denodeify(processPageFunction);

    var listParellelCurl = [];
    for (var curlIndex = 0; curlIndex < simultaneousCurl; curlIndex++) {
        listParellelCurl[listParellelCurl.length] = function(curlIndex) {
            return function(callback) {
                processAllPages(curlIndex, getInfosPromise, processPagePromise)
                    .then(function(result) {
                        callback(null, {
                            index: curlIndex,
                            content: result
                        });
                    })
                    .catch(function(err) {
                        callback(err, null);
                    });

            };

        }(curlIndex);
    }
    return listParellelCurl;
}

function start(simultaneousCurl, getInfosFunction, processPageFunction, isProxy, cb) {
    return new Promise(function(resolve, reject) {
        //todo
        http = selectHttpEngine(isProxy);

        var curlsFunction = createListParallelCurl(simultaneousCurl, getInfosFunction, processPageFunction);

        launchEachCurlParallel(curlsFunction)
            .then(function(resultat) {
                resolve(resultat);
            })
            .catch(function(err) {
                reject(err);
            });
    });

}

function launchEachCurlParallel(curlsFunction) {
    return new Promise(function(resolve, reject) {
        asyncParallel = Promise.denodeify(async.parallel);
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