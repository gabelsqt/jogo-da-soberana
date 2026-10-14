// Vite dev/preview usam arquivos normais. O exportador itch.io pode
// embutir as imagens em data URLs para gerar um único index.html autossuficiente.
export function assetUrl(relativePath) {
  const embedded = globalThis.__SOBERANIA_SINGLEFILE_ASSETS__;
  return embedded?.[relativePath] ?? `./${relativePath}`;
}

export function isSingleFileBuild() {
  return Boolean(globalThis.__SOBERANIA_SINGLEFILE_ASSETS__);
}

export function hasEmbeddedAsset(relativePath) {
  return Object.hasOwn(globalThis.__SOBERANIA_SINGLEFILE_ASSETS__ ?? {}, relativePath);
}
