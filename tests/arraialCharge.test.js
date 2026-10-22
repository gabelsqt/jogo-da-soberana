import test from 'node:test';
import assert from 'node:assert/strict';
import { arraialStage, arraialPhrasePixels, ARRAIAL_TRUCK_PHRASES }
  from '../src/gameplay/arraialBrasil2.js';

test('Carga do balão avança dano, quantidade e paleta nos limites',()=>{
  for(const [hits,count,damage,colors] of [
    [0,1,1,3],[7,1,1,3],[8,2,1,5],[15,2,1,5],
    [16,3,2,8],[27,3,2,8],[28,5,2,10],[100,5,2,10]
  ]){
    const stage=arraialStage(hits);
    assert.equal(stage.fireworks,count);
    assert.equal(stage.damage,damage);
    assert.equal(stage.palette.length,colors);
  }
});
test('Frases são máscaras de pixels pequenas e não fontes de HUD',()=>{
  for(const phrase of ARRAIAL_TRUCK_PHRASES){
    const glyph=arraialPhrasePixels(phrase);
    assert.ok(glyph.points.length>0,phrase);
    assert.ok(glyph.width<=27*4,phrase);
    assert.ok(glyph.points.every(p=>p.x>=0&&p.y>=0&&
      p.x<glyph.width&&p.y<glyph.height));
  }
  assert.ok(arraialPhrasePixels('ROJÃO!').points.length>0);
});
