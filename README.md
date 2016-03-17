Node-Parallel-HTTP
========

Node-Parallel-HTTP is a Javascript for make  **lot of different request** simultaneously. It can use HTTP, HTTPS. It works with socks5 proxy for, exemple, use **TOR NETWORK**.

####Introduction

Some introduction [with link](http://google.fr).



####Getting started

- [Installation]()

####Demos

- [Use TOR Network]()


##Overview

###Installation

#####In node
You will can install synaptic with [npm](https://www.npmjs.com/package/node-parallel-http):

```cmd
npm install npm i node-parallel-http --save
```

#####In the browser
Just include the file synaptic.js from `/dist` directory with a script tag in your HTML:

```html
<script src="node-parallel-http.min.js"></script>
```

###Usage

```javascript
var crawler= require('crawler'); // this line is not needed in the browser
function getInfos(numeroCrawler,cb) {
    var sites = [{
        url: 'www.amazon.fr',
        path: '/',
        isValid: function(codeSource) {
              return (codeSource.indexOf("que vous voyez ci-dessous") <= -1);
        }
    }];
    var infos = {
        sites: sites,
        pageIndex: 0
    };

    cb(null, infos);
}
function traiterPage(page, info, cb) {
	console.log(page);
	cb(null, info);
}
crawler(8,getInfos,traiterPage,true);
```

Now you can start to have parallel request .

###Gulp Tasks

- **gulp**: some things `/dist`.
- **gulp build**: some things `/dist`.
- **gulp min**: some things `/dist`.
- **gulp debug**: some things `/dist`.
- **gulp dev**: some things `/dist`.
- **gulp test**: some things `/dist`.

###Demo

#####demo1

This is how you can create a simple **crawler**:

![perceptron](http://engineering.naukri.com/wp-content/uploads/sites/19/2015/12/spider-web-crawl-featured.jpg).

```javascript
function functionTest()
{
}

```

Now you can ..

```javascript
var things= new things();
```
#####demo2

This is how you can create a simple **crawler**:

![perceptron](http://engineering.naukri.com/wp-content/uploads/sites/19/2015/12/spider-web-crawl-featured.jpg).

```javascript
function function()
{
}

```

Now you can ..

```javascript
var things= new things();
```

##Contribute

**Node-Parallel-HTTP** is an Open Source project that started in Lyon, French. Anybody in the world is welcome to contribute to the development of the project.

If you want to contribute feel free to send PR's, just make sure to run the default **gulp** task before submiting it. This way you'll run all the test specs and build the web distribution files.

<3

