var Config = (function(){
    var config = {
        //modify these
        'name'          : "GDG Seattle",
        'id'            : '104304419342230315027',
        'google_api'    : 'AIzaSyBq72pwSnMvRbzQfy-NdxNtCfbyeh6I6kg',
        'pwa_id'        : '5706159208906929457', //picasa web album id
        //custom stuff
        'cover_photo'   : true, //best results make sure you have 940x180 image
        'cover_color'   : '#ffffff',
        'theme'         : 'gdg.css', // also available: devgoogle.css
        'custom_albums' : {
            events : {
                //'ahNzfmdvb2dsZS1kZXZlbG9wZXJzcg4LEgVFdmVudBib8PsDDA':'5738801490307387457'
            }
        }
    }
    return {get : function(a) { return config[a]}}
})();
