/**
 * SHA-Infinity Hashing System
 *
 * An extensible, recursive hashing system built on SHA-256.
 * Supports infinite depth chaining, merkle trees, and composite hashes.
 *
 * @module sha-infinity
 * @version 1.0.0
 * @license BlackRoad OS Proprietary
 */

const crypto = require('crypto');

/**
 * SHA-Infinity Configuration
 */
const SHA_INFINITY_CONFIG = {
  baseAlgorithm: 'sha256',
  defaultDepth: 1,
  maxDepth: 1000000, // Practical limit for recursion
  encoding: 'hex',
  separator: ':',
  version: '1.0.0'
};

/**
 * Compute SHA-256 hash of input
 * @param {string|Buffer} input - Data to hash
 * @returns {string} Hex-encoded SHA-256 hash
 */
function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * SHA-Infinity: Recursive/chained SHA-256 hashing
 *
 * @param {string|Buffer} input - Data to hash
 * @param {number} depth - Number of hash iterations (default: 1)
 * @returns {string} Final hash after depth iterations
 *
 * @example
 * // Single SHA-256
 * shaInfinity('hello', 1) // Same as sha256('hello')
 *
 * // SHA-256 applied 1000 times
 * shaInfinity('hello', 1000)
 *
 * // SHA-Infinity with depth from config
 * shaInfinity('hello', Infinity) // Uses maxDepth
 */
function shaInfinity(input, depth = SHA_INFINITY_CONFIG.defaultDepth) {
  // Handle Infinity depth
  if (depth === Infinity) {
    depth = SHA_INFINITY_CONFIG.maxDepth;
  }

  // Validate depth
  if (depth < 1) depth = 1;
  if (depth > SHA_INFINITY_CONFIG.maxDepth) depth = SHA_INFINITY_CONFIG.maxDepth;

  let hash = typeof input === 'string' ? input : input.toString();

  for (let i = 0; i < depth; i++) {
    hash = sha256(hash);
  }

  return hash;
}

/**
 * SHA-Infinity with salt
 * @param {string|Buffer} input - Data to hash
 * @param {string} salt - Salt to prepend
 * @param {number} depth - Number of iterations
 * @returns {string} Salted hash
 */
function shaInfinitySalted(input, salt, depth = 1) {
  const saltedInput = `${salt}${SHA_INFINITY_CONFIG.separator}${input}`;
  return shaInfinity(saltedInput, depth);
}

/**
 * Generate a random salt
 * @param {number} length - Salt length in bytes (default: 32)
 * @returns {string} Hex-encoded random salt
 */
function generateSalt(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * SHA-Infinity Merkle Tree
 * Compute merkle root from array of items
 *
 * @param {Array<string>} items - Array of items to hash
 * @param {number} depth - Depth for each leaf hash
 * @returns {object} Merkle tree with root and proof paths
 */
function merkleTree(items, depth = 1) {
  if (!items || items.length === 0) {
    return { root: sha256(''), leaves: [], levels: [] };
  }

  // Hash all leaves
  let leaves = items.map(item => shaInfinity(item, depth));
  const levels = [leaves.slice()];

  // Build tree bottom-up
  while (leaves.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < leaves.length; i += 2) {
      const left = leaves[i];
      const right = leaves[i + 1] || left; // Duplicate last if odd
      nextLevel.push(sha256(left + right));
    }
    leaves = nextLevel;
    levels.push(leaves.slice());
  }

  return {
    root: leaves[0],
    leaves: levels[0],
    levels: levels,
    itemCount: items.length
  };
}

/**
 * Generate Merkle proof for an item
 * @param {Array<string>} items - Original items array
 * @param {number} index - Index of item to prove
 * @param {number} depth - Hash depth
 * @returns {object} Proof object with siblings and directions
 */
function merkleProof(items, index, depth = 1) {
  const tree = merkleTree(items, depth);
  const proof = [];
  let idx = index;

  for (let level = 0; level < tree.levels.length - 1; level++) {
    const levelHashes = tree.levels[level];
    const isRight = idx % 2 === 1;
    const siblingIdx = isRight ? idx - 1 : idx + 1;

    if (siblingIdx < levelHashes.length) {
      proof.push({
        hash: levelHashes[siblingIdx],
        position: isRight ? 'left' : 'right'
      });
    }

    idx = Math.floor(idx / 2);
  }

  return {
    root: tree.root,
    leaf: tree.leaves[index],
    proof: proof,
    index: index
  };
}

/**
 * Verify Merkle proof
 * @param {string} leaf - Leaf hash to verify
 * @param {Array} proof - Proof array from merkleProof
 * @param {string} root - Expected root hash
 * @returns {boolean} True if proof is valid
 */
function verifyMerkleProof(leaf, proof, root) {
  let hash = leaf;

  for (const step of proof) {
    if (step.position === 'left') {
      hash = sha256(step.hash + hash);
    } else {
      hash = sha256(hash + step.hash);
    }
  }

  return hash === root;
}

