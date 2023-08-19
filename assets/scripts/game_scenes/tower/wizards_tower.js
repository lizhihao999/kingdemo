// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let utils=require("utils");
let wizards_=cc.Class({
    name:"wizards",
    properties: {
        tower:{
            type:cc.SpriteFrame,
            default:[],
        },
        hero_down:{
            type:cc.SpriteFrame,
            default:[],
        },
        hero_up:{
            type:cc.SpriteFrame,
            default:[],
        },
        tower_dur:0.2,
        hero_dur:0.1,
        d:0,
    },
});

let cgf={
    0:new wizards_(),
}
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
        wizards:
        {
            type:wizards_,
            default:[],
        },
        level:1,
        

    },

    // LIFE-CYCLE CALLBACKS:

   
    async set_tower_idle(level){//休闲状态换皮
        let tower_sp=this.tower.getComponent(cc.Sprite);
        let towers=await this.wizards[level-1].tower;
        tower_sp.spriteFrame=towers[0];



    },

    async set_hero_idle(level,state_str){//休闲状态换皮  state_str:"down" "up"
        this.set_hero_pos(level);
        let hero_sp=this.hero.getComponent(cc.Sprite);
        if(state_str==="down"){
            let hero_downs=await this.wizards[level-1].hero_down;
            hero_sp.spriteFrame=hero_downs[0];
            cc.log("herosp", hero_sp.spriteFrame);
        }else if(state_str==="up"){
            let hero_ups=await this.wizards[level-1].hero_up;
            hero_sp.spriteFrame=hero_ups[0];
            cc.log("herosp", hero_sp.spriteFrame);
        }
       


    },
   
    async play_tower(level){//播放塔的动画
        let frame_anim= this.tower.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.tower.addComponent("frame_anim");
        }
        let towers=await this.wizards[level-1].tower;
        frame_anim.sprite_frames=towers;
        frame_anim.durtion=this.wizards[level-1].tower_dur;
        frame_anim.play_loop();


    },
    async play_hero(level,state_str){//播放法师的动画   state_str:"down" "up"
        this.set_hero_pos(level);
        let frame_anim= this.hero.getComponent("frame_anim");
        if(!frame_anim){
            frame_anim=this.hero.addComponent("frame_anim");
        }
        if(state_str==="down"){
            let hero_downs=await this.wizards[level-1].hero_down;
            frame_anim.sprite_frames=hero_downs;
        }else if(state_str==="up"){
            let hero_ups=await this.wizards[level-1].hero_up;
            frame_anim.sprite_frames=hero_ups;
        }
        frame_anim.durtion=this.wizards[level-1].hero_dur;
        frame_anim.play_loop();


    },
    loding_asset(){//加载资源
        //初始化wizards
        for(let i=0;i<4;i++){
            this.wizards[i]=new wizards_();
       }
       //加载 文件资源
       let dir_fashi=["fashi1","fashi2","fashi3","fashi4"];
       let dir_hero=["shoot_man_1/down","shoot_man_1/up","shoot_man_2/down","shoot_man_2/up"];
       let dir_array=[];
       for(let i=0;i<4;i++){
           let t_dir_tower=utils.initDirload("wizards_tower",dir_fashi[i],cc.SpriteFrame);
           this.wizards[i].tower=t_dir_tower;

           let t_dir_hero=utils.initDirload("wizards_tower",dir_hero[i],cc.SpriteFrame);
           dir_array.push(t_dir_hero);
       }
       for(let i=0;i<4;i++){
           let cgf={
               0:{dowm:0,up:1},
               1:{dowm:0,up:1},
               2:{dowm:2,up:3},
               3:{dowm:2,up:3}
           }
           this.wizards[i].hero_down=dir_array[cgf[i].dowm];
           this.wizards[i].hero_up=dir_array[cgf[i].up];
           
       }
    },
    set_hero_pos(level){
        let cgf_pos={
            0:cc.v2(-1,19),
            1:cc.v2(0,19),
            2:cc.v2(0,22),
            3:cc.v2(3,16),
        }
        this.hero.setPosition(cgf_pos[level-1]);

    },
   
    onLoad () {
        this.level=4;
        this.tower=this.node.getChildByName("tower");//法师塔
        this.hero=this.node.getChildByName("hero");//
        this.loding_asset();
        this.set_hero_idle(this.level,"up");
        this.play_hero(this.level,"up");
        this.set_tower_idle(this.level);
        this.play_tower(this.level);
        cc.log(this.wizards);


    },

    start () {

    },

    // update (dt) {},
});
