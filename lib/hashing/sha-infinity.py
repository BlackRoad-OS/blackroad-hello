"""
SHA-Infinity Hashing System

An extensible, recursive hashing system built on SHA-256.
Supports infinite depth chaining, merkle trees, and composite hashes.

Module: sha_infinity
Version: 1.0.0
License: BlackRoad OS Proprietary
"""

import hashlib
import hmac
import os
import json
from pathlib import Path
from typing import List, Dict, Optional, Union, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime


# Configuration
SHA_INFINITY_CONFIG = {
    "base_algorithm": "sha256",
    "default_depth": 1,
    "max_depth": 1_000_000,  # Practical limit for recursion
    "encoding": "hex",
    "separator": ":",
    "version": "1.0.0"
}


def sha256(data: Union[str, bytes]) -> str:
    """
    Compute SHA-256 hash of input.

    Args:
        data: Data to hash (string or bytes)

    Returns:
        Hex-encoded SHA-256 hash
    """
    if isinstance(data, str):
        data = data.encode('utf-8')
    return hashlib.sha256(data).hexdigest()


def sha_infinity(data: Union[str, bytes], depth: int = 1) -> str:
    """
    SHA-Infinity: Recursive/chained SHA-256 hashing.

    Args:
        data: Data to hash
        depth: Number of hash iterations (default: 1)

    Returns:
        Final hash after depth iterations

    Examples:
        >>> sha_infinity('hello', 1)  # Same as sha256('hello')
        >>> sha_infinity('hello', 1000)  # SHA-256 applied 1000 times
    """
    # Handle infinite depth
    if depth == float('inf'):
        depth = SHA_INFINITY_CONFIG["max_depth"]

    # Validate depth
    depth = max(1, min(depth, SHA_INFINITY_CONFIG["max_depth"]))

    hash_value = data if isinstance(data, str) else data.decode('utf-8')

    for _ in range(depth):
        hash_value = sha256(hash_value)

    return hash_value


def sha_infinity_salted(data: Union[str, bytes], salt: str, depth: int = 1) -> str:
    """
    SHA-Infinity with salt.

    Args:
        data: Data to hash
        salt: Salt to prepend
        depth: Number of iterations

    Returns:
        Salted hash
    """
    separator = SHA_INFINITY_CONFIG["separator"]
    salted_input = f"{salt}{separator}{data}"
    return sha_infinity(salted_input, depth)


def generate_salt(length: int = 32) -> str:
    """
    Generate a random salt.

    Args:
        length: Salt length in bytes (default: 32)

    Returns:
        Hex-encoded random salt
    """
    return os.urandom(length).hex()


@dataclass
class MerkleTree:
    """Merkle tree result."""
    root: str
    leaves: List[str]
    levels: List[List[str]]
    item_count: int


def merkle_tree(items: List[str], depth: int = 1) -> MerkleTree:
    """
    SHA-Infinity Merkle Tree - compute merkle root from array of items.

    Args:
        items: Array of items to hash
        depth: Depth for each leaf hash

    Returns:
        MerkleTree with root and proof paths
    """
    if not items:
        return MerkleTree(
            root=sha256(''),
            leaves=[],
            levels=[],
            item_count=0
        )

    # Hash all leaves
    leaves = [sha_infinity(item, depth) for item in items]
    levels = [leaves.copy()]

    # Build tree bottom-up
    current_level = leaves.copy()
    while len(current_level) > 1:
        next_level = []
        for i in range(0, len(current_level), 2):
            left = current_level[i]
            right = current_level[i + 1] if i + 1 < len(current_level) else left
            next_level.append(sha256(left + right))
        current_level = next_level
        levels.append(current_level.copy())

    return MerkleTree(
        root=current_level[0],
        leaves=levels[0],
        levels=levels,
        item_count=len(items)
    )


@dataclass
class MerkleProof:
    """Merkle proof result."""
    root: str
    leaf: str
    proof: List[Dict[str, str]]
    index: int


