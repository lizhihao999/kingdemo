// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


let arrow=cc.Class({
    
    name:"arrow",
    properties: {
        arrow_bg:{
            type:cc.SpriteFrame,
            default:null
        },
        up_idle:{
            type:cc.SpriteFrame,
            default:null
        },
        down_idle:{
            type:cc.SpriteFrame,
            default:null
        },
        up_idle_anim:{
            type:cc.SpriteFrame,
            default:[]
        },
        down_idle_anim:{
            type:cc.SpriteFrame,
            default:[]
        },
    },

   

    start () {

    },

    // update (dt) {},
});

let state=cc.Enum({up:0,down:1});
let play_cur=cc.Enum({lsh:0,rsh:1});



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
            type:arrow,
            default:[]
        },
        arrow_grade:1,//弓箭塔等级
        anim_durtion:0.1,
        bullet:{
            type:cc.Prefab,
            default:null,
        },
        bullet_root_path:"Canvas/bullet_root"
    },
    init(level,pos){//初始化弓箭塔
        this.arrow_grade=level;
        let wpos=this.node.parent.convertToWorldSpaceAR(pos);
        let _pos=this.node.parent.convertToNodeSpaceAR(wpos);
        this.node.setPosition(_pos);
        this.set_arrow_grade(state.down);
        // this.is_shoot=true;
    },

    upgrade(){
        if(this.arrow_grade>4){
            return;
        }
        this.arrow_grade++;
        this.set_arrow_grade(state.down);

    },

    



    _set_spf(node,state_){//节点 状态
        let sp=node.getComponent(cc.Sprite);
        switch (state_) {
            case state.up:
                sp.spriteFrame=this.arrow_tower[this.arrow_grade-1].up_idle;
                break;
            case state.down:
                sp.spriteFrame=this.arrow_tower[this.arrow_grade-1].down_idle;
            
                break;
            default:
                break;
        }
    },
    set_arrow_grade(state_){//状态（上下)

        let bg_sp=this.arrow_bg.getComponent(cc.Sprite);
        bg_sp.spriteFrame=this.arrow_tower[this.arrow_grade-1].arrow_bg;
        switch (state_) {
            case state.up:
                this._set_spf(this.lsh,state.up);
                this._set_spf(this.rsh,state.up);
                
                break;
            case state.down:
                this._set_spf(this.lsh,state.down);
                this._set_spf(this.rsh,state.down);
                
                break;
            default:
                break;
        }
    },

    _shoot_anim(node,state_){
        let frame_anim=node.getComponent("frame_anim");
        if(!frame_anim){
            node.addComponent("frame_anim");
            frame_anim=node.getComponent("frame_anim");
        }
        switch (state_) {
            case state.up:
                frame_anim.sprite_frames=this.arrow_tower[this.arrow_grade-1].up_idle_anim;
                break;
            case state.down:
                frame_anim.sprite_frames=this.arrow_tower[this.arrow_grade-1].down_idle_anim;
                break;
            default:
                break;
        }

        frame_anim.durtion=this.anim_durtion;
        frame_anim.play_once(()=>{
            this._set_spf(node,state_)
        });
    },

    shoot_at(dst_wpos){//交叉攻击
        
         //生成预制体子弹
         let node=cc.instantiate(this.bullet);
         let bullet_root=cc.find(this.bullet_root_path);
         
         bullet_root.addChild(node);

        switch (this._play_cur) {
            case play_cur.lsh:
                let start_wpos=this.lsh.convertToWorldSpaceAR(cc.v2(0,0));
                dst_wpos=cc.v2(start_wpos.x+dst_wpos.x,start_wpos.y+dst_wpos.y);

                
                //射箭动画
                let state_=(start_wpos.y<dst_wpos.y)?state.up:state.down;
                this._shoot_anim(this.lsh,state_);
                this._play_cur=play_cur.rsh;

                //发射弓箭
                let node_com=node.getComponent("bullet_arrow");
                node_com.shoot_at(start_wpos,dst_wpos);
                break;
            case play_cur.rsh:

                start_wpos=this.rsh.convertToWorldSpaceAR(cc.v2(0,0));
                dst_wpos=cc.v2(start_wpos.x+dst_wpos.x,start_wpos.y+dst_wpos.y);

                
                //射箭动画
                state_=(start_wpos.y<dst_wpos.y)?state.up:state.down;
                this._shoot_anim(this.rsh,state_);
                this._play_cur=play_cur.lsh;
               
                //发射弓箭
                node_com=node.getComponent("bullet_arrow");
                node_com.shoot_at(start_wpos,dst_wpos);

               
                break;
            default:
                break;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.arrow_bg=this.node.getChildByName("arrow_bg");
        this.lsh=this.node.getChildByName("lsh");
        this.rsh=this.node.getChildByName("rsh");

        // this.arrow_grade=4;
        this._play_cur=play_cur.lsh;
        this.play_time=0;
        this.is_shoot=false;
       

        

    },

    start () {

    },

    update (dt) {
        // if(!this.is_shoot){
        //     return;
        // }
        this.play_time+=dt;
        if(this.play_time<1){
            return;
        }
        this.play_time=0;

        //测试 目标为半径50圆上的随机一个点
        let r=50;
        let degree=2*Math.PI*Math.random();
        let dst_wpos=cc.v2(r*Math.cos(degree),r*Math.sin(degree));
        //
        this.shoot_at(dst_wpos);

    },
});
