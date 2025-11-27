import { gameLocationCenters } from "@/scripts/consts";
import { MatchTeamColor } from "@/scripts/types/types";
import LocationMarker from "@/src/match/googleMaps/LocationMarker";
import useMyLocation from "@/src/match/interfaces/useMyLocation";
import useTeamLocations from "@/src/match/interfaces/useTeamLocations";

export default function AllTeamMarkers({teamName} : {teamName: MatchTeamColor}){
	const teamLocations = useTeamLocations();
	// console.log("Got team locations")
	// console.log(teamLocations.length)
	//filter my team
	const otherTeamLocations = teamLocations.filter(team => team.teamName !== teamName)
	
	// console.log("filtered all team markers")
	// console.log(otherTeamLocations.length)
	return (
		<>
		{otherTeamLocations.map((teamLocation, index) => <LocationMarker key={index} position={teamLocation.location} color={teamLocation.teamName} accuracy={teamLocation.accuracy}/>)}
		</>
	)
}