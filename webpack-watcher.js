// ref: https://fengmiaosen.github.io/2017/03/21/webpack-core-code/
// https://github.com/sap9433/filewatcher-webpack-plugin
// https://github.com/ybonnefond/file-watcher-webpack-plugin
// https://github.com/JonasDoebertin/webpack-watch/blob/master/index.js
// https://github.com/cascornelissen/event-hooks-webpack-plugin
// plugin涉及到源码中的Compiler类和Compilation类，并对这两个类进行了简要介绍。

// Compiler在开始打包时就进行实例化，实例对象里面装着与打包相关的环境和参数，包括options、plugins和loaders等。
// Compilation在每次文件变化重新打包时都进行一次实例化，它继承自Compiler，其实例对象里装着和modules及chunks相关的信息。
const chokidar = require('chokidar');
const pathUrl = require('path');
const fs = require('fs');


const toString = Object.prototype.toString;

class BitorWebpackPlugin {


  constructor(options=  {}){
    this.options = options;
    this.root = options.root || process.cwd();
    this.cachefile =  options.cachefile || '';
    this.rules = options.rules || Object.create(null);
    this.chokidarOption = options.chokidar;

    this.onCacheChange = options.onCacheChange ? options.onCacheChange : ()=>{}
    this.normalize = options.normalize ? options.normalize : ()=>{return false}
    
    this.watcherFiles = {}
    this.compiler = null;
    if(toString.call(this.cachefile) !== '[object String]') {
      throw new TypeError('The option cacefile must be the String Type.')
    }
  }

  /**
   * 
   * @param {*} files 'file, dir, glob, or array'
   * @param {*} options 
   */
  createChokidar(files, options={}){
    var watcher = chokidar.watch(files, {
      persistent: options.persistance || true,
      ignored: options.ignored || false,
      ignoreInitial: options.ignoreInitial || false,
      followSymlinks: options.followSymlinks || true,
      cwd: this.root || '.',
      disableGlobbing: options.disableGlobbing || false,
      usePolling: options.usePolling || true,
      interval: options.interval || 100,
      binaryInterval: options.binaryInterval || 300,
      alwaysStat: options.alwaysStat || false,
      depth: options.depth || 99,
      awaitWriteFinish: {
        stabilityThreshold: options.stabilityThreshold || 2000,
        pollInterval: options.pollInterval || 100
      },

      ignorePermissionErrors: options.ignorePermissionErrors || false,
      atomic: options.atomic || true
    });

    return watcher;
  }

  writeCacheFile(cachefile, data){
    switch (toString.call(data)) {
      case "[object String]":
        fs.writeFileSync(cachefile, data);
        break;
      case "[object Object]":
      case "[object Array]":
        fs.writeFileSync(cachefile, JSON.stringify(data, null, 4));
        break;
    
      default:
        break;
    }
  }

  cacheFiles(namespace, path, action) {
    path = pathUrl.join(this.root,path)
    switch (action) {
      case 'add':
        this.watcherFiles[namespace].push(path)
        break;
      case 'unlink':{
        let ind = this.watcherFiles[namespace].indexOf(path)
        this.watcherFiles[namespace].splice(ind,1)
      } break;
    
      case "init":
        this.watcherFiles[namespace] = []
        break;
    }

    this.onCacheChange(this.watcherFiles)
    if(this.cachefile.length > 0) {
      let data = this.normalize(this.watcherFiles);
      if(data !== false) {
        this.writeCacheFile(this.cachefile, data);
      }
    }
  }

  bindWatcher(watcher, compiler, namespace) {

    this.cacheFiles(namespace, '', 'init');
    let callbackContext = {watcher, compiler}
    let options = this.options;
    watcher
      .on(
        'add',
        options.onAddCallback ? (path)=>{
          options.onAddCallback(namespace,path);
          this.cacheFiles(namespace,path,'add')
        }:(path)=> {
            return null;
          }
      )
      .on(
        'change',
        options.onChangeCallback ? (path)=>{
          options.onChangeCallback(namespace,path);
          this.cacheFiles(namespace,path,'change')
        }:(path)=> {
            console.log(`File ${path} has been changed`)
          }
      )
      .on(
        'unlink',
        options.onUnlinkCallback ? (path)=>{
          options.onUnlinkCallback(namespace,path);
          this.cacheFiles(namespace,path,'unlink')
        }:(path)=> {
            console.log(`File ${path} has been removed`);
          }
      );

    watcher
      .on(
        'addDir',
        options.onAddDirCallback ? (path)=>{
          options.onAddDirCallback(namespace,path);
          this.cacheFiles(namespace,path,'addDir')
        }:(path)=> {
            console.log(`Directory ${path} has been added`);
          }
      )
      .on(
        'unlinkDir',
        options.unlinkDirCallback ? (path)=>{
          options.unlinkDirCallback(namespace,path);
          this.cacheFiles(namespace,path,'unlinkDir')
        }:(path)=> {
            console.log(`Directory ${path} has been removed`);
          }
      )
      .on(
        'error',
        options.onErrorCallback ? (path)=>{
          options.onErrorCallback(namespace,path);
          this.cacheFiles(namespace,path,'error')
        }:(error)=> {
            console.log(`Watcher error: ${error}`);
          }
      )
      .on(
        'ready',
        options.onReadyCallback ? (path)=>{
          options.onReadyCallback(namespace,path);
          this.cacheFiles(namespace,path,'ready')
        }:()=> {
            console.log('Initial scan complete. Ready for changes');
          }
      )
      .on(
        'raw',
        options.onRawCallback ? (path)=>{
          options.onRawCallback(namespace,path);
          this.cacheFiles(namespace,path,'raw')
        }:(event, path, details)=> {
            return null;
          }
      );

  }

