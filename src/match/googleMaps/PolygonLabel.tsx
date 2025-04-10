import Span from "@/src/userInterface/Span";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
type PolygonLabelProps = {
	label : string,
	position : {lat: number, lng: number},
}
export default function PolygonLabel(props : PolygonLabelProps){
	const {label, position} = props;
	return (
		<AdvancedMarker 
		position={position}

		>
			<Span bg={"white"} fw="500">{label}</Span>
		</AdvancedMarker>
	)
}