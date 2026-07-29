use flowshot_core::contracts::{AppErrorDto, BuildInfoDto, EmptyRequest};

#[tauri::command]
#[allow(
    clippy::unnecessary_wraps,
    reason = "every frozen command returns Result<Response, AppErrorDto>"
)]
pub fn get_build_info(_request: EmptyRequest) -> Result<BuildInfoDto, AppErrorDto> {
    Ok(build_info())
}

fn build_info() -> BuildInfoDto {
    BuildInfoDto {
        version: env!("CARGO_PKG_VERSION").into(),
        git_sha: env!("FLOWSHOT_GIT_SHA").into(),
        build_profile: env!("FLOWSHOT_BUILD_PROFILE").into(),
    }
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
}
