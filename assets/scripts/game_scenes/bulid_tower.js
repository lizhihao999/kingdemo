// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let utils=require("utils");
let cgf_com={0:"arrow_tower",
1:"baracks_tower",
2:"connon_tower",
3:"wizards_tower"};
let event_manager=require("event_manager");
cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    // LIFE-CYCLE CALLBACKS:
  
    onLoad () {
        this.eventmanger=event_manager.get_instance();
        this.space=this.node.getChildByName("space_btn");//y
        this.build_tower=null;//塔的节点
        this.type_tower=-1;
       
    },
    click_space_btn(){
        //选者是那块空地
        this.eventmanger.emit("space_taget",this.node);
       
        if(this.build_tower===null){//没有建塔
            cc.log("塔不存在");
          
            this.eventmanger.emit("open_gui_create");
        }else{
            cc.log("塔存在");
            cc.log(this.build_tower);
            this.eventmanger.emit("open_gui_upgrade");
            
        }
    },
   
    
    start () {

    },
    
  
       
  
    
    // update (dt) {},
});
