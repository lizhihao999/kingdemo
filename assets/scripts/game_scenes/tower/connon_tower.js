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
    0:{delay:15,load:3,shoot:9},
    1:{delay:16,load:4,shoot:9},
    2:{delay:13,load:4,shoot:9},
    3:{shoot1:14,shoot2:36},
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
       bullet_4_2:{
        type:cc.SpriteFrame,
        default:null,
       },
       grade:1,
       bullet:{
        type:cc.Prefab,
        default:null,
    },
    bullet_root_path:"Canvas/map_root/bullet_root",

    },

    // LIFE-CYCLE CALLBACKS:
    shoot_at(dst_wpos){
        //取帧动画组件
        let frame_anim=this.node.getChildByName("anim").getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.node.getChildByName("anim").addComponent("frame_anim");
        }
        //初始化帧动画
        let connon_tower_=this.connon_tower[this.grade-1];
        frame_anim.sprite_frames=connon_tower_.anim;
        frame_anim.durtion=connon_tower_.duration;

         //获取开始 目标坐标
        let start_pos=cc.v2(4,24);
        let start_wpos=this.node.convertToWorldSpaceAR(start_pos);//炮塔节点坐标系
        //目标坐标 随机 圆
        let r=60;
        let angle=Math.random()*Math.PI*2;
        let offset=cc.v2(Math.cos(angle)*r,Math.sin(angle)*r);
        dst_wpos=cc.v2(start_wpos.x,start_wpos.y);
        dst_wpos.x+=offset.x;//测试坐标
        dst_wpos.y+=offset.y;

        if(this.grade===4){
            frame_anim.set_frame_events(()=>{
                this._bullet_shoot_at(start_wpos,dst_wpos,this.connon_tower[this.grade-1].shell);
                cc.log("发射炮弹1号");
            },cgf[this.grade-1].shoot1);

            frame_anim.set_frame_events(()=>{
                //特殊小炮台 -->始坐标重新处理
                let start_pos=cc.v2(-21,27);
                let start_wpos=this.node.convertToWorldSpaceAR(start_pos);//炮塔节点坐标系

                this._bullet_shoot_at(start_wpos,dst_wpos,this.bullet_4_2);
                cc.log("发射炮弹2号");
            },cgf[this.grade-1].shoot2);

        }else{
            frame_anim.set_frame_events(()=>{
                this._bullet_shoot_at(dst_wpos,this.connon_tower[this.grade-1].shell);
                cc.log("发射炮弹");
            },cgf[this.grade-1].shoot);
           
            frame_anim.set_frame_events(()=>{
               
                this._shell_loading();
                cc.log("装载炮弹");
            },cgf[this.grade-1].delay);
        }

       
       
        
        frame_anim.play_once(()=>{
            let sp=this.anim.getComponent(cc.Sprite)
            sp.spriteFrame=connon_tower_.anim[0];
        });
        

        

        

        








    },

    _bullet_shoot_at(start_wpos,dst_wpos,shell_sp){
        //实例化子弹
        let bullet_root=cc.find(this.bullet_root_path);
        let node=cc.instantiate(this.bullet);
        bullet_root.addChild(node);
        let bullet_com=node.getComponent("bullet_connon");
        //根据等级换皮炮弹
        bullet_com.set_bullet_skin(shell_sp);

        
        //发射
        bullet_com.shoot_at(start_wpos,dst_wpos);
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
       
       
        this.shell_load.angle=45;
       
        //帧动画发射完炮弹后 装载炮弹动画
        cc.tween(this.shell_load)
        // .delay(cgf[this.grade-1].delay*duration)
        .call(()=>{
            this.shell_load.scale=1;
            this.shell_load.angle=0;
            //异步 --》同时执行2个动作angle bezierto

            // cc.tween(this.shell_load)
            // .to(cgf[this.grade-1].load*duration,{angle:0})
            // .start()
        })
        .then(bezierto)
        .to(0.1,{scale:0})
        .start();

    },

    onLoad () {
        this.shell_load=this.node.getChildByName("shell_load");
        this.anim=this.node.getChildByName("anim");
       
        this.shell_load.scale=0;
        this.grade=4;
        this.shoot_tiem=0;//发射时间
        
    },

    start () {

    },

    update (dt) {
        this.shoot_tiem+=dt;
        if(this.shoot_tiem<4){
            // cc.log(this.shoot_tiem);
            return;
        }
        //测试
        this.shoot_tiem=0;
        // let r=60;
        // let angle=Math.random()*Math.PI*2;
        // let offset=cc.v2(Math.cos(angle)*r,Math.sin(angle)*r);
        this.shoot_at();
        
        
       
    },
});
