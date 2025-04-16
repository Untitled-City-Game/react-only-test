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
		zIndex={5}
		>
			{/* <Span fw="500" fz="xl" w="min-content" bg="grey" ta="center" style={{WebkitTextStroke:"1px white"}}>{label}</Span> */}
			<Span fw="400" fz="xs" w="min-content" ta="center">{label}</Span>
		</AdvancedMarker>
	)
}