<script>
	import Tailwindcss from './Tailwindcss.svelte';
	import { Router, Route, Link } from "svelte-routing";
	import { fade } from 'svelte/transition';
	import defaultWallet from './api/wallet.json';
	import defaultLocales from './api/locales.json';
	import defaultRates from './api/rates.json';
	import { clickOutside } from './utils/clickOutside.js';

	const walletAddr = document.URL.substring(document.URL.lastIndexOf('/') + 1);

	let rates = (localStorage.getItem('rates') !== null)? JSON.parse(localStorage.getItem('rates')): defaultRates;
	let wallet = (localStorage.getItem('wallet') !== null)? JSON.parse(localStorage.getItem('wallet')): defaultWallet;
	let locales = (localStorage.getItem('locales') !== null)? JSON.parse(localStorage.getItem('locales')): defaultLocales;

	async function load () {

		let response = await fetch('https://xuek-do8s-zeh2.f2.xano.io/api:nfXDSxon/rates');
		rates =  await response.json();
		localStorage.setItem('rates', JSON.stringify(rates));

		response = await fetch('https://xuek-do8s-zeh2.f2.xano.io/api:nfXDSxon/wallet?wallet='+walletAddr);
		wallet = await response.json();
		localStorage.setItem('wallet', JSON.stringify(wallet));

		response = await fetch('https://xuek-do8s-zeh2.f2.xano.io/api:nfXDSxon/locales');
		locales =  await response.json();
		localStorage.setItem('locales', JSON.stringify(locales));

		console.log(rates);
		console.log(wallet);
		console.log(locales);

	}

	setInterval(load, 10000);

	load();

	$: tokens = Object.entries(wallet.tokens);
	$: rates = rates;
	$: locales = locales;

	let localDropDown = false;
	let walletDropDown = false;

	function toggleLocaleDropdown () {
		localDropDown = localDropDown? false: true;
	}

	function switchBaseCurrency (code) {
		baseCurrency = code;
	}

	let baseCurrency = "EUR";
	let baseCurrencySymbol = "€";
	let balanceObj;
	let balanceString;
	let decimalString;

	let formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: baseCurrency,
	});

	export let url = '';
</script>

<Tailwindcss />

