import { LogMetadata } from "@/scripts/types/types";
import ImageMantine from "@/src/userInterface/ImageMantine";
import { Box, Stack } from "@mantine/core";
import ReactPlayer from "react-player";

export function ClaimChallengeCompleted({ metadata }: { metadata: LogMetadata; }) {
	return (
		<>
				<span className="capitalize">{metadata.team} team</span> completed challenge <strong>{metadata.challenge}</strong> to {metadata.claimType || "claim"} <strong>{metadata.zoneName || metadata.zone}</strong> {metadata.stealFrom ? `from ${metadata.stealFrom}` : null}
		</>
	);
}


export function FruitEaten({ metadata }: { metadata: LogMetadata; }){
	return (
		<>
				<span className="capitalize">{metadata.team} team</span> completed challenge <strong>{metadata.challenge}</strong> and grew {metadata.growth}m
		</>
	);
}

export function ChallengeEvidence({ metadata, myMessage }: { metadata: LogMetadata; myMessage?: boolean }){
		const evidenceImages = metadata.evidence?.map(imageLink => {
		const fileType = imageLink.split('?')[0].split(".").pop();
		if(!fileType){
			return (
				null
			)
		}
		if (fileType && ["jpg", "png", "jpeg"].includes(fileType)) {
			return (
				<ImageMantine
					style={{
						borderRadius: "10px",
					}}
					key={imageLink}
					src={imageLink}
					alt={`${metadata.team} team completed challenge ${metadata.challenge} to claim zone ${metadata.zone}`}
					w="min(80%, 300px)" 
					mb="4px"
					/>
			);
		}
		return (
			<Box
				key={imageLink}
			>
				<ReactPlayer controls width="100%" url={imageLink} />
			</Box>
		);
	});

	return (
		<Stack align={myMessage? "flex-end" : "flex-start"}>
				{metadata.evidence && evidenceImages}
		</Stack>
		)

}
