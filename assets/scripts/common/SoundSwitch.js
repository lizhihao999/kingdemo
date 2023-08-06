// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let sound_manager=require("sound_manager");
const State=cc.Enum({on:0,off:1});
const Type=cc.Enum({music:0,effect:1});
cc.Class({
    extends: cc.Component,

    properties: {
       on_sp:{
        type:cc.SpriteFrame,
        default:null,
       },
       off_sp:{
        type:cc.SpriteFrame,
        default:null,
       },
       sound_type:{
        type:Type,
        default:Type.music,
       },
       state:{
        type:State,
        default:State.on,
       }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sp=this.node.getComponent(cc.Sprite);
    },

    start () {
        // let music_mute=cc.sys.localStorage.getItem("music_mute");
        // if(music_mute){
        //     music_mute=parseInt(music_mute);
        // }else{
        //     music_mute=0;
        // }
        // cc.log("***",music_mute);
       
        // sound_manager.set_music_mute(music_mute);


        if(this.sound_type===Type.music){
           
            let music_mute=cc.sys.localStorage.getItem("music_mute");
            cc.log(music_mute);
            if(music_mute){
                music_mute=parseInt(music_mute);
            }else{
                music_mute=0;
            }

            if(music_mute===0){
                this.state=State.on;
            }else if(music_mute===1){
                this.state=State.off;
            }
            
           
        }else if(this.sound_type===Type.effect){
            let effect_mute=cc.sys.localStorage.getItem("effect_mute");
            if(effect_mute){
                effect_mute=parseInt(effect_mute);
            }else{
                effect_mute=0;
            }

            if(effect_mute===0){
                this.state=State.on;
            }else if(effect_mute===1){
                this.state=State.off;
            }
            // this.state=music_mute;
        }


        if(this.state===State.on){
            this.sp.spriteFrame=this.on_sp;
        }else if(this.state===State.off){
            this.sp.spriteFrame=this.off_sp;
        }



    },

    click_btn(){
       

        if(this.state===State.on){
            this.sp.spriteFrame=this.off_sp;
            this.state=State.off;
        }else if(this.state===State.off){
            this.sp.spriteFrame=this.on_sp;
            this.state=State.on;
        }

        if(this.sound_type===Type.music){
            let music_mute=(sound_manager.b_music_mute)?0:1;
            sound_manager.set_music_mute(music_mute);
           
        }else if(this.sound_type===Type.effect){
            let effect_mute=(sound_manager.b_effect_mute)?0:1;
            sound_manager.set_effect_mute(effect_mute);
        }





    }

    // update (dt) {},
});
