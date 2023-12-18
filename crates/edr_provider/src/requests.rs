/// Ethereum RPC request types
pub mod eth;
/// Hardhat RPC request types
pub mod hardhat;
mod methods;
mod validation;

pub use edr_eth::remote::client::Request as RpcRequest;

pub use crate::requests::methods::{MethodInvocation, OneUsizeOrTwo, U64OrUsize};

///
#[derive(serde::Deserialize, serde::Serialize)]
#[serde(untagged)]
pub enum ProviderRequest {
    /// A single JSON-RPC request
    Single(Request),
    /// A batch of requests
    Batch(Vec<Request>),
}

/// an RPC method with its parameters
#[derive(Clone, Debug, PartialEq, serde::Deserialize, serde::Serialize)]
#[serde(untagged)]
#[allow(clippy::large_enum_variant)]
pub enum Request {
    /// an eth_* method invocation
    Eth(MethodInvocation),
    /// a hardhat_* method invocation
    Hardhat(rpc_hardhat::Request),
}
