let ugame={
    user_data:{
        0:null,
        1:null,
        2:null,
    },

    level_config:{
        0:"第1关",
        1:"第2关",
        2:"第3关",
        4:"第4关",
        5:"第5关",
        6:"第6关",
        7:"第7关",
        8:"第8关",
        9:"第9关",
        10:"第10关",
        11:"第11关",
        12:"第12关",
        13:"第13关",
        14:"第14关",
        15:"第15关",
        16:"第16关",
        17:"第17关",
        18:"第18关",
        19:"第19关",
    },

    set_level_num(index){
        cc.log(this.level_config[index]);
    },
    get_star_num(){
        let num=0;
        for(let i=0;i<this.user_data[this.current_user].lever_info_start.length;i++){
            num+=this.user_data[this.current_user].lever_info_start[i];
        }
        return num;
    },
   
    current_user:0,//现在的用户

    skill_upgrade_config:{
        0:[1,1,2,2,3],//弓箭塔
        1:[1,1,2,2,3],//步兵塔
        2:[1,1,2,2,3],//术士塔
        3:[1,1,3,3,3],//火炮塔

        4:[1,1,2,2,3],//炸弹技能
        5:[2,3,3,3,4]//步兵技能


    },
    set_current_user(user_index){
        if(user_index<0||user_index>3){
            user_index=0;
        }
        this.current_user=user_index;
    },



    save_data_local:function(){//保存数据到本地
        let json_str=JSON.stringify(this.user_data);//json-->string
        cc.sys.localStorage.setItem("user_data",json_str);//sav
    },

    get_current_cuser:function(){//返回现在的用户数据
        return this.user_data[this.current_user];
    },

}


//禁止ugame.数据=掉用ugame.函数(ugame.数据) -->相互引用问题
let read_local_data=()=>{//读取本地数据(读档)
   
    
    let user_data=cc.sys.localStorage.getItem("user_data");
    if(user_data){
        ugame.user_data = JSON.parse(user_data);//如果有存档 json缓存该存档
        // this.user_data[0].chip=400;//先改后存
        // this.save_data_local();
        // this.user_data[0].lever_info_start=[1,1,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3];
       
        ugame.user_data[0].new_level=2;
        ugame.user_data[1].new_level=1;
        ugame.user_data[2].new_level=1;
        // ugame.user_data[0].start_num=35;
        ugame.user_data[0].skill_info=[1,2,3,4,5,0],
        ugame.save_data_local();
        cc.log("read_data");
        
        return;
    }

    //初始化存档
    ugame.user_data={
        0:{
            chip:2000,
            blood:20,
            lever_info_start:[1,1,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3],//19
            skill_info:[0,0,0,0,0,0],
            start_num:0,
            start_total:77,
            new_level:1,
        }, 
        
        1:{
            chip:2000,
            blood:20,
            lever_info_start:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//19
            skill_info:[0,0,0,0,0,0],
            start_num:0,
            start_total:77,
            new_level:1,
        },

        2:{
            chip:2000,
            blood:20,
            lever_info_start:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//19
            skill_info:[0,0,0,0,0,0],
            start_num:0,
            start_total:77,
            new_level:1,


        }
    }
    cc.log("init****");
    ugame.save_data_local();



}

read_local_data();
cc.log("***",ugame.user_data[0]);


module.exports=ugame;