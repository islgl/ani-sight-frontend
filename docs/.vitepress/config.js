export default {
    title: 'AniSight', //站点标题
    description: '基于深度大模型的野生动物识别',//mate标签description，多用于搜索引擎抓取摘要
    head: [
        ['link', {rel: 'icon', href: '/logo.png'}],
    ],
    themeConfig: {
        siteTitle: 'AniSight',
        logo: '/logo.png',
        nav: [
            {text: '首页', link: '/'},
            {text: '关于', link: '/about/'},
            {text: '官方文档', link: '/official/'},
            {
                text: '本地部署', items: [
                    {text: '模型部署', link: '/local/install/'},
                    {text: '系统部署', link: '/local/train/'}]
            },
            {text: '在线体验', link: ''}
        ],
        socialLinks: [
            {icon: 'github', link: 'https://github.com/islgl/ani-sight'},
        ]
    }
}
