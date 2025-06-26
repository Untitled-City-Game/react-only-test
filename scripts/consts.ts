export const highlightColor = "orange";

export const numPlayers = 6;
export const gameTimeMinutes = 360;
export const cities = [
	"melbourne",
	"montreal",
	"london",
] as const;

export const maps = {
	melbourne: {
		name: "Melbourne",
		code: "melbourne",
		kml_live_id: "1h1mLlEU1PRRbiF9eusZUplFhg7wjCaU",
	},
	montreal: {
		name: "Montreal",
		code: "montreal",
		kml_live_id: "1bliTnqrqX9A6txnta7C27Em0PJ3phzE",
	},
	london: {
		name: "London",
		code: "london",
		kml_live_id: "1DWUN7rKm1FUFr0BiKme7f0NpqegZWos",
	},
	nyc: {
		name: "New York City",
		code: "nyc",
		kml_live_id: "1L42PLDup2h_AiMSNTT1hAdBoyE5P6Ig"
	}
}

export const gameLocationCenters = {
	melbourne: {
		lat: -37.8136,
		lng: 144.9631
	},
	montreal: {
		lat:  45.529819917244254,
		lng: -73.60361034602055,
	},
	london: {
		lat:  51.5073509,
		lng: -0.1277583,
	},
}

//games
export const games = [
	{
		name: "Connect Four",
		code: "connect_four",
		active: true,
		description: "Connect four neighbourhoods in your city before the other team!",
		color: "yellow",
	},
	{
		name: "Tag",
		code: "tag",
		active: false,
		description: "Explore the city and dodge the taggers - or chase your friends to the end of the line!",
		color: "purple",
	},
	{
		name: "Battleship",
		code: "battleship",
		active: false,
		description: "Find and destroy the other team before they find you!",
		color: "water",
	}
]

   //Montreal

//   const center = {
// 	lat:  45.529819917244254,
// 	lng: -73.60361034602055,
//   }