# SnappiTi

A emmet/zencoding style code generator for Titanium

# Install

```
$ [sudo] npm install -g snappiti
```

# Usage

```
$ snappiti compile [code]
```

There is an optional flag to hide style option generation. E.g.

```
$ snappiti comiple [code] -s
$ snappiti compile [code] --hide-style
```

#Examples

## Simple cases (with `--hide-style` flag)

### example 1 - named objects

```
  Window#win
```

becomes

```
  var win = Ti.UI.createWindow(styles['#win'])
```

### example 2 - with children

```
Window#win>View#container>Label.white#label+Button.green
```

becomes

```
  var win = Ti.UI.createWindow(styles['#win'])
  var container = Ti.UI.createView(styles['#container'])
  win.add(container)
  var label = Ti.UI.createLabel(_.defaults(styles['#label'],styles['.white']))
  container.add(label)
  container.add(Ti.UI.createButton(_.defaults({},styles['.green']))
```

### example 3 - iterations

```
  View#container>View#num$.button*8
```

becomes

```
  var container = Ti.UI.createView(styles['#container'])
  var num1 = Ti.UI.createView(_.defaults(styles['#num1'],styles['.button']))
  container.add(num1)
  var num2 = Ti.UI.createView(_.defaults(styles['#num2'],styles['.button']))
  container.add(num2)
  var num3 = Ti.UI.createView(_.defaults(styles['#num3'],styles['.button']))
  container.add(num3)
  var num4 = Ti.UI.createView(_.defaults(styles['#num4'],styles['.button']))
  container.add(num4)
  var num5 = Ti.UI.createView(_.defaults(styles['#num5'],styles['.button']))
  container.add(num5)
  var num6 = Ti.UI.createView(_.defaults(styles['#num6'],styles['.button']))
  container.add(num6)
  var num7 = Ti.UI.createView(_.defaults(styles['#num7'],styles['.button']))
  container.add(num7)
  var num8 = Ti.UI.createView(_.defaults(styles['#num8'],styles['.button']))
  container.add(num8)
```

### Example with device and platform queries

The `?` character has been added for this purpose.

You will need this library for detection:
[gist](https://gist.github.com/dbankier/5810192)

```
Window#win>(View#android?android>Button.blue)+(View#ios?ios?tablet>Button.red)
```

becomes

```
  var win = Ti.UI.createWindow(styles['#win'])
  if (Detect.android) {
    var android = Ti.UI.createView(styles['#android'])
    win.add(android)
    android.add(Ti.UI.createButton(_.defaults({},styles['.blue'])))
  }
  if (Detect.ios && Detect.tablet) {
    var ios = Ti.UI.createView(styles['#ios'])
    win.add(ios)
    ios.add(Ti.UI.createButton(_.defaults({},styles['.red'])))
  }
```


## Better cases (without the `--hide-styling` flag)

### Example using wrapping snippets

see the `snippets.json` file

```
  module#MainWindow>Window#win>(View#top.white>Label#label)+(View#bottom.green>Button#exit)
```

becomes

```

/******     STYLES     *****/

var styles = {
  '#MainWindow': {
    
  },
  '#bottom': {
    
  },
  '#exit': {
    
  },
  '#label': {
    
  },
  '#top': {
    
  },
  '#win': {
    
  },
  '.green': {
    
  },
  '.white': {
    
  }
};

/******      VIEWS     *****/

var _ = require('/lib/underscore');

function MainWindow(o){
  var win = Ti.UI.createWindow(styles['#win'])
  var top = Ti.UI.createView(_.defaults(styles['#top'],styles['.white']))
  win.add(top)
  var label = Ti.UI.createLabel(styles['#label'])
  top.add(label)
  var bottom = Ti.UI.createView(_.defaults(styles['#bottom'],styles['.green']))
  win.add(bottom)
  var exit = Ti.UI.createButton(styles['#exit'])
  bottom.add(exit)

}

module.exports = MainWindow

```

### Example using wrapping snippets and unnamed parent view

```
  module#MainWindow>Window#win>(View.white>Label#label)+(View.green>Button#exit)
```


becomes

```
/******     STYLES     *****/

var styles = {
  '#MainWindow': {
    
  },
  '#exit': {
    
  },
  '#label': {
    
  },
  '#win': {
    
  },
  '.green': {
    
  },
  '.white': {
    
  }
};

/******      VIEWS     *****/

var _ = require('/lib/underscore');

function MainWindow(o){
  var win = Ti.UI.createWindow(styles['#win'])
  var _view8 = Ti.UI.createView(_.defaults({},styles['.white']))
  win.add(_view8)
  var label = Ti.UI.createLabel(styles['#label'])
  _view8.add(label)
  var _view16 = Ti.UI.createView(_.defaults({},styles['.green']))
  win.add(_view16)
  var exit = Ti.UI.createButton(styles['#exit'])
  _view16.add(exit)

}

module.exports = MainWindow

```

# Editor Plugins

Hopefully this list will continue to be updated

 * **VIM** - [SnappiTi.vim](http://github.com/dbankier/SnappiTi.vim)
 * **Sublime Text 2 *** - [SnappiTi.sublime](http://github.com/dbankier/SnappiTi.sublime)



