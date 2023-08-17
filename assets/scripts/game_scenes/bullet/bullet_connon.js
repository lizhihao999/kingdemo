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
        bom_anim:{
            type:cc.SpriteFrame,
            default:[],
        },
        // bullet_sp:{
        //     type:cc.Sprite,
        //     default:null,
        // },
        speed:200,
        attack:10,
        bom_duration:0.08,
        

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim=this.node.getChildByName("anim");
        this.bullet=this.node.getChildByName("bullet");
        this.bullet_sp=this.bullet.getComponent(cc.Sprite);
        
        this.bullet.scale=0;
    },
    shoot_at(start_wpos,dst_wpos){
        // cc.log("diaoyonglebullet");
        //世界坐标--》子弹节点坐标
        let start_pos=this.node.convertToNodeSpaceAR(start_wpos);
        let dst_pos=this.node.convertToNodeSpaceAR(dst_wpos);
        //时间
        let dir=start_pos.sub(dst_pos);//向量dst_pos-start_pos
        let len=dir.len();
        let time=len/this.speed;

        //塞贝尔曲线
        this.bullet.setPosition(start_pos);
        let contry_x=(start_pos.x+dst_pos.x)/2;
        let contry_y=(start_pos.y>dst_pos.y)?start_pos.y:dst_pos.y;
        contry_y+=40;
        let contry=cc.v2(contry_x,contry_y);
        //抛物线+渐隐 
        let bezier=[cc.v2(start_pos.x,start_pos.y+100),contry,dst_pos];
        let bezierto=cc.bezierTo(time,bezier);
        // let fadeOut=cc.fadeIn(0.2);

        this.bullet.scale=1;
        cc.tween(this.bullet)
        .then(bezierto)
        // .then(fadeOut)
        .call(()=>{
            this.play_bom_anim();
        })

        .start()

       
        let angle_=(dir.x>0)?180-Math.random()*20:-180+Math.random()*20;

        //旋转
        cc.tween(this.bullet)
        .to(time,{angle:angle_})
        .start()


    },

    play_bom_anim(){
        
        let pos=this.bullet.getPosition();
        this.anim.setPosition(pos);
        //获取帧动画组件
        let frame_anim=this.anim.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.anim.addComponent("frame_anim");
        }

        frame_anim.set_frame_events(()=>{
            this.bullet.scale=0;

        },2)

        frame_anim.durtion=this.bom_duration;
        frame_anim.sprite_frames=this.bom_anim;
        frame_anim.play_once(()=>{
            this.node.removeFromParent();
        });


    },
    set_bullet_skin(bullet_sp){//子弹换皮
       
        this.bullet_sp.spriteFrame=bullet_sp;
        // cc.log(this.bullet);
    },
    start () {

    },

    // update (dt) {},
});
