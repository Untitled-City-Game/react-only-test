import { EXPIRE_TIME, gameLocationCenters } from "@/scripts/consts";
import { LocationData, MatchTeamColor } from "@/scripts/types/types";
import useInterval from "@/scripts/useInterval";
import { OtherTeamsContext } from "@/src/match/Board";
import LocationMarker from "@/src/match/googleMaps/LocationMarker";
import { useContext, useState } from "react";

export default function AllTeamMarkers({ teamName }: { teamName: MatchTeamColor }) {
	const teamLocations = useContext(OtherTeamsContext);
	//console.log("rendering all team markers. Team location data:", teamLocations.length)

	//filter my team
	const otherTeamLocations = teamLocations.filter(team => team.teamName !== teamName)

	return (
		<MarkersWithExpiry otherTeamLocations={otherTeamLocations} />
	)

}

function MarkersWithExpiry({otherTeamLocations} : {otherTeamLocations : LocationData[]}){
	const [, setTimer] = useState<boolean>(false)
	
	useInterval(() => {
		//console.log("expiry")
		setTimer((previous => !previous))
	}, EXPIRE_TIME)

	const locationsWithExpiry = otherTeamLocations.map(team => {return {
		expired: Date.now() - team.timestamp > EXPIRE_TIME*2,
		...team
	}})
	//console.log("expired status", locationsWithExpiry[0]?.expired, Date.now() - otherTeamLocations[0]?.timestamp)
	return (
		<>
			{locationsWithExpiry.map((teamLocation, index) => <LocationMarker
				key={index} 
				position={teamLocation.location} 
				color={teamLocation.teamName} 
				accuracy={teamLocation.accuracy} 
				invalid={teamLocation.invalid}
				expired={teamLocation.expired}
				/>)}
		</>
	)
}