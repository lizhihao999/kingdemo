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
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.set_interface=this.node.getChildByName("gui_root").getChildByName("set_interface");
        this.bullet_root=cc.find("Canvas/bullet_root");
        this.pause_interface=this.node.getChildByName("gui_root").getChildByName("pause_interface");
        this.level_init();
        
    },
    level_init(){
        let user=ugame.get_current_cuser();
        this.blood=cc.find("Canvas/gui_root/gui_top/gui_top_bk/blood").getComponent(cc.Label);
        this.gold=cc.find("Canvas/gui_root/gui_top/gui_top_bk/gold").getComponent(cc.Label);
        this.enemy=cc.find("Canvas/gui_root/gui_top/gui_top_bk/enemy").getComponent(cc.Label);

        this.blood.string=user.blood.toString();
        this.gold.string=user.chip.toString();
        // this.enemy.string=//待定

    },

    start () {

    },
    btn_set(){
        this.set_interface.active=true;
    },
    set_interface_btn_reset(){
        this.set_interface.active=false;
        cc.log("重新开始游戏");

    },
    set_interface_goto_map_scenes(){//返回地图场景
        let loding_door=cc.find("Canvas/loding_door").getComponent("lodingDoor");
        sound_manager.play_effect("sound/click",false);
        loding_door.close_the_door();

        this.scheduleOnce(()=>{
            cc.director.preloadScene("road_map", (completedCount, totalCount, item)=>{
            // this.lab.string= Math.floor(completedCount/totalCount * 100) + "%";
            },(error)=>{
                cc.director.loadScene("road_map");
                cc.log("加载成功");
            });

        },loding_door.duration+0.5);

    },

    btn_pause(){
        this.pause_interface.active=true;
    },

    pause_interface_btn_continue(){
        this.pause_interface.active=false;
        cc.log("继续游戏");
    },



    update (dt) {
        let children = this.bullet_root.children;
        children.sort((a,b)=>{
            return b.y-a.y;
        })
    }
      
});