<Router url="{url}">
<div class="bg-gray-100 flex">

	<div class="min-h-screen w-64 border border-r-1 border-gray-200 bg-white">

		<div class="h-24 p-6">
			<div class="flex items-center text-3xl font-bold text-gray-500 font-logo">
				<img src="img/logo.png" alt="Woulter" class="mr-2 w-12 h-12">
				Woulter<span class="text-indigo-500">.</span>
			</div>
		</div>

		<nav class="p-6">
			<a href="" class="flex text-blue-500 p-4 items-center rounded-xl font-medium mb-2 hover:text-blue-500 bg-gray-100">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
					<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
				</svg>
				Dashboard
			</a>
			<a href="" class="flex text-gray-500 p-4 items-center rounded-xl font-medium mb-2 hover:text-blue-500">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
				</svg>
				Assets
			</a>
			<a href="" class="flex text-gray-500 p-4 items-center rounded-xl font-medium mb-2 hover:text-blue-500">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
				</svg>
				Transactions
			</a>
			<a href="" class="flex text-gray-500 p-4 items-center rounded-xl font-medium mb-2 hover:text-blue-500">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clip-rule="evenodd" />
				</svg>
				Exchange
			</a>
			<a href="" class="flex text-gray-500 p-4 items-center rounded-xl font-medium mb-2 hover:text-blue-500">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
					<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
				</svg>
				Prices
			</a>
		</nav>
	</div>

	<div class="py-6 pt-0 px-12 flex-1">

		<div class="h-24 flex items-center justify-between">
			<div class="relative">
				<a class="flex flex-row p-3 cursor-pointer rounded-2xl">
					<div class="mr-2"><img src="https://identicon-api.herokuapp.com/{walletAddr}/45?format=png"></div>
					<div class="mr-4">
						<p class="overflow-ellipsis	max-w-120 overflow-hidden font-bold">{walletAddr}</p>
						<p class="text-gray-400 text-sm font-semibold">Ethereum</p>
					</div>
					<!--<div class="flex items-start">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
						</svg>
					</div>-->
				</a>
				<!--<div class="origin-top-right right-0 mt-2 absolute bg-white rounded-2xl shadow-md flex flex-col text-sm border border-gray-200 p-6">
					<h3 class="mb-2 font-bold uppercase text-sm text-gray-400 tracking-wide">Saved Wallets</h3>
					<ul>
						<li class="flex flex-row">
							<div class="mr-2">
								<Identicon address="0x885bB4323a40aaC75a0e95a57D6054bc5e2C0Fc7" width="40" height="40" />
							</div>
							<div>
								<p class="overflow-ellipsis	max-w-120 overflow-hidden font-bold">0x885bB4323a40aaC75a0e95a57D6054bc5e2C0Fc7</p>
								<p class="text-gray-400 text-sm font-semibold">Ethereum</p>
							</div>
							<div class="flex items-start">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
								</svg>
							</div>
						</li>
					</ul>
				</div>-->
			</div>
			<div class="flex items-center justify-end">
				<div class="mr-6 relative">
					<a class="text-gray-800 flex items-center cursor-pointer p-4 py-2 rounded-xl hover:bg-gray-200" on:click="{toggleLocaleDropdown}">
						Eng / {baseCurrency} {baseCurrencySymbol}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
	  					<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
						</svg>
					</a>
					{#if localDropDown}
					<div class="origin-top-right right-0 mt-2 absolute bg-white rounded-2xl shadow-md flex text-sm border border-gray-200" transition:fade use:clickOutside on:click_outside={toggleLocaleDropdown}>
						<div class="w-48 p-8 border-r border-gray-200">
							<ul>
								<li>
									<a href="" class="flex items-center mb-4 text-blue-600 font-semibold">
										<img src="img/united-states.svg" alt="English (US)" class="w-5 mr-2">
										English
									</a>
								</li>
								<li>
									<a href="" class="flex items-center mb-4 hover:text-blue-600 hover:font-semibold">
										<img src="img/china.svg" alt="中文" class="w-5 mr-2">
										中文
									</a>
								</li>
								<li>
									<a href="" class="flex items-center mb-4 hover:text-blue-600 hover:font-semibold">
										<img src="img/netherlands.svg" alt="Nederlands" class="w-5 mr-2">
										Nederlands
									</a>
								</li>
								<li>
									<a href="" class="flex items-center hover:text-blue-600 hover:font-semibold">
										<img src="img/france.svg" alt="Français" class="w-5 mr-2">
										Français
									</a>
								</li>
							</ul>
						</div>
						<div class="p-8">
							<ul class="border-b border-gray-200 mb-3">
								{#each locales.cryptos as crypto}
								<li class="mb-2">
									<a href="" class="hover:text-blue-600 hover:font-semibold">{crypto}</a>
								</li>
								{/each}
							</ul>
							<ul>
								{#each locales.currencies as currency}
								<li class="mb-2">
									<a href="" class="hover:text-blue-600 {baseCurrency === currency.code? 'text-blue-600 font-semibold': ''}" on:click|preventDefault="{() => {switchBaseCurrency(currency.code)}}">{currency.code}</a>
								</li>
								{/each}
							</ul>
						</div>
					</div>
					{/if}
				</div>
				<div>
					<a class="text-gray-800 flex items-center cursor-pointer">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
					</svg>
					</a>
				</div>
			</div>
		</div>

		<div class="p-10 bg-white rounded-3xl w-full shadow-mellow mb-10">

			<div class="mb-10">
				<p class="text-gray-800 text-lg mb-2">Total balance</p>
				<p class="text-gray-800 text-5xl font-bold mb-2">
					{formatter.format(wallet.total.EUR * locales.rates[baseCurrency])}
				</p>
				<p class="text-gray-500">Profit/loss: <span class="{wallet.total.net.sign === '+'? 'text-green-500': 'text-red-500'} font-bold">{wallet.total.net.sign}{formatter.format(wallet.total.net.value * locales.rates[baseCurrency])}</span></p>
			</div>

			<div class="flex">
				{#each wallet.favTokens as favToken}
				<div class="flex-1 rounded-2xl border border-gray-200 p-4 mr-10 flex">
					<a href="{wallet.tokens.ETH.url}" target="_blank"><img src="{wallet.tokens[favToken].icon}" class="w-8 h-8 mr-4"></a>
					<div>
						<p class="text-gray-500 text-sm">{wallet.tokens[favToken].name}</p>
						<p class="text-gray-800 text-lg font-semibold mb-1">{wallet.tokens[favToken].balance.toFixed(7)} {favToken}</p>
						<p class="{(wallet.tokens[favToken].net.sign === '+')? 'text-green-500': 'text-red-500'}  text-sm font-semibold">{formatter.format(wallet.tokens[favToken].balance * rates[baseCurrency][favToken].value)} ({wallet.tokens[favToken].net.sign}{formatter.format(wallet.tokens[favToken].net.value * locales.rates[baseCurrency])})</p>
					</div>
				</div>
				{/each}
				<!--<div class="flex-1 rounded-2xl border border-gray-200 p-4 mr-10 flex">
					<a href="{wallet.tokens.ETH.url}" target="_blank"><img src="{wallet.tokens.ETH.icon}" class="w-8 h-8 mr-4"></a>
					<div>
						<p class="text-gray-500 text-sm">{wallet.tokens.ETH.name}</p>
						<p class="text-gray-800 text-lg font-semibold mb-1">0.256567545 ETH</p>
						<p class="text-green-500 text-sm font-semibold">{baseCurrencySymbol}3,700.96 (+{baseCurrencySymbol}456.09)</p>
					</div>
				</div>
				<div class="flex-1 rounded-2xl border border-gray-200 p-4 mr-10 flex">
					<a href="{wallet.tokens.UNI.url}" target="_blank"><img src="{wallet.tokens.UNI.icon}" class="w-8 h-8 mr-4"></a>
					<div>
						<p class="text-gray-500 text-sm">{wallet.tokens.UNI.name}</p>
						<p class="text-gray-800 text-lg font-semibold mb-1">0.256567545 UNI</p>
						<p class="text-green-500 text-sm font-semibold">{baseCurrencySymbol}3,700.96 (+{baseCurrencySymbol}456.09)</p>
					</div>
				</div>
				<div class="flex-1 rounded-2xl border border-gray-200 p-4 flex">
					<a href="{wallet.tokens.COMP.url}" target="_blank"><img src="{wallet.tokens.COMP.icon}" class="w-8 h-8 mr-4"></a>
					<div>
						<p class="text-gray-500 text-sm">{wallet.tokens.COMP.name}</p>
						<p class="text-gray-800 text-lg font-semibold mb-1">0.256567545 COMP</p>
						<p class="text-green-500 text-sm font-semibold">{baseCurrencySymbol}3,700.96 (+{baseCurrencySymbol}456.09)</p>
					</div>
				</div>-->
			</div>

		</div>

		<div>
			{#each tokens as token, i}
			<div class="flex items-center p-4 justify-between border-2 border-color border-transparent rounded-2xl hover:border-blue-600 cursor-pointer transform transition duration-700 {(i % 2)? 'bg-gray-200': ''}">
				<div class="flex items-center">
					<img src="{token[1].icon}" alt="{token[1].name}" class="w-8 h-8 mr-3">
					<p class="text-gray-800 font-semibold mr-4">{token[1].name}</p>
					<p class="text-gray-400 font-semibold mr-2">{Number(token[1].balance).toFixed(2)} {token[0]} | {formatter.format(rates[baseCurrency][token[0]].value)}</p>
					<p class="flex items-center {(rates[baseCurrency][token[0]].recent_value > 0)? 'text-green-500': 'text-red-500'} text-sm">
						{#if rates[baseCurrency][token[0]].recent_value > 0}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
  						<path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
						</svg>
						{:else}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
  						<path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
						{/if}
						{Math.abs(rates[baseCurrency][token[0]].recent_percentage*100).toFixed(2)}% ({formatter.format(rates[baseCurrency][token[0]].recent_value)})
					</p>
				</div>
				<div class="flex flex-col items-end">
					<p class="text-gray-800 font-bold">{formatter.format(token[1].balance*rates[baseCurrency][token[0]].value)}</p>
					<p class=" font-semibold text-sm {(token[1].net.sign === '+')? 'text-green-500': 'text-red-500'}">net {token[1].net.sign}{formatter.format(token[1].net.value * locales.rates[baseCurrency])}</p>
				</div>
			</div>
			{/each}
		</div>

	</div>

</div>
</Router>
