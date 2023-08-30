// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let ugame=require("ugame_s");
// let ugame=null;
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
        prefab_level:{
            type:cc.Prefab,
            default:null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.leves_pos=[];
        this.anim=this.node.getComponent(cc.Animation);
        this.clips=this.anim.getClips();
        this.get_leves_pos();
        this.new_level=this.node.getChildByName("History_level_root").getChildByName("new_level");
        ugame.user_data[0].new_level=6;
        let new_lever_info=ugame.get_current_cuser().new_level;
        this.show_levels(new_lever_info);

        

        
       
        
    },

    show_levels(new_level){//第几关
        let lever_info=ugame.get_current_cuser().lever_info_start;
        for(let i=0;i<new_level-1;i++){//实例化旧关卡
            if(new_level>19){
                break;
            }
            let level=cc.instantiate(this.prefab_level);
            this.node.getChildByName("History_level_root").addChild(level);
            let level_com=level.getComponent("LevelPrefab");
            level_com.set_star_num(lever_info[i]);
            level.setPosition(this.leves_pos[i]);

            let button=level_com.icon.getComponent(cc.Button);
            let eventHandler = new cc.Component.EventHandler();
            eventHandler.target =this.node;//调用函数脚本节点
            eventHandler.component = "load_level";//调用函数的脚本名字
            eventHandler.handler = "goto_game_level";//调用回调函数
            eventHandler.customEventData =''+(i+1);//传输的数据
            button.clickEvents.push(eventHandler);//加入数组

            
        }
        //新关卡位置
        // cc.log(this.leves_pos[new_level-1]);
        this.new_level.setPosition(this.leves_pos[new_level-1]);

        let button=this.new_level.getComponent(cc.Button);
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target =this.node;//调用函数脚本节点
        eventHandler.component = "load_level";//调用函数的脚本名字
        eventHandler.handler = "goto_game_level";//调用回调函数
        eventHandler.customEventData =''+(new_level);//传输的数据
        button.clickEvents.push(eventHandler);//加入数组
    },

    goto_game_level(event,index){//进入游戏关卡
        let loding_door=cc.find("Canvas/loding_door").getComponent("lodingDoor");
        sound_manager.play_effect("sound/click",false);
        loding_door.close_the_door();

        index=parseInt(index);
        ugame.set_level_num(index);
        // cc.log(index);
        this.scheduleOnce(()=>{
            cc.director.preloadScene("game", (completedCount, totalCount, item)=>{
            // this.lab.string= Math.floor(completedCount/totalCount * 100) + "%";
            },(error)=>{
                cc.director.loadScene("game");
                cc.log("加载成功");
            });
        },loding_door.duration+0.5);
    },

    get_leves_pos(){//获取19个关卡的点
        let pos=this.clips[0].curveData.paths["History_level_root/level1"].props.position;
        let motionPath=pos[0].motionPath;
        this.leves_pos.push(cc.v2(pos[0].value[0],pos[0].value[1]));
        // cc.log(pos[0].value[0],pos[0].value[1]);
        // cc.log(pos);

        for(let i=0;i<17;i++){
            let pos=cc.v2(motionPath[i][0],motionPath[i][1]);
            this.leves_pos.push(pos);
        }
        this.leves_pos.push(cc.v2(pos[1].value[0],pos[1].value[1]));
        // cc.log(this.leves_pos);





    },

    

    start () {
       

    },

    // update (dt) {},
});
