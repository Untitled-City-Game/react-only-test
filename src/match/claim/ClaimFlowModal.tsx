import {
	MetroGameBoardProps,
	ZoneData
} from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import claimZone from "@/src/match/claim/claimZone";
import { ModalHeader } from "@/src/match/claim/ui/ModalHeader";
import FullHeightLayout, { VerticalSpread } from "@/src/userInterface/Layout";
import {
	Button,
	FileInput,
	LoadingOverlay,
	Modal,
	Select,
	Stack
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";

const claimFormValues = {
			zone: "",
			challenge: "",
			evidence: "",
		}
export type ClaimFormValues = typeof claimFormValues;

export default function ClaimFlowModal({
	open,
	close,
	claimedZone,
	challengeTitle
}: {
	open: boolean;
	close: () => void;
	claimedZone?: ZoneData;
	challengeTitle?: string;
}) {
	const props: MetroGameBoardProps = useContext(GameContext);
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(0);
	
	const claimForm = useForm({
		mode: "controlled",
		initialValues: {
			zone: claimedZone?.id ? String(claimedZone?.id) : claimFormValues.zone,
			challenge: challengeTitle || claimFormValues.challenge,
			evidence: claimFormValues.evidence,
		},
		validate: {
			zone: hasLength({min: 1}, 'No zone included'),
			challenge:hasLength({min: 1}, 'No challenge included'),
		}
	});

	useEffect(()=>{
		challengeTitle && claimForm.setValues({challenge: challengeTitle});
	}, [challengeTitle]);
	
	useEffect(()=>{
		claimedZone && claimForm.setValues({zone: String(claimedZone.id)});
	}, [claimedZone]);

	function closeClaim() {
		claimForm.reset();
		// setStep(0);
		close();
	}
	
	const { allTeamsData, allPlayersData } = props.G;
	const playerData = allPlayersData[props.playerID];
	const myTeam = playerData.teamColor;
	const challengeHand = allTeamsData[myTeam]?.challengeHand.map(challenge => challenge.title);
	const zoneSelectOptions = props.G.zoneData.map(zone => {return {value: `${zone.id}`, label: zone.name}});

	async function handleSubmit(values: ClaimFormValues){
		setLoading(true);
		await claimZone(props.playerID, props.moves.completeChallengeAndClaim, Number(values.zone), values.challenge, values.evidence as unknown as File);
		setLoading(false);
		closeClaim();
	}

	return (
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
					{ModalHeader(props.playerData.data.teamColor)}
					<VerticalSpread>
						<div></div>
						<form onSubmit={claimForm.onSubmit(handleSubmit)}>
							<Stack ta="left">
							<Select label="Challenge" data={challengeHand} {...claimForm.getInputProps("challenge")} defaultValue={challengeTitle} />
							<Select label="Neighbourhood" data={zoneSelectOptions} {...claimForm.getInputProps("zone")} defaultValue={String(claimedZone?.id || "")} />
							<FileInput
								label="Photo evidence"
								// clearable = {claimForm.getValues().evidence !== undefined}
								{...claimForm.getInputProps("evidence")}
								/>
								<Button type="submit">Submit</Button>
							</Stack>
						</form>
												<div></div>

						{/* {StepperControls(claimForm, step, setStep, closeClaim, setLoading, props)} */}
					</VerticalSpread>
				</FullHeightLayout>
			</Modal.Content>
		</Modal.Root>
	);
}


// <Stepper
// 							active={step}
// 							styles={{
// 								steps: { display: "none" },
// 							}}>
// 							{!challengeTitle ? <Stepper.Step>
// 								<ChooseChallenge
// 									props={props}
// 									radioGroupProps={{...claimForm.getInputProps('challenge')}}
// 								/>
// 							</Stepper.Step> : null}
// 							{!claimedZone ? <Stepper.Step>
// 								<ChooseZone
// 									props={props}
// 									radioGroupProps={{...claimForm.getInputProps('zone')}}
// 								/>
// 							</Stepper.Step> : null}
// 							<Stepper.Step>
// 								<Evidence props={props} radioGroupProps={{...claimForm.getInputProps('zone')}} />
// 							</Stepper.Step>
// 							<Stepper.Completed>
// 								<ConfirmClaim
// 									currentFormValues={claimForm.values}
// 									zoneName={claimForm.values.zone ? props.G.zoneData[Number(claimForm.values.zone)]?.name : ""}
// 								/>
// 							</Stepper.Completed>
// 						</Stepper>