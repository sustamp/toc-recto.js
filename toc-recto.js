
/**
 * TocRecto类。借助js构造函数定义，未使用ES6类语法
 * 构造函数类属性值有:
 * article: 文章区域的id。默认'article'
 * headings: 要解析的标题级别。默认'h2,h3,h4,h5,h6'
 * @param {*} config 配置信息，赋值方式config = {}
 */
function TocRecto(config){

    //默认属性与验证规则
    var defaultProperties = {
        article: {
            defaultValue: 'article',
            // validate: function(value){
            //     if (typeof value !== 'string') {
            //         throw new Error('article must be a string');
            //     }
            // }
        },
        headings: {
            defaultValue: 'h2,h3,h4,h5,h6'
        },
        position: {
            defaultValue: 'fixed'
        },
        tocHeader: {
            defaultValue: '本文目录'
        },
        //是否优化标题id，默认为true。
        headingOptimal: {
            defaultValue: true
        }
    };

    // 动态定义 getter 和 setter
    for (let prop in defaultProperties) {
        if (defaultProperties.hasOwnProperty(prop)) {
            let descriptor = defaultProperties[prop];
            Object.defineProperty(this, prop, {
                get: function() {
                    return this[`_${prop}`];
                },
                set: function(value) {
                    // descriptor.validate(value);
                    this[`_${prop}`] = value;
                }
            });
            
            // 初始化私有属性
            this[`_${prop}`] = descriptor.defaultValue;
        }
    }

    // 用传参中的配置信息给属性赋值
    if (config) {
        for (const prop in config) {
            if (config.hasOwnProperty(prop)) {
                try {
                    this[prop] = config[prop];
                } catch (error) {
                    console.error(error);
                }
                
            }
        }
    }
    
}

const _tocSidebar = 'su-toc-sidebar';
const _tocOverlay = 'su-toc-overlay';
const _tocHeader = 'su-toc-header';
const _tocContent = 'su-toc-conent';
const _tocMenu = 'su-toc-menu';

// 原型方法createTOCElement()，生成导读栏所需要的html元素
TocRecto.prototype.createTOCElement = function() {

    //创建导读菜单栏
    const tocMenu = document.createElement('div');
    tocMenu.className = _tocMenu;
    tocMenu.id = _tocMenu;
    tocMenu.innerHTML = `
        <button class="su-toc-button" onclick="sucScrollToTop()">
            <span>回</span>
            <span>到</span>
            <span>顶</span>
            <span>部</span>
        </button>
        <button class="su-toc-button" onclick="sucToggleSidebar()">
            <span>导</span>
            <span>读</span>
            <span>目</span>
            <span>录</span>
        </button>
    `;

    // 创建遮罩层
    const tocOverlay = document.createElement('div');
    tocOverlay.id = _tocOverlay;
    tocOverlay.className = _tocOverlay;
    
    //创建导读栏容器
    const tocSidebar = document.createElement('div');
    tocSidebar.id = _tocSidebar;
    tocSidebar.className = _tocSidebar;
    //创建导读栏头部
    const tocHeader = document.createElement('div');
    tocHeader.className = _tocHeader;
    tocHeader.innerHTML = `
            <h3>${this.tocHeader}</h3>
            <button onclick="sucToggleSidebar()">x</button>
    `;
    tocSidebar.appendChild(tocHeader);
    //创建导读栏内容区
    const tocContent = document.createElement('div');
    tocContent.className = _tocContent;
    tocSidebar.appendChild(tocContent);
    
    // 返回创建好的元素
    return {tocMenu, tocSidebar, tocOverlay};
};

