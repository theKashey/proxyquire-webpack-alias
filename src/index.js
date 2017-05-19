import {dirname, normalize} from 'path';
import ProxyquireClass from 'proxyquire-2/lib/proxyquire';

import {readAlises, processFile} from './getResolver';

let settings;

function nameResolver(stubs, fileName, module) {
    const activeDir = module ? dirname(module) : '';
    let requireName = fileName;
    if (activeDir) {
        requireName = fileName.charAt(0) == '.' ? normalize(activeDir + '/' + fileName) : fileName;
    }
    const tryPath = (path)=> {
        if (stubs[path]) {
            return {
                key: path,
                stub: stubs[path]
            }
        }
    };
    return (
        tryPath(requireName) ||
        tryPath(fileName)
    );
}

function transformStubs(stubs) {
    let result = {};
    for (const i in stubs) {
        let stubName = processFile(i, settings);
        result[stubName || i] = stubs[i];
    }
    return result;
}

/**
 * @name WebpackAliasProxyquire
 * @class
 * @augments Proxyquire
 * @returns {*}
 * @constructor
 */
function WebpackAliasProxyquire() {
    var result = ProxyquireClass.prototype.constructor.apply(this, arguments);
    result.resolveNames(nameResolver);
    return result;
}

/* inherit */
var F = function () {
};
F.prototype = ProxyquireClass.prototype;
WebpackAliasProxyquire.prototype = new F();

/* overload */
WebpackAliasProxyquire.prototype.load = function (request, stubs) {
    if (!settings) {
        configure();
    }
    return ProxyquireClass.prototype.load.call(this, request, transformStubs(stubs));
};

const configure = (path) => {
    settings = readAlises(path);
};

// delete this module from the cache to force re-require in order to allow resolving test module via parent.module
delete require.cache[require.resolve(__filename)];


export {
    configure,
    WebpackAliasProxyquire as Class
}
/**
 * @type {WebpackAliasProxyquire}
 */
const proxyquireInstance = new WebpackAliasProxyquire(module.parent);
export default proxyquireInstance;