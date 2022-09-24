// 单独封装修改起来更方便
// 获取token(要有返回值)
export function getToken() {
  return sessionStorage.getItem('token')
}

// 存储token
export function setToken(Token) {
  sessionStorage.setItem('token', Token)
}

// 移出token
export function removeToken() {
  sessionStorage.removeItem('token')
}
