# Stylo AI Web App

Stylo AI is a fashion choice assistant that helps you find the perfect outfit for any occasion. It uses the power of AI to suggest outfits based on your preferences and style.

## How Does It Work?

Stylo AI uses the power of AI to suggest outfits based on your preferences and style input. It analyzes our selected wardrobe, listed [here](https://github.com/DikDns/stylo-assets/tree/main) and suggests outfits that match your style and preferences input. Stylo AI levarages the power of AI on Chain (Model Llama 3.1 8B) to generate the outfit suggestions.

## How to Use

1. Visit the [ICP Ninja Shareable Links](https://icp.ninja/s/Gn1rw).
2. Enter your style and preferences in the input fields.
3. Click the "Generate" button.
4. Stylo AI will suggest outfits that match your style and preferences with the preview images.

## Further Development Goals

- [x] Generate outfits based on user preferences and wardrobe.
- [x] Display outfits to users.
- [ ] Authenticatation system with internet identity.
- [ ] Upload custom user wardrobes.
- [ ] Share outfits with others.
- [ ] Rate outfits to DAO
- [ ] Chat history.

## Project structure

The `/backend` folder contains the Rust smart contract:

- `Cargo.toml`, which defines the crate that will form the backend
- `lib.rs`, which contains the actual smart contract, and exports its interface

The `/frontend` folder contains web assets for the application's user interface. The user interface is written using the React framework.

## Continue building locally

To continue building the project locally, you'll need to:

### 1. Clone the repository

```
  git clone https://github.com/dikdns/stylo-web3 # HTTPS
  git clone git@github.com:DikDns/stylo-web3.git # SSH
  gh repo clone DikDns/stylo-web3 # GitHub CLI
```

### 2. Setting up Ollama

To be able to test the agent locally, you'll need a server for processing the agent's prompts. For that, we'll use `ollama`, which is a tool that can download and serve LLMs.
See the documentation on the [Ollama website](https://ollama.com/) to install it. Once it's installed, run:

```
ollama serve
# Expected to start listening on port 11434
```

The above command will start the Ollama server, so that it can process requests by the agent. Additionally, and in a separate window, run the following command to download the LLM that will be used by the agent:

```
ollama run llama3.1:8b
```

The above command will download an 8B parameter model, which is around 4GiB. Once the command executes and the model is loaded, you can terminate it. You won't need to do this step again.

### 3. Open the `BUILD.md` file for further instructions.
