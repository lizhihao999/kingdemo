// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var _64bitData=cc.Class({
    properties: {
        value:0,
        bit:0,
    },
   
    ctor: function () {
        
    },
    init:function(bit,value){
       this.value=value;
       this.bit=bit;
    },
    read_bit(bit){
        let num=1<<bit-1;//第几位的数 1左移n-1
        let num1=(this.value&num)>>bit-1;//状态
        return num1;
    },
    write_bit(bit,state){
        if(state===0){
            let num3=~(1<<bit-1);//第几位的数 1左移n-1
            this.value=num3&this.clicked;
        }else if(state===1){
            let num4=1<<bit-1;
            this.value=num4|this.value;
        }
    },




    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },

    // update (dt) {},
});

module.exports=_64bitData;
