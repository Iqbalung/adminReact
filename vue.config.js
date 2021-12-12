const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: ['feathers-vuex'],
  chainWebpack: (config) => {
    config.module.rules.delete('eslint')
  },
  lintOnSave: false,
})
