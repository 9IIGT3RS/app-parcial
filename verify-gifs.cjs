// verify-gifs.cjs
// Verifica cada gifUrl del JSON, elimina los que devuelven 404 u otro error
// Uso: node verify-gifs.cjs

const fs = require('fs');
const https = require('https');
const http = require('http');

const INPUT_PATH = './public/data/exercises.json';
const CONCURRENCY = 20;      // peticiones simultáneas (aumenta si va lento, baja si da errores)
const TIMEOUT_MS = 8000;     // tiempo máximo de espera por GIF

const data = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8'));
const exercises = data.data;

console.log(`Total exercises to check: ${exercises.length}`);
console.log(`Concurrency: ${CONCURRENCY} | Timeout: ${TIMEOUT_MS}ms`);
console.log('Starting verification...\n');

function checkUrl(url) {
    return new Promise((resolve) => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.request(url, { method: 'HEAD' }, (res) => {
            resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
        });
        req.on('error', () => resolve({ url, status: 'ERROR', ok: false }));
        req.setTimeout(TIMEOUT_MS, () => {
            req.destroy();
            resolve({ url, status: 'TIMEOUT', ok: false });
        });
        req.end();
    });
}

async function runInBatches(items, batchSize, fn) {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(fn));
        results.push(...batchResults);

        const done = Math.min(i + batchSize, items.length);
        const pct = ((done / items.length) * 100).toFixed(1);
        process.stdout.write(`\r  Progress: ${done}/${items.length} (${pct}%)`);
    }
    console.log('');
    return results;
}

async function main() {
    const startTime = Date.now();

    // Verificar todas las URLs
    const results = await runInBatches(exercises, CONCURRENCY, (ex) =>
        checkUrl(ex.gifUrl).then(r => ({ ...r, exerciseId: ex.exerciseId, name: ex.name }))
    );

    // Separar válidos e inválidos
    const invalid = results.filter(r => !r.ok);
    const validIds = new Set(results.filter(r => r.ok).map(r => r.exerciseId));

    console.log(`\n=== Results ===`);
    console.log(`✅ Valid GIFs:   ${validIds.size}`);
    console.log(`❌ Invalid GIFs: ${invalid.length}`);

    if (invalid.length > 0) {
        console.log('\n--- Removed exercises ---');
        invalid.forEach(r => console.log(`  [${r.status}] ${r.name} — ${r.url}`));
    }

    // Filtrar el JSON
    const cleanedExercises = exercises.filter(ex => validIds.has(ex.exerciseId));

    // Guardar
    const output = {
        success: true,
        metadata: { totalExercises: cleanedExercises.length },
        data: cleanedExercises
    };
    fs.writeFileSync(INPUT_PATH, JSON.stringify(output));

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const newSize = (fs.statSync(INPUT_PATH).size / 1024).toFixed(0);
    console.log(`\n✅ Done in ${elapsed}s — ${cleanedExercises.length} exercises kept — JSON size: ${newSize} KB`);
}

main().catch(console.error);