import AsyncStorage from "@react-native-async-storage/async-storage"

const keyFor = (collection) => `repo:${collection}`
const lastIdKeyFor = (collection) => `repo:${collection}:lastId`

async function getAll(collection) {
  const raw = await AsyncStorage.getItem(keyFor(collection))
  if (!raw) return []
  try {
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function setAll(collection, items) {
  await AsyncStorage.setItem(keyFor(collection), JSON.stringify(items || []))
}

function dedupeById(items) {
  const seen = new Set()
  const out = []
  for (const it of items || []) {
    const id = it?.id
    if (id == null || !seen.has(id)) {
      out.push(it)
      if (id != null) seen.add(id)
    }
  }
  return out
}

async function nextId(collection, seedMaxId = 0) {
  const raw = await AsyncStorage.getItem(lastIdKeyFor(collection))
  let last = raw ? Number(raw) : 0
  if (!last || Number.isNaN(last)) last = 0
  const base = Math.max(last, seedMaxId || 0)
  const next = base + 1
  await AsyncStorage.setItem(lastIdKeyFor(collection), String(next))
  return next
}

async function upsert(collection, item, seedMaxId = 0) {
  const list = await getAll(collection)
  let updated
  if (item.id == null) {
    const id = await nextId(collection, seedMaxId)
    updated = { ...item, id }
    list.unshift(updated)
  } else {
    const idx = list.findIndex((x) => Number(x.id) === Number(item.id))
    if (idx >= 0) list[idx] = { ...list[idx], ...item }
    else list.unshift(item)
    updated = item
  }
  await setAll(collection, list)
  return updated
}

async function remove(collection, id) {
  const list = await getAll(collection)
  const idx = list.findIndex((x) => Number(x.id) === Number(id))
  if (idx >= 0) {
    list.splice(idx, 1)
    await setAll(collection, list)
    return true
  }
  return false
}

async function mergeWithSeed(collection, seed = []) {
  const local = await getAll(collection)
  if (!seed?.length && !local?.length) return []
  if (!seed?.length) return local
  if (!local?.length) return seed
  // prefer local overrides by id
  const byId = new Map()
  for (const it of seed) byId.set(it.id, it)
  for (const it of local) byId.set(it.id, { ...byId.get(it.id), ...it })
  return Array.from(byId.values())
}

export const localRepo = {
  getAll,
  setAll,
  upsert,
  remove,
  mergeWithSeed,
}

export default localRepo
