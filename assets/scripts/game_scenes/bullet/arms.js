// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let utils=require("utils");
let actor_anim=cc.Class({
    
    name:"actor_anim",
    properties: {
        // attack:{
        //     type:cc.SpriteFrame,
        //     default:[],
        // },
        // dead:{
        //     type:cc.SpriteFrame,
        //     default:[],
        // },
        // walk:{
        //     type:cc.SpriteFrame,
        //     default:[],
        // },
        dur_attack:0.1,
        dur_dead:0.1,
        dur_walk:0.1,
    },

   
});
let cgf={
    0:{L_attack:3,L_dead:9,L_walk:15},
    1:{L_attack:3,L_dead:9,L_walk:15},
    2:{L_attack:3,L_dead:9,L_walk:15},
    3:{L_attack:4,L_dead:11,L_walk:17},
}
let State=cc.Enum({attack:0,dead:1,walk:2,idle:3});
cc.Class({
    extends: cc.Component,
    properties: {
       actor:{
            type:actor_anim,
            default:[]
       },
       level:1,
       state:{
            type:State,
            default:State.idle,
       },
       speed:200,
    },

    // LIFE-CYCLE CALLBACKS:
    async load_asset(){
        

    },
    async init_asset(){
        for(let i=0;i<4;i++){
            this.actor[i]=new actor_anim();
        }
        let dir_actor=["actor1","actor2","actor3","actor4"];
        for(let i=0;i<4;i++){
            this.dir_asset[i]=utils.initDirload("bing_tower",dir_actor[i],cc.SpriteFrame);
        }
        
    },
    async _play_attack(){
        let dir_level=await this.dir_asset[this.level-1];
        let anims=[];

        for(let i=0;i<cgf[this.level-1].L_attack;i++){
            anims.push(dir_level[i]);
        }
       

        let frame_anim= this.sp_s.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.sp_s.addComponent("frame_anim");
        }
        
       
        frame_anim.sprite_frames=anims;
        frame_anim.durtion=this.actor[this.level-1].dur_attack;
        frame_anim.play_loop();

    },
    async _play_dead(){
        let dir_level=await this.dir_asset[this.level-1];
        let anims=[];

        for(let i=cgf[this.level-1].L_attack;i<cgf[this.level-1].L_dead;i++){
            anims.push(dir_level[i]);
        }

        let frame_anim= this.sp_s.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.sp_s.addComponent("frame_anim");
        }
        
        
        frame_anim.sprite_frames=anims;
        frame_anim.durtion=this.actor[this.level-1].dur_dead;
        frame_anim.play_once();

    },

    async _play_walk(){
        let dir_level=await this.dir_asset[this.level-1];
        let anims=[];

        for(let i=cgf[this.level-1].L_dead;i<cgf[this.level-1].L_walk;i++){
            anims.push(dir_level[i]);
        }
        
        let frame_anim= this.sp_s.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.sp_s.addComponent("frame_anim");
        }
        frame_anim.sprite_frames=anims;
        frame_anim.durtion=this.actor[this.level-1].dur_walk;
        frame_anim.play_loop();

    },
    async _set_idle(){
        let dir_level=await this.dir_asset[this.level-1];//判断资源加载完成
        this.state=State.idle;
        let frame_anim= this.sp_s.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.sp_s.addComponent("frame_anim");
        }
        frame_anim.is_playing=false;//结束播放动画
        let sp=this.sp_s.getComponent(cc.Sprite);
        sp.spriteFrame=dir_level[cgf[this.level-1].L_dead];
    },

    onLoad () {
        this.ttt=0;
        this.dir_asset=[];
        this.sp_s=this.node.getChildByName("sp_s");
        this.init_asset();
        
    },

    start () {

    },

    set_walking(dst_wpos){
        this.state=State.walk;
       
        let dst_pos=this.node.parent.convertToNodeSpaceAR(dst_wpos);
        let start_pos=this.node.getPosition();
        let dir=dst_pos.sub(start_pos);
        this._len=dir.len();
        this._walk_time=this._len/this.speed;
        this._vx=this.speed*dir.x/this._len;
        this._vy=this.speed*dir.y/this._len;
        this._play_walk();

       

       
       


    },
    set_level(level){
        this.level=level;
    },
    _up_walking(dt){
        if(this._walk_time<=0){//到达目标点
           
            this._set_idle();
            this._walk_time=0;
            this._len=0;
            this._vx=0;
            this._vy=0;
          
            return;
        }
       
        
        if(dt>this._walk_time){//反映位移
            dt=this._walk_time;
        }

        let sx=dt*this._vx;
        let sy=dt*this._vy;
        this.node.x+=sx;
        this.node.y+=sy;
        this._walk_time-=dt;
    },

    update (dt) {
       
        if(this.state===State.walk){
            this._up_walking(dt);
        }
        

        
    },
});
