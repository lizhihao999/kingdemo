// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let ugame =require("ugame_s");
// let ugame=null;
let sound_manager=require("sound_manager");
let level1=require("level1");
let utils=require("utils");
let event_manager=require("event_manager");
cc.Class({
    extends: cc.Component,

    properties: {
        actor:{
            type:cc.Prefab,
            default:null,
        },
        monster_root:{
            type:cc.Node,
            default:null,
        }
        
    },

    // LIFE-CYCLE CALLBACKS:

    async load_asset(){
        let attack=[];
        let dead=[];
        let walk=[];

        for(let i=0;i<7;i++){
            attack[i]= await utils.initDirload("monster",`actor${i}/attack`,cc.SpriteFrame);
            dead[i]=await utils.initDirload("monster",`actor${i}/dead`,cc.SpriteFrame);
            walk[i]=await utils.initDirload("monster",`actor${i}/walk`,cc.SpriteFrame);

        }
        cc.log("场景资源加载完成");
       
 
 

    },

    onLoad () {
        cc.log(ugame);
        // cc.log("hhh");
        this.set_interface=this.node.getChildByName("gui_root").getChildByName("set_interface");
        this.bullet_root=cc.find("Canvas/bullet_root");
        this.pause_interface=this.node.getChildByName("gui_root").getChildByName("pause_interface");
        this.level_init();
        this.load_asset();
        this.monster_j=0;//第N轮怪索引
        this.monster_num=0;//第n波怪数量
        this.monster_i=0;//第n波怪索引
        let eventmanger=event_manager.get_instance();
        eventmanger.on("arrive",(parame)=>{
            cc.log("怪物到达终点",parame);
            this.monster_num-=1;
            if(!this.monster_num){//该波怪全寄了
                this.monster_i++;//出下一波怪
                if(this.monster_i>=level1[this.monster_j].length){//该轮怪释放完了
                    cc.log("一轮怪物释放完了:"+this.monster_j);
                     this.monster_j++;//释放下一轮的怪
                    return;
                } 
                this.monster_num=level1[this.monster_j][this.monster_i].num;//获取该波怪数量
                this._relese_i(level1[this.monster_j][this.monster_i]);//释放该波怪
            }

        },this.node)


       

        
        
    },
    level_init(){
        let user=ugame.get_current_cuser();
        this.blood=cc.find("Canvas/gui_root/gui_top/gui_top_bk/blood").getComponent(cc.Label);
        this.gold=cc.find("Canvas/gui_root/gui_top/gui_top_bk/gold").getComponent(cc.Label);
        this.enemy=cc.find("Canvas/gui_root/gui_top/gui_top_bk/enemy").getComponent(cc.Label);

        this.blood.string=user.blood.toString();
        this.gold.string=user.chip.toString();
        // this.enemy.string=//待定

    },

    relese_monster(){//放第n轮怪
        if(this.monster_j>=level1.length){
            cc.log("怪物已经释放完了");
            return;
        }
        this.monster_i=0;//第一波怪
        this.monster_num=level1[this.monster_j][this.monster_i].num;
        this._relese_i(level1[this.monster_j][this.monster_i]);
        


    },
    async _relese_i(data){//释放第n波怪
        //实例化怪 num type
        let level_data=data;
        let node_coms=[];
        for(let i=0;i<level_data.num;i++){
            let node=cc.instantiate(this.actor);
            this.monster_root.addChild(node);
            let node_com=node.getComponent("actor_0");
            cc.log("type",level_data.type);
            node_com.init(level_data.type,level_data.parme,level_data.path[i]);
            node_coms.push(node_com);
        }
        let async_fun=async(delay,endfun)=>{//等待xxx秒然后放怪
            return new Promise((resolve, reject) => {
                this.scheduleOnce(() => {
                    resolve();
                }, delay);
            }).then(()=>{
                endfun();
            });
           
        }


        for(let i=0;i<=level_data.dur.length;i++){
            if(i>0){
                await async_fun(level_data.dur[i-1],()=>{
                    cc.log("释放",level_data.dur[i-1])
                    node_coms[i-1].walk_to_next();
                });
            }else{
                await async_fun(level_data.delay,()=>{
                    cc.log("延时释放",level_data.delay)
                });
            }

        }
    },

    start () {
        
       

    },
    btn_set(){
        this.set_interface.active=true;
    },
    set_interface_btn_reset(){
        this.set_interface.active=false;
        cc.log("重新开始游戏");

    },
    set_interface_goto_map_scenes(){//返回地图场景
        let loding_door=cc.find("Canvas/loding_door").getComponent("lodingDoor");
        sound_manager.play_effect("sound/click",false);
        loding_door.close_the_door();

        this.scheduleOnce(()=>{
            cc.director.preloadScene("road_map", (completedCount, totalCount, item)=>{
            // this.lab.string= Math.floor(completedCount/totalCount * 100) + "%";
            },(error)=>{
                cc.director.loadScene("road_map");
                cc.log("加载成功");
            });

        },loding_door.duration+0.5);

    },

    btn_pause(){
        this.pause_interface.active=true;
    },

    pause_interface_btn_continue(){
        this.pause_interface.active=false;
        cc.log("继续游戏");
    },



    update (dt) {
        let children = this.bullet_root.children;
        children.sort((a,b)=>{//假如a>b-->ab 降序
            return b.y-a.y;//
        })
        let monster=this.monster_root.children;
        monster.sort((a,b)=>{
            return b.y-a.y;
        })

    }
      
});
