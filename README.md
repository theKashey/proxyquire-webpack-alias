# proxyquire-webpack-alias [![Build Status](https://secure.travis-ci.org/thekashey/proxyquire-webpack-alias.svg)](http://travis-ci.org/thekashey/proxyquire-webpack-alias)

[![NPM](https://nodei.co/npm/proxyquire-webpack-alias.png?downloads=true&stars=true)](https://nodei.co/npm/proxyquire-webpack-alias/)

Modification of proxyquire to work with webpack aliases.

# API

```js
import proxyquire, { configure } from 'proxyquire-webpack-alias';
```
For `proxyquire` API see [its repo](https://github.com/theKashey/proxyquire).
`configire(webpack.alias.conf)` allows you to overwrite location of webpack.aliases configuration file.
Behavior similar to [babel-plugin-webpack-alias](https://github.com/trayio/babel-plugin-webpack-alias/)

Next you can use alises as names of deps to be mocked.
 
 
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
const mocked = proxyquire.noUnusedStubs().('source.js',{
  'something': mock,
  'core/something': mock, 
  'component/something': something,// <-- typo. And stub will be unsued.
});

``` 
PS: This is not wrapper around [proxyquire](https://github.com/thlorenz/proxyquire), this is wrapper around [proxyquire-2](https://github.com/theKashey/proxyquire).
