'use strict';

const {join} = require('path');
const {
    readFileSync,
    writeFileSync,
} = require('fs');

const {extend} = require('supertape');
const swc = require('@swc/core');
const babel = require('@babel/parser');

const swcToBabel = require('..');

const json = (a) => JSON.parse(JSON.stringify(a));

const test = extend({
    jsonEqual: (operator) => (actual, expected, message = 'should jsonEqual') => {
        const {is, output} = operator.deepEqual(json(actual), json(expected));
        
        return {
            is,
            message,
            actual,
            expected,
            output,
        };
    },
});

const fixtureDir = join(__dirname, 'fixture');

const isUpdate = process.env.UPDATE;
const update = (a, json) => {
    if (!isUpdate)
        return;
    
    writeFileSync(`${fixtureDir}/${a}.json`, JSON.stringify(json, null, 4));
};

const readJS = (a) => readFileSync(join(`${fixtureDir}/${a}`), 'utf8');
const readJSON = (a) => require(`${fixtureDir}/${a}`);
const fixture = {
    ast: {
        swcModule: readJSON('swc-module.json'),
        identifier: readJSON('identifier.json'),
    },
    js: {
        swcModule: readJS('swc-module.js'),
        identifier: readJS('identifier.js'),
    },
};

test('estree-to-babel: swc: parse: cwcModule', (t) => {
    const ast = swc.parseSync(fixture.js.swcModule);
    const result = swcToBabel(ast, fixture.js.swcModule);
    
    update('swc-module', result);
    
    t.jsonEqual(result, fixture.ast.swcModule);
    t.end();
});

test('estree-to-babel: swc: parse: identifier', (t) => {
    const ast = swc.parseSync(fixture.js.identifier);
    const result = swcToBabel(ast, fixture.js.identifier);
    
    update('identifier', result);
    
    t.jsonEqual(result, fixture.ast.identifier);
    t.end();
});

test('estree-to-babel: swc: parse: babel', (t) => {
    const ast = swc.parseSync(fixture.js.identifier);
    const result = swcToBabel(ast, fixture.js.identifier);
    //const babelAst = babel.parse(fixture.js.identifier);
    
    t.jsonEqual(result, fixture.ast.identifier);
    t.end();
});

