import path from 'path';
import Proxyquire from 'proxyquire-2/lib/proxyquire';

import {readAlises, processFile} from './getResolver';

let settings;

function nameResolver(stubs, fileName, module) {
    var dirname = module ? path.dirname(module) : '';
    var requireName = fileName;
    if (dirname) {
        requireName = fileName.charAt(0) == '.' ? path.normalize(dirname + '/' + fileName) : fileName;
    }
    if (stubs[requireName]) {
        return {
            key: requireName,
            stub: stubs[requireName]
        }
    }
}

function transformStubs(stubs) {
    let result = {};
    for (const i in stubs) {
        result[processFile(i, settings)] = stubs[i];
    }
    return result;
}

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
module.exports.configure = configure;