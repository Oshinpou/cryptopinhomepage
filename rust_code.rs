use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use std::collections::HashMap;
use std::sync::Mutex;
use lazy_static::lazy_static;

// User Struct for Storing User Data
#[derive(Serialize, Deserialize, Clone)]
pub struct User {
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

// Global User Database (In-Memory Simulation)
lazy_static! {
    static ref USER_DB: Mutex<HashMap<String, User>> = Mutex::new(HashMap::new());
}

// Hash Password Securely using SHA-256
#[wasm_bindgen]
pub fn hash_password(password: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    let result = hasher.finalize();
    format!("{:x}", result)
}

// Register New User
#[wasm_bindgen]
pub fn register_user(username: &str, email: &str, password: &str) -> String {
    let password_hash = hash_password(password);
    let user = User {
        username: username.to_string(),
        email: email.to_string(),
        password_hash,
    };

    let mut db = USER_DB.lock().unwrap();
    if db.contains_key(username) {
        return "Username already exists".to_string();
    }

    db.insert(username.to_string(), user);
    "User registered successfully".to_string()
}

// Login User and Verify Password
#[wasm_bindgen]
pub fn login_user(username: &str, password: &str) -> String {
    let db = USER_DB.lock().unwrap();
    if let Some(user) = db.get(username) {
        if user.password_hash == hash_password(password) {
            return "Login successful".to_string();
        } else {
            return "Incorrect password".to_string();
        }
    }
    "User not found".to_string()
}

// Retrieve User Information by Username
#[wasm_bindgen]
pub fn get_user_info(username: &str) -> JsValue {
    let db = USER_DB.lock().unwrap();
    if let Some(user) = db.get(username) {
        return JsValue::from_serde(user).unwrap();
    }
    JsValue::NULL
}

// Delete User from Database
#[wasm_bindgen]
pub fn delete_user(username: &str) -> String {
    let mut db = USER_DB.lock().unwrap();
    if db.remove(username).is_some() {
        return "User deleted successfully".to_string();
    }
    "User not found".to_string()
}

// List All Users (for admin panel)
#[wasm_bindgen]
pub fn list_all_users() -> JsValue {
    let db = USER_DB.lock().unwrap();
    let users: Vec<_> = db.values().cloned().collect();
    JsValue::from_serde(&users).unwrap()
}

// Clear All Users (Admin Only)
#[wasm_bindgen]
pub fn clear_all_users() -> String {
    let mut db = USER_DB.lock().unwrap();
    db.clear();
    "All users cleared successfully".to_string()
}
