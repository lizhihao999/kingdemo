let utils={
    async initBundle(str_budle,path,type) {
        let bundle = await this.loadBudleSync(str_budle);
        return bundle;
    },
    async initDirload(str_budle,path,type) {
        let bundle = await this.loadBudleSync(str_budle);
        let dir=await this.loadDirSync(bundle,path,type);
        return dir;
    },


    loadBudleSync(str_budle) {
        return new Promise((reovle, reject) => {
            cc.assetManager.loadBundle(str_budle, (err, bundle) => {
                if(err){
                    reject(err);
                }else{
                    reovle(bundle);
                }
            });
        });
    },
    loadDirSync(bundle,path,type){
        //let bundle=await initBudle(str_budle);
        // cc.log(bundle);
        return new Promise((reovle, reject) => {
            bundle.loadDir(path,type,(err, dir_asset) => {
                if(err){
                    reject(err);
                }else{
                    reovle(dir_asset);
                }
            });
        });

    },
    
}

module.exports=utils;
