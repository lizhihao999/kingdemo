// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let sound_manager=require("sound_manager");
let game_manager =require("game_manager");
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
        state:0,
        duration:0.5,
        disable_click:{
            type:cc.Node,
            default:null,
        },
        // l_door:{
        //     type:cc.Node,
        //     default:null,

        // },
        // r_door:{
        //     type:cc.Node,
        //     default:null,

        // }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.l_door=this.node.getChildByName("l_door");
        this.r_door=this.node.getChildByName("r_door");

        this.state=-1;//0关门 1开门 
        this.set_door_state(0);
        this.open_the_door(()=>{cc.log("hello world")});

        let active=cc.sys.localStorage.getItem("disable_click");
        if(active){
            active=parseInt(active);
        }else{
            active=0;
        }
        this.disable_click.active=true;
        cc.log("***",this.disable_click.active);

        // cc.log(this.state);

       
        

    },

    start () {
       
    },
    set_door_state(state){
        if(this.state==state){
            return;
        }
        // cc.log("****",this.node.children);
        if(state===0){
            this.l_door.x=2;
            this.r_door.x=-2;
            
        }else if(state===1){
            this.l_door.x=-cc.winSize.width/2;
            this.r_door.x=cc.winSize.width/2;
        }
        // cc.log(this.l_door.x,this.r_door.x);
        this.state=state;

    },
    open_the_door(end_fun){
        
        if(this.state==1){
            return;
        }


        this.l_door.x=2;
        this.r_door.x=-2;
        let winsize=cc.winSize;
        let l_moveby=cc.moveBy(this.duration,cc.v2(-winsize.width/2-2,0));
        let r_moveby=cc.moveBy(this.duration,cc.v2(winsize.width/2+2,0));

        cc.tween(this.l_door)
        .then(l_moveby)
        .start()

        cc.tween(this.r_door)
        .then(r_moveby)
        .call(()=>{
            this.state=1;
            // game_manager.disable_click=!game_manager.disable_click;
            let active;
            active=game_manager.disable_click?false:true;
            game_manager.set_disable_click(active);
            this.disable_click.active=false;
            // cc.log("open_the_door",active);
        })
        .start()

        if(end_fun){
            end_fun();
        }

    },

    close_the_door(end_fun){
        if(this.state===0){
            return;
        }
        // game_manager.disable_click=!game_manager.disable_click;
        let active;
        active=game_manager.disable_click?fasle:true;
        game_manager.set_disable_click(active);
        this.disable_click.active=true;

        // cc.log(active,"**");
        
        let winsize=cc.winSize;
        this.l_door.x=-winsize.width/2;
        this.r_door.x=winsize.width/2;
        
        let l_moveby=cc.moveBy(this.duration,cc.v2(winsize.width/2+2,0));
        let r_moveby=cc.moveBy(this.duration,cc.v2(-winsize.width/2-2,0));
        // cc.log(this.duration,this.l_door.x);

        cc.tween(this.l_door)
        .then(l_moveby)
        .start()

        cc.tween(this.r_door)
        .then(r_moveby)
        .call(()=>{
            this.state=0;
            sound_manager.play_effect("sound/close_door",false);
            cc.log("close_the_door");
        })
        .start()

        

        if(end_fun){
            end_fun();
        }
       

    }

    // update (dt) {},
});
