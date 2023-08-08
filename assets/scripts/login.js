// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
// var loding_door=require("loding_door");
let sound_manager=require("sound_manager");
let ugame =require("ugame");

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
        // door:{
        //     type:loding_door,
        //     default:null,
        // }
    },

    // LIFE-CYCLE CALLBACKS:
    show_local_userdata(player_com,index){
        player_com.string=ugame.user_data[index].start_num+"/"+ugame.user_data[index].start_total;
    },
    onLoad () {
        // this.started=false;
        // this.abouted=false;
        let loding_door=cc.find("Canvas/loding_door").getComponent("lodingDoor");

        this.anim_login=cc.find("Canvas/start_anim_root").getComponent(cc.Animation);
        this.anim_close=cc.find("Canvas/close_root").getComponent(cc.Animation);

        this.player1=cc.find("Canvas/close_root/user_info_up/star_num").getComponent(cc.Label);
        this.player2=cc.find("Canvas/close_root/user_info_mid/star_num").getComponent(cc.Label);
        this.player3=cc.find("Canvas/close_root/user_info_dow/star_num").getComponent(cc.Label);


        cc.log(this.player1);

        for (let i=0; i < this.anim_login.node.childrenCount; i++) {
            this.anim_login.node.children[i].active=false;
        }

        this.anim_login.on('play',()=>{
            loding_door.disable_click.active=true;
           
        }, this);
        this.anim_login.on('finished',()=>{
            loding_door.disable_click.active=false;
           
        }, this);

        this.anim_close.on('play',()=>{
            loding_door.disable_click.active=true;
           
        }, this);
        this.anim_close.on('finished',()=>{
            loding_door.disable_click.active=false;
           
        }, this);
        let num=ugame.get_star_num();
        this.player1.string=num+"/"+ugame.user_data[ugame.current_user].start_total;

        this.show_local_userdata(this.player1,0);
        this.show_local_userdata(this.player2,1);
        this.show_local_userdata(this.player3,2);

        
        

    },

    start () {
        let start_button=cc.find("Canvas/start_anim_root/start_button/start_up");
        let button=start_button.getComponent(cc.Button);
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target =this.node;//调用函数脚本节点
        eventHandler.component = "login";//调用函数的脚本名字
        eventHandler.handler = "click_start_button";//调用回调函数
        eventHandler.customEventData ="100";//传输的数据
        button.clickEvents.push(eventHandler);//加入数组

        let about_button=cc.find("Canvas/start_anim_root/about_botton/about_up");
        let about_btn_ccom=about_button.getComponent(cc.Button);
        let eventHandler_about = new cc.Component.EventHandler();
        eventHandler_about.target =this.node;//调用函数脚本节点
        eventHandler_about.component = "login";//调用函数的脚本名字
        eventHandler_about.handler = "click_about_btn";//调用回调函数
        eventHandler_about.customEventData ="100";//传输的数据
        about_btn_ccom.clickEvents.push(eventHandler_about);//加入数组



       
        // cc.log(sound_manager.b_effect_mute);
        let loding_door=cc.find("Canvas/loding_door").getComponent("lodingDoor");
        this.scheduleOnce(()=>{
            let state=this.anim_login.play("anim_login");
        },loding_door.duration)

        // this.anim_login.on('finished',()=>{
           
        // }, this);

        

        

        this.anim_login_clips=this.anim_login.getClips();
        cc.log(this.anim_login_clips);

       



       


       
       

       
        

    },
    click_start_button(e,str){
        cc.log(e,str);
        // if(this.started||loding_door.state===0){
        //     return;
        // }
        sound_manager.play_effect("sound/click",false);
        // cc.log(loding_door.state,this.started);
        // this.started=true;
        let state = this.anim_login.play("anim_login");
        state.wrapMode = cc.WrapMode.Reverse;

        this.anim_login.once('finished', ()=>{
            let state_close = this.anim_close.play("anim_close_up");
            state_close.wrapMode = cc.WrapMode.Normal;
        })

       


        



        // cc.log(state);


       

        // this.anim_login_clips[0].wrapMode=36;
        // this.anim_login.play("anim_login");
        // cc.log(this.anim_login_clips[0].wrapMode);

        
        
        // loding_door.close_the_door();
        
    },
    click_about_btn(){
        let loding_door=cc.find("Canvas/loding_door").getComponent("lodingDoor");
        // if(this.abouted||loding_door.state===0){
        //     return;
        // }
        // this.abouted=true;
        sound_manager.play_effect("sound/click",false);
        loding_door.close_the_door();

        this.scheduleOnce(()=>{
            cc.director.preloadScene("about", (completedCount, totalCount, item)=>{
            // this.lab.string= Math.floor(completedCount/totalCount * 100) + "%";
            },(error)=>{
                cc.director.loadScene("about");
                cc.log("加载成功");
            });

        },loding_door.duration+0.5);
       
    
        

    },

    click_close_x_(){
        let state_close = this.anim_close.play("anim_close_up");
        state_close.wrapMode = cc.WrapMode.Reverse;

        // let on_click_close_x=3;
        // this.anim_close.on('finished',()=>{
        //     if(on_click_close_x===3){
        //         let state=this.anim_login.play("anim_login");
        //         state.wrapMode=cc.WrapMode.Normal;
        //     }
            
           
        // }, this);


        this.anim_close.once('finished', ()=>{
            let state=this.anim_login.play("anim_login");
            state.wrapMode=cc.WrapMode.Normal;
        })

    },
    click_goto_map_scenes(event,index){
        index=parseInt(index);
        ugame.set_current_user(index);//第几个存档

        let loding_door=cc.find("Canvas/loding_door").getComponent("lodingDoor");
        sound_manager.play_effect("sound/click",false);
        loding_door.close_the_door();

        this.scheduleOnce(()=>{
            cc.director.preloadScene("road_map", (completedCount, totalCount, item)=>{
            // this.lab.string= Math.floor(completedCount/totalCount * 100) + "%";
            },(error)=>{
                cc.director.loadScene("road_map");
                cc.log("加载成功read_map");
            });

        },loding_door.duration+0.5);


    }


    

    // update (dt) {},
});
