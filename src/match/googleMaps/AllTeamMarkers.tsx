import { gameLocationCenters } from "@/scripts/consts";
import { MatchTeamColor } from "@/scripts/types/types";
import LocationMarker from "@/src/match/googleMaps/LocationMarker";
import useTeamLocations from "@/src/match/interfaces/useTeamLocations";

export default function AllTeamMarkers(){
	const allTeamLocations = useTeamLocations();
	console.log("rendering all team markers")
	return (
		<>
		{allTeamLocations.map((teamLocation, index) => <LocationMarker key={index} position={teamLocation.location} color={teamLocation.teamName} />)}
		{/* <LocationMarker key="dummy" position={gameLocationCenters.montreal} color={"pink" as MatchTeamColor} /> */}
		</>
	)
}