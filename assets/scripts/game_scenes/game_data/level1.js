

let Type_monster=cc.Enum({
    actor0:0,
    actor1:1,
    actor2:2,
    actor3:3,
    actor4:4,
    actor5:5,
    actor6:6,
})

let level_data={
    0:{//第一波怪
        delay:0,//每波怪的时间间隔
        num:3,//每次放多少个
        type:Type_monster.actor0,//怪的类型
        dur:[0.4,0.5],//放怪相隔时间0.4到0.5随机
        path:[1,3],//路径1-3随机

        speed:50,//速度
        blood:50,//血
        attack:10,//攻击力


    },

    1:{//第一波怪
        delay:5,//每波怪的时间间隔
        num:5,//每次放多少个
        type:Type_monster.actor1,//怪的类型
        dur:[0.4,0.5],//放怪相隔时间0.4到0.5随机
        path:[1,3],//路径1-3随机

        speed:50,//速度
        blood:50,//血
        attack:15,//攻击力


    },
}