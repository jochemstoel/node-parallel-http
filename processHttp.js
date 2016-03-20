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
            } else {
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
        //todo limit
        getPageToPromise(infos, cb);

    });

    req.end();
});