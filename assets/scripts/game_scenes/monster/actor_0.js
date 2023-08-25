// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let utils=require("utils");
let actor_0_asset=cc.Class({
    name:"actor_0_asset",

    properties: {
        attack:{
            type:cc.SpriteFrame,
            default:[],
        },
        dead:{
            type:cc.SpriteFrame,
            default:[],
        },
        walk:{
            type:cc.SpriteFrame,
            default:[],
        },
        attack_dur:0.1,
        dead_dur:0.1,
        walk_dur:0.1,
      
    },
});
let State=cc.Enum({
    idle:0,
    attack:1,
    dead:2,
    walk:3,
    end_walk:4,
});

let Dirention=cc.Enum({
    left:0,
    right:1,
    up:2,
    down:3,

})
cc.Class({
    extends: cc.Component,

    properties: {
        asset:{
            type:actor_0_asset,
            default:[],
        },
       speed:200,
       state:{
            type:State,
            default:State.walk,
        },
    },

    async loding_asset(){//加载资源
        //初始化wizards
       for(let i=0;i<1;i++){
            this.asset[i]=new actor_0_asset();
       }
       this.asset[0].attack=utils.initDirload("actor0","attack",cc.SpriteFrame);
       this.asset[0].dead=utils.initDirload("actor0","dead",cc.SpriteFrame);
       this.asset[0].walk=await utils.initDirload("actor0","walk",cc.SpriteFrame);
       cc.log("资源加载完成");


    
    },
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sp=this.node.getChildByName("sp");
        this.loding_asset();
        this._vx=0;
        this._vy=0;
        this.walk_time=0;

      


    },
    async play_attack(){
        let frame_anim= this.sp.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.sp.addComponent("frame_anim");
        }
        let attack=await this.asset[0].attack;
        frame_anim.sprite_frames=attack;
        frame_anim.durtion=this.asset[0].attack_dur;
        frame_anim.play_loop();
        
    },
    async play_dead(){
        let frame_anim= this.sp.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.sp.addComponent("frame_anim");
        }
        let dead=await this.asset[0].dead;
        frame_anim.sprite_frames=dead;
        frame_anim.durtion=this.asset[0].dead_dur;
        frame_anim.play_loop();
    },
    async play_walk(direction){
        let cgf={left:{start:0,end:5},up:{start:6,end:18},down:{start:19,end:32}}
        let walk=await this.asset[0].walk;
        let walk_dir=[];
        if(direction===Dirention.left){
            for(let i=cgf.left.start;i<cgf.left.end;i++){
                walk_dir.push(walk[i]);
            }
             this.node.scaleX=-1;
        }else if(direction===Dirention.right){
            for(let i=cgf.left.start;i<cgf.left.end;i++){
                walk_dir.push(walk[i]);
            }
            this.node.scaleX=1;
        }else if(direction===Dirention.up){
            for(let i=cgf.up.start;i<cgf.up.end;i++){
                walk_dir.push(walk[i]);
            }
        }else if(direction===Dirention.down){
            for(let i=cgf.down.start;i<cgf.down.end;i++){
                walk_dir.push(walk[i]);
            }
        }
        let frame_anim= this.sp.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.sp.addComponent("frame_anim");
        }
       
        frame_anim.sprite_frames=walk_dir;
        frame_anim.durtion=this.asset[0].walk_dur;
        frame_anim.play_loop();
        
    },
    async _set_idle(){//怪一般没有这个状态
        this.state=State.idle;
        let walk=await this.asset[0].walk;//判断资源加载完成
        this.state=State.idle;
        let frame_anim= this.sp.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.sp.addComponent("frame_anim");
        }
        frame_anim.is_playing=false;//结束播放动画
        let sp=this.sp.getComponent(cc.Sprite);
        sp.spriteFrame=walk[0];
    },
    walk_to_next(){
        
        this.state=State.walk;
        let end__pos=this.path_data[this.start_index+1];
        let end_wpos=this.node.parent.convertToWorldSpaceAR(end__pos);
        let end_pos=this.node.parent.convertToNodeSpaceAR(end_wpos);
        let now_pos=this.node.getPosition();

        let dir=end_pos.sub(now_pos);
        let len=dir.len();
        this.walk_time=len/this.speed;

        this._vx=dir.x/len*this.speed;
        this._vy=dir.y/len*this.speed;
        
        let angle=Math.atan2(dir.y,dir.x);

        this.last_dir=(this.start_index>0)?this.now_dir:angle;//上一个方向
        this.now_dir=angle;

        let direction=null;
        let pi=Math.PI;
       
        if(angle>=3/4*pi&&angle<=pi||angle>=-pi&&angle<=-3/4*pi){
            direction=Dirention.left;
        }else if(angle>=0*pi&&angle<=1/4*pi||angle>=-1/4*pi&&angle<=0){
            direction=Dirention.right;
        }else if(angle>1/4*pi&&angle<3/4*pi){
            direction=Dirention.up;
        }else if(angle>-3/4*pi&&angle<-1/4*pi){
            direction=Dirention.down;
        }
       

        if(this.start_index>0&&this.last_dir!=this.now_dir){
            this.play_walk(direction);
        }else{
            this.play_walk(direction);
        }


    },
    _updata_walking(dt){
        if(this.state!=State.walk){//攻击 死亡 不行走
            return;
        }
        if(this.walk_time<=0){
            this.start_index++;
            if(this.start_index>=this.path_data.length-1){//61
                this.state=State.end_walk;
                // this._set_idle();//test set_idle
            }else{
                this.walk_to_next();//60 max
            }
           
            return;
        }
        if(this.walk_time<dt){
            dt=this.walk_time;
        }
        let s_x=this._vx*dt;
        let s_y=this._vy*dt;

        this.node.x+=s_x;
        this.node.y+=s_y;
        this.walk_time-=dt;


    },
    start () {
        let map_root_com=cc.find("Canvas/map_root").getComponent("map_root");
        this.path_data=map_root_com.get_path_data()[0];//第一条路

       

        this.start_index=0;
        let now_wpos=this.node.parent.convertToWorldSpaceAR(this.path_data[0]);
        let now_pos=this.node.parent.convertToNodeSpaceAR(now_wpos);
        this.node.setPosition(now_pos);
    },

    update (dt) {
        if(this.state===State.walk){
             this._updata_walking(dt);
        }
       
    },
});
