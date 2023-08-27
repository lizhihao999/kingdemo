// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let utils=require("utils");
let cgf_com={0:"arrow_tower",
1:"baracks_tower",
2:"connon_tower",
3:"wizards_tower"};
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
        towers:{
            type:cc.Prefab,
            default:[],
        },
        tower_root_path:"Canvas/tower_root",
        mask_path:"Canvas/build_root/mask",
        b_root_path:"Canvas/build_root/b_root",
    },

    // LIFE-CYCLE CALLBACKS:
    async loding_asset(){//加载资源
        this.towers=await utils.initDirload("prefabs","tower",cc.Prefab);
        cc.log("塔的预制体加载完成", this.towers);
       
    },
    onLoad () {
        this.create_btn=this.node.getChildByName("create_btn");
        this.upgrade_btn=this.node.getChildByName("upgrade_btn");
        this.space=this.node.getChildByName("space_btn");
        this.build_bar_bg=this.space.getChildByName("build_bar_bg");
        this.build_bar=this.build_bar_bg.getChildByName("build_bar");
        this.mask=cc.find(this.mask_path);
        this.is_bulided=false;//是否建了塔
        this.build_tower=null;//塔的节点
        this.type_tower=-1;//塔的类型
        this.loding_asset();

        this.node.on("off_tower_interface",()=>{
            this.create_btn.active=false;
            this.upgrade_btn.active=false;
            this.mask.active=false;
            cc.log("退出塔");
        },this);//接收事件

        

        

    },
    click_space_btn(){
        this.mask.active=true;
        if(!this.is_bulided){//没有建塔
            this.create_btn.active=true;
        }else{
            this.upgrade_btn.active=true;
        }
       

    },
    async click_create_btn(e,type_tower){
       
        type_tower=parseInt(type_tower);
        this.type_tower=type_tower;
        //重新调整塔的偏移位置
        let cgf_offset={0:{x:-7,y:8},
                        1:{x:-7,y:8},
                        2:{x:-7,y:8},
                        3:{x:-7,y:8}};
        let pos=cc.v2(this.node.x+cgf_offset[type_tower].x,this.node.y+cgf_offset[type_tower].y);
        this.create_btn.active=false;
        this.build_bar_bg.active=true;
        let sp=this.build_bar.getComponent(cc.Sprite);
        sp.fillRange=0;

        
        return new Promise((resolve, reject) => {
            this.schedule(()=>{
                sp.fillRange+=0.01;
                if( sp.fillRange>=1){
                     resolve();
                     cc.log("builded_over");
                }
            },0.01,100-1);
            }).then(()=>{
                
            //初始化塔
            this.build_tower=cc.instantiate(this.towers[type_tower]);
            let tower_root=cc.find(this.tower_root_path);
            tower_root.addChild(this.build_tower);
            let n_com=this.build_tower.getComponent(cgf_com[type_tower]);
            n_com.init(1,pos);
            //关创建界面和遮罩
            this.create_btn.active=false;
            this.mask.active=false;
            this.build_bar_bg.active=false;
            //塔存在
            this.is_bulided=true;
            })


       
       

        
           
    },

    click_upgrade_btn(){
        //塔和类型都不能不存在
        if(!this.is_bulided||this.type_tower<0){
            return;

        }
        //升级
        let n_com=this.build_tower.getComponent(cgf_com[this.type_tower]);
        n_com.upgrade();
        let level_name=null;
        switch (this.type_tower) {
            case 0:
                level_name="arrow_grade";
                break;
            case 1:
                level_name="level";
                break;
            case 2:
                level_name="grade";
                break;
            case 3:
                level_name="level";
                break;
            default:
                break;
        }
        let level=n_com[level_name];
        if(level>=4){//4级关闭升级按钮交换
            let btn= this.upgrade_btn.getChildByName("upgrade").getComponent(cc.Button);
            btn.interactable=false;
        }

       
       



        

    },
    click_undo(){
        this.build_tower.removeFromParent();//从父节点中删除

        this.is_bulided=false;//是否建了塔
        this.build_tower=null;//塔的节点
        this.type_tower=-1;//塔类型不存在

        this.upgrade_btn.active=false;//关闭升级界面
        this.mask.active=false;//关遮罩

        //重新激活按钮
        let btn= this.upgrade_btn.getChildByName("upgrade").getComponent(cc.Button);
        btn.interactable=true;


    },
    click_mask(){
        //退出塔的处理
        let e=new cc.Event.EventCustom("off_tower_interface",true);//注册事件
        
        this.node.dispatchEvent(e);//发送事件 能冒泡
        let b_root=cc.find(this.b_root_path);
        let children=b_root.children;
        for(let i=0;i<children.length;i++){
            let b=children[i];
            let create_btn=b.getChildByName("create_btn");
            let upgrade_btn=b.getChildByName("upgrade_btn");
            create_btn.active=false;
            upgrade_btn.active=false;
        }
        this.mask.active=false;
        
        
    },
    
    start () {

    },
    
    // progress(){

    //    new Promise((resolve, reject) => {

        
        
    //     let a=0;
    //     this.schedule(()=>{
    //         a++;
    //         cc.log("aaaa")
    //         if(a===3){
    //              resolve();
    //              cc.log("成功")
    //         }
    //     },1,3-1);
    //     }).then(function(){
    //         console.log(1)
    //     }).then(function(){
    //         console.log(2)
    //     })
       
    // },
    // async fun(){
    //     await this.progress();
    // },

    
    // update (dt) {},
});
