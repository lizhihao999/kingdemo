
let Type_monster=require("monster_manager").Type_monster;

let level_data=[
    [//第一轮--》需要手动释放
        {//第一波怪 --》死了之后释放第二波怪
            delay:0,//每波怪的时间间隔
            num:3,//每次放多少个
            type:Type_monster.actor0,//怪的类型
            dur:[0.4,0.5,0.5],//放怪相隔时间0.4到0.5随机
            path:[1,2,0],//路径1-3随机

            parme:{
                speed:50,//速度
                blood:50,//血
                attack:15,//攻击力
            },


        },

        {//第二波怪
            delay:1,//每波怪的时间间隔
            num:5,//每次放多少个
            type:Type_monster.actor1,//怪的类型
            dur:[0.4,0.5,0.7,0.7,0.3],//放怪相隔时间0.4到0.5随机
            path:[1,2,0,1,2],//路径1-3随机
            parme:{
                speed:50,//速度
                blood:50,//血
                attack:15,//攻击力
            },
           


        },

         {//第3波怪 --》死了之后释放第二波怪
            delay:0,//每波怪的时间间隔
            num:3,//每次放多少个
            type:Type_monster.actor2,//怪的类型
            dur:[0.4,0.5,0.5],//放怪相隔时间0.4到0.5随机
            path:[1,2,0],//路径1-3随机

            parme:{
                speed:50,//速度
                blood:50,//血
                attack:15,//攻击力
            },


        },

         {//第4波怪 --》死了之后释放第二波怪
            delay:0,//每波怪的时间间隔
            num:3,//每次放多少个
            type:Type_monster.actor3,//怪的类型
            dur:[0.4,0.5,0.5],//放怪相隔时间0.4到0.5随机
            path:[1,2,0],//路径1-3随机

            parme:{
                speed:50,//速度
                blood:50,//血
                attack:15,//攻击力
            },


        },

         {//第5波怪 --》死了之后释放第二波怪
            delay:0,//每波怪的时间间隔
            num:3,//每次放多少个
            type:Type_monster.actor4,//怪的类型
            dur:[0.4,0.5,0.5],//放怪相隔时间0.4到0.5随机
            path:[1,2,0],//路径1-3随机

            parme:{
                speed:50,//速度
                blood:50,//血
                attack:15,//攻击力
            },


        },

         {//第6波怪 --》死了之后释放第二波怪
            delay:0,//每波怪的时间间隔
            num:3,//每次放多少个
            type:Type_monster.actor5,//怪的类型
            dur:[0.4,0.5,0.5],//放怪相隔时间0.4到0.5随机
            path:[1,2,0],//路径1-3随机

            parme:{
                speed:50,//速度
                blood:50,//血
                attack:15,//攻击力
            },


        },

         {//第7波怪 --》死了之后释放第二波怪
            delay:0,//每波怪的时间间隔
            num:3,//每次放多少个
            type:Type_monster.actor6,//怪的类型
            dur:[0.4,0.5,0.5],//放怪相隔时间0.4到0.5随机
            path:[1,2,0],//路径1-3随机

            parme:{
                speed:50,//速度
                blood:50,//血
                attack:15,//攻击力
            },


        },
    ],

    [//第二轮

        {//第一波怪
            delay:1,//每波怪的时间间隔
            num:3,//每次放多少个
            type:Type_monster.actor2,//怪的类型
            dur:[0.4,0.5,0.6],//放怪相隔时间0.4到0.5随机
            path:[1,2,0],//路径1-3随机

            parme:{
                speed:50,//速度
                blood:50,//血
                attack:15,//攻击力
            },


        },

    ]


]

module.exports=level_data;