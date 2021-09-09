import { keyframes } from '@angular/animations';
import { Component, HostListener, ViewChild } from '@angular/core';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import presetJson from '../assets/presets.json';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	title = 'chess-clock';

	@ViewChild('cd1', {static: false}) private cd1!: CountdownComponent;
	@ViewChild('cd2', {static: false}) private cd2!: CountdownComponent;


	// Clock 1 Settings
	public clock1: any = {
		state: "paused",
		increment: 0,
		startingTimeLeft: 600
	}

	// Clock 2 Settings
	public clock2: any = {
		state: "paused",
		increment: 0,
		startingTimeLeft: 600
	}

	public dangerZone: number = 21;
	public isSynced: boolean = true;
	public isFirstClick: boolean = true;
	public selectedPreset: string = "10+0";
	public moveCount: number = 0;
	public presets: Array<any> = JSON.parse(JSON.stringify(presetJson));

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


	onBtnOne() {
		this.handleBtn(this.clock1, this.clock2, this.cd1, this.cd2);
	}

	onBtnTwo() {
		this.handleBtn(this.clock2, this.clock1, this.cd2, this.cd1);
	}

	handleBtn(clock1: any, clock2: any, cd1: CountdownComponent, cd2: CountdownComponent) {
		cd1.pause();
		cd2.resume();

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

	onSetTime(time: number, increment: number = 0, name: string = "custom") {
		this.clock1.increment = increment;
		this.clock2.increment = increment;
		this.cd1.config.leftTime = time;
		this.cd2.config.leftTime = time;
		this.clock1.startingTimeLeft = time;
		this.clock2.startingTimeLeft = time;
		this.selectedPreset = name;
		this.onReset();
	}

	onPause() {
		this.cd1.pause();
		this.cd2.pause();
		this.clock1.state = "paused";
		this.clock2.state = "paused";
	}

	onReset() {
		this.cd1.config.leftTime = this.clock1.startingTimeLeft;
		this.cd2.config.leftTime = this.clock2.startingTimeLeft;
		this.cd1.restart();
		this.cd2.restart();
		this.clock1.state = "paused";
		this.clock2.state = "paused";
		this.isFirstClick = true;
		this.moveCount = 0;
	}

	onCycleMode() {
		var idx = this.presets.findIndex(p => p.name == this.selectedPreset) + 1;
		if (idx >= this.presets.length) {
			idx = 0;
		}

		this.onSetTime(this.presets[idx].time, this.presets[idx].inc, this.presets[idx].name);
	}

	handleEvent(event: CountdownEvent) {
		console.log(event);

		if (event.action === 'notify') {

		}
	}
}

