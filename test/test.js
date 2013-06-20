var SnappiTi = require("../snappiti");
var assert = require("assert");
describe("basic object parsing", function() {
  it("should parse simple objects", function() {
    assert.deepEqual(SnappiTi.parse("View"),[{object:"View"}]);
  });

  it("should parse simple objects with id", function() {
    assert.deepEqual(SnappiTi.parse("View#id"),[{object:"View", id:"id", classes: []}]);
  });

  it("should parse simple objects with id number", function() {
    assert.deepEqual(SnappiTi.parse("View#id2"),[{object:"View", id:"id2", classes: []}]);
  });

  it("should parse simple objects with id and classes", function() {
    assert.deepEqual(SnappiTi.parse("View#id.one.two"),[{object:"View", id:"id", classes: ["one","two"]}]);
  });

  it("should parse simple objects with id and classes different order", function() {
    assert.deepEqual(SnappiTi.parse("View.one.two#id"),[{object:"View", id:"id", classes: ["one","two"]}]);
  });

  it("should parse simple objects with classes", function() {
    assert.deepEqual(SnappiTi.parse("View.one.two"),[{object:"View", classes: ["one","two"]}]);
  });

});

describe("plus operators", function() {
  it("plus sign",function() {
    assert.deepEqual(SnappiTi.parse("View+ImageView"), [{object:"View"},{object:"ImageView"}]);
  });

  it("plus sign with classes and ids",function() {
    assert.deepEqual(SnappiTi.parse("View.one+ImageView#me"), [{object:"View", classes:["one"]},{object:"ImageView",id:"me", classes:[]}]);
  });

  it("parses many plus signs",function() {
    assert.deepEqual(SnappiTi.parse("View+ImageView+View"), [{object:"View"},{object:"ImageView"},{object:"View"}]);
  });
});

describe("multiply operator", function() {
  it ("parses simple case", function() {
    assert.deepEqual(SnappiTi.parse("View*3"),[{object:"View"},{object:"View"},{object:"View"}]);
  });
  it ("parses case with plus", function() {
    assert.deepEqual(SnappiTi.parse("View*3+ImageView"),[{object:"View"},{object:"View"},{object:"View"},{object:"ImageView"}]);
  });
  it ("parses case with plus again", function() {
    assert.deepEqual(SnappiTi.parse("ImageView+View*3"),[{object:"ImageView"},{object:"View"},{object:"View"},{object:"View"}]);
  });
  it ("parses case with class", function() {
    assert.deepEqual(SnappiTi.parse("View.red*3"),[{object:"View",classes:['red']},{object:"View",classes:['red']},{object:"View",classes:['red']}]);
  });
  it ("parses case with class and wildcard", function() {
    assert.deepEqual(SnappiTi.parse("View.red$*3"),[{object:"View",classes:['red1']},{object:"View",classes:['red2']},{object:"View",classes:['red3']}]);
  });
  it ("parses case with id and wildcard", function() {
    assert.deepEqual(SnappiTi.parse("View#red$*3"),[{object:"View",id:'red1',classes:[]},{object:"View",id:'red2',classes:[]},{object:"View",id:'red3',classes:[]}]);
  });



});

describe("with children", function() {
  it ("parses single child", function() {
    assert.deepEqual(SnappiTi.parse("View>ImageView"), [{object:"View", children:[{object:"ImageView"}]}]);
  });
  it ("parses single grandchild", function() {
    assert.deepEqual(SnappiTi.parse("View>ImageView>Button"), [{object:"View", children:[{object:"ImageView", children:[{object:"Button"}]}]}]);
  });
  it ("parses generations", function() {
    assert.deepEqual(SnappiTi.parse("View>ImageView+Button#one>Button#two+Button#three"), [{object:"View", children:[{object:"ImageView"},{object:"Button", id:"one", classes:[], children:[{object:"Button", id:"two", classes:[]},{object:"Button", id:"three", classes:[]}]}]}]);
  });
  it ("parses mutiples with children", function() {
    assert.deepEqual(SnappiTi.parse("View*2>ImageView"), [{object:"View", children:[{object:"ImageView"}]},{object:"View", children:[{object:"ImageView"}]}]);
  });
});

describe("support parentheses", function() {
  it("parse parentheses expression", function() {
    assert.deepEqual(SnappiTi.parse("Window>(View>ImageView)+(View#footer>Button)"),[
       {object:"Window", children: [ {object:"View", children: [{object:"ImageView"}]
         },{object:"View",id:"footer",classes:[],children:[{object:"Button"}]}]}]);
  });
});

describe("supports querries", function() {
  it("supports single query", function() {
    assert.deepEqual(SnappiTi.parse("View#id?handheld?android"),[{object:"View", id:"id", classes: [], querries:["handheld","android"]}]);  });
});

describe("supports attributes", function() {
  it("supports simple text attribute", function() {
    assert.deepEqual(SnappiTi.parse("View[text='one']"),[{object:"View", attributes: {text: 'one'}}]);  
  });
  it("supports simple integer attribute", function() {
    assert.deepEqual(SnappiTi.parse("View[text=0]"),[{object:"View", attributes: {text: '0'}}]);  
  });
  it("supports mutiple attribute", function() {
    assert.deepEqual(SnappiTi.parse("View#id?handheld?android[title='hello' borderRadius=0]"),[{object:"View", id:"id", classes: [], querries:["handheld","android"], attributes: {title: 'hello', borderRadius: 0}}]);  
  });

});

