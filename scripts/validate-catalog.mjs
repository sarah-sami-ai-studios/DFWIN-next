import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=JSON.parse(fs.readFileSync('src/_data/products.json','utf8'));
const output=JSON.parse(fs.readFileSync('_site/catalog.json','utf8'));
const sectors=JSON.parse(fs.readFileSync('src/_data/sectors.json','utf8'));
assert.equal(output.count,source.length);
assert.equal(output.products.length,source.length);
assert.equal(new Set(source.map(p=>p.id)).size,source.length);
assert.equal(new Set(source.map(p=>p.slug)).size,source.length);
for (const p of source) {
  assert.equal(p.status,'Active');
  assert(sectors.some(s=>s.key===p.sector),p.id+' sector');
  assert(fs.existsSync('_site/'+p.image),p.id+' image');
  assert(fs.existsSync('_site/products/'+p.slug+'.html'),p.id+' page');
  const q=output.products.find(q=>q.id===p.id);
  assert(q,p.id+' absent from AI catalog');
  assert.deepEqual(q.specifications,p.specifications);
}
console.log(`Validated ${source.length} product pages, images and AI records.`);
