// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.star=[];
        this.start1_dead=this.node.getChildByName("start1").getChildByName("start_bright").getChildByName("start_dead");
        this.start2_dead=this.node.getChildByName("start2").getChildByName("start_bright").getChildByName("start_dead");
        this.start3_dead=this.node.getChildByName("start3").getChildByName("start_bright").getChildByName("start_dead");

        this.star[0]=this.start1_dead;
        this.star[1]=this.start2_dead;
        this.star[2]=this.start3_dead;

        this.icon=this.node.getChildByName("passed_entry_icon");
    },
    set_star_num(start_num){
        // start_num-=1;
        if(start_num>3){
            cc.log("level_prefab.js-->set_star_num(start_num>3||start_num<0)");
            return;
        }
        // cc.log(start_num);
        for(let i=0;i<start_num;i++){
            let temp=this.star[i];
            temp.active=false;
        }
    },

   
    start () {

    },

    // update (dt) {},
});
