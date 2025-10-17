import LocationMarker from "@/src/match/googleMaps/LocationMarker";
import useTeamLocations from "@/src/match/interfaces/useTeamLocations";

export default function AllTeamMarkers(){
	const allTeamLocations = useTeamLocations();
	return (
		<>
		{allTeamLocations.map(teamLocation => <LocationMarker position={teamLocation.location} color={teamLocation.teamName} />)}
		</>
	)
}