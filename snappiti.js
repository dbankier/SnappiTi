var fs = require('fs');
var snippets = require("./snippets.json");

var parse = require('./parser').parse;


exports.parse = function(string) {
  return parse(string);
};
function buildStart(name) {
  if ("Annotation" === name) {
    return "Ti.Map.createAnnotation(";
  }
  if (["VideoPlayer", "AudioPlayer"].indexOf(name) > -1) {
    return "Ti.Media.create"+name+"(";
  }
  if (["AdView", "DocumentViewer", "CoverFlowView","TabbedBar","Toolbar"].indexOf(name) > -1) {
    return "Ti.UI.iOS.create"+name+"(";
  }
  if (["Popover","SplitWindow"].indexOf(name) > -1) {
    return "Ti.UI.iPad.create"+name+"(";
  }
  if (["NavigationGroup"].indexOf(name) > -1) {
    return "Ti.Media.create"+name+"(";
  }
  return "Ti.UI.create"+name+"(";
}

function buildObject(o, buffer, parent) {
  if (snippets[o.object]) {
    return buffer.push(snippets[o.object].replace(/\{\{id\}\}/g,o.id||""));
  }
  var start = buildStart(o.object);
  if (o.id) {
    buffer.push("var " + o.id + " = " + start );
    if (o.classes && o.classes.length > 0) {
      buffer.push("_.default(styles['#"+o.id+"']," + o.classes.map(function(c) { return "styles['."+c+"']";}).join(","));
    } else {
      buffer.push("styles['#"+o.id+"']");
    }
    buffer.push(")\n");
    if (parent) {
      buffer.push(parent + ".add("+o.id+")\n");
    }
  } else if (parent) {
    buffer.push(parent+ ".add("+start);
    if (o.classes && o.classes.length > 0) {
      buffer.push("_.default({}," + o.classes.map(function(c) { return "styles['."+c+"']";}).join(","));
    }
    buffer.push("))\n");
  }
  if (o.children) {
    o.children.forEach(function(child) {
      buildObject(child, buffer, o.id);
    });
  }
}
exports.generate = function(string) {
  var buffer = [];
  var objects = parse(string);
  objects.forEach(function(o) {
    buildObject(o, buffer);
  });

  return buffer.join("");
}
