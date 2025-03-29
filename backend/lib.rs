use ic_cdk::update;
use ic_llm::{ChatMessage, Model};

#[update]
async fn chat(messages: Vec<ChatMessage>) -> String {
    ic_llm::chat(Model::Llama3_1_8B, messages).await
}

// Export the interface for the smart contract.
ic_cdk::export_candid!();
