Brahma.screens
--
Amazing widget for creating effect of travels around the screens

## Usage
To make it work, you need [BrahmaJs](https://github.com/morulus/brahma) lib and right structure of document.

Create a node element and give it id (or some other selector). Put in that node another elements. This children elements will be your screens. 
Mark the position of screens by attributes data-x and data-y (when data-x - is X coord, data-y - is Y coord in the grid, capish?)
```html
<div id="screens">
	<div data-x="0" data-y="0">Screen1</div>
	<div data-x="1" data-y="0">Screen2</div>
	<div data-x="1" data-y="1">Screen3</div>
</div>
```
Ok. That's enough.

Now, run application of Brahma with created earlier selector:
```javascript
Brahma("#screens").app('screens');
```

It should work.
If doesn't. Look up for [example](http://morulus.github.io/brahma.screens/)

## License
MIT

## Author
[@morulus](ttps://github.com/morulus/)

