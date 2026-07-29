use std::{
    process,
    sync::atomic::{AtomicU64, Ordering},
    time::Instant,
};

use flowshot_core::contracts::{AppErrorDto, BuildInfoDto, EmptyRequest};
use serde_json::{Value, json};

static NEXT_CORRELATION_ID: AtomicU64 = AtomicU64::new(1);

#[tauri::command]
#[allow(
    clippy::unnecessary_wraps,
    reason = "every frozen command returns Result<Response, AppErrorDto>"
)]
pub fn get_build_info(_request: EmptyRequest) -> Result<BuildInfoDto, AppErrorDto> {
    let started_at = Instant::now();
    let correlation_id = next_correlation_id();
    let response = build_info();
    let duration_ms = u64::try_from(started_at.elapsed().as_millis()).unwrap_or(u64::MAX);

    println!(
        "{}",
        command_completion_log(&response, &correlation_id, duration_ms)
    );

    Ok(response)
}

fn build_info() -> BuildInfoDto {
    BuildInfoDto {
        version: env!("CARGO_PKG_VERSION").into(),
        git_sha: env!("FLOWSHOT_GIT_SHA").into(),
        build_profile: env!("FLOWSHOT_BUILD_PROFILE").into(),
    }
}

fn next_correlation_id() -> String {
    let sequence = NEXT_CORRELATION_ID.fetch_add(1, Ordering::Relaxed);
    format!("flowshot-{}-{sequence}", process::id())
}

fn command_completion_log(
    response: &BuildInfoDto,
    correlation_id: &str,
    duration_ms: u64,
) -> Value {
    json!({
        "event": "command_complete",
        "command": "get_build_info",
        "correlationId": correlation_id,
        "durationMs": duration_ms,
        "resultCode": "OK",
        "buildInfo": response,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn command_returns_the_shared_serializable_dto() {
        let response =
            get_build_info(EmptyRequest::default()).expect("build info should be available");
        let value = serde_json::to_value(&response).expect("build info should serialize");
        let object = value.as_object().expect("build info should be an object");

        assert_eq!(object.len(), 3);
        assert_eq!(object["version"], env!("CARGO_PKG_VERSION"));
        assert_eq!(object["gitSha"], env!("FLOWSHOT_GIT_SHA"));
        assert_eq!(object["buildProfile"], env!("FLOWSHOT_BUILD_PROFILE"));
    }

    #[test]
    fn completion_log_contains_required_command_metadata() {
        let response = build_info();
        let value = command_completion_log(&response, "flowshot-test-1", 12);

        assert_eq!(value["event"], "command_complete");
        assert_eq!(value["command"], "get_build_info");
        assert_eq!(value["correlationId"], "flowshot-test-1");
        assert_eq!(value["durationMs"], 12);
        assert_eq!(value["resultCode"], "OK");
        assert_eq!(value["buildInfo"]["version"], env!("CARGO_PKG_VERSION"));
        assert_eq!(value["buildInfo"]["gitSha"], env!("FLOWSHOT_GIT_SHA"));
        assert_eq!(
            value["buildInfo"]["buildProfile"],
            env!("FLOWSHOT_BUILD_PROFILE")
        );
    }
}
