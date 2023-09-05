const fs = require('fs');
const _ = require('lodash');
const assert = require('assert');
const jsonDiff = require('json-diff');

const expected = cleanJson(JSON.parse(fs.readFileSync('expected_xray.json')));
const result = cleanJson(JSON.parse(fs.readFileSync('xray.json')));
console.log('Comparaison between actual result and expected result');
console.log(jsonDiff.diffString(expected, result));
assert(_.isEqual(result, expected));
console.log('Everything is OK');

function cleanJson(json) {
  const duration = 'Duration:';
  json.tests.forEach(test => {
    if (test.start) {
      test.start = null;
    }
    if (test.finish) {
      test.finish = null;
    }
    test.steps.forEach(step => {
      if (step.actualResult) {
        step.actualResult = step.actualResult.replace(/(?:\\[rn]|[\r\n]+)+/g, '');
        step.actualResult = step.actualResult.substring(0, step.actualResult.indexOf(duration));
      }
      step.evidences.forEach(evidence => {
        if (evidence.data) {
          evidence.data = null;
        }
      });
    });
  });
  return json;
}
