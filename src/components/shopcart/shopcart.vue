<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">
            {{totalPrice}}元
          </div>
          <div class="desc">另需配送费¥{{deliveryPrice}}</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payDesc}}
            <!--￥{{minPrice}}元起送-->
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div  class="price">
                  <span>¥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  export default{
    props: {
      selectFoods:{
        type: Array,
        default(){
          return [
            {   //此处假数据 测试效果用
              price:10, //单价
              count: 1   //数量
            }
          ];
        }
      },
      deliveryPrice: {    //配送费（后台获取）
        type:Number,
        default:0
      },
      minPrice: {   //起送价
        type: Number,
        default:12
      }
    },
    data() {
      return {
        balls: [    //购物车运动小球
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold:true
      };
    },
    computed:{
      totalPrice(){   //总价
        let total = 0;
        this.selectFoods.forEach((food) => {
            total += food.price * food.count;
        });
        return total;
      },
      totalCount(){   //总量
        let  count = 0;
        this.selectFoods.forEach((food) => {
            count += food.count;
        });
        return count;
      },
      payDesc(){    //去结算的状态（三种：1.开始多少起送 2.差多少起送 3.结算）
        if (this.totalPrice === 0){
            return `¥${this.minPrice}元起送`;
        }else if (this.totalPrice < this.minPrice){
          let diff = this.minPrice  - this.totalPrice;
          console.log(this.minPrice);
          return `还差${diff}元起送`;
        }else {
            return `去结算`;
        }
      },
      payClass(){   //结算按钮状态 （不可提交 可提交）
        if(this.totalPrice < this.minPrice){
            //console.log(this.totalPrice)
          return 'not-enough'
        }else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop(el){
        for(let i = 0;i < this.balls.length; i++){  //遍历小球数量并设置当前小球为true
          let ball = this.balls[i];
          if (!ball.show){
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList() {    //显隐购物车（有物品时）
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      hideList(){
        this.fold = true;
      },
      empty() {
          this.selectFoods.forEach((food) => {    //清空购物车
             food.count = 0;
          });
      },
      pay(){    //点击支付时
        if (this.totalPrice < this.minPrice) {
            return;
        }
        window.alert(`支付${this.totalPrice}元`);
      },
      addFood(target) {   //购物车小球运动组件复用
        this.drop(target);
      },
      beforeDrop(el) {
        let  count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect(); //调用接口获取小球位置（相对视口）
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform =  'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend',done)
        });
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if(ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    },
    components:{
        'cartcontrol':cartcontrol
    }
  };
</script>
<style type="styles" rel="stylesheet/less" lang="less">
  @import "../../common/stylus/mixin";
.shopcart{
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height:48px;
  .content{
    display: flex;
    background: #141d27;
    font-size: 0;
    color: rgba(255,255,255,0.4);
    .content-left{
      flex:1;
      .logo-wrapper{
        display: inline-block;
        position: relative;
        top:-10px;
        margin: 0 12px;
        padding:6px;
        width:56px;
        height:56px;
        box-sizing: border-box;
        vertical-align: top;
        border-radius: 50%;
        background: #141d27;
        .num {
          position: absolute;
          top:0;
          right: 0;
          width: 24px;
          height:16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: rgb(240,20,20);
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
        }
        .logo{
          width: 100%;
          height:100%;
          border-radius: 50%;
          background: #2b343c;
          text-align: center;
          &.highlight{
          background: rgb(0,160,220);
        }
          .icon-shopping_cart{
            font-size: 24px;
            line-height: 44px;
            color: #80858a;
            &.highlight{
              color: #fff;
            }
          }
        }
      }
      .price{
        display: inline-block;
        vertical-align: top;
        line-height: 24px;
        margin-top: 12px;
        box-sizing: border-box;
        padding-right: 12px;
        border-right: 1px solid rgba(255,255,255,0.1);
        font-size: 16px;
        font-weight: 700;
        &.highlight{
          color: #fff;
        }
      }
      .desc{
        display: inline-block;
        vertical-align: top;
        line-height: 24px;
        margin: 12px 0 0 12px;
        font-size: 10px;
      }
    }
    .content-right{
      flex: 0 0 105px;
      width: 105px;
      .pay{
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        background: #2b333b;
        &.not-enough{
          background: #2b333b;
        }
        &.enough{
          background: #00b43c;
          color: #fff;
        }
      }
    }

  }
  .ball-container{
    .ball{
      position: fixed;
      left: 32px;
      bottom:22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.66,-0.19,0.8,0.73);
      .inner{
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgb(0,160,220);
        transition: all 0.4s linear;
      }
    }
  }
  .shopcart-list{
    position: absolute;
    top:0;
    left:0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0,-100%,0);
    &.fold-enter-active,&.fold-leave-active{
      transition:  all 0.5s;
    }
    &.fold-enter,&.fold-leave-active{
      transform: translate3d(0,0,0);
    }
    .list-header{
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7,17,27,0.1);
      .title{
        float: left;
        font-size: 14px;
        color: rgb(7,17,27);
      }
      .empty{
        float: right;
        font-size: 12px;
        color: rgb(0,160,220);
      }
    }
    .list-content{
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;
      .food{
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        .border-px(rgba(7,17,27,0.1));
        .name{
          line-height: 24px;
          font-size: 14px;
          color: rgb(7,17,27);
        }
        .price{
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240,20,20);
        }
        .cartcontrol-wrapper{
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }

  }
}
.list-mask{
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height:100%;
  z-index: 40;
  -webkit-backdrop-filter: blur(10px); //模糊
  opacity: 1;
  background: rgba(7,17,27,0.6);
  &.fade-enter-active,&.fade-leave-active{
    transition: all 0.5s;
  }
  &.fade-enter,&.fade-leave-active{
    opacity: 0;
    background: rgba(7,17,27,0);
  }
}
</style>
