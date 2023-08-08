// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

        sprite_frames:{//帧动画 图片集
            default:[],
            type:cc.SpriteFrame,
        },

        //需要把帧动画导出给别的脚本用必须 使用代码来获取精灵组件
        // sprite:{//牛牛
        //     default:null,
        //     type:cc.Sprite,
        // },
        durtion:1,//每一帧相隔的时间
        loop:false,//是否循环播放
        play_onload:true,//是否在组件加载的时候播放


        
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.is_playing=false;

        // 获得了精灵组件
        this.sprite = this.getComponent(cc.Sprite);
        if (!this.sprite) {
            this.sprite = this.addComponent(cc.Sprite);
        }

        if(this.play_onload){//加载时播放
            if(this.loop){//是否循环播放
                this.init_loop_play();
            }else{
              this.init_once_play();
            }
        }
        

    },
    init_loop_play(end_func){//循环播放一些参数的状态
        if (this.sprite_frames.length <= 0) {
            cc.log("帧动画资源为空");
            return;
        }
        this.is_playing=true;//正在播放
        this.play_time=0;//播放时长
        this.end_func=end_func;
        this.sprite.spriteFrame=this.sprite_frames[0];
        this.loop=true;


    },
    init_once_play(end_func){
        if (this.sprite_frames.length <= 0) {
            cc.log("帧动画资源为空");
            return;
        }


        this.is_playing=true;//正在播放
        this.play_time=0;//播放时长
        this.end_func=end_func;
        this.sprite.spriteFrame=this.sprite_frames[0];
        this.loop=false;


    },
    start () {
    },

    update (dt) {
        if(!this.is_playing){
            return;
        }
        this.play_time =  this.play_time+dt;//现在的时长
        var index =Math.floor(this.play_time/this.durtion);///下标=播放时长/每一段时长 -->整数
        
        
            if(this.loop){
                if(this.sprite_frames.length<=index){//每一次播放完成
                    if(this.end_func){//执行回调
                        this.end_func();
                    }
                    this.play_time-=this.sprite_frames.length*this.durtion;//重置播放时长
                    index=0;
                }
                // cc.log(index);
                this.sprite.spriteFrame=this.sprite_frames[index];
            }
            else{//非循环播放
                if(this.sprite_frames.length<=index){//播放完成 播放状态关闭 重置播放时长
                    if(this.end_func){//执行回调
                        this.end_func();
                    }
                    this.is_playing=false;
                    return;//退出
                }
                this.sprite.spriteFrame=this.sprite_frames[index];
                
            }

    },
    end_func(){
        cc.log("播放完成");
       
    },
   
});
