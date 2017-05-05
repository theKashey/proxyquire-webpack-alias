import {expect} from 'chai';

import proxyquire, {configure} from '../src/index';

const aliasConfig = 'tests/webpack.config.js';


describe('proxyquire ', () => {
    it('check default behavior: ', () => {
        configure(aliasConfig);
        const baz = proxyquire('./lib/a/test.js', {});
        expect(baz()).to.be.equal('foobar');
    });

    it('should overload by alias: ', () => {
        configure(aliasConfig);
        const baz = proxyquire('./lib/a/test.js', {
            'my-absolute-test-lib/foo': function () {
                return 'aa'
            },
            'same-folder-lib/bar': function () {
                return 'bb'
            }
        });
        expect(baz()).to.be.equal('aabb');
    });
});
