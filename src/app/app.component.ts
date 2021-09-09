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
	public increment1: number = 0;
	public increment2: number = 0;
	public moveCount: number = 0;
	public isFirstClick: boolean = true;
	public startingTimeLeft: number = 600;
	public cd1State: string = "paused";
	public cd2State: string = "paused";
	public selectedPreset: string = "10+0";
	public presets: Array<any> = JSON.parse(JSON.stringify(presetJson));

	@ViewChild('cd1', {static: false}) private cd1!: CountdownComponent;
	@ViewChild('cd2', {static: false}) private cd2!: CountdownComponent;
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
		leftTime: 600,
		format: 'mm:ss'
	}
	public config2: CountdownConfig = {
		demand: true,
		leftTime: 600,
		format: 'mm:ss'
	}


	onBtnOne() {
		this.cd1.pause();
		this.cd2.resume();

		if (this.isFirstClick) {
			this.isFirstClick = false;
		} else {
			if (this.cd1State == "active") {
				this.moveCount++;

				if (this.increment1 != 0) {
					this.cd1.config.leftTime = this.cd1.left/1000 + this.increment1;
					this.cd1.restart();
				}
			}
		}

		this.cd1State = "paused";
		this.cd2State = "active";
	}

	onBtnTwo() {
		this.cd2.pause();
		this.cd1.resume();

		if (this.isFirstClick) {
			this.isFirstClick = false;
		} else {
			if (this.cd2State == "active") {
				this.moveCount++;

				if (this.increment2 != 0) {
					this.cd2.config.leftTime = this.cd2.left/1000 + this.increment2;
					this.cd2.restart();
				}
			}
		}

		this.cd2State = "paused";
		this.cd1State = "active";

	}

	onSetTime(time: number, increment: number = 0, name: string = "custom") {
		this.increment1 = increment;
		this.increment2 = increment;
		this.cd1.config.leftTime = time;
		this.cd2.config.leftTime = time;
		this.startingTimeLeft = time;
		this.selectedPreset = name;
		this.onReset();
	}

	onPause() {
		this.cd1.pause();
		this.cd2.pause();
		this.cd1State = "paused";
		this.cd2State = "paused";
	}

	onReset() {
		this.cd1.config.leftTime = this.startingTimeLeft;
		this.cd2.config.leftTime = this.startingTimeLeft;
		this.cd1.restart();
		this.cd2.restart();
		this.cd1State = "paused";
		this.cd2State = "paused";
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
	}
}

