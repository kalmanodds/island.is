// @ts-check
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { ROOT } from './_common.mjs';


export function createOutputs(steps) {
    return {
        outputs: steps.reduce(
            (a, value) => {
                return {
                    ...a,
                    [`${value.id}-success`]: {
                        description: `Success for ${value.name}`,
                        value: `\${{ steps.${value.id}.outputs.success }}`,
                    },
                };
            },
            {
                success: {
                    description: 'Success for all caches',
                    value: JSON.stringify(
                        steps.reduce((a, value) => {
                            if (!value || !value.enabled) {
                                return a;
                            }
                            return {
                                ...a,
                                [value.id]: `\${{ steps.${value.id}.outputs.success }}`,
                            };
                        }, {})
                    ),
                },
            }
        ),
    };
}

export function createRuns(steps) {
    return {
        runs: {
            using: 'composite',
            steps: steps.map((_value) => {
                const { name, id, uses, with: withValue, value } = _value;
                return {
                    name,
                    id,
                    uses,
                    ...value,
                    with: {
                        path: withValue.path,
                        key: withValue.key,
                    },
                };
            }),
        },
    };
}

export function generateCacheAction({ name, id, path, key }) {
    return {
        name,
        id,
        uses: 'island-is/cache@v0.3',
        continue_on_error: true,
        with: {
            path,
            key,
        },
    };
}
export async function exportToYaml(
    obj,
    _fileName,
    fileName = resolve(ROOT, _fileName)
) {
    const YAML_FILE_ROOT = dirname(fileName);
    await mkdir(YAML_FILE_ROOT, { recursive: true });
    return /** @type {Promise<void>} */ (
        new Promise((resolve) => {
            const jsonString = JSON.stringify(obj);
            const cueProcess = spawn('cue', ['export', '-', '-o', fileName]);
            cueProcess.stdin.write(jsonString);
            cueProcess.on('message', (msg) => {
                console.error(`Error during YAML export: ${msg}`);
            });
            cueProcess.on('error', (msg) => {
                console.error(`Error during YAML export: ${msg}`);
            });
            cueProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`cue export failed with code ${code}`);
                    process.exit(1);
                }
                resolve();
            });
            cueProcess.stdin.end();
        })
    );
}
