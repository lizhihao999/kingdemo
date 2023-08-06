console.log("sound_manager");

//0开 1关
let sound_manager={
    b_music_mute:-1,
    b_effect_mute:-1,
    set_effect_mute:function(b_mute){
        if(this.b_effect_mute==b_mute){
            return;
        }

        this.b_effect_mute=(b_mute)?1:0;

        if(this.b_effect_mute===0){
            cc.audioEngine.setEffectsVolume(1);
        }else if(this.b_effect_mute===1){
            cc.audioEngine.setEffectsVolume(0);
        }


        cc.sys.localStorage.setItem("effect_mute",this.b_effect_mute);

    },

    set_music_mute:function(b_mute){
        if(this.b_music_mute==b_mute){
            return;
        }

        this.b_music_mute=(b_mute)?1:0;
        if(this.b_music_mute===0){
            cc.audioEngine.setMusicVolume(1);
        }else if(this.b_music_mute===1){
            cc.audioEngine.setMusicVolume(0);
        }


        cc.sys.localStorage.setItem("music_mute",this.b_music_mute);

    },

    play_music:function(path,loop){
       cc.resources.load(path, cc.AudioClip, null, function (err, clip) {
            if(err){cc.log(err)}
            cc.audioEngine.playMusic(clip, loop);
        });
    },

    play_effect:function(path,loop){
        cc.resources.load(path, cc.AudioClip, null, function (err, clip) {
            if(err){cc.log(err)}
            cc.audioEngine.playEffect(clip, loop);
        });
      
    }
}

var music_mute=cc.sys.localStorage.getItem("music_mute");
if(music_mute){
    music_mute=parseInt(music_mute);
}else{
    music_mute=0;
}
sound_manager.set_music_mute(music_mute);

var effect_mute=cc.sys.localStorage.getItem("effect_mute");
if(effect_mute){
    effect_mute=parseInt(effect_mute);
}else{
    effect_mute=0;
}
sound_manager.set_effect_mute(effect_mute);
sound_manager.play_music("sound/music/home_scene_bg",true);
sound_manager.set_music_mute(0);
sound_manager.set_effect_mute(0);
module.exports=sound_manager;
// module.exports = sound_manager;