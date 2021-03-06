const R = require('ramda')
var exception = {},
    exceptions = [],
    thisObjs = {
        onException: onException,
        getExceptions: () => exceptions,
        retryRepetitions: retryRepetitions,
        retryDelay: retryDelay,
        fallbackProcessor: fallbackProcessor,
        end: end,
        getStrategy: getStrategy
    },
    defaultStrategy = {
        fallbackProcessor : defaultFallbackProcessor,
        retryRepetitions : 2,
        retryDelay : 500
    }

function onException(routeName) {
    exception.routeName = routeName
    exception.fallbackProcessor = defaultFallbackProcessor
    return thisObjs
}

function retryRepetitions(value) {
    exception.retryRepetitions = value
    return thisObjs
}

function retryDelay(value) {
    exception.retryDelay = value
    return thisObjs
}

function fallbackProcessor(func){
    exception.fallbackProcessor = func
    return thisObjs
}

function end() {
    exceptions.push({routeName: exception.routeName, strategy: exception})
}

function defaultFallbackProcessor(exchange) {
    console.log(`defaultFallbackProcessor exchange: [${JSON.stringify(exchange)}]`)
    return Promise.reject(exchange)
}

function getStrategy(routeName) {
    var exceptionStrategy = R.find(R.propEq('routeName', routeName))(exceptions);
    return !exceptionStrategy ? defaultStrategy : exceptionStrategy.strategy
}

module.exports = thisObjs