# GDG Bootstrap

A GDG club static web site with integration to [Google Developer Groups][http://developers.google.com/groups].

Created by [+Joshua Woodward]
with contributions from:
- [+Friedger Müffke][] Events - upcoming/previous
- [+Michel Racic][] News Feed
- [+Dustin Brand][] +1 button
- [+Mike Koss][] GDG Seattle

  [+Joshua Woodward]: http://joshuawoodward.com/+
  [+Friedger Müffke]: https://plus.google.com/107100127479392600261
  [+Michel Racic]: https://plus.google.com/109163915105172405583
  [+Dustin Brand]: https://plus.google.com/111468921647150271146
  [+Mike Koss]: https://plus.google.com/104304419342230315027

Includes jQuery, Twitter Bootstrap, and a JavaScript Date Formatter - License all inside

## How do I use it?

Go to Google Developer API console (https://code.google.com/apis/console/) and create a project, or use existing
one, that has the Google+ Service turned on. You will need an API Key to get "About" and "Photo" sections to work.

Open /js/gdg.js and modify the config lines 3-5, with your GDG Name, Google+ Profile ID (Use your chapters +Page,
not your personal), and API Key.

Should just work ...

LIVE EXAMPLES
=============
1. [GDG Fresno][http://gdgfresno.com/]
2. [GDG Albuquerque][http://gdgabq.com/]
3. [GDG Zurich][http://gdgzh.ch/test/]
4. [Brussels GTUG][https://googledrive.com/host/0B5AyOi3Zg85OT1pueUl4QzZ2YVk/index.html]
5. [GDG Seattle][http://mckoss.github.io/gdg-bootstrap/]

## Revision History

### v 0.6 (current)

- Fix bug in home page image sizing.
- README converted to Markdown.

### v 0.5

- Changed layout to display more like tabs
- Modified news section, +1 post directly from your website
- include a picasa web album id - pwa seems to be buggy when just trying to get last overall
- Some other stuff...

### v 0.4

- Added Google+ Stream, by Michel Racic
- Modified Photo lay out, once again
- created gdg.css, to assist in stream and future custom css

### v 0.3

- Added two new config options.
- cover_photo (boolean) - determines if you want to use cover photo from
  google+ chapter page, currently best if you use a 940x180 image
- cover_color (css color) - custom font color option for cover photo, for
  dark pictures
- Added "Join" link - if users is logged into Google, will automagically
  mark the "I'm a member button", otherwise does nothing.
- Minified dateFormat.js

### v 0.2

- Added bootstrap-responsive.min.css
- Categorized upcoming and past events
- Photos: Changed layout, pulls last 22 photos

### v 0.1

- About: Pulled from Google+ API
- Events: Temporary pulls from gdgfresno.com/gdgfeed.php, until developers.google.com event
  feed implements JSONP ability
- Photos: Pulled from Google+ Photos, last 24 added
