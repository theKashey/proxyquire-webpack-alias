import {expect} from 'chai';
import {join} from 'path';

import {readAlises, processFile} from './../src/aliases';

const aliasConfig = 'tests/webpack.config.js';

describe('aliases', () => {
    it('should read aliases ', () => {
        const aliases = readAlises(aliasConfig);
        const targetConfig = {
            aliasConf: {
                'my-absolute-test-lib': join(process.cwd(), '/tests/lib/a'),
                'same-folder-lib': join(process.cwd(), '/tests/lib/b')
            },
            extensionsConf: null
        };
        expect(aliases).to.deep.equal(targetConfig);
    });

    it('should transform filename', () => {
        const aliases = readAlises(aliasConfig);
        const newFileName1 = processFile('my-absolute-test-lib/foo.js', aliases);
        expect(newFileName1).to.be.equal(join(process.cwd(), '/tests/lib/a/foo.js'));

        const newFileName2 = processFile('same-folder-lib/foo.js', aliases);
        expect(newFileName2).to.be.equal(join(process.cwd(), '/tests/lib/b/foo.js'));
    })
});
