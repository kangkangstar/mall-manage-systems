// 获取网页配置相关
import defaultSettings from '@/settings'

// 设置一个默认值
const title = defaultSettings.title

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
