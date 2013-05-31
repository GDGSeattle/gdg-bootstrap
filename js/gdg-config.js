namespace.module('gdg-bootstrap.config', function(exports, require) {
    exports.extend({
        'name'          : "GDG Seattle",

        // You club's Google Plus id
        'id'            : '104304419342230315027',

        // Get your own google api key from https://code.google.com/apis/console/
        'google_api'    : 'AIzaSyBq72pwSnMvRbzQfy-NdxNtCfbyeh6I6kg',

        // Google Plus photo album id (aka Picassa web album)
        'pwa_id'        : '5706159208906929457',

        'cover_photo'   : true,
        'cover_color'   : '#ffffff',

        // also available: devgoogle.css
        'theme'         : 'gdg.css',
        'custom_albums' : {
            events : {
                //'ahNzfmdvb2dsZS1kZXZlbG9wZXJzcg4LEgVFdmVudBib8PsDDA':'5738801490307387457'
            }
        }
    });
});
