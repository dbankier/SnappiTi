var fs = require('fs');
var snippets = require("./snippets.json");

var parse = require('./parser').parse;

var indent = "  ";


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
  if (snippets[o.object]) { //wrapping snippets
    var snippet_parts = snippets[o.object].replace(/\{\{id\}\}/g,o.id||"").split("$0");
    buffer.push(snippet_parts[0]);
    if (o.children) {
      o.children.forEach(function(child) {
        buildObject(child, buffer);
      });
    }
    buffer.push(snippet_parts[1]);
    return;
  }
  var old_indent = indent;
  if (o.querries) {
    buffer.push(indent + "if (" + o.querries.map(function(q) { return "Detect." + q;}).join(" && ") + ") {\n");
    indent = indent + indent;
  }
  var start = buildStart(o.object);
  if (o.id) {
    buffer.push(indent  + "var " + o.id + " = " + start );
    if (o.classes && o.classes.length > 0) {
      buffer.push("_.defaults(styles['#"+o.id+"']," + o.classes.map(function(c) { return "styles['."+c+"']";}).join(",") + ")");
    } else {
      buffer.push("styles['#"+o.id+"']");
    }
    buffer.push(")\n");
    if (parent) {
      buffer.push(indent + parent + ".add("+o.id+")\n");
    }
  } else if (o.children) {
    o.id = "_view" + buffer.length;
    buffer.push(indent  + "var " + o.id + " = " + start );
    if (o.classes && o.classes.length > 0) {
      buffer.push("_.defaults({}," + o.classes.map(function(c) { return "styles['."+c+"']";}).join(",") + ")");
    } 
    buffer.push(")\n");
    if (parent) {
      buffer.push(indent + parent + ".add("+o.id+")\n");
    }
  } else if (parent) {
    buffer.push(indent + parent+ ".add("+start);
    if (o.classes && o.classes.length > 0) {
      buffer.push("_.defaults({}," + o.classes.map(function(c) { return "styles['."+c+"']";}).join(",") + ")");
    }
    buffer.push("))\n");
  }
  if (o.children) {
    o.children.forEach(function(child) {
      buildObject(child, buffer, o.id);
    });
  }
  if (o.querries) {
    indent = old_indent;
    buffer.push(indent + "}\n");
  }
}


function getClassesAndIds(o) {
  var ret = [];
  o.id && ret.push("#"+o.id);
  if (o.classes && o.classes.length > 0) {
    ret = ret.concat(o.classes.map(function(c) { return "." + c}));
  }
  if (o.children) {
    o.children.forEach(function(c) {
      ret = ret.concat(getClassesAndIds(c));
    });
  }
  return ret;
}

exports.generate = function(string, hideStyle) {
  var buffer = [];
  var objects = parse(string);
  if (!hideStyle) {
    buffer.push("\n" + "/******     STYLES     *****/\n\n"+ "var styles = {\n");
    var styles = [];
    objects.forEach(function(o) {
      styles = styles.concat(getClassesAndIds(o));
    });
    buffer.push(styles.sort().map(function(x) { 
      return indent +  "'" + x + "': {\n"+ indent + indent + "\n" + indent + "}";}).join(",\n"));
    buffer.push("\n};\n");
    buffer.push("\n" +  "/******      VIEWS     *****/\n\n");
  }

  objects.forEach(function(o) {
    buildObject(o, buffer);
  });

  return buffer.join("");
}
