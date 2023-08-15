// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let connon_tower_=cc.Class({
    // extends: cc.Component,
    name:"connon_tower_",
    properties: {
        shell:{
            type:cc.SpriteFrame,
            default:null,
        },
        anim:{
            type:cc.SpriteFrame,
            default:[]
        },
        duration:0.1,
       

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});

let cgf={
    0:{delay:15,load:3},
    1:{delay:16,load:4},
    2:{delay:13,load:4},
};


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

       connon_tower:{
           type:connon_tower_,
           default:[]
       },
       grade:1,

    },

    // LIFE-CYCLE CALLBACKS:
    play_anim_1(){
        //取帧动画组件
        let frame_anim=this.node.getChildByName("anim").getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.node.getChildByName("anim").addComponent("frame_anim");
        }
        //初始化帧动画
        let connon_tower_=this.connon_tower[this.grade-1];
        frame_anim.sprite_frames=connon_tower_.anim;
        frame_anim.durtion=connon_tower_.duration;
       

        frame_anim.play_once(()=>{
            let sp=this.anim.getComponent(cc.Sprite)
            sp.spriteFrame=connon_tower_.anim[0];
        });

        this._shell_loading();

        








    },

    _shell_loading(){//炮弹装载动画
        if(this.grade===4){
            return;
        }
        //炮弹换皮
        let shell_sp= this.shell_load.getComponent(cc.Sprite);
        shell_sp.spriteFrame=this.connon_tower[this.grade-1].shell;
        //帧动画换图时间
        let duration=this.connon_tower[this.grade-1].duration;
        //赛贝尔曲线
        let start_pos=cc.v2(-23,5);
        let dst_pos=cc.v2(4,24);
        let contry_x=(start_pos.x+dst_pos.x)/2;
        let contry_y=dst_pos.y+10;
        let contry=cc.v2(contry_x,contry_y);
        let bezier=[contry,contry,dst_pos];
        let bezierto=cc.bezierTo(cgf[this.grade-1].load*duration,bezier);
        //设置装载炮弹起始位置
        this.shell_load.setPosition(start_pos);
       
       

       
        //帧动画发射完炮弹后 装载炮弹动画
        cc.tween(this.shell_load)
        .delay(cgf[this.grade-1].delay*duration)
        .call(()=>{
            this.shell_load.scale=1;
            this.shell_load.angle=0;
            //异步 --》同时执行2个动作angle bezierto
            cc.tween(this.shell_load)
            .to(cgf[this.grade-1].load*duration,{angle:-180,scale:0.7})
            .start()
        })
        .then(bezierto)
        .to(0.1,{scale:0})
        .start();

    },

    onLoad () {
        this.shell_load=this.node.getChildByName("shell_load");
        this.anim=this.node.getChildByName("anim");
       
        this.shell_load.scale=0;
        
    },

    start () {

    },

    // update (dt) {},
});
