Node-Parallel-HTTP [![Build Status](https://api.travis-ci.org/lucasBertola/node-parallel-http.svg?branch=master)](https://travis-ci.org/lucasBertola/node-parallel-http)
==================
Node-Parallel-HTTP is a JavaScript lib for make  **lot of different request simultaneously**. It can use HTTP, HTTPS. It works with socks5 proxy for, example, use **TOR NETWORK**.  You can use it for retrieving lots of data on the internet. Or for realizes some **bruteforce**.

![](http://zupimages.net/up/16/12/xb0a.gif)


![](http://zupimages.net/up/16/12/u3qv.gif)

#It's easy to use !
You can easily customize which website you want to visit and how to process these pages !

#Process

##Getting started
```javascript
var parallelHttp = require('node-parallel-http');

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
    });
```


##Installation

You will can install **node-parallel-http** with [npm](https://www.npmjs.com/package/node-parallel-http):

```cmd
npm install node-parallel-http --save
```

Now you can start to have parallel request .

###Gulp Tasks

- **gulp**:  runs all the tests and builds the minified and unminified bundles into `/dist`.
- **gulp build**:  builds the bundle.
- **gulp build**:  builds the bundle.

###Demo

####Simple exemple

This is a simple exemple

####Simple bruteForce

This is a simple bruteForce

####Simple use of TorNetwork

This is a simple use of TorNework


##Contribute

**Node-Parallel-HTTP** is an Open Source project that started in Lyon, French. Anybody in the world is welcome to contribute to the development of the project.

If you want to contribute feel free to send PR's, just make sure to run the default **gulp** task before submiting it. This way you'll run all the test specs and build the web distribution files.

<3


