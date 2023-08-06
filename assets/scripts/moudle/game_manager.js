
let game_manager={
    disable_click:true,
    set_disable_click(state){
        if(this.disable_click==state){
            return;
        }
        this.disable_click=state?1:0;
        cc.sys.localStorage.setItem("disable_click",this.disable_click);

    }
}

let active=cc.sys.localStorage.getItem("disable_click");
if(active){
    active=parseInt(active);
}else{
    active=0;
}
game_manager.set_disable_click(active);
game_manager.set_disable_click(1);
module.exports=game_manager;