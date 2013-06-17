var PEG = require('pegjs');
var fs = require('fs');

var data = fs.readFileSync('snappiti.peg', 'utf-8');
var parse = PEG.buildParser(data).parse;


exports.parse = function(string) {
  return parse(string);
}
