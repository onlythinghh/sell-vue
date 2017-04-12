// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from 'App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from 'components/goods/goods';

import './common/stylus/index.less'

Vue.use( VueRouter );
Vue.use(VueResource); //进行注册 全局的

//方法一：用import引入路由组件
import Goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';
import seller from 'components/seller/seller.vue';

//方法二：直接定义路由组件
//const Goods = {
//  template:'<div>I am goods</div>'
//}

const routes = [
  {path:'/goods',component:Goods},
  {path:'/ratings',component:ratings},
  {path:'/seller',component:seller}
]
const router = new VueRouter({
  routes,
  linkActiveClass:'active'

});
//const app = new Vue({
//  router
//}).$mount('#app');

//默认显示商品页
router.push ('/goods');
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});
