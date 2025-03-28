use wasm_bindgen::prelude::*;
use sha2::{Sha256, Digest};

// Hash Data Securely
#[wasm_bindgen]
pub fn hash_data(input: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    format!("{:x}", result)
}
