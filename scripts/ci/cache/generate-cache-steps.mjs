/**
 * This script is used to generate a cache workflow for a CI/CD pipeline.
 */

// @ts-check
import { ENV_YAML_FILE } from './_const.mjs'
import { caches } from './__config.mjs'
import {
  generateCacheActionRestore,
  createRestoreOutputs,
  createRuns,
  exportToYaml,
} from './_generate-cache-steps-utils.mjs'
import { HAS_HASH_KEYS } from './_common.mjs'
import { writeToSummary, writeToOutput } from './_get_hashes_utils.mjs'
import { keyStorage } from './_key_storage.mjs'

if (!HAS_HASH_KEYS) {
  console.log('Generating cache hashes')
}
/** Generate hash */
for (const value of caches) {
  if (value.enabled && !HAS_HASH_KEYS) {
    console.log(`Generating hash for ${value.name}`)
    keyStorage.setKey(value.id, await value.hash())
  }
  if (!value.enabled && HAS_HASH_KEYS && keyStorage.hasKey(value.id)) {
    // Delete key if not enabled
    keyStorage.deleteKey(value.id)
  }
}
if (!HAS_HASH_KEYS) {
  // Only write summary if this is initial run
  await writeToSummary(keyStorage.getKeys())
}
writeToOutput(keyStorage.getKeys())

const steps = await Promise.all(
  caches
    .map(async (value) => {
      if (!value.enabled) {
        return null
      }
      return generateCacheActionRestore({
        name: value.name,
        id: value.id,
        path: value.path,
        key: await value.hash(),
      })
    })
    .filter((e) => e != null),
)

const outputs = createRestoreOutputs(steps)
console.log({ outputs })

const workflow = {
  name: 'Autogenerated cache workflow',
  description: 'Autogenerated',
  ...createRestoreOutputs(steps),
  ...createRuns(steps),
}

const YAML_FILE = process.env[ENV_YAML_FILE]

if (YAML_FILE) {
  await exportToYaml(workflow, YAML_FILE)
}
