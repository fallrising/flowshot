mod commands;

/// Runs the Flowshot desktop application.
///
/// # Panics
///
/// Panics if Tauri cannot initialize or run the native application.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::build_info::get_build_info
        ])
        .run(tauri::generate_context!())
        .expect("failed to run Flowshot");
}