def merkle_proof(items: List[str], index: int, depth: int = 1) -> MerkleProof:
    """
    Generate Merkle proof for an item.

    Args:
        items: Original items array
        index: Index of item to prove
        depth: Hash depth

    Returns:
        Proof object with siblings and directions
    """
    tree = merkle_tree(items, depth)
    proof = []
    idx = index

    for level in range(len(tree.levels) - 1):
        level_hashes = tree.levels[level]
        is_right = idx % 2 == 1
        sibling_idx = idx - 1 if is_right else idx + 1

        if sibling_idx < len(level_hashes):
            proof.append({
                "hash": level_hashes[sibling_idx],
                "position": "left" if is_right else "right"
            })

        idx = idx // 2

    return MerkleProof(
        root=tree.root,
        leaf=tree.leaves[index],
        proof=proof,
        index=index
    )


def verify_merkle_proof(leaf: str, proof: List[Dict[str, str]], root: str) -> bool:
    """
    Verify Merkle proof.

    Args:
        leaf: Leaf hash to verify
        proof: Proof array from merkle_proof
        root: Expected root hash

    Returns:
        True if proof is valid
    """
    hash_value = leaf

    for step in proof:
        if step["position"] == "left":
            hash_value = sha256(step["hash"] + hash_value)
        else:
            hash_value = sha256(hash_value + step["hash"])

    return hash_value == root


def composite_hash(hashes: List[str], depth: int = 1) -> str:
    """
    Composite hash - combine multiple hashes into one.

    Args:
        hashes: Array of hashes to combine
        depth: Final hash depth

    Returns:
        Combined hash
    """
    separator = SHA_INFINITY_CONFIG["separator"]
    combined = separator.join(hashes)
    return sha_infinity(combined, depth)


@dataclass
class TimedHash:
    """Timed hash result."""
    hash: str
    timestamp: int
    depth: int
    version: str


def timed_hash(data: Union[str, bytes], depth: int = 1) -> TimedHash:
    """
    Time-based hash - includes timestamp in hash.

    Args:
        data: Data to hash
        depth: Hash depth

    Returns:
        Hash with timestamp metadata
    """
    timestamp = int(datetime.now().timestamp() * 1000)
    separator = SHA_INFINITY_CONFIG["separator"]
    timed_input = f"{timestamp}{separator}{data}"

    return TimedHash(
        hash=sha_infinity(timed_input, depth),
        timestamp=timestamp,
        depth=depth,
        version=SHA_INFINITY_CONFIG["version"]
    )


def versioned_hash(data: Union[str, bytes], depth: int = 1) -> str:
    """
    Versioned hash - includes version for future compatibility.

    Args:
        data: Data to hash
        depth: Hash depth

    Returns:
        Versioned hash string
    """
    hash_value = sha_infinity(data, depth)
    version = SHA_INFINITY_CONFIG["version"]
    return f"sha-inf-v{version}-d{depth}-{hash_value}"


def parse_versioned_hash(versioned_hash_str: str) -> Dict[str, Union[str, int]]:
    """
    Parse versioned hash string.

    Args:
        versioned_hash_str: Versioned hash string

    Returns:
        Parsed hash components

    Raises:
        ValueError: If format is invalid
    """
    import re
    match = re.match(r'^sha-inf-v([\d.]+)-d(\d+)-([a-f0-9]+)$', versioned_hash_str)

    if not match:
        raise ValueError('Invalid versioned hash format')

    return {
        "version": match.group(1),
        "depth": int(match.group(2)),
        "hash": match.group(3)
    }


def hmac_sha_infinity(key: Union[str, bytes], data: Union[str, bytes], depth: int = 1) -> str:
    """
    HMAC-SHA-Infinity.

    Args:
        key: Secret key
        data: Data to authenticate
        depth: Hash depth

    Returns:
        HMAC hash
    """
    if isinstance(key, str):
        key = key.encode('utf-8')
    if isinstance(data, str):
        data = data.encode('utf-8')

    hmac_value = hmac.new(key, data, hashlib.sha256).hexdigest()

    # Apply additional depth iterations
    for _ in range(1, depth):
        hmac_value = sha256(hmac_value)

    return hmac_value


