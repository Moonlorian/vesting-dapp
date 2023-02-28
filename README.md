# @moonlorian/vesting-dapp

This is the source code of a **Vesting dApp**, built on MultiversX blockchain.

It is composed by an Smart Contract + a website with 2 pages: administrator dashboard + user dashboard.

## Usage

### Smart Contract

Deploy a new smart contract for each token to apply vesting (see [sc](https://github.com/Moonlorian/vesting-dapp/tree/main/sc)).

- It will keep safely all the tokens to be distributed during the vesting period.

- It will store all the wallets and its vesting periods for each category.
 
### dApp

Setup the SC and deploy the dApp (see [dapp](https://github.com/Moonlorian/vesting-dapp/tree/main/dapp)).

#### Login

[https://github.com/Moonlorian/vesting-dapp/tree/main/login.png](https://github.com/Moonlorian/vesting-dapp/blob/main/login.png?raw=true)

#### Administrator dApp web page

[https://github.com/Moonlorian/vesting-dapp/tree/main/back.png](https://github.com/Moonlorian/vesting-dapp/blob/main/back.png?raw=true)

When you login with the administrator wallet, you can setup the Smart Contract:

- Add tokens.
- Freeze/unfreeze the contract.
- Setup the allowed token.
- Add vesting categories. For each category:
  - Name
  - Lock (cliff) in epochs
  - Percent to unlock every xx epochs

> For example:
> 
> SEED category 3 month lock (90 epoch) + 25 month vesting, with 4% unlocked every month (30 epoch)
> 
> TEAM category 6 month lock (180 epoch) + 50 month vessting, with 5% unlocked every quarter (180 epoch) 

#### User dApp web page

[https://github.com/Moonlorian/vesting-dapp/tree/main/front.png](https://github.com/Moonlorian/vesting-dapp/blob/main/front.png?raw=true)

User can see the following balances:

- $EGLD
- Vesting tokens
  - Remaining locked tokens
  - Already claimed tokens
  - Unolocked tokens to claim now.
- Button to claim.

## 👥 Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

One can contribute by creating _pull requests_, or by opening _issues_ for discovered bugs or desired features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

If you're a smart contract developer/project building on MultiversX or just a user, don't hesitate to [DM us on Twitter](https://twitter.com/moonlorian).

