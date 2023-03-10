# @moonlorian/vesting-dapp

This is the source code of a **Vesting dApp**, built on MultiversX blockchain. Is built using [React.js](https://reactjs.org/) and [Typescript](https://www.typescriptlang.org/).

## Requirements

- Node.js version 12.16.2+
- Npm version 6.14.4+

## Getting Started

The dapp is a client side only project and is built using the [Create React App](https://create-react-app.dev) scripts.

### Instalation and running

### Step 1. Install modules

From a terminal, navigate to the project folder and run:

```bash
npm install
```

### Step 2. Update environment

In *config* folder you have the dapp config file (**config.tsx**). Edit this file to configure your dapp. If you have your dapp in mainnet and testnet simultaneously, copy the content of the selected file to **config.tsx** to easy change environment.

Some config fields:

**dAppName** ==> Set Here dapp name. This name will be shown in the header

**brand** ==> Brand will be shown at footer

**contractAddress** ==> Place here the erd contract address of your vesting smart contract

**walletConnectV2ProjectId** ==> Generate your own WalletConnect 2 ProjectId here: https://cloud.walletconnect.com/app and set it in this constant

**abi**
---------------------------------------------
Use the generated abi file to facilitate smart contract interaction. This can be removed from dapp creating smart contract constant like this:

```bash
export const smartContract = new SmartContract({
  address: new Address(contractAddress)
});
```

### Step 3. Running in development mode

In the project folder run:

```bash
npm run start
```

This will start the React app in development mode, using the configs found in the `config.tsx` file.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Step 4. Build for testing and production use

A build of the app is necessary to deploy for testing purposes or for production use.
To build the project run:

```bash
npm run build
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

One can contribute by creating _pull requests_, or by opening _issues_ for discovered bugs or desired features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
