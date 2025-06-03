import { storage } from "@/scripts/firebase";
import { ClaimStateMoves } from "@/scripts/games/connect_four";
import { MetroGameBoardProps, ZoneData } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import { ChooseChallenge } from "@/src/match/claim/ChooseChallenge";
import ConfirmClaim from "@/src/match/claim/ConfirmClaim";
import { Evidence } from "@/src/match/claim/Evidence";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import FullHeightLayout, { VerticalSpread } from "@/src/userInterface/Layout";
import {
	Box,
	Button,
	Group,
	LoadingOverlay,
	Modal,
	Stepper
} from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";

export type Form = UseFormReturnType<
	{
		challenge: string;
		evidence: string;
	},
	(values: { challenge: string; evidence: string }) => {
		challenge: string;
		evidence: string;
	}
>;

export default function ClaimFlowModal({
	open,
	close,
	claimedZone,
}: {
	open: boolean;
	close: () => void;
	claimedZone?: ZoneData;
}) {
	const props: MetroGameBoardProps = useContext(GameContext);
	const moves = props.moves as ClaimStateMoves;
	const [loading, setLoading] = useState(false);

	const [step, setStep] = useState(0);
	const claimForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			challenge: "",
			evidence: "",
		},
		validate: (values) => {
			console.log("validating claim form", values);
			if (step === 0) {
				return {
					challenge: values.challenge
						? null
						: "Select a challenge to claim this zone",
				};
			}
			return {};
		},
	});
	const zoneName = claimedZone?.name;
	async function claimZone(zone: number, challenge: string, evidence: File) {
		setLoading(true);
		console.log("claiming zone on client", zone, challenge, evidence);
		const imageRef = ref(
			storage,
			`images/zone${zone}player${props.playerID}${Date.now()}.jpg`
		);
		try {
			const uploadTask = await uploadBytes(imageRef, evidence);
			console.log("Uploaded bytes to: ", uploadTask.metadata.fullPath);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
		const evidenceURL = await getDownloadURL(imageRef);

		moves.completeChallengeAndClaim(zone, challenge, evidenceURL);
		closeClaim();
		setLoading(false);
	}

	function closeClaim() {
		console.log("closing claim form");
		claimForm.reset();
		setStep(0);
		close();
	}

	return claimedZone ? (
		<Modal.Root
			opened={open}
			onClose={closeClaim}
			fullScreen
			padding={0}
			radius={0}>
			<Modal.Overlay />
			<Modal.Content>
				<FullHeightLayout>
					<LoadingOverlay visible={loading} />
					<Modal.Header>
						<ComplexHeader
							color={props.playerData.data.teamColor}
							w="100%">
							<Group
								w="100%"
								justify="space-between"
								align="flex-start"
								wrap="nowrap"
								gap="0">
								<Box flex="1 1 30px"></Box>
								<Box flex="1 0 auto" ta="center">
									<h1>{`Claim ${zoneName}`}</h1>
								</Box>
								<Box flex="1 1 30px" ta="right">
									<Modal.CloseButton
										size={"lg"}
										mt="5px"
										mr="5px"
									/>
								</Box>
							</Group>
						</ComplexHeader>
					</Modal.Header>
					<VerticalSpread>
						<div></div>
						<Stepper
							active={step}
							styles={{
								steps: { display: "none" },
							}}>
							<Stepper.Step>
								<ChooseChallenge
									props={props}
									claimForm={claimForm}
								/>
							</Stepper.Step>
							<Stepper.Step>
								<Evidence
									props={props}
									claimForm={claimForm}
								/>
							</Stepper.Step>
							<Stepper.Completed>
								<ConfirmClaim
									claimForm={claimForm}
									claimedZone={claimedZone}
								/>
							</Stepper.Completed>
						</Stepper>
						<Group justify="center" mt="xl">
							{step !== 2 ? (
								<>
									{step === 0 ? (
										<Button
											variant="outline"
											onClick={closeClaim}>
											Back
										</Button>
									) : (
										<Button
											variant="outline"
											onClick={() =>
												setStep(step - 1)
											}>
											Back
										</Button>
									)}
									<Button
										onClick={() => {
											if (
												claimForm.validate()
													.hasErrors
											)
												return;
											setStep(step + 1);
										}}>
										Next step
									</Button>
								</>
							) : (
								<>
									<Button
										variant="outline"
										onClick={() =>
											setStep(step - 1)
										}>
										Back
									</Button>
									<Button
										onClick={() =>
											claimZone(
												claimedZone.id,
												claimForm.getValues()
													.challenge,
												claimForm.getValues()
													.evidence as unknown as File
											)
										}>
										Claim
									</Button>
								</>
							)}
						</Group>
					</VerticalSpread>
				</FullHeightLayout>
			</Modal.Content>
		</Modal.Root>
	) : null;
}
