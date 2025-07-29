import { LogMetadata } from "@/scripts/types";
import ImageMantine from "@/src/userInterface/ImageMantine";
import { Box, Stack } from "@mantine/core";
import ReactPlayer from "react-player";

export function ChallengeCompleted({ metadata }: { metadata: LogMetadata; }) {
	// const evidenceImages = metadata.evidence?.map(imageLink => {
	// 	const fileType = imageLink.split('?')[0].split(".").pop();
	// 	if (fileType && ["jpg", "png", "jpeg"].includes(fileType)) {
	// 		return (
	// 			<ImageMantine
	// 				key={imageLink}
	// 				src={imageLink}
	// 				alt={`${metadata.team} team completed challenge ${metadata.challenge} to claim zone ${metadata.zone}`}
	// 				w="min(100%, 300px)" />
	// 		);
	// 	}
	// 	return (
	// 		<Box
	// 			key={imageLink}
	// 		>
	// 			<ReactPlayer controls width="100%" url={imageLink} />
	// 		</Box>
	// 	);
	// });
	return (
		<>
			<p>
				<span className="capitalize">{metadata.team} team</span> completed challenge <strong>{metadata.challenge}</strong> to {metadata.claimType || "claim"} <strong>{metadata.zoneName || metadata.zone}</strong> {metadata.stealFrom ? `from ${metadata.stealFrom}` : null}
			</p>
		</>
	);
}

export function ChallengeEvidence({ metadata }: { metadata: LogMetadata; }){
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
					key={imageLink}
					src={imageLink}
					alt={`${metadata.team} team completed challenge ${metadata.challenge} to claim zone ${metadata.zone}`}
					w="min(100%, 300px)" />
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
		<Stack>
				{metadata.evidence && evidenceImages}
		</Stack>
		)

}
