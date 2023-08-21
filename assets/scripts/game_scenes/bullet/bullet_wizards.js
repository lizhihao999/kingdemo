// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let utils=require("utils");
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
        bomb_anim:{
            type:cc.SpriteFrame,
            default:[],
        },
        bomb_dur:0.08,
        speed:200,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bomb_anim=utils.initDirload("wizards_tower","bomb",cc.SpriteFrame);
    
        this.bullet=this.node.getChildByName("bullet");
        this.bomb=this.node.getChildByName("bomb");

    },

    shoot_at(start_wpos,dst_wpos){//子弹发射 start_wpos:开始坐标 dst_wpos:目标坐标
        //世界--》节点坐标
        if(!this.node.parent){
            return;
        }

        let start_pos=this.node.parent.convertToNodeSpaceAR(start_wpos);
        let dst_pos=this.node.parent.convertToNodeSpaceAR(dst_wpos);
        let dir=dst_pos.sub(start_pos);
        let time=dir.len()/this.speed;
        this.node.setPosition(start_pos);

        let moveto=cc.moveTo(time,dst_pos);

        cc.tween(this.node)
        .then(moveto)
        .call(()=>{
            this.play_bomb(()=>{
                // this.node.destroy();
                this.node.removeFromParent();
                // cc.assetManager.releaseAsset(this.bomb_anim);
            });
        })
        .start()




    },
    async play_bomb(endfuc){
        let frame_anim= this.bomb.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.bomb.addComponent("frame_anim");
        }
        frame_anim.set_frame_events(()=>{//关闭子弹图
            this.bullet.scale=0;

        },2)

        let bomb_anim=await this.bomb_anim;
        frame_anim.sprite_frames=bomb_anim;
        frame_anim.durtion=this.bomb_dur;
        frame_anim.play_once(endfuc);

    },

    

    start () {

    },

    // update (dt) {},
});
