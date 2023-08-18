// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let utils=require("utils");
let wizards_=cc.Class({
    name:"wizards",
    properties: {
        anim:{
            type:cc.SpriteFrame,
            default:[],
        },
        hero:{
            type:cc.SpriteFrame,
            default:[],
        },
        anim_dur:0.1,
        hero_dur:0.1,
        d:0,
    },
});

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
        wizards:{
            type:wizards_,
            default:[],
        }
        

    },

    // LIFE-CYCLE CALLBACKS:

   

    onLoad () {
        //加载 包
        // let asset_cgf=
        this.sp;
        let dirload=utils.initDirload("wizards_tower","shoot_man_2",cc.SpriteFrame);

        this.sp=dirload;
        cc.log(this.sp);

    },

    start () {

    },

    // update (dt) {},
});
