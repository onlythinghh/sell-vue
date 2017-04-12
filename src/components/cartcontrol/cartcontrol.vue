<template>
<div class="cartcontrol">
  <transition name="inner">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
  </transition>
  <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
  <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
</div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue';
export default {
  props:{
      food:{
          type:Object
      }
  },
  methods: {
    addCart(event) {    //加号（商品+）
      if (!event._constructed) {    //判断区分PC端阻止PC端两次点击
          return;
      }
      if(!this.food.count){  //如果food.count不存在
          Vue.set(this.food, 'count' , 1); //set方法替代 this.food.count = 1；（直接写不生效）
      }else {
          this.food.count++;
      }
      this.$emit('add', event.target); //小球动画对象
    },
    decreaseCart(event){  //减号（商品-）
      if (!event._constructed) {    //判断区分PC端阻止PC端两次点击
        return;
      }
      if (this.food.count){
        this.food.count--;
      }

    }

  }

};
</script>
<style type="styles" rel="stylesheet/less" lang="less">
  .cartcontrol{
    font-size: 0;
    .cart-decrease{
      display: inline-block;
      padding: 6px;
      transition: all 0.4s linear;
      .inner{
        line-height: 24px;
        font-size: 24px;
        color: rgb(0,160,220);
        transition: all 0.4s linear;
      }
      &.inner-enter-active,.inner-leave-active{  //减号的动画
        transform: translate3D(0,0,0);
        .inner{
          display: inline-block;
          transform: rotate(0);   //旋转
        }
      }
      &.inner-enter, &.inner-leave-active{   //动画结束（开始和结尾）
        transform: translate3D(24px,0,0);
        .inner{
          transform: rotate(180deg);
        }
      }
    }
    .cart-count{
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147,153,159);
    }
    .cart-add{
      display: inline-block;
      padding: 6px;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0,160,220);

    }
  }
</style>
