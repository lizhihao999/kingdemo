// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let utils=require("utils");
let event_manager=require("event_manager");
let monster_manager=require("monster_manager");
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
let Type_monster=monster_manager.Type_monster;
let cgf=monster_manager.asset_cgf;
cc.Class({
    extends: cc.Component,

    properties: {
        
       speed:200,
       state:{
            type:State,
            default:State.walk,
        },
        Type_monster:{
            type:Type_monster,
            default:Type_monster.actor0
        }
    },

    async init(type,parme,path){

        this.Type_monster=type;
        
        
        //加载怪物资源 并且换皮
        this.loding_asset();
        let walk=await this.asset[0].walk;
        cc.log("资源加载完成--actor"+this.Type_monster);
        this._set_idle();

        //初始化怪物参数 速度 攻击 血量
        this.speed=parme.speed;

        //初始化怪物位置
        let map_root_com=cc.find("Canvas/map_root").getComponent("map_root");
        this.path_data=map_root_com.get_path_data()[path];//第一条路
        this.start_index=0;
        let now_wpos=this.node.parent.convertToWorldSpaceAR(this.path_data[0]);
        let now_pos=this.node.parent.convertToNodeSpaceAR(now_wpos);
        this.node.setPosition(now_pos);

        //调整血条位置
        //修改节点大小
        this.sp.height=walk[0]._rect.height;
        this.sp.width=walk[0]._rect.width;

        let blood=this.node.getChildByName("blood_bg");
        blood.y=this.sp.y+this.sp.height+5;
    },
    async loding_asset(){//加载资源
        //初始化wizards
       for(let i=0;i<1;i++){
            this.asset[i]=new actor_0_asset();
       }
       this.asset[0].attack=utils.initDirload("monster",`actor${this.Type_monster}/attack`,cc.SpriteFrame);
       this.asset[0].dead=utils.initDirload("monster",`actor${this.Type_monster}/dead`,cc.SpriteFrame);
       this.asset[0].walk=utils.initDirload("monster",`actor${this.Type_monster}/walk`,cc.SpriteFrame);
   

    
    },
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.asset={
            type:actor_0_asset,
            default:[],
        },
        this.sp=this.node.getChildByName("sp");
        this._vx=0;
        this._vy=0;
        this.walk_time=0;
        this.path_data=null;
        this.start_index=0;

      


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
        
        let walk=await this.asset[0].walk;
        let walk_dir=[];
        if(direction===Dirention.left){
            for(let i=cgf[this.Type_monster].walk.left.start;i<cgf[this.Type_monster].walk.left.end;i++){
                walk_dir.push(walk[i]);
            }
             this.node.scaleX=-1;
        }else if(direction===Dirention.right){
            for(let i=cgf[this.Type_monster].walk.left.start;i<cgf[this.Type_monster].walk.left.end;i++){
                walk_dir.push(walk[i]);
            }
            this.node.scaleX=1;
        }else if(direction===Dirention.up){
            for(let i=cgf[this.Type_monster].walk.up.start;i<cgf[this.Type_monster].walk.up.end;i++){
                walk_dir.push(walk[i]);
            }
        }else if(direction===Dirention.down){
            for(let i=cgf[this.Type_monster].walk.down.start;i<cgf[this.Type_monster].walk.down.end;i++){
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
                let eventmanger=event_manager.get_instance();
                eventmanger.emit("arrive",1);

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
       
    },

    update (dt) {
        if(this.state===State.walk){
             this._updata_walking(dt);
        }
       
    },
});
