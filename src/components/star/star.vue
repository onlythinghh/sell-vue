<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" ></span>
  </div>
</template>
<script type="text/ecmascript-6">

  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

  export default {

      props:{
          size:{  //星星图片的尺寸
              type: Number
          },
        score:{   //分数
              type: Number
        }
      },
      computed:{
          starType(){  //用星星的计算星星的数量
              return 'star-' + this.size;
          },
          itemClasses() {   //定义星星图片状态
            let result = [];
            let score = Math.floor(this.score *2) / 2;
            let hasDecimal = score % 1 !== 0;   //处理小数半星
            let integer = Math.floor(score);    //处理整数全星
            for (let  i=0; i < integer; i++){   //x先添加全星
                result.push(CLS_ON);
            }
            if (hasDecimal){
                result.push(CLS_HALF);    //判断是否有小数 并添加一个半星
            }
            while(result.length < LENGTH){    //循环数据传来的星数量是否小于定义的数 如果小于添加空星
                result.push(CLS_OFF)
            }
            return result;
          }
      }
  };
</script>
<style type="styles" rel="stylesheet/less" lang="less">
  @import "../../common/stylus/mixin.less";
  .star{
    font-size: 0;

    &.star-48{
      .star-item{
        display: inline-block;
        background-repeat: no-repeat;
        width: 20px;
        height:20px;
        margin-right: 20px;
        background-size: 20px 20px;
        &:last-child{
          margin-right: 0;
        }
        &.on{
          .bg-image('star48_on');
        }
        &.half{
          .bg-image('star48_half');
        }
        &.off{
          .bg-image('star48_off');
        }
      }
    }
    &.star-36{
      .star-item{
        display: inline-block;
        background-repeat: no-repeat;
        width: 15px;
        height:15px;
        margin-right: 6px;
        background-size: 15px 15px;
        &:last-child{
          margin-right: 0;
        }
        &.on{
          .bg-image('star36_on')
        }
        &.half{
          .bg-image('star36_half')
        }
        &.off{
          .bg-image('star36_off')
        }
      }
    }
    &.star-24{
      .star-item{
        display: inline-block;
        background-repeat: no-repeat;
        width: 10px;
        height:10px;
        margin-right: 3px;
        background-size: 10px 10px;
        &:last-child{
          margin-right: 0;
        }
        &.on{
          .bg-image('star24_on')
        }
        &.half{
          .bg-image('star24_half')
        }
        &.off{
          .bg-image('star24_off')
        }
      }
    }
  }
</style>
