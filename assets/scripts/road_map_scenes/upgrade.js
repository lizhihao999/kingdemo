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
        // this.skill_1_root=this.node.getChildByName("skill_1_root");
        // let skill=this.node.getChildByName("skill_1");
        // cc.log(skill);
        // cc.log("childreneount",this.node.childrenCount,"skill_"+1);
        for(let j=0;j<this.node.childrenCount-4;j++){//减少一个mask节点
            let skill=this.node.getChildByName("skill_"+(j+1));
            
            for(let i=0;i<skill.childrenCount;i++){
               
                let str=j+1;
                str=str.toString();
                str=str+(i+1);
                let node=skill.getChildByName(str);
                let btn1=node.getChildByName("btn1").getComponent(cc.Button);

                let eventHandler_about = new cc.Component.EventHandler();
                eventHandler_about.target =this.node;//调用函数脚本节点
                eventHandler_about.component = "upgrade";//调用函数的脚本名字
                eventHandler_about.handler = "chlick_btn1";//调用回调函数
                eventHandler_about.customEventData =str;//传输的数据
                btn1.clickEvents.push(eventHandler_about);//加入数组
    
            }



        }
        

    },

    chlick_btn1(event,index){
        let skill_node=event.target.parent;
        let icon_btn2=skill_node.getChildByName("icon_btn2").getComponent(cc.Button);
        let star_bg=skill_node.getChildByName("star_bg").getComponent(cc.Button);
        

        let falg=icon_btn2.interactable;
        icon_btn2.interactable=!falg;
        star_bg.interactable=!falg;

        cc.log(index);


    },

    chilck_back(){
        this.node.active=false;

    },

    start () {

    },

    // update (dt) {},
});
