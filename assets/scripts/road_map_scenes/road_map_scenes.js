// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let ugame =require("ugame");
let sound_manager=require("sound_manager");
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
        // lab:{
        //     type:cc.Label,
        //     default:null,
        // }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lab=cc.find("Canvas/score_back/lab").getComponent(cc.Label);
        // cc.log("lab",this.lab);
        let num=ugame.get_star_num();
        // cc.log(num,'dddddd');
        this.lab.string=num+"/"+ugame.user_data[ugame.current_user].start_total;
    },
    click_back_btn(){
        let loding_door=cc.find("Canvas/loding_door").getComponent("lodingDoor");
        // if(this.backed||loding_door.state===0){
        //     return;
        // }
        // this.backed=true;
        sound_manager.play_effect("sound/click",false);
        loding_door.close_the_door();

        this.scheduleOnce(()=>{
            cc.director.preloadScene("login", (completedCount, totalCount, item)=>{
            // this.lab.string= Math.floor(completedCount/totalCount * 100) + "%";
            },(error)=>{
                cc.director.loadScene("login");
                cc.log("加载成功");
            });

        },loding_door.duration+0.5);
       
    
        

    },

    start () {


    },

    // update (dt) {},
});
