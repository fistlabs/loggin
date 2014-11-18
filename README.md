loggin [![Build Status](https://travis-ci.org/fistlabs/loggin.png?branch=master)](https://travis-ci.org/fistlabs/loggin)
=========

Flexible and tiny logging system

##Features
* Pretty default settings
* Context logging
* Easy messages templating (sprintf)
* Incremental configuration

##Easiest usage
```js
var logging = require('loggin');
logging.log('Hello world!');
```
![Easiest usage example](/stuff/i/easiest-usage.png)

##API
###```logging```

####```Logger logging.getLogger()```
Creates a new logger

```js
var logger = logging.getLogger();
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

Set any unknown level to disable any records

```js
logging.logLevel = 'LOG'; // production case
```

###```Logger```
logger is an object returned from ```logging.getLogger()```

####```logger.log(String message[, * arg...])```
Logs message

```js
logger.log('Hello %s', 'world');
```
```internal```, ```debug```, ```note```, ```info```, ```warn```, ```error```, ```fatal``` methods also available

####```logger.bind(String context)```
Creates new context logger
```js
var logger = logging.getLogger();
var contextLogger = logger.bind(request.id);
contextLogger.log('Incoming request!');
```

![Context logger example](/stuff/i/context-logger.png)

####```logger.setup(Object some)```
Setups logger to ```<some>```> object
```js
logger.setup(console);
console.internal('Start initialization');
```

##Customization

###How to create my own layout?

Create your own layout class, or configure bundled classes.

```js
//  Using builtin layout class
logging.conf({
    layouts: {
        // layout instance or configuration
        spec: {
            //  Path to layout class or direct link to constructor
            Class: 'loggin/core/layout/layout',
            //  layout-specific params
            params: {
                template: '%(date)s %(level)s %(message)s\n'
                dateFormat: '%H:%M:%S'
            }
        }
    }
});
```

Layout class must implement ```layout.format``` method that will be called by handler with ```vars``` object containing record variables.

#####Available record variables:
* ```date``` - record creation date
* ```name``` - logger name
* ```process``` - process id
* ```message``` - log message
* ```level``` - log level name

```layout.format``` should return any data for its handler. In case of builtin [```Layout```](/core/layout/layout) it is String.

###How to enable my layout?
Layout will be called by each logging handler at each record hapenned. You should create your own handler configuration.

layout instance will be passed to Handler constructor in ```params.layout``` object.

Create your own handler or use bundled handler.

Handler class must implement ```handler.handle``` method that will be called with object of record variables. Handler should call layout and process complete message. In case of [```StreamHandler```](/core/handler/stream-handler.js) it is writing to any specified stream. 

```js
//  Using stream-handler
logging.conf({
    handlers: {
        console: {
            Class: 'loggin/core/handler/stream-handler',
            params: {
                stream: process.stdout,
                //  name of configured layout
                layout: 'spec'
            }
        }
    }
});
```

###Ok, how to enable my handler???

```js
logging.conf({
    enabled: ['console']
});
```

###Handler log levels
You can support ```handler.level``` property which can be used to handle the only records which level higher or equal to ```handler.level```

```js
logging.conf({
    enabled: ['foo', 'bar']
    handlers: {
        foo: {
            Class: 'loggin/core/stream-handler',
            params: {
                layout: 'pretty',
                stream: process.stdout
            }
        },
        bar: {
            Class: 'loggin/core/stream-handler',
            params: {
                level: 'WARNING',
                layout: 'pretty',
                stream: process.stderr
            }
        }
    }
});
```

Configuration like that let you to write all the records to stdout and WARNING+ records to stderr.

---------
LICENSE [MIT](LICENSE)
