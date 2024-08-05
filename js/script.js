document.addEventListener("DOMContentLoaded", function() {
    const connectButton = document.getElementById('connectButton');
    const buyButton = document.getElementById('buyButton');
    const bnbAmountInput = document.getElementById('bnbAmount');
    const statusDiv = document.getElementById('status');
    const walletSelect = document.getElementById('walletSelect');
    const transactionList = document.getElementById('transactionList');

    const recipientAddress = '0xf9919DD1aa3077Eb3Be98275E3a6875d5F0fA33C';

    let web3;
    let accounts;

    async function connectWallet() {
        if (connectButton.textContent === 'Conectar Wallet') {
            const walletType = walletSelect.value;
            if (walletType === 'metamask') {
                if (typeof window.ethereum !== 'undefined') {
                    try {
                        await window.ethereum.request({ method: 'eth_requestAccounts' });
                        web3 = new Web3(window.ethereum);
                        accounts = await web3.eth.getAccounts();

                        connectButton.textContent = 'Wallet Conectada';
                        connectButton.classList.add('connected');
                        buyButton.disabled = false;
                        statusDiv.textContent = 'Wallet conectada. Ingresa la cantidad de BNB para comprar RickCoin.';
                    } catch (error) {
                        console.error('Error conectando a MetaMask:', error);
                        statusDiv.textContent = 'Error al conectar la wallet: ' + error.message;
                    }
                } else {
                    statusDiv.textContent = 'MetaMask no está instalado.';
                }
            }
        } else {
            web3 = null;
            accounts = null;

            connectButton.textContent = 'Conectar Wallet';
            connectButton.classList.remove('connected');
            buyButton.disabled = true;
            statusDiv.textContent = 'Wallet desconectada. Conéctate para comprar RickCoin.';
        }
    }

    connectButton.addEventListener('click', connectWallet);

    async function buyCrypto() {
        const amount = parseFloat(bnbAmountInput.value);
        if (isNaN(amount) || amount <= 0) {
            alert('Por favor, ingrese una cantidad válida de BNB.');
            return;
        }

        try {
            statusDiv.textContent = `Comprando RickCoin por ${amount} BNB`;
            statusDiv.classList.add('show');

            const valueInWei = web3.utils.toWei(amount.toString(), 'ether');
            const gasPrice = await web3.eth.getGasPrice();

            const tx = await web3.eth.sendTransaction({
                from: accounts[0],
                to: recipientAddress,
                value: valueInWei,
                gas: 30000, // Aumentar el límite de gas
                gasPrice: gasPrice
            });

            addTransactionToHistory(tx);
            statusDiv.textContent = `Compra Exitosa!`;
        } catch (error) {
            console.error('Error al realizar la transacción:', error);
            statusDiv.textContent = 'Error al realizar la transacción: ' + error.message;

            // Mostrar detalles adicionales del error
            if (error.code) {
                console.error('Código del error:', error.code);
                statusDiv.textContent += ` (Código de error: ${error.code})`;
            }
            if (error.data) {
                console.error('Datos del error:', error.data);
                statusDiv.textContent += ` (Datos del error: ${JSON.stringify(error.data)})`;
            }
        }
    }

    buyButton.addEventListener('click', buyCrypto);

    function addTransactionToHistory(tx) {
        const listItem = document.createElement('li');
        listItem.textContent = `Transacción: ${tx.transactionHash} - Cantidad: ${parseFloat(bnbAmountInput.value)} BNB`;
        listItem.classList.add('transaction-item'); 
        transactionList.appendChild(listItem);
    }
    
});
