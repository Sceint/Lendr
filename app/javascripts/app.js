// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'

// Import libraries we need.
import {
    default as Web3
} from 'web3'
import {
    default as contract
} from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import loanSystem_artifacts from '../../build/contracts/LoanSystem.json'

// Conference is our usable abstraction, which we'll use through the code below.

var LoanSystem = contract(loanSystem_artifacts)
var accounts
var loanSystem

function getBalance(address) {
    return web3.fromWei(web3.eth.getBalance(address).toNumber(), 'ether')
}

window.App = {
    start: function () {
        var self = this

        web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                alert('There was an error fetching your accounts.')
                return
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
                return
            }

            accounts = accs
            self.initializeLoanSystem()
        })
    },

    initializeLoanSystem: function(){
        var self = this
        LoanSystem.deployed().then(function (instance) {
            $("#loginBlock").toggle()
        }).catch(function (e) {
            console.log(e)
        })
    },

    loginToSystem: function (loginAccount) {
      var self = this
      LoanSystem.deployed().then(function (instance) {
            loanSystem = instance
            var flag = false
            accounts.forEach(function(account) {
              if(account == loginAccount){
                  $("#loginBlock").toggle()
                  $("#mainBlock").toggle()
                self.updateHomeTab(loginAccount)
                flag = true
              }
            });
            if(flag == false)
                $('#loginStatus').html('Login Failed')
            else
                $('#loginStatus').html('')  
        }).catch(function (e) {
            console.log(e)
        })
    },

    updateHomeTab: function(account){
        var self = this
      LoanSystem.deployed().then(function (instance) {
            loanSystem = instance
            $('#userBalance').html(getBalance(account))
        }).catch(function (e) {
            console.log(e)
        })
    },

    logoutAction: function(){
        var self = this
      LoanSystem.deployed().then(function (instance) {
            loanSystem = instance
            $('#loginAddress').val('')
            $("#loginBlock").toggle()
            $("#mainBlock").toggle()
        }).catch(function (e) {
            console.log(e)
        })
    }
}

window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider)
    } else {
        console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    }

    LoanSystem.setProvider(web3.currentProvider)
    App.start()

    // $.addRegistered = function (vNum, owner) {
    //     $('#carsTable').append('<tr><td>' + vNum + '</td><td>' + owner + '</td></tr>')
    // }

    // $.deleteCheckin = function (row) {
    //     $('#checkinTable #' + row).remove()
    // }

    $('#login').click(function () {
        App.loginToSystem($('#loginAddress').val())
    })

    $('#logout').click(function () {
        App.logoutAction()
    })
})