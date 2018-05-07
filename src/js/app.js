App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Is there an injected web3 instance?
		if (typeof web3 !== 'undefined') {
  		App.web3Provider = web3.currentProvider;
		} else {
  		// If no injected web3 instance is detected, fall back to Ganache
  		App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
		}
		web3 = new Web3(App.web3Provider);
    return App.initWeb3();
  },

  initWeb3: function() {
    return App.initContract();
  },

  initContract: function() {
		$.getJSON('ShipCodeContract.json', function(data) {
			// Get the necessary contract artifact file and instantiate it with truffle-contract
			var ShipCodeContractArtifact = data;
			App.contracts.ShipCodeContract = TruffleContract(ShipCodeContractArtifact);

			// Set the provider for our contract
			App.contracts.ShipCodeContract.setProvider(App.web3Provider);

			return App.showVersion();
		});
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleBuy);
    $(document).on('click', '.btn-new-version', App.handleNewDeploy);
  },

  showVersion: function(customer, account) {
		var adoptionInstance;

		App.contracts.ShipCodeContract.deployed().then(function(instance) {
			ShipCodeContractInstance = instance;

			return ShipCodeContractInstance.currentVersion.call();
		}).then(function(currentVersion) {
      var currentVersion = currentVersion;
			$('#productVersion').text('Product was not published');
			$('.btn-buy').attr('disable', false);
			if (currentVersion) {
				$('.btn-buy').attr('disable', false);
				$('#productVersion').text(currentVersion);
        return ShipCodeContractInstance.retriveProduct();
      }
		}).then(function(downloadHash){
        if (downloadHash) {
          $('#productDownload').css("visibility", "visible");
          $("#downloadLink").attr("href", "http://localhost:8080/ipfs/" + downloadHash);
        } else {
          ShipCodeContractInstance.currentVersion().then(function(currentVersion) {
			      if (currentVersion) {
              $('#productBuy').show();
            }
          })
        }
    }).catch(function(err) {
		});
  },

	handleNewDeploy: function(event) {
		event.preventDefault();
    newVersion = $('#version-input').val();
    downloadHash = $('#hash-input').val();
    ShipCodeContractInstance.deployProductVersion(newVersion, downloadHash).then(function(result){
      console.log(result);
    });
	},

  handleBuy: function(event) {
    event.preventDefault();
    ShipCodeContractInstance.buyProduct({value: 100000000000000000});
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
