#### rough-react-cli  
___
这是一个自用的react-cli程序，将会构建一个 webpack 构建的 react 项目。  
  
初始化选择支持：  
- 选择以 js / ts 构建
- 是否注入 ES2015+ 环境, 兼容 IE
- 是否需要兼容移动端，将对 px -> vw  
  
项目 webpack 默认配置支持:  
- babel 对 js ES6 语法编译为 ES5语法。并根据情况注入相关Polyfill。
- less 文件支持
- postcss 支持对css 编译为具有兼容性前缀的 css, 以及css压缩。
- 支持 开发服务器(dev server)，以及 热更新。
- 打包时，将会打包出一个基础的react文件。保证该文件的hash永不改变。(assetsReact)
- ....
  
##### 安装  
```
npx rough-react-cli <name>
```

