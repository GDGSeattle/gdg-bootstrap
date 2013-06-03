namespace.module('gdg-bootstrap', function(exports, require) {
    var config = require('gdg-bootstrap.config');
    var PLUS_API = 'https://www.googleapis.com/plus/v1/people/';
    var DEV_FEED_API = 'http://gdgfresno.com/gdgfeed.php';
    var PLUS_PROFILE = 'https://plus.google.com/';
    var DEV_CHAPTER_PAGE = 'https://developers.google.com/groups/chapter/';
    var PHOTO_FEED = 'https://picasaweb.google.com/data/feed/api/user/';

    exports.extend({
        signInCallback: signInCallback
    });

    $(document).ready(init);

    function init() {
        $('head').append('<link href="css/' + config.theme + '" rel="stylesheet"/>');
        $('title').prepend(config.name + ' | ');
        $('.brand').html('<strong>' + config.name + '</strong>');

        gapi.signin.render('signInButton', {
            callback: signInCallback,
            height: '30px',
            clientid: config.clientId,
            cookiepolicy: 'single_host_origin',
            requestvisibleactions: 'http://schemas.google.com/AddActivity',
            scope: 'https://www.googleapis.com/auth/plus.login'
            });

        $('#join_chapter').click(onJoin);
        $('li#googleplus').click(function () {
            window.open(PLUS_PROFILE + config.id)
        });

        $.getJSON(PLUS_API + config.id + '?' +
                  $.param({
                      fields: 'aboutMe,cover,displayName,image,plusOneCount',
                      key: config.google_api
                  }),
                  updatePlusInfo);
        $.getJSON(DEV_FEED_API + '?' + $.param({id: config.id}), updateDevEvents);
        $.getJSON(PHOTO_FEED + config.id + '/albumid/' + config.pwa_id + '?callback=?&' +
                  $.param({
                      access: 'public',
                      alt: 'json-in-script',
                      kind: 'photo',
                      'max-results': 18,
                      fields: 'entry(title,link/@href,summary,content/@src)',
                      v: '2.0'
                  }),
                  updatePhotos);
        $.getJSON(PLUS_API + config.id + '/activities/public?' +
                  $.param({
                      maxResults: 10,
                      key: config.google_api,
                  }),
                  updateNews);

        changePanel();
        $(window).on('hashchange', changePanel);
    }

    function changePanel() {
        var panel = location.hash.substr(1);
        if (panel == '') {
            panel = 'about';
        }

        $('.panel').hide();
        $('.nav li').removeClass('active');
        $('#'+panel+'_sec').show();
        $('#'+panel+'_nav').addClass('active');
    }

    function signInCallback(authResult) {
        if (authResult['access_token']) {
            // Successfully authorized
            // Hide the sign-in button now that the user is authorized, for example:
            document.getElementById('signInButton').setAttribute('style', 'display: none');
            console.log("Signed in", authResult);
        } else if (authResult['error']) {
            // There was an error.
            // Possible error codes:
            //   "access_denied" - User denied access to your app
            //   "immediate_failed" - Could not automatically log in the user
            console.log('There was an error: ' + authResult['error']);
        }
    }

    // Join - "I'm a member button"
    function onJoin() {
        var win = window.open(DEV_CHAPTER_PAGE + '/join/' + config.id);
        // TODO: Why do we change window's href after 1/2 sec?
        setTimeout(function () {
            win.location.href = DEV_CHAPTER_PAGE + config.id + '/';
        }, 500);
    }

    function updatePlusInfo(data) {
        $('#about-description').html(data.aboutMe);
        if (data.cover.coverPhoto.url && config.cover_photo) {
            var coverPhoto = data.cover.coverPhoto;
            var coverInfo = data.cover.coverInfo;
            $('#home').css({
                'background': 'url(' + coverPhoto.url + ') ' + coverInfo.leftImageOffset + 'px ' +
                    coverInfo.topImageOffset + 'px',
                'background-repeat': 'no-repeat',
                'color': config.cover_color,
                'width': coverPhoto.width + 'px',
                'height': coverPhoto.height + 'px'
            });
        }
    }

    //tie photo album to event
    function handleEventPhotos(event_id, album_id) {
        $.getJSON(PHOTO_FEED + config.id + '/albumid/' + album_id + '/?callback=?&' +
                  $.param({
                      alt: 'json-in-script',
                      'max-results': 12,
                      kind: 'photo',
                  }),
                  function (d) {
                      var tn;
                      var p = d.feed.entry;

                      for (var x in p) {
                          tn = '<li class="span2"><a href="' + p[x].link[1].href +
                              '" class="thumbnail" target="_blank"><img src="' + p[x].content.src +
                              '?sz=260" alt="'+p[x].title.$t + '" title="' + p[x].summary.$t + '"></a></li>';
                          $('#' + event_id).append(tn);
                      }
                  });
    }

    // gdg dev site events feed
    function updateDevEvents(data) {
        var now = new Date();
        for(var i=data.length-1;i>=0;i--){
            var start = new Date(data[i].start);

            var format = start.format("longDate")
            format += ' '+start.format("shortTime")

            var html = '<div class="media">';
            html+= data[i].iconUrl != undefined ? '<a class="pull-left" href="https://developers.google.com'+data[i].link+'" target="_blank"><img class="media-object" src="https://developers.google.com'+data[i].iconUrl+'"></a>' : '';
            html+='<div class="media-body">' +
                '<h4 class="media-heading"><a href="https://developers.google.com'+data[i].link+'" target="_blank">'+data[i].title+'</a></h4>' +
                '<h5>'+data[i].location+'<br/>'+format+'</h5>' +
                data[i].description +
                '</div>';

            if(config.custom_albums){
                var album_id = config.custom_albums.events[data[i].id];
                if( album_id ){
                    html+='<div><ul class="thumbnails" id="'+data[i].id+'"></ul></div>';
                    handleEventPhotos(data[i].id, album_id);
                }
            }

            html +='</div>';

            if (start < now){
                $('#past_events').next().next().append(html);
            } else {
                $('#upcoming_events').next().next().prepend(html);
            }
        }
        var past = $('#past_events').next().next().children();
        if(past.length > 5 ){
            $('#past_events').next().next().append('<div id="view_more_events"><a href="#">View More...</a></div>');
        }
        for( var i = past.length-1; i>=5; i--){
            past[i].style.display='none';
        }
        $('#view_more_events').click(function(){
            $('#past_events').next().next().children().slideDown();
            setTimeout(function(){$('#view_more_events').hide();}, 1);
        });
    }

    // Google+ photos
    function updatePhotos(d) {
        var html;
        var p = d.feed.entry;
        var count = 0;

        for(var x in p){
            count++;
            if(count == 1){
                html = '<li class="span4"><a href="'+p[x].link[1].href+'" class="thumbnail" target="_blank"><img src="'+ p[x].content.src + '?sz=460" alt="'+p[x].title.$t+'" title="'+p[x].summary.$t+'"></a></li>'
            }else if(count == 14){
                html = '<li class="span4 pull-right"><a href="'+p[x].link[1].href+'" class="thumbnail" target="_blank"><img src="'+ p[x].content.src + '?sz=460" alt="'+p[x].title.$t+'" title="'+p[x].summary.$t+'"></a></li>'
            }else{
                html = '<li class="span2"><a href="'+p[x].link[1].href+'" class="thumbnail" target="_blank"><img src="'+ p[x].content.src + '?sz=260" alt="'+p[x].title.$t+'" title="'+p[x].summary.$t+'"></a></li>'
            }
            $('#photo_container').append(html);
        }
    }

    // gdg g+ stream for news (reusing code from Roman Nurik for aggregating g+, twitter and
    // friend feed stream into a webpage)
    function updateNews(response) {
        if (response.error) {
            rebuildStreamUI([]);
            if (console && console.error) {
                console.error('Error loading Google+ stream.', response.error);
            }
            return;
        }

        var entries = [];
        for (var i = 0; i < response.items.length; i++) {
            var item = response.items[i];
            var actor = item.actor || {};
            var object = item.object || {};
            // Normalize tweet to a FriendFeed-like entry.
            var item_title = '<b><a href="' + item.url + '">' + item.title + '</a></b>';

            var html = [item_title.replace(new RegExp('\n','g'), '<br />')];
            //html.push(' <b>Read More &raquo;</a>');

            var thumbnails = [];

            var attachments = object.attachments || [];
            for (var j = 0; j < attachments.length; j++) {
                var attachment = attachments[j];
                switch (attachment.objectType) {
                case 'album':
                    break;//needs more work
                    var upper = attachment.thumbnails.length > 7 ? 7 : attachment.thumbnails.length;
                    html.push('<ul class="thumbnails">');
                    for(var k=1; k<upper; k++){
                        html.push('<li class="span2"><img src="' + attachment.thumbnails[k].image.url + '" /></li>');
                    }
                    html.push('</ul>');

                case 'photo':
                    thumbnails.push({
                        url: attachment.image.url,
                        link: attachment.fullImage.url
                    });
                    break;

                case 'video':
                    thumbnails.push({
                        url: attachment.image.url,
                        link: attachment.url
                    });
                    break;

                case 'article':
                    html.push('<div class="link-attachment"><a href="' +
                              attachment.url + '">' + attachment.displayName + '</a>');
                    if (attachment.content) {
                        html.push('<br>' + attachment.content + '');
                    }
                    html.push('</div>');
                    break;
                }
            }

            html = html.join('');

            var actor_image = actor.image.url;
            actor_image = actor_image.substr(0,actor_image.length-2)+'16';

            var entry = {
                via: {
                    name: 'Google+',
                    url: item.url
                },
                body: html,
                date: item.updated,
                reshares: (object.resharers || {}).totalItems,
                plusones: (object.plusoners || {}).totalItems,
                comments: (object.replies || {}).totalItems,
                thumbnails: thumbnails,
                icon: actor_image
            };

            entries.push(entry);
        }

        rebuildStreamUI(entries);
    }

    // To be called once we have stream data
    function rebuildStreamUI(entries) {
        entries = entries || [];
        entries.sort(function(x,y){ return y.date - x.date; });

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var $entry = $('<li>')
                .addClass(entry.via.name)
                .html(entry.body)

            // Entry icon
            $('<img class="icon">')
                .attr('src', entry.icon)
                .appendTo($entry);

            // Thumbnails
            if (entry.thumbnails && entry.thumbnails.length) {
                var $thumbs = $('<ul class="thumbnails">').appendTo($entry);
                for (var j = 0; j < entry.thumbnails.length; j++) {
                    var thumb = entry.thumbnails[j];
                    var $thumb = $('<li>').appendTo($thumbs);
                    if (thumb.link)
                        $thumb = $('<a>')
                        .attr('href', thumb.link)
                        .appendTo($thumb);
                    $('<img>')
                        .attr({
                            src: thumb.url/*,
                                            width: thumb.width,
                                            height: thumb.height*/
                        })
                        .appendTo($thumb);
                }
            }

            // Meta (date/time, via link)
            var $meta = $('<div class="meta">').appendTo($entry);
            $('<span class="from">')
                .html('Posted on ' + dateFormat(entry.date, 'fullDate'))
                .appendTo($meta);



            if (entry.comments) {
                $('<span class="label">')
                    .text(entry.comments + ' comment' +
                          ((entry.comments == 1) ? '' : 's'))
                    .appendTo($entry);
            }
            if (entry.reshares) {
                $('<span class="label">')
                    .text(entry.reshares + ' reshare' +
                          ((entry.reshares == 1) ? '' : 's'))
                    .appendTo($entry);
            }
            //+1 button
            $('<span class="g-plusone label" data-size="medium" data-annotation="bubble" data-href="'+entry.via.url+'">')
                .appendTo($entry);

            $entry.appendTo('#news-feed');
        }

        //render +1 buttons
        gapi.plusone.go();
    }
});
