const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: ['@vue/cli-plugin-babel/preset','feathers-vuex'],
  chainWebpack: (config) => {
    config.module.rules.delete('eslint')
  },
  lintOnSave: false,
})
