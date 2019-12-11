// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

/*const chain = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
export const environment = {
    production: false,
    appName: 'EOSweb',
    network: {
        blockchain: 'eos',
        host: 'bp.cryptolions.io',
        port: 443,
        protocol: 'https',
        expireInSeconds: 120,
        chainId: chain
    },
    chain: chain,
    Eos: {
        httpEndpoint: 'https://bp.cryptolions.io',
        chainId: chain,
        verbose: false
    },
    frontConfig: {
       coin: 'EOS',
       bp: 'bp.json',
       tokenContract: 'eosio.token',
       totalBalance: 'EOS',
       convertToUSD: true,
       customBalance: false,
       logo: '/assets/images/eosweb.png',
       name: {
          big: 'eos',
          small: 'web'
       },
       nets: [{ name: 'Mainnet', url: 'https://eosweb.net', active: true },
              { name: 'Jungle', url: 'https://jungle.eosweb.net', active: false },
              { name: 'Europechain', url: 'https://xec.eosweb.net', active: false },
              { name: 'WAX', url: 'https://wax.eosweb.net', active: false }],
       disableNets: false,
       voteDonationAcc: 'eoswebnetbp1',
       disableVoteDonation: false,
       version: '2.2.8',
       producers: 1000,
       social: [
         { link: '', icon: 'fa-github' },
         { link: '', icon: 'fa-facebook' },
         { link: '', icon: 'fa-reddit-alien' },
         { link: 'https://medium.com/europechain', icon: 'fa-medium' },
         { link: 'https://twitter.com/europechain_', icon: 'fa-twitter' },
         { link: 'https://t.me/europechain', icon: 'fa-telegram-plane' }
       ],
       liveTXenable: true
    }
};*/

const chain = '37ec63023f051ad81db28e72e0b45ab81e60a150e80da240a5e6fa92b42fd7b7';
export const environment = {
    production: true,
    appName: 'DAObet',
    network: {
        blockchain: 'eos',
        host: 'api.daobet.org',
        port: 443,
        protocol: 'https',
        expireInSeconds: 120,
        chainId: chain
    },
    chain: chain,
    Eos: {
        httpEndpoint: 'https://api.daobet.org',
        chainId: chain,
        verbose: false
    },
    frontConfig: {
       coin: 'BET',
       bp: 'bp.json',
       tokenContract: 'eosio.token',
       totalBalance: 'BET',
       convertToUSD: true,
       customBalance: false,
       logo: '/assets/images/daobet_logo.svg',
       name: {
          big: 'DAO',
          small: 'bet'
       },

       nets: [
              { name: 'Mainnet', url: 'http://mainnet.daovalidator.com/', active: false },
              { name: 'Testnet', url: 'http://testnet.daovalidator.com/', active: true },
              // { name: 'Europechain', url: 'https://xec.eosweb.net', active: false },
              // { name: 'WAX', url: 'https://wax.eosweb.net', active: true }
             ],

       disableNets: false,
       voteDonationAcc: 'doanteAccName',
       disableVoteDonation: true,
       version: '1.0.0',
       producers: 1000,
       social: [
         { link: 'https://github.com/daocasino', icon: 'fa-github' },
         { link: 'https://www.facebook.com/Dao.casino', icon: 'fa-facebook' },
         // { link: 'https://www.reddit.com/user/eosweb', icon: 'fa-reddit-alien' },
         // { link: 'https://medium.com/@EoswebN', icon: 'fa-medium' },
         { link: 'https://twitter.com/daocasino', icon: 'fa-twitter' },
         { link: 'https://t.me/daobet_validators', icon: 'fa-telegram-plane' }
       ],
       liveTXenable: true
    }
};
