let ugame={
    user_data:{
        0:null,
        1:null,
        2:null,
    },
   
    current_user:0,//现在的用户

    tower_skill_upgraded_config:{
        arrow_tower:[0,1,1,2,2,3],//弓箭塔
        infantry_tower:[0,1,1,2,2,3],//步兵塔
        warlock_tower:[0,1,1,2,2,3],//术士塔
        artillery_tower:[0,1,1,3,3,3],//火炮塔

        skill_bom:[0,1,1,2,2,3],//炸弹技能
        skill_infantry:[0,2,3,3,3,4]//步兵技能


    },
    set_current_user(user_index){
        if(user_index<0||user_index>3){
            user_index=0;
        }
        ugame.current_user=user_index;
    },



    save_data_local:function(){//保存数据到本地
        let json_str=JSON.stringify(ugame.user_data);//json-->string
        cc.sys.localStorage.setItem("user_data",json_str);//sav
    },

    get_current_cuser:function(){//返回现在的用户数据
        return ugame.user_data[ugame.current_user];
    },

}

function read_local_data(){//读取本地数据(读档)
   
    
    let user_data=cc.sys.localStorage.getItem("user_data");
    if(user_data){
        ugame.user_data = JSON.parse(user_data);//如果有存档 json缓存该存档
        // ugame.user_data[0].chip=400;//先改后存
        // ugame.save_data_local();
        cc.log( ugame.user_data);
        return;
    }

    //初始化存档
    ugame.user_data={
        0:{
            chip:2000,
            blood:20,
            lever_info_start:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//19
            start_num:0,
            start_total:77,
        }, 
        
        1:{
            chip:2000,
            blood:20,
            lever_info_start:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//19
            start_num:0,
            start_total:77,
        },

        2:{
            chip:2000,
            blood:20,
            lever_info_start:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//19
            start_num:0,
            start_total:77,


        }
    }
    cc.log("init****");
    ugame.save_data_local();



}

read_local_data();
// cc.log("***",ugame.user_data[0]);


module.exports=ugame;