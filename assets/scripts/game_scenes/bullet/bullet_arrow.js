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
        arrow_tower:{
            type:cc.Node,
            default:null,
        },
        arrow:{
            type:cc.SpriteFrame,
            default:null,
        },
        decal_arrow:{
            type:cc.SpriteFrame,
            default:null,
        },
        speed:200,
        attack:10,

    },

    // LIFE-CYCLE CALLBACKS:
    shoot_at(start_wpos,dst_wpos){
        
        let start_pos=this.node.parent.convertToNodeSpaceAR(start_wpos);
        let dst_pos=this.node.parent.convertToNodeSpaceAR(dst_wpos);
        
        let dir=dst_pos.sub(start_pos);
        let len=dir.len();
        let time=len/this.speed;
      

        this.node.setPosition(start_pos);
        this.node.angle=270;

        let contr_x=(start_pos.x+dst_pos.x)/2;
        let contr_y=(start_pos.y>dst_pos.y)?start_pos.y:dst_pos.y;
        contr_y+=20;

        let bezier = [cc.v2(contr_x,contr_y), cc.v2(contr_x,contr_y), dst_pos];//第一控制点 第二控制点 终点
        let bezierTo = cc.bezierTo(time, bezier)
        let random=Math.random()*20;
        let angle_=(start_pos.x<dst_pos.x)?-180+random:180-random;

        let fadeout = cc.fadeOut(0.3);
        cc.tween(this.node)
        .to(time, { angle:270+angle_},{easing: 'cubicOut'})
        .start();

        cc.tween(this.node)
        .then(bezierTo)
        .call(()=>{
            this.arrow_sp.spriteFrame=this.decal_arrow;
        })
        .delay(3)
        .then(fadeout)
        .call(()=>{
            this.node.removeFromParent();
        })
        .start();
    },

    onLoad () {
        // let start_wpos=cc.v2(300,260);
        // let start_pos=this.node.parent.convertToNodeSpaceAR(start_wpos);
       
        // cc.log("init_wpos",init_wpos);

        // this.shoot_at(init_wpos,cc.v2(350,300));
        this.arrow_sp=this.node.getComponent(cc.Sprite);
        // this.time=0;
    },
    

    start () {

    },

    // update (dt) {},
});
