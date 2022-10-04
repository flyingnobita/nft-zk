# Mint AI Generated Kanji NFTs with Zero Knowledge

> For more information on the circuit generation, you can read more about it in my [blog post](https://jansonmak.com/minting-nfts-with-zero-knowledge-proof) I wrote.

## Installing Prerequisite

***If you use [Visual Studio Code - Docker Container](https://code.visualstudio.com/docs/remote/containers), you can just open this container inside VSCode and all the prerequisite will be installed for you. You can skip this step and go to the next section***

1) Install [rust](https://www.rust-lang.org/tools/install)

2) Install [Circom](https://docs.circom.io/getting-started/installation/). 
  - you should use v2.0.6 to ensure snarkjs compatibility at the time of writing
  - i.e. `git checkout tags/v2.0.6 -b v2.0.6`

3) Install [snarkjs](https://github.com/iden3/snarkjs)

4) Install all package dependencies

```
yarn
```

## Running in `localhost`

1) Setup the contract deploy credentials.

Create `/packages/contracts/.env` by using the example file `/packages/contracts/.env.example` and fill in all the fields.

2) Start a hardhat local node

```bash
yarn localnode
```

3) In another terminal window, deploy to the local node

```bash
yarn deployLocalhost
```

4) Start the react app

```bash
yarn react
```

## Running in `rinkeby`

You can deploy to `rinkeby` by running:

```bash
yarn deployRinkeby
```

## Compiling the circuit

The circuit and related files are all stored in `packages\circuits\CheckSecret`.

If you update `CheckSecret.circom` and  `CheckSecret_input.json`, you can use the convenient script `packages\circuits\gen.sh` to compile and generate all the necessary files.

```bash
# To use Plonk
./gen.sh CheckSecret plonk

# To use Groth16
./gen.sh CheckSecret groth16
```

## TO DO

- [ ] add nullifier
- [ ] add test cases
- [ ] allow string as passwords
