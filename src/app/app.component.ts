import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import presetJson from '../assets/presets.json';
import { IClock } from './interfaces/clock.interface';
import { ISettings } from './interfaces/settings.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
	title = 'chess-clock';

	@ViewChild('cd1', {static: false}) private cd1!: CountdownComponent;
	@ViewChild('cd2', {static: false}) private cd2!: CountdownComponent;

	private clickSound: HTMLAudioElement = new Audio('../assets/sounds/254316__jagadamba__clock-tick.wav');
	private alarmSound: HTMLAudioElement = new Audio('../assets/sounds/426888__thisusernameis__beep4.wav');

	public settings: ISettings = {
		font: "LCDBOLD",
		isSoundEnabled: true,
		isSynced: true,
		selectedPreset: "10+0",
	};

	// Clock 1 Settings
	public clock1: IClock = {
		state: "paused",
		increment: 0,
		startingTimeLeft: 600
	}

	// Clock 2 Settings
	public clock2: IClock = {
		state: "paused",
		increment: 0,
		startingTimeLeft: 600
	}


	public isSoundEnabled: boolean = this.settings.isSoundEnabled;
	public isSynced: boolean = this.settings.isSynced;
	public isFirstClick: boolean = true;
	public moveCount: number = 0;
	public dangerZone: number = 21;
	public presets: Array<any> = JSON.parse(JSON.stringify(presetJson));
	public custom: string = this.settings.selectedPreset;

	constructor(public dialog: MatDialog) {
		this.settings = JSON.parse(localStorage.getItem('userSettings') || JSON.stringify(this.settings));
	}

	ngOnInit() {

	}

	ngAfterViewInit() {
		if (this.settings.clock1 == null) {
			this.settings.clock1 = this.clock1;
		}
		if (this.settings.clock2 == null) {
			this.settings.clock2 = this.clock2;
		}

		this.clock1 = this.settings.clock1;
		this.clock2 = this.settings.clock2;

		this.setCustomValue();
		this.onSetTime(this.settings.clock1.startingTimeLeft, this.settings.clock2.startingTimeLeft, this.settings.clock1.increment, this.settings.clock2.increment, this.settings.selectedPreset);
	}

	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		console.log(event);

		if (event.key == '1') {
			this.onBtnOne();
		}

		if (event.key == '2') {
			this.onBtnTwo();
		}

		if (event.key == 'r' || event.key == 'R') {
			this.onReset();
		}

		if (event.key == 'p' || event.key == 'P' || event.key == ' ') {
			this.onPause();
		}

		if (event.key == 'm' || event.key == 'M') {
			this.onCycleMode();
		}
	}

	public config1: CountdownConfig = {
		demand: true,
		leftTime: this.clock1.startingTimeLeft,
		format: 'mm:ss',
		notify: this.dangerZone - 1
	}
	public config2: CountdownConfig = {
		demand: true,
		leftTime: this.clock2.startingTimeLeft,
		format: 'mm:ss',
		notify: this.dangerZone - 1
	}


	onBtnOne(): void {
		this.handleBtn(this.clock1, this.clock2, this.cd1, this.cd2);
	}

	onBtnTwo(): void {
		this.handleBtn(this.clock2, this.clock1, this.cd2, this.cd1);
	}

	handleBtn(clock1: any, clock2: any, cd1: CountdownComponent, cd2: CountdownComponent): void {

		cd1.pause();
		cd2.resume();

		if (this.isSoundEnabled && (clock1.state == "active" || this.isFirstClick)) {
			this.clickSound.load();
			this.clickSound.play();
		}

		if (this.isFirstClick) {
			this.isFirstClick = false;
		} else {
			if (clock1.state == "active") {
				this.moveCount++;

				if (clock1.increment != 0) {
					cd1.config.leftTime = cd1.left/1000 + clock1.increment;
					cd1.restart();
				}
			}
		}

		clock1.state = "paused";
		clock2.state = "active";
	}

	onSetTime(time1: number, time2: number = time1, inc1: number = 0, inc2: number = inc1, name: string = "custom"): void {
		this.clock1.increment = inc1;
		this.clock2.increment = inc2;
		this.cd1.config.leftTime = time1;
		this.cd2.config.leftTime = time2;
		this.clock1.startingTimeLeft = time1;
		this.clock2.startingTimeLeft = time2;
		this.settings.selectedPreset = name;
		this.onReset();

		this.onSaveSettings();
		this.setCustomValue();
	}

	onPause(): void {
		this.cd1.pause();
		this.cd2.pause();
		this.clock1.state = "paused";
		this.clock2.state = "paused";
	}

	onReset(): void {
		this.cd1.config.leftTime = this.clock1.startingTimeLeft;
		this.cd2.config.leftTime = this.clock2.startingTimeLeft;
		this.cd1.restart();
		this.cd2.restart();
		this.clock1.state = "paused";
		this.clock2.state = "paused";
		this.isFirstClick = true;
		this.moveCount = 0;
	}

	onCycleMode(): void {
		var idx = this.presets.findIndex(p => p.name == this.settings.selectedPreset) + 1;
		if (idx >= this.presets.length) {
			idx = 0;
		}

		this.onSetTime(this.presets[idx].time, this.presets[idx].inc, this.presets[idx].name);
	}

	onFontChange(event: any): void {
		console.log(event);
		this.onSaveSettings();
	}

	onSaveSettings(): void {
		localStorage.setItem('userSettings', JSON.stringify(this.settings));
	}

	handleEvent(event: CountdownEvent): void {
		console.log(event);

		if (event.action === 'done' && this.isSoundEnabled) {
			this.alarmSound.load();
			this.alarmSound.play();
		}
	}

	parseCustomSettings(value: string): void {

		const settings = value.trim().replace(' ', '').split(',');
		const setting1 = settings[0];
		const setting2 = settings[1] || setting1;

		const time1 = parseInt(setting1.split('+')[0]) * 60;
		const inc1 = parseInt(setting1.split('+')[1]);

		const time2 = parseInt(setting2.split('+')[0]) * 60;
		const inc2 = parseInt(setting2.split('+')[1]);

		this.onSetTime(time1, time2, inc1, inc2, "custom");
	}

	setCustomValue(): void {
		if (this.settings.clock1 == null) {
			this.settings.clock1 = this.clock1;
		}
		if (this.settings.clock2 == null) {
			this.settings.clock2 = this.clock2;
		}

		let clock1Preset = (this.settings.clock1.startingTimeLeft/60).toString() + "+" + (this.settings.clock1.increment).toString();
		let clock2Preset = (this.settings.clock2.startingTimeLeft/60).toString() + "+" + (this.settings.clock2.increment).toString();

		this.custom = clock1Preset + "," + clock2Preset;
	}
	openDialog(): void {
		const dialogRef = this.dialog.open(DialogComponent, {
			width: '250px',
			data: this.custom
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.custom = result;
				this.parseCustomSettings(this.custom);
				this.settings.selectedPreset = "custom";
				this.onSaveSettings();
				// console.log(result);
			}
		});
	   }
}

