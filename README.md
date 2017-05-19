# proxyquire-webpack-alias [![Build Status](https://secure.travis-ci.org/thekashey/proxyquire-webpack-alias.svg)](http://travis-ci.org/thekashey/proxyquire-webpack-alias)

[![NPM](https://nodei.co/npm/proxyquire-webpack-alias.png?downloads=true&stars=true)](https://nodei.co/npm/proxyquire-webpack-alias/)

Modification of proxyquire to work with webpack aliases. 
Proxies commonjs require/es6 import in order to allow overriding dependencies during testing.
Just hides some webpack magic inside.

# API

```js
import proxyquire, { configure } from 'proxyquire-webpack-alias';
```
Next you can use aliases as names of deps to be mocked. 
So you can use old proxyquire in more modern way.

If you prefer using original proxyquire - have a look in [resolveQuire](https://github.com/theKashey/resolveQuire)  

* For details about `proxyquire` API – see [proxyquire documentation](https://github.com/theKashey/proxyquire).
It is absolutely same.

* `configire(webpack.alias.conf)` allows you to overwrite location of webpack.aliases configuration file.
By default one will try to find 'webpack.config.js' or 'webpack.config.babel.js' in project root.
 
Alias behavior similar to [babel-plugin-webpack-alias](https://github.com/trayio/babel-plugin-webpack-alias/). 
As long we `take` some sources from it.


  
# Using proxyquire

So you have one file. You use webpack alises and address other files using them.
```js
import something from 'something';
import somethingElse from 'core/something';
import somethingMore from 'components/something';
```

And then you want to mock deps with [`proxyquire`](https://github.com/thlorenz/proxyquire).
But you cant.

You have to mock relative imports. And each time you have to `guess` the right name. 
```js
const mocked = proxyquire('source.js',{
  'something': mock,
  '../../core/something': mock, // will not work, the right path is '../../../core....'
  'shared/something': something
})
```

So, this lets fix this issue.
 
```js
//import proxyquire from 'proxyquire';
import proxyquire from 'proxyquire-webpack-alias'; 

// now, you can mock files as you import them.
const mocked = proxyquire('source.js',{
  'something': mock,
  'core/something': mock, 
  'components/something': something
});


// and, finnaly you can be sure, that you do something RIGHT.

// next example will trigger error
const mocked = proxyquire.noUnusedStubs().load('source.js',{
  'something': mock,
  'core/something': mock, 
  'component/something': something,// <-- typo. And stub will be unsued.
});
```
 
# Your own setup 
If you want to extend proxyquire, for example to `setup` it as you want, and use it indirectly - you have to add some magic
```js
// so you are using special version of proxyquire
import proxyquire from 'my-proxyquire';
```
Where my-proxyquire.js is your file
```js
import proxyquire from 'proxyquire-webpack-alias';

// this one creates `special` proxyquire for the file it use
const myProxyquire = (new proxyquire.Class(module.parent))
                     // now you can setup default behavior
                     .noUnusedStubs().noCallThru();;




// and this prevent caching. So in new place you will get new class
delete require.cache[require.resolve(__filename)];

export default myProxyquire;
```
 
PS: This is not wrapper around [proxyquire](https://github.com/thlorenz/proxyquire), this is wrapper around [proxyquire-2](https://github.com/theKashey/proxyquire).
