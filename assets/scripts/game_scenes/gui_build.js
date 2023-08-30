// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let event_manager=require("event_manager");
let utils=require("utils");

let cgf_com={0:"arrow_tower",
1:"baracks_tower",
2:"connon_tower",
3:"wizards_tower"};

let level_name_s=["arrow_grade","level","grade","level"]

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    // LIFE-CYCLE CALLBACKS:

    async loding_asset(){//加载资源
        this.towers=await utils.initDirload("prefabs","tower",cc.Prefab);
        cc.log("塔的预制体加载完成", this.towers);
       
    },
    onLoad () {
        this.towers={
            type:cc.Prefab,
            default:[],
        },
        this.loding_asset();//加载资源

        this.mask=this.node.getChildByName("mask");
        this.build_bar_bg=this.node.getChildByName("build_bar_bg");
        this.build_bar=this.build_bar_bg.getChildByName("build_bar");
        this.create_btn=this.node.getChildByName("create_btn");
        this.upgrade_btn=this.node.getChildByName("upgrade_btn");
        this.space_taget=null;

        let eventmanger=event_manager.get_instance();

        eventmanger.on("space_taget",(param)=>{//点击了哪个空地
            this.space_taget=param;
            cc.log("事件:接受node");
        });

        eventmanger.on("open_gui_create",()=>{
            cc.log("事件:open_gui_create");
            this.mask.active=true;
            let space_pos=this.space_taget.getPosition();
            let space_wpos=this.space_taget.parent.convertToWorldSpaceAR(space_pos);
            let create_pos=this.create_btn.parent.convertToNodeSpaceAR(space_wpos);
            this.create_btn.setPosition(create_pos);
            this.create_btn.active=true;

        });

        eventmanger.on("open_gui_upgrade",()=>{
            cc.log("事件:open_gui_upgrade");
            //打开遮罩
            this.mask.active=true;
            //设置升级界面的位置
            let space_pos=this.space_taget.getPosition();
            let space_wpos=this.space_taget.parent.convertToWorldSpaceAR(space_pos);
            let upgrade_pos=this.create_btn.parent.convertToNodeSpaceAR(space_wpos);
            this.upgrade_btn.setPosition(upgrade_pos);
            //打开升级界面
            this.upgrade_btn.active=true;
            //每次打开刷新按钮数据
            
            let build_tower=this.space_taget.getComponent("bulid_tower").build_tower;
            let type_tower=this.space_taget.getComponent("bulid_tower").type_tower;

            let n_com=build_tower.getComponent(cgf_com[type_tower]);
            
            let level=n_com[level_name_s[type_tower]];
            let btn= this.upgrade_btn.getChildByName("upgrade").getComponent(cc.Button);
            if(level<4){
                btn.interactable=true;
            }
           

            



        });


    },

    async click_create_btn(e,type_tower){
        
      
      
        type_tower=parseInt(type_tower);
        this.type_tower=type_tower;

       

        let cgf_offset={0:{x:-7,y:8},
                        1:{x:-7,y:8},
                        2:{x:-7,y:8},
                        3:{x:-7,y:8}};
        //先设置进度条位置
        let space_pos=this.space_taget.getPosition();
        let space_wpos=this.space_taget.parent.convertToWorldSpaceAR(space_pos);
        let progress_bar_pos=this.build_bar_bg.parent.convertToNodeSpaceAR(space_wpos);
        this.build_bar_bg.setPosition(progress_bar_pos);
       
        
       
       
        //重新调整塔的偏移位置
        let tower_pos=cc.v2(this.space_taget.x+cgf_offset[type_tower].x,this.space_taget.y+cgf_offset[type_tower].y);
        //关闭create界面显示进度条
        this.create_btn.active=false;
        this.build_bar_bg.active=true;

        let sp=this.build_bar.getComponent(cc.Sprite);
        sp.fillRange=0;
         //初始化塔
        let build_tower=cc.instantiate(this.towers[type_tower]);
        let tower_root=cc.find("Canvas/tower_root");
        tower_root.addChild(build_tower);
        build_tower.active=false;
        return new Promise((resolve, reject) => {

            this.schedule(()=>{
                sp.fillRange+=0.01;
                if( sp.fillRange>=1){
                     resolve();
                    
                }
            },0.01,100-1);
            }).then(()=>{
                //进度条和遮罩
                this.mask.active=false;
                this.build_bar_bg.active=false;
                //向空地节点传输塔的数据
                let bulid_tower_com=this.space_taget.getComponent("bulid_tower");
                bulid_tower_com.build_tower=build_tower;
                bulid_tower_com.type_tower=type_tower;
                cc.log("over_build");
                
            build_tower.active=true;
            let n_com=build_tower.getComponent(cgf_com[type_tower]);
            n_com.init(1,tower_pos);
           
           
           
            
            })


       
       

        
           
    },

    click_upgrade_btn(){
        //塔和类型都不能不存在
        let build_tower=this.space_taget.getComponent("bulid_tower").build_tower;
        let type_tower=this.space_taget.getComponent("bulid_tower").type_tower;
        if(!build_tower||type_tower===-1){//build_tower塔的节点 type_tower塔的类型-1不存在
            return;
        }
        //升级
        let n_com=build_tower.getComponent(cgf_com[type_tower]);
        n_com.upgrade();
        let level=n_com[level_name_s[type_tower]];
        cc.log("level",level);
        if(level>=4){//4级关闭升级按钮交换
            let btn= this.upgrade_btn.getChildByName("upgrade").getComponent(cc.Button);
            btn.interactable=false;
        }

       
       



        

    },
    click_undo(){
        cc.log("undo_tuild_tower",this.space_taget.getComponent("bulid_tower").build_tower);

        this.space_taget.getComponent("bulid_tower").build_tower.removeFromParent(false);//
        this.space_taget.getComponent("bulid_tower").build_tower=null;
       
       

        cc.log("undo_tuild_tower",  this.space_taget.getComponent("bulid_tower").build_tower);
        
        this.space_taget.getComponent("bulid_tower").type_tower=-1;//初始化塔的类型
        this.upgrade_btn.active=false;//关闭升级界面
        this.mask.active=false;//关遮罩

        //重新激活按钮
        let btn= this.upgrade_btn.getChildByName("upgrade").getComponent(cc.Button);
        btn.interactable=true;


    },
    click_mask(){

        if(!this.build_bar_bg.active){//不在建塔时
            this.mask.active=false;
            this.create_btn.active=false;
            this.upgrade_btn.active=false;
        }
        
        
       
        
        
    },

    start () {

    },

    // update (dt) {},
});
