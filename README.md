Node-Parallel-HTTP
==================
Node-Parallel-HTTP is a Javascript for make  **lot of different request simultaneously**. It can use HTTP, HTTPS. It works with socks5 proxy for, exemple, use **TOR NETWORK**.  You can use it for retrieve lot of data on internet. Or for realize some **bruteforce**.

![exemple node parallel http](http://img4.hostingpics.net/pics/34195545t.gif)


![enter image description here](http://img4.hostingpics.net/pics/29390369p.gif)

#It easy to uses !
You can easly customise which website you want to visit and how to process these pages !

#Process

##Getting started
```javascript
var parallelHttp = require('node-parallel-http');

function getInfos(numeroCrawler,cb) {
   
   var sites = [{        
         url: 'www.this-page-intentionally-left-blank.org',        
           path: '/',        
          isValid: function(codeSource) {       
               return (codeSource.indexOf("This Page Intentionally Left Blank") >=0);      
           }     
    }];

    var infos = {
        sites:sites,
        pageIndex: 0,
        numeroCrawler : numeroCrawler
    };

    cb(null, infos);
}

function processPage(page, info, cb) {
    console.log(page); //display page
    cb(null, info);
}
parallelHttp(50,getInfos,processPage,false)
    .then(function(result){
        console.log("finish")
    })
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