/**
 * Composite hash - combine multiple hashes into one
 * @param {Array<string>} hashes - Array of hashes to combine
 * @param {number} depth - Final hash depth
 * @returns {string} Combined hash
 */
function compositeHash(hashes, depth = 1) {
  const combined = hashes.join(SHA_INFINITY_CONFIG.separator);
  return shaInfinity(combined, depth);
}

/**
 * Time-based hash - includes timestamp in hash
 * @param {string} input - Data to hash
 * @param {number} depth - Hash depth
 * @returns {object} Hash with timestamp metadata
 */
function timedHash(input, depth = 1) {
  const timestamp = Date.now();
  const timedInput = `${timestamp}${SHA_INFINITY_CONFIG.separator}${input}`;

  return {
    hash: shaInfinity(timedInput, depth),
    timestamp: timestamp,
    depth: depth,
    version: SHA_INFINITY_CONFIG.version
  };
}

/**
 * Versioned hash - includes version in hash for future compatibility
 * @param {string} input - Data to hash
 * @param {number} depth - Hash depth
 * @returns {string} Versioned hash string
 */
function versionedHash(input, depth = 1) {
  const hash = shaInfinity(input, depth);
  return `sha-inf-v${SHA_INFINITY_CONFIG.version}-d${depth}-${hash}`;
}

/**
 * Parse versioned hash string
 * @param {string} versionedHashStr - Versioned hash string
 * @returns {object} Parsed hash components
 */
function parseVersionedHash(versionedHashStr) {
  const match = versionedHashStr.match(/^sha-inf-v([\d.]+)-d(\d+)-([a-f0-9]+)$/);

  if (!match) {
    throw new Error('Invalid versioned hash format');
  }

  return {
    version: match[1],
    depth: parseInt(match[2], 10),
    hash: match[3]
  };
}

/**
 * HMAC-SHA-Infinity
 * @param {string} key - Secret key
 * @param {string} data - Data to authenticate
 * @param {number} depth - Hash depth
 * @returns {string} HMAC hash
 */
function hmacShaInfinity(key, data, depth = 1) {
  let hmac = crypto.createHmac('sha256', key).update(data).digest('hex');

  // Apply additional depth iterations
  for (let i = 1; i < depth; i++) {
    hmac = sha256(hmac);
  }

  return hmac;
}

/**
 * Hash a file using SHA-Infinity
 * @param {string} filePath - Path to file
 * @param {number} depth - Hash depth
 * @returns {Promise<string>} File hash
 */
async function hashFile(filePath, depth = 1) {
  const fs = require('fs').promises;
  const content = await fs.readFile(filePath);
  return shaInfinity(content, depth);
}

/**
 * Hash a directory recursively
 * @param {string} dirPath - Path to directory
 * @param {number} depth - Hash depth
 * @returns {Promise<object>} Directory hash with file hashes
 */
async function hashDirectory(dirPath, depth = 1) {
  const fs = require('fs').promises;
  const path = require('path');

  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const hashes = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const subDir = await hashDirectory(fullPath, depth);
      hashes.push({ name: entry.name, type: 'directory', hash: subDir.root });
    } else {
      const fileHash = await hashFile(fullPath, depth);
      hashes.push({ name: entry.name, type: 'file', hash: fileHash });
    }
  }

  const tree = merkleTree(hashes.map(h => h.hash), 1);

  return {
    root: tree.root,
    files: hashes,
    itemCount: hashes.length
  };
}

/**
 * Content-addressable hash for deduplication
 * @param {string|Buffer} content - Content to hash
 * @returns {string} Content address (hash)
 */
function contentAddress(content) {
  return sha256(content);
}

/**
 * Chain of hashes - useful for audit trails
 * @param {Array<string>} items - Items to chain
 * @param {string} previousHash - Previous chain hash (optional)
 * @returns {object} Chain with all intermediate hashes
 */
function hashChain(items, previousHash = null) {
  const chain = [];
  let currentHash = previousHash || sha256('genesis');

  for (const item of items) {
    const itemHash = sha256(item);
    currentHash = sha256(currentHash + itemHash);
    chain.push({
      item: item,
      itemHash: itemHash,
      chainHash: currentHash
    });
  }

  return {
    previousHash: previousHash,
    chain: chain,
    finalHash: currentHash,
    length: chain.length
  };
}

// Export all functions
module.exports = {
  // Core
  sha256,
  shaInfinity,
  shaInfinitySalted,
  generateSalt,

  // Merkle Trees
  merkleTree,
  merkleProof,
  verifyMerkleProof,

  // Composite & Advanced
  compositeHash,
  timedHash,
  versionedHash,
  parseVersionedHash,
  hmacShaInfinity,

  // File Operations
  hashFile,
  hashDirectory,

  // Content Addressing
  contentAddress,
  hashChain,

  // Config
  SHA_INFINITY_CONFIG
};
