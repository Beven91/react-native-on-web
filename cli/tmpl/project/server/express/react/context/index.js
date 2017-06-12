/**
 * 名称：React同构全局数据
 * 日期：2017-06-12
 * 描述：用于进行服务端与客户端数据结构共享，提供统一api
 */

const VariableName = '@@__reactAppContext__@@'

class ReactAppContextClass {
  constructor () {
    global[VariableName] = {
     
    }
  }

  get context () {
    return global[VariableName]
  }

  set context (value) {
    global[VariableName] = value
  }
}

export default ReactAppContext = new ReactAppContextClass()
