Brahma.screens
--
Amazing widget for creating parallax fullscreen slider

## Usage
To make it work, you need [BrahmaJs](http://morulus.github.io/brahma/) library and Brahma.touch plugin. See depends in [bower.json](https://github.com/morulus/brahma.screens/blob/gh-pages/bower.json).

Create a node element and give id to it (or some other selector). Put inside node any elements, which will be your slides. 
Mark the positions of slides by attributes _data-screen-x_ and _data-screen-y_ (where data-screen-x - is X coord in the grid, data-screen-y - is Y coord in the grid, capish?)

The grid is a map of your slides in 2D plane. So, if you wanna to your slider will work in only horizontal mode, you should make data-screen-y equal 0, always. But this slider supports XY moves, so Y can have any value. To understand it, imagine that _data-screen-y_ is a number of floor, so that data-screen-x is a serial number of room. But in the case of the program, all the way around. We build this building in to the ground. So 5-th floor is a deep inside the ground, not up.
```html
<div id="screens">
	<div data-screen-x="0" data-screen-y="0">First floor, first room</div>
	<div data-screen-x="1" data-screen-y="0">First floor, second room</div>
	<div data-screen-x="1" data-screen-y="1">Second floor, second room</div>
</div>
```

The best way to create a photo gallery - a place photos inside the main container and enable `photogallery` option (it is enabled by defaults). 
<div id="screens">
	<img data-screen-x="0" data-screen-y="0" alt="Photo 1" />
	<img data-screen-x="1" data-screen-y="0" alt="Photo 2" />
	<img data-screen-x="2" data-screen-y="0" alt="Photo 3" />
</div>
```
This photos will be transformed into DIV elements with background. Inside these element will be placed titles, generated from alt-attribute or filename.

Another way - to create your custome structure with your own style and don't forget to disable `photogallery` option. After or 

After creating elements run application of Brahma:
```javascript
Brahma("#screens").app('screens', {
	// Options
});
```

Look for a result. It should work.
If doesn't. Look up for [example](http://morulus.github.io/brahma.screens/)

## Options
- lockDelay : Imposes a ban on the any action after the start of movement on specific time in ms. Or if value is true, on full duration of moving. _Default_: false. (This options automaticly enabled on infinity mode)
- easing : easing function of CSS animation (it can be cubic-bezier or any else CSS compatible easing). _Default_: `cubic-bezier(.43,.2,.46,.8)`
- duration : Duration of animation in ms. _Default_: 1000
- touch : Enables touch screen support. _Default_: true
- mobileMap : On mobile devices (including tablet) will show map in center of screen. Default: false
- deadlockEffect : Enables effect of endings of grid. _Default_: true
- photogallery : To convert images to DIV elements with property background-size:cover. It makes process of creating photo-gallery easier. _Default_: false
- infinity : Experimental & unstable mode, when slides will never ends and user can move to any direction any times. Like teleporting to another edge. _Default_: false
- infinityMethod : Method of logic of infinity mode. Can be passage or discover. _Default_: passage
- keyboard: Enables keyboard listner. _Default_: true

## Special effect
There is few simple CSS3 effects, that you can use in the slides contents. Use the special classes at sub-elements in screen:
- brahma-screen-effect-fade : will show element using fade effect when slider will become current.
- brahma-screen-effect-zoom : will show element using zoom effect when slider will decome current.

## Intresting
You can use a lot of copies of sliders at one page. But do not forget that the keyboard is one at all. You can disable it via the keyboard option, but when one keyboard is one at all - it is also interesting. Look up for example [example](http://morulus.github.io/brahma.screens/several.html)


## News
### Version 1.2.1
- Disable mobileMap on defaults
- Change default duration to 650
- Adds titles in photogallery mode
- Keyboard option

### Version 1.2.0
- Supporting touch screen
- The effect of the deadlock
- Auto fill images : if slide nodeName is IMG, element converted to DIV with same background image like IMG.src.
- Centered map display in mobile devices
- Responsive arrows to mobile devices
- Detecting mobile devices
- Fixed easing prop in config
- Changed default value of easing function

## License
MIT

## Author
[@morulus](ttps://github.com/morulus/)

