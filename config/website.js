export const titleSuffix = 'TBC 的码棚'
export const defaultKeywords = '前端开发,JavaScript,个人博客,唐比昌,TBC,tangbichang'
export const defaultDescription = '一些与前端开发技术相关的东西以及一些生活纪事等等……'

const thisYear = (new Date()).getFullYear()
export const introduce = [
    '这里是一个简单的个人博客，取名为「TBC 的码棚」',
    '我的家乡来自山水甲天下的桂林，目前居住在深圳市，从事 Web 前端开发，专注前端开发和有趣的东西；',
    `喜欢竞技体育，羽毛球单打狂热爱好者，热衷看 NBA，${thisYear - 2013} 年库里球迷，水花死忠党 🖐`
].join('')

export const declaration = [
    '本站所有文章均为原创，如转载请注明出处。',
    '文章的内容、观点仅代表我个人，与其他任何人或组织都无关。',
    '由于技术更新迭代导致的内容过时或不正确的欢迎留言指出 :-)'
].join('')

export const navMenus = [
    {
        path: '/',
        name: '技术文章'
    },
    {
        path: '/essay',
        name: '无关技术',
        preface: '与技术无关的生活记录。'
    },
    {
        path: '/about',
        name: '关于我'
    }
]

export const license = {
    name: '署名-非商业性使用-禁止演绎 4.0 国际许可协议',
    link: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh'
}

export const icp = '桂 ICP 备 12002316 号'
export const copyright = `© ${thisYear} ${titleSuffix}`