def hash_file(file_path: Union[str, Path], depth: int = 1) -> str:
    """
    Hash a file using SHA-Infinity.

    Args:
        file_path: Path to file
        depth: Hash depth

    Returns:
        File hash
    """
    with open(file_path, 'rb') as f:
        content = f.read()
    return sha_infinity(content, depth)


@dataclass
class DirectoryHash:
    """Directory hash result."""
    root: str
    files: List[Dict[str, str]]
    item_count: int


def hash_directory(dir_path: Union[str, Path], depth: int = 1) -> DirectoryHash:
    """
    Hash a directory recursively.

    Args:
        dir_path: Path to directory
        depth: Hash depth

    Returns:
        Directory hash with file hashes
    """
    dir_path = Path(dir_path)
    hashes = []

    entries = sorted(dir_path.iterdir(), key=lambda x: x.name)

    for entry in entries:
        if entry.is_dir():
            sub_dir = hash_directory(entry, depth)
            hashes.append({
                "name": entry.name,
                "type": "directory",
                "hash": sub_dir.root
            })
        else:
            file_hash = hash_file(entry, depth)
            hashes.append({
                "name": entry.name,
                "type": "file",
                "hash": file_hash
            })

    tree = merkle_tree([h["hash"] for h in hashes], 1)

    return DirectoryHash(
        root=tree.root,
        files=hashes,
        item_count=len(hashes)
    )


def content_address(content: Union[str, bytes]) -> str:
    """
    Content-addressable hash for deduplication.

    Args:
        content: Content to hash

    Returns:
        Content address (hash)
    """
    return sha256(content)


@dataclass
class HashChain:
    """Hash chain result."""
    previous_hash: Optional[str]
    chain: List[Dict[str, str]]
    final_hash: str
    length: int


def hash_chain(items: List[str], previous_hash: Optional[str] = None) -> HashChain:
    """
    Chain of hashes - useful for audit trails.

    Args:
        items: Items to chain
        previous_hash: Previous chain hash (optional)

    Returns:
        Chain with all intermediate hashes
    """
    chain = []
    current_hash = previous_hash or sha256('genesis')

    for item in items:
        item_hash = sha256(item)
        current_hash = sha256(current_hash + item_hash)
        chain.append({
            "item": item,
            "item_hash": item_hash,
            "chain_hash": current_hash
        })

    return HashChain(
        previous_hash=previous_hash,
        chain=chain,
        final_hash=current_hash,
        length=len(chain)
    )


# Convenience aliases
sha256_hash = sha256
sha_inf = sha_infinity


if __name__ == "__main__":
    # Demo
    print("SHA-Infinity Demo")
    print("=" * 50)

    # Basic hashing
    data = "BlackRoad OS"
    print(f"\nInput: {data}")
    print(f"SHA-256 (depth=1): {sha_infinity(data, 1)}")
    print(f"SHA-Infinity (depth=10): {sha_infinity(data, 10)}")
    print(f"SHA-Infinity (depth=100): {sha_infinity(data, 100)}")

    # Salted hash
    salt = generate_salt(16)
    print(f"\nSalt: {salt}")
    print(f"Salted hash: {sha_infinity_salted(data, salt, 10)}")

    # Merkle tree
    items = ["item1", "item2", "item3", "item4"]
    tree = merkle_tree(items, 1)
    print(f"\nMerkle Tree root: {tree.root}")
    print(f"Leaves: {len(tree.leaves)}")

    # Versioned hash
    vh = versioned_hash(data, 5)
    print(f"\nVersioned hash: {vh}")
    parsed = parse_versioned_hash(vh)
    print(f"Parsed: {parsed}")

    # Hash chain
    chain = hash_chain(["event1", "event2", "event3"])
    print(f"\nHash chain final: {chain.final_hash}")
    print(f"Chain length: {chain.length}")
