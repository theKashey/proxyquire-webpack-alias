import Proxyquire from 'proxyquire-2';
/**
 * @name WebpackAliasProxyquire
 * @class
 * @augments Proxyquire
 * Proxies imports/require in order to allow overriding dependencies during testing.
 */
interface WebpackAliasProxyquire extends Proxyquire {
    withAliasInFileName(): WebpackAliasProxyquire;
    noAliasInFileName(): WebpackAliasProxyquire;
}

declare module 'proxyquire-webpack-alias' {
    var proxyquire_webpack_alias: WebpackAliasProxyquire;
}

export default proxyquire_webpack_alias;