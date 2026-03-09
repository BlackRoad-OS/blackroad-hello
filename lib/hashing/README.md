# SHA-Infinity Hashing System

An extensible, recursive hashing system built on SHA-256 for the BlackRoad OS ecosystem.

## Overview

SHA-Infinity provides a flexible hashing framework that supports:
- **Recursive hashing** - Apply SHA-256 multiple times for increased security
- **Merkle trees** - Efficient verification of large datasets
- **Hash chains** - Audit trails and blockchain-style linking
- **Content addressing** - Deduplication and content-based storage
- **Time-stamped hashes** - Temporal proof of existence

## Installation

### JavaScript/Node.js

```javascript
const {
  sha256,
  shaInfinity,
  merkleTree,
  hashChain
} = require('./sha-infinity.js');
```

### Python

```python
from sha_infinity import (
    sha256,
    sha_infinity,
    merkle_tree,
    hash_chain
)
```

## Quick Start

### Basic Hashing

```javascript
// JavaScript
const hash1 = sha256('hello');  // Single SHA-256
const hash10 = shaInfinity('hello', 10);  // 10 iterations
const hash1000 = shaInfinity('hello', 1000);  // 1000 iterations
```

```python
# Python
hash1 = sha256('hello')  # Single SHA-256
hash10 = sha_infinity('hello', 10)  # 10 iterations
hash1000 = sha_infinity('hello', 1000)  # 1000 iterations
```

### Salted Hashing

```javascript
const salt = generateSalt(32);
const salted = shaInfinitySalted('password', salt, 100);
```

### Merkle Trees

```javascript
const items = ['file1.txt', 'file2.txt', 'file3.txt'];
const tree = merkleTree(items, 1);
console.log('Root:', tree.root);

// Generate proof for item at index 1
const proof = merkleProof(items, 1);

// Verify proof
const isValid = verifyMerkleProof(proof.leaf, proof.proof, proof.root);
```

### Hash Chains (Audit Trails)

```javascript
const events = [
  'user:login:alice',
  'action:create:document',
  'action:edit:document',
  'user:logout:alice'
];

const chain = hashChain(events);
console.log('Final hash:', chain.finalHash);
console.log('Chain length:', chain.length);
```

### Versioned Hashes

```javascript
// Create versioned hash
const vh = versionedHash('data', 5);
// Output: "sha-inf-v1.0.0-d5-abc123..."

// Parse versioned hash
const parsed = parseVersionedHash(vh);
// { version: "1.0.0", depth: 5, hash: "abc123..." }
```

### File and Directory Hashing

```javascript
// Hash single file
const fileHash = await hashFile('/path/to/file.txt', 1);

// Hash entire directory
const dirHash = await hashDirectory('/path/to/dir', 1);
console.log('Directory root:', dirHash.root);
```

## API Reference

### Core Functions

| Function | Description |
|----------|-------------|
| `sha256(data)` | Single SHA-256 hash |
| `shaInfinity(data, depth)` | Recursive SHA-256 with configurable depth |
| `shaInfinitySalted(data, salt, depth)` | Salted recursive hash |
| `generateSalt(length)` | Generate cryptographic random salt |

### Merkle Tree Functions

| Function | Description |
|----------|-------------|
| `merkleTree(items, depth)` | Build Merkle tree from items |
| `merkleProof(items, index, depth)` | Generate inclusion proof |
| `verifyMerkleProof(leaf, proof, root)` | Verify proof against root |

### Advanced Functions

| Function | Description |
|----------|-------------|
| `compositeHash(hashes, depth)` | Combine multiple hashes |
| `timedHash(data, depth)` | Hash with timestamp metadata |
| `versionedHash(data, depth)` | Hash with version prefix |
| `hmacShaInfinity(key, data, depth)` | HMAC with recursive hashing |
| `hashChain(items, previousHash)` | Create linked hash chain |
| `contentAddress(content)` | Content-addressable hash |

### File Operations

| Function | Description |
|----------|-------------|
| `hashFile(path, depth)` | Hash file contents |
| `hashDirectory(path, depth)` | Recursively hash directory |

## Configuration

```javascript
const SHA_INFINITY_CONFIG = {
  baseAlgorithm: 'sha256',
  defaultDepth: 1,
  maxDepth: 1000000,
  encoding: 'hex',
  separator: ':',
  version: '1.0.0'
};
```

## Use Cases

### 1. Password Hashing
Use high depth values (10,000+) for password storage:
```javascript
const passwordHash = shaInfinitySalted(password, salt, 10000);
```

### 2. File Integrity Verification
```javascript
const tree = merkleTree(fileHashes, 1);
// Store tree.root
// Later, verify any file with merkleProof
```

### 3. Audit Trails
```javascript
const auditChain = hashChain(events, previousBlockHash);
// Each event is cryptographically linked
```

### 4. Content Deduplication
```javascript
const address = contentAddress(fileContent);
// Use address as unique identifier/filename
```

### 5. Git-style Object Storage
```javascript
const objectId = sha256(content);
const path = `.objects/${objectId.slice(0,2)}/${objectId.slice(2)}`;
```

## Security Considerations

- **Depth selection**: Higher depth = more computation for attackers
- **Salt management**: Always use unique salts per hash
- **Key storage**: HMAC keys must be stored securely
- **Versioning**: Use versioned hashes for future algorithm migration

## License

BlackRoad OS Proprietary License
