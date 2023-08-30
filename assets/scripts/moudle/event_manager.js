// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let event_manager=cc.Class({
    properties: {
       _instance:null
    },

    get_instance(){
        if(this._instance){
            return this._instance;
        }
        this._instance=new cc.EventTarget();
        return this._instance;
    }

  
});
let _event_manager=new event_manager();
module.exports=_event_manager;
