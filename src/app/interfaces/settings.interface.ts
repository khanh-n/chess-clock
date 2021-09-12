import { IClock } from "./clock.interface";

export interface ISettings {
	font: string,
	isSynced: boolean,
	isSoundEnabled: boolean,
	selectedPreset: string
	clock1?: IClock
	clock2?: IClock
}
