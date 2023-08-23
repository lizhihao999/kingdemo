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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       
        this.anim=this.node.getComponent(cc.Animation);
        this.graphics=this.node.getComponent(cc.Graphics);
        this.clips=this.anim.getClips();
        this.graphics.clear();
       
        let bezier_data_0=this.get_bezier_data(1);
      
        let path_data_0=this.get_path(bezier_data_0);
        for(let i=0;i<path_data_0.length;i++){
            let path=path_data_0[i];
            this.graphics.circle(path.x,path.y,1);
        }

        let bezier_data_1=this.get_bezier_data(2);
        let path_data_1=this.get_path(bezier_data_1);
        for(let i=0;i<path_data_1.length;i++){
            let path=path_data_1[i];
            this.graphics.circle(path.x,path.y,1);
        }

        let bezier_data_2=this.get_bezier_data(3);
        let path_data_2=this.get_path(bezier_data_2);
        for(let i=0;i<path_data_2.length;i++){
            let path=path_data_2[i];
            this.graphics.circle(path.x,path.y,1);
        }
       
        this.graphics.stroke ();
        this.graphics.fill ();

    },

    start () {

    },
    get_bezier_data(path_i){//获取贝塞尔曲线数据 1开始  
        let start=null;
        let ctrl1=null;
        let ctrl2=null;
        let end=null;

        // let position

        let bezier_data=[];
        let start_pos=this.clips[0].curveData.paths[`path_${path_i}`].props.position[0].value;
        let end_pos=this.clips[0].curveData.paths[`path_${path_i}`].props.position[1].value;
        let motionpath=this.clips[0].curveData.paths[`path_${path_i}`].props.position[0].motionPath;
       
        //处理第一个贝塞尔曲线(二阶)
        start=cc.v2(start_pos[0],start_pos[1]);
        ctrl1=this._get_v2_motionpath(motionpath[0],1);
        end=this._get_v2_motionpath(motionpath[0],0);
        bezier=[start,ctrl1,ctrl1,end];
        bezier_data.push(bezier);

       
        for(let i=0;i<motionpath.length-1;i++){//处理中间三阶贝塞尔
            start=this._get_v2_motionpath(motionpath[i],0);
            ctrl1=this._get_v2_motionpath(motionpath[i],2);
            ctrl2=this._get_v2_motionpath(motionpath[i+1],1);
            end=this._get_v2_motionpath(motionpath[i+1],0);
            bezier=[start,ctrl1,ctrl2,end];
            bezier_data.push(bezier);
        }
        //尾部二阶贝塞尔
        start=this._get_v2_motionpath(motionpath[motionpath.length-1],0);
        ctrl1=this._get_v2_motionpath(motionpath[motionpath.length-1],2);
       
        end=cc.v2(end_pos[0],end_pos[1]);
        bezier=[start,ctrl1,ctrl1,end];
        bezier_data.push(bezier);

        return bezier_data;
    },
    _get_v2_motionpath(motionpath_i,index){//index 0->start_pos 1->ctrl1 2->ctrl2
        if(index===1){//0{01}1{23}2{34}
            index=2;
        }
        else if(index===2){
            index=4;
        }
        let pos=cc.v2(motionpath_i[index],motionpath_i[index+1])
        return pos;
    },
    _get_bezier_len(bezier){
        let start=bezier[0];
        let ctrl1=bezier[1];
        let ctrl2=bezier[2];
        let end=bezier[3];

        let p1=start;
        let p2=null;
        let len=0;
        let t=0;
        for(let i=0;i<20;i++){//分成20份 t可以表示曲线进度
            let x=start.x*Math.pow((1-t),3)+3*ctrl1.x*t*(1-t)*(1-t)+3*ctrl2.x*t*t*(1-t)+end.x*t*t*t;
            let y=start.y*Math.pow((1-t),3)+3*ctrl1.y*t*(1-t)*(1-t)+3*ctrl2.y*t*t*(1-t)+end.y*t*t*t;
            p2=cc.v2(x,y);
            let dir=p2.sub(p1);
            p1=p2;
            len+=dir.len();
            t+=0.05;
        }

        return len;

    },
    get_path(bezier_data){
        let path_data=[];
        for(let i=0;i<bezier_data.length;i++){
            //处理贝塞尔曲线
            let len=this._get_bezier_len(bezier_data[i]);
            let step_len=16;//每次走16
            let count=len/step_len;//次数

            let t_delta=1/count;//需要count次完成
            let t=0;
            //曲线数据
            let start=bezier_data[i][0];
            let ctrl1=bezier_data[i][1];
            let ctrl2=bezier_data[i][2];
            let end=bezier_data[i][3];

            for(let j=0;j<count;j++){//
                let x=start.x*Math.pow((1-t),3)+3*ctrl1.x*t*(1-t)*(1-t)+3*ctrl2.x*t*t*(1-t)+end.x*t*t*t;
                let y=start.y*Math.pow((1-t),3)+3*ctrl1.y*t*(1-t)*(1-t)+3*ctrl2.y*t*t*(1-t)+end.y*t*t*t;
                let point=cc.v2(x,y);
                path_data.push(point);
                t+=t_delta;
            }



        }

        return path_data;


    },

    // update (dt) {},
});
