export const highlightColor = "orange";

export const numPlayers = 6;
export const cities = [
	"melbourne",
	"montreal",
] as const;
//Melbourne
export const gameLocationCenter: google.maps.LatLngLiteral = {
	lat: -37.8136,
	lng: 144.9631
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
}

   //Montreal

//   const center = {
// 	lat:  45.529819917244254,
// 	lng: -73.60361034602055,
//   }