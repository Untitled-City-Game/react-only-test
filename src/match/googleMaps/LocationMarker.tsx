import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { FaCircle } from "react-icons/fa";
export default function LocationMarker({position, color} : {position: google.maps.LatLngLiteral, color: string}) {
	return (
	<AdvancedMarker position={position}>
		<FaCircle color={color} size="1rem" style={{filter: `drop-shadow(0 0 3px ${color})`}} />
	</AdvancedMarker>
	)
}
