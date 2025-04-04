export const highlightColor = "orange";

export const numPlayers = 6;
export const gameTimeMinutes = 300;
export const cities = [
	"melbourne",
	"montreal",
] as const;

export const gameLocationCenters = {
	melbourne: {
		lat: -37.8136,
		lng: 144.9631
	},
	montreal: {
		lat:  45.529819917244254,
		lng: -73.60361034602055,
	},
}

//games
export const games = [
	{
		name: "Connect Four",
		code: "connect_four",
		active: true,
		description: "Connect four neighbourhoods in your city before the other team!"
	},
	{
		name: "Tag",
		code: "tag",
		active: false,
	},
	{
		name: "Battleship",
		code: "battleship",
		active: false,
	}
]

   //Montreal

//   const center = {
// 	lat:  45.529819917244254,
// 	lng: -73.60361034602055,
//   }