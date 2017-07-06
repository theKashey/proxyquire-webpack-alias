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
    var p: WebpackAliasProxyquire;
    export = p;
}