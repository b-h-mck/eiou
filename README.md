![eiou](public/eiou-wide.svg)

eiou is a small React app to allow users to record IOUs/payments and check balances. For more info, on what it does and how to use it, 
[see the in-app help page](https://eiou.azurewebsites.net/).

If you just want to see the app in action, [visit the "official" deployment here](https://eiou.azurewebsites.net/).

## Running Locally
1. Clone the repository: `git clone https://github.com/your-repo/eiou.git`
2. Navigate to the project directory: `cd eiou`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

The app is client-side only and has no server or external dependencies.

## Roadmap
- [x] **Basic functionality**
- [ ] **Import/export:** This is a high priority so we can give users a fighting chance to preserve their data on future updates.
- [ ] **Other currencies:** This app is shamefully dollar-centric. We should allow users to select their own currency.
- [ ] **Offline functionality:** This app is embarassingly offlineable. We should set up a service worker to allow full offline use.
- [ ] **Updates & data migrations:** Provide a way to smoothly upgrade users to later versions of the app, including preserving their data. 
- [ ] **Multiway splitting:** Users can currently split transactions between themselves and one other person. We should be able to split them between three or more.
- [ ] **Multiple ledgers:** Allow multiple ledgers, each with their own lists of people and transactions, to be stored on a single device.
- [ ] **Authentication & cloud sync:** Let users authenticate and access the same ledger on multiple devices.
- [ ] **Transaction sharing:** Let users share transactions. Users will always retain full control over what they let into their ledger.

## Contributing
Contributions are welcome! If you find a bug or have an idea for a feature, please open an issue. If you'd like to
make a minor change (fix up some styles, add emoji to this readme, etc.), feel free to make a pull request. For larger
changes, please open an issue first so we can discuss the best way to approach it.

## Licence
This project is licensed under the [MIT License](LICENSE.txt).