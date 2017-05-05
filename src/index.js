import {dirname, normalize} from 'path';
import Proxyquire from 'proxyquire-2/lib/proxyquire';

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
    return tryPath(requireName) || tryPath(fileName);
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
 * @class WebpackAliasProxyquire
 * @extends {Proxyquire}
 * @returns {*}
 * @constructor
 */
function WebpackAliasProxyquire() {
    var result = Proxyquire.prototype.constructor.apply(this, arguments);
    result.resolveNames(nameResolver);
    return result;
}

/* inherit */
var F = function () {
};
F.prototype = Proxyquire.prototype;
WebpackAliasProxyquire.prototype = new F();

/* overload */
WebpackAliasProxyquire.prototype.load = function (request, stubs) {
    if (!settings) {
        configure();
    }
    return Proxyquire.prototype.load.call(this, request, transformStubs(stubs));
};

const configure = (path) => {
    settings = readAlises(path);
};

export {
    configure
}

// delete this module from the cache to force re-require in order to allow resolving test module via parent.module
delete require.cache[require.resolve(__filename)];

module.exports = new WebpackAliasProxyquire(module.parent);
module.exports.Class = WebpackAliasProxyquire;
module.exports.configure = configure;