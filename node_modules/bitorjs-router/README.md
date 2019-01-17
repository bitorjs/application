# bitorjs-router

> npm i bitorjs-router


### path-to-regexp
> pathToRegexp(path, keys?, options?)
```
path 字符串，字符串数组或正则表达式.
keys 要在路径中找到的键填充的数组.
  name 令牌的名称（string用于命名或number索引）
  prefix （/或.）的前缀字符
  delimiter  的分隔符（与前缀相同/）
  optional 表示令牌是可选的（boolean）
  repeat 表示令牌重复（boolean）
  partial 表示此令牌是部分路径段（boolean）
  patternRegExp 用于匹配此令牌（string）
options
  sensitive 当true 则表达式区分大小写. (default: false) e.g. /one or /One
  strict 当true 严格要求尾随分隔符匹配. (default: false) e.g. /event or /event/
  end 当true 则强制从字符串的结尾匹配. (default: true) 
  start 当true 则强制从字符串的开头匹配. (default: true)
  高级选项（用于非路径名字符串，例如主机名）:
    delimiter 默认分隔符. (default: '/')
    endsWith 可选字符或字符列表，用作“结束”字符.
    delimiters 解析时要考虑分隔符的字符列表. (default: './')
```
- 修饰符
```
? 零或一个|可选的
* 零或更多
+ 一个或多个
(.*) 通配符
```

