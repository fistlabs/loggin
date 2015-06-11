loggin [![Build Status](https://travis-ci.org/fistlabs/loggin.svg?branch=master)](https://travis-ci.org/fistlabs/loggin)
=========

Flexible and tiny logging system for [nodejs](https://nodejs.org) platform

![Easiest usage example](/stuff/i/easiest-usage.png)

##Features
* Pretty default settings
* Context logging
* Easy messages templating (sprintf)
* Incremental configuration

##Installation

```
$ npm install loggin
```

##Easiest usage
```js
var logging = require('loggin');

logging.log('Hello, World!');
```

##Philosophy

The idea is to create lightweight logging system, with low understanding threshold, but with high customization level.
Every data you log turns to ```record``` object, then that will be formatted with ```layout``` and then will be handled by ```handler```. 

Handler is an object that have a behaviour to store data somewhere. It can be just stdout or file, even database.
The function of ```handler``` - just store log messages. Handler storing place can require some data type or format, therefore handler have ```layout```.

Layout is an object that takes some structure, describing the log message and turns it to ```handler``` required format. Also ```layout``` can manage just message representation. The same types of handlers can have different layouts. Totally, ```layout``` is a micro templating system. Layout template can require some data format. Because of that ```layout``` have own ```record``` factory.

Record factory is special object that takes incoming data like caller, arguments passed to caller, log level, logging context, etc. that constructs a log message model for ```layout```.

##Context appending

Sometimes log messages need to be bound to some execution context. E.g. request id.

```js
console.log('%s - %s', request.id, 'Some happened');
```

You should add request id to your any log message to then find some information about this request later.
With loggin you should not. You can create a logger that context is bound to request id.
```js
var rootLogger = logging.getLogger();

***

//  bind request context
var logger = rootLogger.bind(request.id);

logger.log('The data, bound to request id');
```

Your record factory has access to logging context, and layout can represent it in messages. Logger instances is lightweight, and you can create context loggers as mush as you want.

##API
###```logging```

####```Logging logging.getLogger([name="default"])```
Creates a new root logger

```js
var logger = logging.getLogger();
```

```logging``` will memorize ```getLogger``` calls by ```name``` argument.

```js
assert.strictEqual(logging.getLogger('foo'), logging.getLogger('foo'));
```

It would also be useful to know that ```loggin``` package exporting object is an instance of ```Logging``` with name ```"default"```. It is default root logger.
```js
var logging = require('loggin');

assert.strictEqual(logging, logging.getLogger());   // done
```

####```String logging.logLevel```
Sets logging level

Available log levels:
* ```INTERNAL``` use it for logging calls and other internal stuff
* ```DEBUG``` recommended to use it for debugging applications
* ```NOTE```  development verbose information (default)
* ```INFO``` minor information
* ```LOG``` significant messages
* ```WARNING``` really important stuff
* ```ERROR``` application business logic error condition
* ```FATAL``` system error condition

```js
logging.logLevel = 'LOG'; // production case
```

Set any unknown level to disable any records

###```Logger```
logger is an object returned from ```logging.getLogger()```

####```logger.log(String message[, * arg...])```
Logs a message

```js
logger.log('Hello %s', 'world');
```
```internal```, ```debug```, ```note```, ```info```, ```warn```, ```error```, ```fatal``` methods also available

####```logger.bind(String context)```
Creates new context lightweight logger

```js
var rootLogger = logging.getLogger('<e.g. application name>');
var contextLogger = rootLogger.bind('<some context>');
```

####```logger.setup(Object some)```
Setups logger to ```<some>``` object
```js
logger.setup(console);
console.log('Start initialization');
```

##Advanced customization

The true way to customize your logging is using ```logging.conf```

####```logging.conf(configs)```
Incrementaly confugures logging
```js
logging.conf({
    logLevel: 'WARNING'
});
```

This call adds a ```logLevel``` to the existing configuration.

###How to create my own log handler?

Handler class is an object that must implement ```handler.handle``` method and ```layout``` property that should be a ```layout```. ```handler.handle``` will be called with value, returned from handler's ```layout```.

Create your own handler or use bundled ```StreamHandler``` handler.

```js
//  Using stream-handler
logging.conf({
    handlers: {
        // handler instance or descriptor
        console: {
            //  path to handler class or direct link to class
            Class: 'loggin/core/handlers/stream-handler',
            //  Link to handler's layout, layout instance will be passed to handler constructor as first argument
            layout: 'colorVerbose',
            //  handlers keyword arguments, will be passed to handler constructor as second argument
            kwargs: {
                stream: process.stdout,
            }
        }
    }
});
```

###How to create my own layout?

Layout class must implement ```layout.format``` method and ```record``` property. ```layout.format``` will be called before record handled.

```record``` property should be an object that implements ```create``` method, that will be called before ```layout.format``` called.

```record.create``` will be called with positional arguments:
 1. ```String context``` - logger context
 2. ```String level``` - record log level
 3. ```Function caller``` - function, that was called in program to make lo entry, e.g. ```logger.log```.
 4. ```Arguments args``` - the arguments passed to ```caller``` 

```record.create``` should return an object which will be passed to ```layout.format```.

Create your own layout class, or configure bundled classes.

```js
//  Using builtin layout class
logging.conf({
    layouts: {
        // layout instance or configuration
        spec: {
            //  Path to layout class or direct link to constructor
            Class: 'loggin/core/layouts/layout',
            //  Link to config.records.regular, should be passed in Layout constructor as first argument
            record: 'regular',
            //  layout-specific arguments, will be passed to Layout constructor as second argument
            kwargs: {
                template: '%(date)s %(level)s %(message)s\n'
                dateFormat: '%H:%M:%S'
            }
        }
    }
});
```

```layout.format``` should return any data for its handler.

###Record factories

There are some built-in Record classes

* ```loggin/core/records/regular``` - produces ```date```, ```context```, ```message``` and ```level``` variables.
* ```loggin/core/records/verbose``` - inherits from ```regular```. Also produces ```module```, ```filename```, ```line``` and ```column``` variables.

You can create your own record class and specify it in config.
```js
logging.conf({
    records: {
        //  record descriptor or instance
        recordName: {
            // path to record class or direct link to class
            Class: 'path/to/class',
            //  this object will be passed to record constructor
            kwargs: {}
        }
    }
});
```

###Ok, how to use MY handler???

You can enable one or more handlers:

```js
logging.conf({
    enabled: ['console'/**, more */]
});
```

###Handler log levels
You can support ```handler.minLevel``` and ```handler.maxLevel``` properties in your handlers which can be used to enable your handlers in some record level ranges

```js
logging.conf({
    enabled: ['foo', 'bar']
    handlers: {
        foo: {
            Class: 'loggin/core/handlers/stream-handler',
            layout: 'colorRegular',
            kwargs: {
                maxLevel: 'LOG',
                stream: process.stdout
            }
        },
        bar: {
            Class: 'loggin/core/handlers/stream-handler',
            layout: 'colorVerbose',
            kwargs: {
                minLevel: 'WARNING',
                stream: process.stderr
            }
        }
    }
});
```

Configuration like this let you to write ```LOG``` and less records to stdout and ```WARNING``` and higher records to stderr.

##Default configuration
```loggin``` gives you rich and pretty default configuration. There are some handlers, layouts and two record instances.

###Records
* ```regular``` - regular record provides fields:
  * ```String context``` - logger context
  * ```String level``` - record log level
  * ```Date date``` - record creation date
  * ```Array message``` - all the arguments passed to log function

* ```verbose``` - more rich record than ```regular``` provides the fields:
  * ```String context``` - logger context
  * ```String level``` - record log level
  * ```Date date``` - record creation date
  * ```Array message``` - all the arguments passed to log function
  * ```Number line``` - log calling line number
  * ```Number column``` - log calling column number
  * ```String filename``` - log caller absolute filename
  * ```String module``` - log caller filename relative from main module dirname

###Layouts
* ```cleanRegular``` - the layout, ideal for logging regular messages into file
* ```cleanVerbose``` - may be pretty to log warnings and errors into file, including caller data
* ```colorRegular``` - ideal for logging regular messages to terminal
* ```colorVerbose``` - good for logging errors and warnings to terminal, including caller data

###Handlers
* ```stdoutColorRegular``` - writes colored compact entries which level less then ```WARNING``` to standard output (dev)
* ```stderrColorRegular``` - writes colored compact entries which level is ```WARNING``` to standard error output (dev)
* ```stderrColorVerbose``` - writes colored verbose entries which level higher then ```LOG``` to standard error output (dev)
* ```stdoutCleanRegular``` - writes all the entries to standard output in pretty compact layout (prod)
* ```stderrCleanRegular``` - writes `WARNING` entries to standard error output in pretty compact layout (prod)
* ```stderrCleanVerbose``` - writes ```WARNING``` and higher entries to standard error output in super verbose layout (prod)

###Default setup
By default ```stdoutColorRegular``` and ```stderrColorVerbose``` handlers are enabled and ```NOTE``` log level is enabled.
In this case you can see really important data in pretty form in your terminal output. It is development setup. In production case you can set higher ```logLevel``` and enable ```stdoutCleanRegular``` and ```stderrCleanVerbose``` handlers to see clean logs in the files, written by you application starting daemon for example.
```js
var loggin = require('loggin');

if (process.env.NODE_ENV !== 'development') {
    loggin.conf({
        logLevel: 'LOG',
        enabled: ['stdoutCleanRegular', 'stdoutCleanVerbose']
    });
}
```

##Complete configuration example
See loggin's [default configuration](/configs.js) as example

---------
LICENSE [MIT](LICENSE)
