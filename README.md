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

### named objects

```
  Window#win
```

becomes

```
  var win = Ti.UI.createWindow(styles['#win'])
```

### with children, styles and ids

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

### attributes

```
Window#win.white>Label#title[text="Hello World!"]+View.black[borderRadius=5 backgroundColor="black"]
```

becomes

```
  var win = Ti.UI.createWindow(_.defaults(styles['#win'],styles['.white']));
  var title = Ti.UI.createLabel(_.defaults({"text":"Hello World!"},styles['#title']));
  win.add(title);
  win.add(Ti.UI.createView(_.defaults({"borderRadius":5,"backgroundColor":"black"},styles['.black'])));
```

### iterations

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

### device and platform queries

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

### style object generation

```
Window#win>View#container>Label.white#label+Button.green
```

becomes

```
/******     STYLES     *****/

var styles = {
  '#container': {
    
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

  var win = Ti.UI.createWindow(styles['#win'])
  var container = Ti.UI.createView(styles['#container'])
  win.add(container)
  var label = Ti.UI.createLabel(_.defaults(styles['#label'],styles['.white']))
  container.add(label)
  container.add(Ti.UI.createButton(_.defaults({},styles['.green'])))

```

### using wrapping snippets

see the `snippets.json` file for `module` definition

```
  module#MainWindow>Window#win>(View.white>Label#label)+(View.green>Button#exit)
```


becomes

```
/******     STYLES     *****/

var styles = {
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

var _ = require('/lib/underscore'), Detect = require('/lib/detect');

function MainWindow(o){
  var win = Ti.UI.createWindow(styles['#win'])
  var _view6 = Ti.UI.createView(_.defaults({},styles['.white']))
  win.add(_view6)
  var label = Ti.UI.createLabel(styles['#label'])
  _view6.add(label)
  var _view10 = Ti.UI.createView(_.defaults({},styles['.green']))
  win.add(_view10)
  var exit = Ti.UI.createButton(styles['#exit'])
  _view10.add(exit)

}

module.exports = MainWindow
```

# Editor Plugins

Hopefully this list will continue to be updated

 * **VIM** - [SnappiTi.vim](http://github.com/dbankier/SnappiTi.vim)
 * **Sublime Text 2** - [SnappiTi.sublime](http://github.com/dbankier/SnappiTi.sublime)



