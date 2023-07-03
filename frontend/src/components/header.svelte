<script lang="ts">
	export let showSearchBar = false;
</script>

<header>
	<div class="logo" />
	<a class="font-bold text-white text-lg tracking-wide" href="/"> SkyStats </a>

	<a href="/about" style="text-decoration: none;" class="header-button" id="about_button">ABOUT</a>
	<a href="/api" style="text-decoration: none;" class="header-button" id="api_button">API</a>

	<form class="lookup-player {showSearchBar ?? 'hidden'}">
		<input name="ign" type="search" enterkeyhint="go" placeholder="Enter username" aria-label="username" required />
		<button type="submit">
			<svg style="width:24px;height:24px" viewBox="0 0 24 24">
				<title>search</title>
				<path
					fill="currentColor"
					d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
				/>
			</svg>
		</button>
	</form>

	<button class="themes-button">
		<svg viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M19,11.5C19,11.5 17,13.67 17,15A2,2 0 0,0 19,17A2,2 0 0,0 21,15C21,13.67 19,11.5 19,11.5M5.21,10L10,5.21L14.79,10M16.56,8.94L7.62,0L6.21,1.41L8.59,3.79L3.44,8.94C2.85,9.5 2.85,10.47 3.44,11.06L8.94,16.56C9.23,16.85 9.62,17 10,17C10.38,17 10.77,16.85 11.06,16.56L16.56,11.06C17.15,10.47 17.15,9.5 16.56,8.94Z"
			/>
		</svg>
		<span>Themes</span>
	</button>

	<button class="packs-button">
		<svg viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z"
			/>
		</svg>
		<span>Packs</span>
	</button>
</header>

<style>
	.logo {
		width: 25px;
		height: 25px;
		background: url(https://media.discordapp.net/attachments/1095019625349120041/1125444281939787796/SkyStats_161x161.jpg?width=161&height=161)
			no-repeat center center;
		background-size: cover;
		border-radius: 3px;
	}

	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 48px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-top: env(safe-area-inset-top, 0);
		padding-left: max(8px, env(safe-area-inset-left));
		padding-right: max(8px, env(safe-area-inset-right));
		background-color: #282828;
		z-index: 1000;
		line-height: 48px;
		overflow: hidden;
		@supports (overflow: clip) {
			overflow: clip;
		}
	}

	header > * {
		margin: 0 4px;
	}

	.header-button {
		-webkit-appearance: none;
		appearance: none;
		display: inline-block;
		vertical-align: middle;
		position: relative;
		text-transform: uppercase;
		box-sizing: unset;
		height: 16px;
		font-weight: 600;
		font-size: 13px;
		background-color: #dbdbdb;
		color: rgba(0, 0, 0, 0.8);
		padding: 5px;
		padding-left: 10px;
		padding-right: 10px;
		border-radius: 9999px;
		line-height: normal;
		transition: background-color 0.1s;
		border: none;
	}

	.header-button:hover {
		color: black;
	}

	.lookup-player {
		position: relative;
		flex-grow: 1;
		flex-shrink: 1;
		max-width: 500px;
		height: 36px;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 18px;
		@media (min-width: 1100px) {
			margin: 0 auto;
		}
	}

	.lookup-player {
		margin-left: auto;
	}

	.lookup-player input[type='search'] {
		position: absolute;
		top: 0;
		left: 0;
		outline: 0;
		border: 0;
		border-radius: inherit;
		background-color: transparent;
		color: white;
		height: 100%;
		width: 100%;
		padding: 0 65px 0 15px;
		font-size: 16px;
		box-sizing: border-box;
		font-weight: 600;
		transition: background-color 0.1s;
	}

	.lookup-player input[type='search']:focus,
	.lookup-player input[type='search']:hover {
		outline: none;
		background-color: rgba(0, 0, 0, 0.2);
	}

	.lookup-player button {
		display: grid;
		place-items: center;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: 60px;
		-webkit-appearance: none;
		appearance: none;
		border: none;
		border-radius: 18px;
		background-color: rgba(0, 0, 0, 0.15);
		color: black;
		transition: background-color 0.1s;
		cursor: pointer;
	}

	.lookup-player button:focus,
	.lookup-player button:hover {
		background-color: rgba(0, 0, 0, 0.07);
	}

	.lookup-player svg {
		width: 24px;
		height: 24px;
		fill: currentColor;
		color: white;
	}

	.packs-button,
	.themes-button {
		-webkit-appearance: none;
		appearance: none;
		display: flex;
		height: 36px;
		line-height: 36px;
		box-sizing: border-box;
		text-transform: capitalize;
		font-weight: 600;
		font-size: 14px;
		color: white;
		padding: 0 6px;
		border-radius: 9999px;
		top: 6px;
		right: 20px;
		background-color: rgba(0, 0, 0, 0.2);
		align-items: center;
		border: none;
	}

	.packs-button svg,
	.themes-button svg {
		width: 24px;
		height: 24px;
	}

	.themes-button svg {
		transform: translateY(2px);
	}

	.packs-button span,
	.themes-button span {
		display: block;
		transform: scaleX(1);
		transition: transform 0.2s, font-size, 0.2s, opacity 0.2s, padding-right 0.2s;
		padding: 0 6px 0 4px;
	}

	.themes-button {
		margin-left: auto;
	}
</style>
