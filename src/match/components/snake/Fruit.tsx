import { Fruit } from "@/scripts/games/snake/types";
import { Circle } from "@/src/match/googleMaps/shapes/Circle";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { FaAppleAlt } from "react-icons/fa";

export default function FruitMarker({fruitData, onClick} : {fruitData : Fruit, onClick : () => void}) {
	return (
		<>
		<AdvancedMarker position={fruitData.coords}>
			<FaAppleAlt color="red" size="1rem" style={{marginBottom: "-0.75rem"}}/>
		</AdvancedMarker>
		<Circle onClick={onClick} center={fruitData.coords} radius={50} strokeColor={"red"} fillColor={"orange"} fillOpacity={0.2} />
		
		</>
	)
}