// 原型方法generateTOC()：生成导航目录
TocRecto.prototype.generateTOC = function() {
    try {
        // 创建导读栏元素并插入到页面中
        const {tocMenu, tocSidebar, tocOverlay} = this.createTOCElement();
        document.body.appendChild(tocMenu);
        document.body.appendChild(tocOverlay);
        document.body.appendChild(tocSidebar);
        
        // 获取文章区域
        const article = document.getElementById(this.article);
        if (!article) {
            throw new Error(`未找到 id="${this.article}" 的文章区域，无法进行后续toc生成`);
        }
        // 获取toc区域
        // const tocContent = document.querySelector('.su-toc-conent');
        const tocContent = tocSidebar.querySelector(`.${_tocContent}`);
        // 基础字体大小（单位：px）
        let baseFontSize = 16;
        // 基础左边距（单位：px）
        let baseMarginLeft = 10;
        
        if (tocContent) {
            //清空现有内容
            tocContent.innerHTML = '';

            const contentFontSize = window.getComputedStyle(tocContent).getPropertyValue('font-size');
            if (contentFontSize) {
                baseFontSize = contentFontSize.replace('px', '');
            }
        }
        
        const headings = article.querySelectorAll(this.headings);
        if (headings) {
            const ul = document.createElement('ul');
            tocContent.appendChild(ul);
            
            const rootLevel = parseInt(headings[0].tagName.slice(1));
            //把最上级标题认定为1级标题，由于文章内容可能从h2开始，那么计算级别偏移量。
            const range = rootLevel - 1;
            
            // 建立一个元素栈，首先放入根元素ul。
            let stack = [ul];

            headings.forEach(heading => {
                // 标题级别
                const level = parseInt(heading.tagName.slice(1));
                // 创建子元素 - 当前标题目录
                const elementTag = 'li'
                const li = document.createElement(elementTag);
                li.className = 'su-toc-item';
                // 创建锚点
                const a = document.createElement('a');
                // 为标题添加id，以便链接跳转
                if (!heading.id || this.headingOptimal === true ) {
                    const headingText = heading.id ? heading.id : heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
                    heading.id = `heading-${headingText}`;
                }
                a.href = '#' + heading.id;
                a.textContent = heading.textContent;
                li.appendChild(a);

                //栈中元素超过当前级别的，把多余元素推出来，只保留最后的那个。
                while(stack.length > level - range){
                    stack.pop();
                }
                // 同根级目录，直接追加节点
                if (level === rootLevel) {
                    li.style.borderBottom = '1px solid #ddd';
                    stack[stack.length - 1].appendChild(li);
                }else if (level > rootLevel) {
                    // 下级目录则推入一个新的ul，包裹li元素
                    const newUL = document.createElement('ul');
                    // 加点缩进
                    // li.style.paddingLeft = `${(level - range) * 0.45}em`;
                    li.style.fontSize = baseFontSize * (1 - (level - range) * 0.06) + 'px';
                    li.style.marginLeft = baseMarginLeft + (level - range) * 6 + 'px';
                    
                    newUL.appendChild(li);
                    // 从栈顶追加元素
                    stack[stack.length - 1].appendChild(newUL);
                }
                stack.push(li);
                
            });
            
            stack = null;//清空元素栈
        }
        
        
    } catch (error) {
        console.error(error);
    }
}

function sucToggleSidebar() {
    const sidebar = document.getElementById(_tocSidebar);
    const overlay = document.getElementById(_tocOverlay);
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

function sucHideSidebar() {
    const sidebar = document.getElementById(_tocSidebar);
    const overlay = document.getElementById(_tocOverlay);
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}
function sucScrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 监听toc区域，当点击空白处或a标签时，隐藏toc栏
document.addEventListener('DOMContentLoaded', () => {
    const tocSidebar = document.querySelector(`.${_tocSidebar}`);
    const tocOverlay = document.querySelector(`.${_tocOverlay}`);

    // 监听导读栏点击事件。点击a标签时后，收起侧边栏
    tocSidebar.addEventListener('click', (event) => {
        if (event.target.tagName.toLowerCase() === 'a') {
            sucToggleSidebar();
        }
    });
    
    //监听遮罩层点击事件。如果点击了遮罩层的其他区域，收侧边栏
    tocOverlay.addEventListener('click', (event) => {
        if (event.target.tagName.toLowerCase() === 'a' || !tocSidebar.contains(event.target)) {
            sucToggleSidebar();
        }
    });
    
});