  apply(compiler){
    this.compiler = compiler;
    Object.keys(this.rules).forEach(key=>{
      let namespace = key;
      let rule = this.rules[namespace];

      let watcher = this.createChokidar(rule, this.chokidarOption)
      this.bindWatcher(watcher, compiler,namespace);
    })
  }

  
}



module.exports = BitorWebpackPlugin;





// apply(compiler) {

//   // 当前配置所有使用的插件列表
//   // const plugins = compiler.options.plugins;


//   // 当依赖的文件发生变化时会触发 watch-run 事件
//   compiler.plugin('watch-run', (watching, callback) => {
//     // 获取发生变化的文件列表
//     // const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
//     // changedFiles 格式为键值对，键为发生变化的文件路径。
//     console.warn('-------start----watching------------')
//     // console.log("\r\nwatching", watching)
//     console.warn('-------end----watching------------')
//     callback();
//   });

//   compiler.plugin('after-compile', (compilation, callback) => {
//     // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
//     // compilation.fileDependencies.push(filePath);
//     console.warn('-------start----fileDependencies------------')
//     // console.log(compilation.fileDependencies)
//     // compilation.fileDependencies.push()
//     console.warn('-------end----fileDependencies------------')
//     callback();
//   });
//   // Setup callback for accessing a compilation:
//   compiler.plugin("compilation", function (compilation) {

//     // Now setup callbacks for accessing compilation steps:
//     compilation.plugin("optimize", function () {
//       console.log("Assets are being optimized.");
//     });
//   });

//   compiler.plugin('emit', (compilation, callback) => {
//     // compilation.chunks 存放所有代码块，是一个数组

//     // compilation.chunks.forEach(function (chunk) {
//     //   // chunk 代表一个代码块
//     //   // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
//     //   chunk.forEachModule(function (module) {
//     //     // module 代表一个模块
//     //     // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
//     //     module.fileDependencies.forEach(function (filepath) {});
//     //   });

//     //   // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
//     //   // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
//     //   // 该 Chunk 就会生成 .js 和 .css 两个文件
//     //   chunk.files.forEach(function (filename) {
//     //     // compilation.assets 存放当前所有即将输出的资源
//     //     // 调用一个输出资源的 source() 方法能获取到输出资源的内容
//     //     let source = compilation.assets[filename].source();
//     //   });
//     // });

//     callback();
//   });

//   compiler.plugin('done', function () {
//     console.log('@@@@@@@@@######Hello World!');
//   });
// }

// 一个webpack的插件由以下几方面组成：
// 一个非匿名的js函数
// 在它的原型对象上定义apply方法
// 指明挂载自身的webpack钩子事件
// 操作webpack内部情况的特定数据
// 方法完成时唤起webpack提供的回调
// 钩子	作用	参数	类型
// after-plugins	设置完一组初始化插件之后	compiler	sync
// after-resolvers	设置完 resolvers 之后	compiler	sync
// run	在读取记录之前	compiler	async
// compile	在创建新 compilation 之前	compilationParams	sync
// compilation	compilation 创建完成	compilation	sync
// emit	在生成资源并输出到目录之前	compilation	async
// after-emit	在生成资源并输出到目录之后	compilation	async
// done	完成编译	stats	sync

// should-emit	所有需要输出的文件已经生成好，询问插件哪些文件需要输出，哪些不需要。	webpack/lib/Compiler.js:146
// emit	确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出内容。	webpack/lib/Compiler.js:287
// after-emit	文件输出完毕。	webpack/lib/Compiler.js:278
// done	成功完成一次完成的编译和输出流程。	webpack/lib/Compiler.js:166
// failed	如果在编译和输出流程中遇到异常导致 Webpack 退出时，就会直接跳转到本步骤，插件可以在本事件中获取到具体的错误原因。

// 关键事件
// entry-option：初始化options
// after-plugins
// after-resolvers
// environment
// after-environment
// before-run
// run：开始编译
// watch-run
// normal-module-factory
// context-module-factory
// before-compile
// compile
// this-compilation
// compilation
// make：从entry开始递归分析依赖并对依赖进行build
// build-module：使用loader加载文件并build模块
// normal-module-loader：对loader加载的文件用acorn编译，生成抽象语法树AST
// program：开始对AST进行遍历，当遇到require时触发call require事件
// after-compile
// should-emit
// need-additional-pass
// seal：所有依赖build完成，开始对chunk进行优化（抽取公共模块、加hash等）
// optimize-chunk-assets：优化代码
// emit：把各个chunk输出到结果文件
// after-emit
// done
// failed
// invalid
// watch-close