# toc-recto.js
js+css生成文章内容导读目录。自测在网页端，移动端都有不错的效果。

项目地址：
<a href="https://github.com/sustamp/toc-recto.js" target="_blank">https://github.com/sustamp/toc-recto.js</a>

文章地址：
<a href="https://sustamp.github.io/notes-blog/2024/11/15/su-toc-recto-usage.html" target="_blank">toc-recto.js文章导读目录生成器</a>

**toc-recto.js**是我借助阿里**通义灵码**AI-Chat问答功能辅助编写的TOC(table of contents, 文章导读目录)脚本，纯js+css代码。脚本内容如下：
1. toc-recto.js
2. toc-recto.css

*后面我看怎么压缩成`*.min.js/css`*

在任意html页面引入`toc-recto.js`及其样式，就可以在窗口右侧栏居中位置生成导读菜单，点击菜单响应相应功能。目前已有的交互功能有：
1. 导读目录
2. 回到顶部

## 原理
`toc-recto.js`会在htmll页面创建生成导读内容所需要的dom元素，分别是：
- 导读区域
- 遮罩层
- 导读菜单栏

脚本会分析html中有dom元素`id="article"`的区域内容，解析其中h2~h6级别的标题，然后生成内容到导读区域。

> `article`是默认值，可以通过传参设置其他的id。  
> h2~h6并不是固定的，也可以通过传参调节。  
> 导读菜单栏的功能按钮目前是固定的。


## 用法
### 步骤1：引入toc-recto.js及其样式
下载源码，然后在你的html页面或功能模板页面做如下步骤。

在`<stye>`标签中引入样式：

```html
<!-- 示意代码路径是放在同级目下的，如果不同请调整为你防止代码的正确路径 -->
<link rel="stylesheet" href="toc-recto/toc-recto.css">
```

在`<body>`标签的末尾引入js:

```html
<!-- 示意代码路径是放在同级目下的，如果不同请调整为你防止代码的正确路径 -->
<script src="toc-recto/toc-recto.js"></script>
```


> 在末尾引入js，一般认为此时html的dom元素都加载完成了

### 步骤2：编写调用脚本
在`<body>`标签的末尾继续编写一小段代码调用`toc-recto.js`。

```html
<script src="toc-recto/toc-recto.js"></script>
<!-- 调用toc-recto.js -->
<script>
    (function(){
        // 调整配置
        let config = {
            //设置成你html内容区域<div id="your-id">的id
            article: 'your-id'
        };
        // 创建一个TocRecto
        const tocRecto = new TocRecto(config);
        // 使用TocRecto的原型方法生成toc目录
        tocRecto.generateTOC();
    })()
</script>
```

> tips:创建一个对象，使用对象的方法。  

`(function(){})()`是**立即执行函数表达式（Immediately Invoked Function Expression, IIFE）**，书写格式为：

- `(function() { /* 代码 */ })();` 或者
- `(function() { /* 代码 */ }());`
  
IIFE一般的作用是：
1. 作用域隔离：
   - IIFE 创建了一个新的作用域，避免了全局变量污染。这有助于防止与其他脚本或库中的变量发生冲突。
2. 初始化代码：
   - IIFE 可以用于执行一些初始化操作，如设置初始状态、绑定事件监听器等。


如果想直接使用**默认配置**进行调用，代码可以简化如下：

```html
<!-- 在body末尾处引入脚本 -->
<script src="toc-recto/toc-recto.js"></script>
<script>
// 创建一个toc对象
var toc = new TocRecto();
toc.generateTOC();
</script>
```

> 使用默认配置调用`toc-recto.js`分析的是 `id="article"` 的元素内容区域，即：`<div id="article"></div>`



### 步骤3：设置内容元素的id
在之前提到过`toc-recto.js`是分析html文件中 `<div id="your-id"></div>` 的元素的内容作为分析区域的。所以请确保你的html文件或模板有为该内容元素设置id。

完整的使用示例如下：

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 引入toc-recto.js的样式 -->
    <link rel="stylesheet" href="toc-recto/toc-recto.css">
    
    <title>使用toc-recto.js生成导读目录</title>
</head>
<body>
    <!-- begin:toc-recto.js内容分析区域 -->
    <div id="article">
        <h1>文章标题</h1>
        <p>content.....</p>
        <h2>二级标题-1</h2>
        <p>正文内容....</p>
        <h2>二级标题-2</h2>
        <h3>三级标题-1</h3>
        <p>正文内容....</p>
        <h3>三级标题-2</h3>
        <p>正文内容....</p>
        <h2>二级标题-3</h2>
        <p>正文内容....</p>
    </div>
    <!-- end:toc-recto.js内容分析区域 -->
    
    <!-- ... -->
    <!-- ... -->
    <!-- ... -->
     
    <!-- 在body末尾处引入脚本 -->
    <script src="toc-recto/toc-recto.js"></script>
    <script>
    let config = {
        // 绑定分析区域
        article: 'article',
        // 要解析的标题级别
        headings: 'h2,h3,h4,h5,h6',
        // 导读栏标题
        tocHeader: 'table of contents',
    };
    // 创建一个toc对象
    var toc = new TocRecto(config);
    toc.generateTOC();
    </script>
     
</body>
</html>

```

现在，你可以在浏览器刷新页面，查看效果了。

<img src="https://sustamp.github.io/assets/pictures/toc-recto/toc-recto1.jpg" alt="toc-recto.js效果图1">

<img src="https://sustamp.github.io/assets/pictures/toc-recto/toc-recto2.jpg" alt="toc-recto.js效果图2">

## 参数配置
调用`toc-recto.js`时使用json格式变量传递给构造函数，可以调整配置。示例代码：

```js
let config = {
        // 绑定分析区域
        article: 'article',
        // 要解析的标题级别
        headings: 'h2,h3,h4,h5,h6',
        // 导读栏标题
        tocHeader: 'table of contents',
    };
// 创建一个toc对象
var toc = new TocRecto(config);
toc.generateTOC();
```

目前`toc-recto.js`的代码量不大，有些定制化的参数会在后续过程中逐渐完善。现在罗列下一些主要参数。

### article
文章参数，指定要解析的内容区域。

|type|default|
|:---|:---|
|`String`|`'article'`|

解析html文件中，任意`<div id="${article}"></div>`的内容。

### headings
要解析的标题级别。

|type|default|
|:---|:---|
|`String`|`'h2,h3,h4,h5,h6'`|

### tocHeader
导读栏展开时的标题。

|type|default|
|:---|:---|
|`String`|`'本文目录'`|

### headingOptimal
标题id优化，为避免有些id命名和html元素冲突，故在分析内容其余时为标题id加一个前缀`heading-`。

|type|default|
|:---|:---|
|`Boolean`|`true`|
