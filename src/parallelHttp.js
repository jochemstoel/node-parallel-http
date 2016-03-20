var async   = require("async");
var Promise = require("promise");
var http;



function processOnePage(numero, getInfos, processPageData) {

    return new Promise(function (resolve, reject) {
       getInfos(numero)
       .then(Promise.denodeify(function(infos, cbFinall) {
            if(!infos) {
                 reject("no info");
             }else if(!infos.sites){
                reject("no site in info");
            }
            if (infos.sites.length === 0) {
                resolve("Finish");
            } else {
                traiterInfo(infos, getInfos, processPageData, cbFinall);
            }
        }))
       .then(function() {
        processOnePage(numero, getInfos, processPageData).
        then(function(result){
            resolve(result);
        });

    }).catch(function(err){
        console.log("Err: " + err);
        reject("Err: " + err,null);
    });
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