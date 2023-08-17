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
        this.sprite = this.node.getComponent(cc.Sprite);
        if (!this.sprite) {
            this.sprite = this.node.addComponent(cc.Sprite);
        }

        // if(this.play_onload){//加载时播放
        //     if(this.loop){//是否循环播放
        //         this.play_loop();
        //     }else{
        //       this.play_once();
        //     }
        // }

        this.cur_frame_index=0;//当前关键帧索引
        this.is_frame_events=[];//是否含有帧事件
        this.frame_events=[];//帧事件数组
        

    },
    play_loop(end_func){//循环播放一些参数的状态
        if (this.sprite_frames.length <= 0) {
            cc.log(this.sprite_frames);
            cc.log("帧动画资源为空");
            return;
        }
        this.is_playing=true;//正在播放
        this.play_time=0;//播放时长
        this.end_func=end_func;
        this.sprite.spriteFrame=this.sprite_frames[0];
        this.loop=true;


    },
    play_once(end_func){
        if (this.sprite_frames.length <= 0) {
            cc.log("帧动画资源为空");
            return;
        }
        this.is_frame_events.length=this.sprite_frames.length;

        this.is_playing=true;//正在播放
        this.play_time=0;//播放时长
        this.end_func=end_func;
        this.sprite.spriteFrame=this.sprite_frames[0];
        this.loop=false;


    },

    // _set_is

    set_frame_events(frame_event,index){//帧事件数组 0开始
        this.frame_events[index-1]=(frame_event);
        this.is_frame_events[index-1]=1;
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
                
                this.sprite.spriteFrame=this.sprite_frames[index];

                this.cur_frame_index=index;
                if(this.is_frame_events[this.cur_frame_index]===1){//存在帧事件
                    this.fun=this.frame_events[this.cur_frame_index];
                    this.fun();
                    this.is_frame_events[this.cur_frame_index]=0;
                }
            }
            else{//非循环播放
                if(this.sprite_frames.length<=index){//播放完成 播放状态关闭 重置播放时长 9
                    if(this.end_func){//执行回调
                        this.end_func();
                    }
                    this.is_playing=false;
                    return;//退出
                }
                // cc.log(index);
                this.sprite.spriteFrame=this.sprite_frames[index];

                this.cur_frame_index=index;
                if(this.is_frame_events[this.cur_frame_index]===1){//存在帧事件
                    this.fun=this.frame_events[this.cur_frame_index];
                    this.fun();
                    this.is_frame_events[this.cur_frame_index]=0;
                }
                
            }

    },
    // end_func(){
    //     cc.log("播放完成");
       
    // },
   
});
