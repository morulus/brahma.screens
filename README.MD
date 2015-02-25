Brahma.screens
--

## Usage
To make it work you need BrahmaJs lib and right structore of document.

Create a node element and give it id (or some other identifier). Put in that node another elements. That elements will be your screens. 
Mark the position of screens by attributes data-x and data-y (when data-x - is X coord, data-y - is Y coord in the grid, capish?)
```html
<div id="screens">
	<div data-x="0" data-y="0">Screen1</div>
	<div data-x="1" data-y="0">Screen2</div>
	<div data-x="1" data-y="1">Screen3</div>
</div>
```
Ok. That's enough.

Now, run application of Brahma:
```javascript
Brahma("#screens").app('screens');
```

I should work.
Look up for [example](http://)

