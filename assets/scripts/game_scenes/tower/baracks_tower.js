// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let utils=require("utils");
let barracks_=cc.Class({
   
    name:"baracks_",
    properties: {
        anim:{
            type:cc.SpriteFrame,
            default:[],
        },
        dur:0.1,

    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        barracks:{
            type:barracks_,
            default:[],
       },
       level:1,
       arms:{
            type:cc.Prefab,
            default:null,
       },
       bullet_root_path:"Canvas/bullet_root",
    },

    init(level,pos){//初始化弓箭塔
        this.level=level;
        let wpos=this.node.parent.convertToWorldSpaceAR(pos);
        let _pos=this.node.parent.convertToNodeSpaceAR(wpos);
        this.node.setPosition(_pos);
    },

    upgrade(){
        if(this.level>4){
            return;
        }
        this.level++;
        this._set_tower_idle();

    },

    async _set_tower_idle(){//塔换皮
        let sp=this.tower.getComponent(cc.Sprite);
        let anims=await this.barracks[this.level-1].anim;
        sp.spriteFrame=anims[0];

    },

    // LIFE-CYCLE CALLBACKS:
    init_asset(){//加载资源
        for(let i=0;i<4;i++){
            this.barracks[i]=new barracks_();
        }
        let dir_tower=["bing1","bing2","bing3","bing4"]
        for(let i=0;i<4;i++){
            let t_dir_tower=utils.initDirload("bing_tower",dir_tower[i],cc.SpriteFrame);
            this.barracks[i].anim=t_dir_tower;
        }
        

    },
    async play_open_door(funend){
        let frame_anim= this.tower.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.tower.addComponent("frame_anim");
        }
        let anims=await this.barracks[this.level-1].anim;
        frame_anim.sprite_frames=anims;
        frame_anim.durtion=this.barracks[this.level-1].dur;
        frame_anim.play_once(funend);



    },
    async play_close_door(){
        let frame_anim= this.tower.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.tower.addComponent("frame_anim");
        }
        let anims=await this.barracks[this.level-1].anim;
        let t_anims= anims.concat();
        t_anims.reverse();
       
        frame_anim.sprite_frames=t_anims;
        frame_anim.durtion=this.barracks[this.level-1].dur;
        frame_anim.play_once();

        
    },
    async dispatch_troops(){
        // cc.log(this.play_close_door.name);
        
        
        let node=cc.instantiate(this.arms);
        let bullet_root=cc.find(this.bullet_root_path);
        bullet_root.addChild(node);
        let arms_com=node.getComponent("arms");
        arms_com.set_level(this.level);
        let start_wpos=this.node.convertToWorldSpaceAR(cc.v2(0,0));
        let start_pos=node.parent.convertToNodeSpaceAR(start_wpos);
       
        this.play_open_door();//开门后出兵　
        cc.tween(this.node)
        .delay(0.3)
        .call(()=>{
            node.setPosition(start_pos);
            
            //随机圆位置
            //目标坐标 随机 圆
            let r=60;
            let angles=Math.random()*Math.PI*2;
            let offset=cc.v2(Math.cos(angles)*r,Math.sin(angles)*r);
            let dst_wpos=cc.v2(start_wpos.x,start_wpos.y);
            dst_wpos.x+=offset.x;//测试坐标
            dst_wpos.y+=offset.y;
            arms_com.set_walking(dst_wpos);
        })
        .start()

        this.scheduleOnce(this.play_close_door,1);//关门



    },
    onLoad () {
        this.tower=this.node.getChildByName("tower");

        this.level=1;
        this.init_asset();
        
        
       
    },

    start () {

    },

    // update (dt) {},
});
