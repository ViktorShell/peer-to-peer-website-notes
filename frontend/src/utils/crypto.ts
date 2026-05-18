/** SHA-256 hex of a UTF-8 string using SubtleCrypto. */
export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return bufferToHex(hash)
}

/** SHA-256 hex of arbitrary bytes. */
export async function sha256HexBytes(bytes: Uint8Array): Promise<string> {
  // Copy into a fresh ArrayBuffer so the type is unambiguous (not SharedArrayBuffer)
  const buf = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buf).set(bytes)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return bufferToHex(hash)
}

export function bufferToHex(buf: ArrayBuffer): string {
  const view = new Uint8Array(buf)
  let out = ''
  for (let i = 0; i < view.length; i++) {
    out += view[i].toString(16).padStart(2, '0')
  }
  return out
}

export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('hex must have even length')
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}
