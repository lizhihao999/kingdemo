// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.skill_1_root=this.node.getChildByName("skill_1_root");
        // let skill=this.node.getChildByName("skill_1");
        // cc.log(skill);
        // cc.log("childreneount",this.node.childrenCount,"skill_"+1);
        let loding_door=cc.find("Canvas/loding_door").getComponent("lodingDoor");
        this.anim=this.node.getComponent(cc.Animation);
        this.anim.on('play',()=>{
            loding_door.disable_click.active=true;
           
        }, this);
        this.anim.on('finished',()=>{
            loding_door.disable_click.active=false;
           
        }, this);



        this.skill=this.node.getChildByName("skill");
        this.star_lab=this.node.getChildByName("star").getChildByName("lab").getComponent(cc.Label);
        this.star_lab.string=ugame.user_data[ugame.current_user].start_num.toString();

        this.show_init();
        
        

    },
    show_init(){
        for(let j=0;j<this.skill.childrenCount;j++){//减少一个mask节点
            let skill=this.skill.getChildByName("skill_"+(j+1));
            let on_icon=ugame.user_data[ugame.current_user].skill_info[j];
            
            for(let i=0;i<skill.childrenCount;i++){
               
                let str=j+1;
                str=str.toString();
                str=str+(i+1);
                let node=skill.getChildByName(str);
                let btn1=node.getChildByName("btn1").getComponent(cc.Button);
                let icon_btn2=node.getChildByName("icon_btn2").getComponent(cc.Button);
                let star_bg=node.getChildByName("star_bg").getComponent(cc.Button);
                let lab=star_bg.node.getChildByName("lab").getComponent(cc.Label);
                let cost=ugame.skill_upgrade_config[j][i];//升级费用
                lab.string=cost.toString();
                if(on_icon>0){
                    on_icon--;
                    icon_btn2.interactable=true;
                    star_bg.interactable=true;

                }else{
                    icon_btn2.interactable=false;
                    star_bg.interactable=false;
                }
                
                

                let eventHandler_about = new cc.Component.EventHandler();
                eventHandler_about.target =this.node;//调用函数脚本节点
                eventHandler_about.component = "upgrade";//调用函数的脚本名字
                eventHandler_about.handler = "chlick_btn1";//调用回调函数
                eventHandler_about.customEventData =str;//传输的数据
                btn1.clickEvents.push(eventHandler_about);//加入数组
    
            }



        }
    },

    skill_reset(){
        for(let j=0;j<this.skill.childrenCount;j++){//减少一个mask节点
            ugame.user_data[ugame.current_user].skill_info[j]=0;
            let skill=this.skill.getChildByName("skill_"+(j+1));
            for(let i=0;i<skill.childrenCount;i++){
                let str=j+1;
                str=str.toString();
                str=str+(i+1);
                let node=skill.getChildByName(str);
                let icon_btn2=node.getChildByName("icon_btn2").getComponent(cc.Button);
                let star_bg=node.getChildByName("star_bg").getComponent(cc.Button);
                icon_btn2.interactable=false;
                star_bg.interactable=false;
            }
        }
        ugame.user_data[ugame.current_user].start_num=ugame.get_star_num();
        this.star_lab.string=ugame.user_data[ugame.current_user].start_num.toString();



    },

    chlick_btn1(event,index){//处理技能显示 升级
         
        let skill_node=event.target.parent;
        let icon_btn2=skill_node.getChildByName("icon_btn2").getComponent(cc.Button);
        let star_bg=skill_node.getChildByName("star_bg").getComponent(cc.Button);
        

        let skill_level_index=parseInt(index[1]);//多少级
        let skill_index=parseInt(index[0]);//技能类型
        let cost=ugame.skill_upgrade_config[skill_index-1][skill_level_index-1];//升级费用
        let star_num=ugame.user_data[ugame.current_user].start_num;//星星数量
        let skill_level= ugame.user_data[ugame.current_user].skill_info[skill_index-1];//技能等级
        if(skill_level_index>5||cost>star_num){
            cc.log("return");
            return;
        }

        if(skill_level_index-skill_level==1){//可以升级
            icon_btn2.interactable=true;
            star_bg.interactable=true;
            skill_level++;
            star_num-=cost;
            this.star_lab.string=star_num.toString();
        }
        ugame.skill_upgrade_config[skill_index-1][skill_level_index-1]=cost;//升级费用
        ugame.user_data[ugame.current_user].start_num=star_num;//星星数量
        ugame.user_data[ugame.current_user].skill_info[skill_index-1]=skill_level;//关卡等级

    },
    click_save(){//存档
        ugame.save_data_local();

    },

    chilck_back(){

        // this.node.active=false;
        let state = this.anim.play("anim_upgrade");
        state.wrapMode = cc.WrapMode.Reverse;
       


    },

    start () {

    },

    // update (dt) {},
});
