import { keyframes } from '@angular/animations';
import { Component, HostListener, ViewChild } from '@angular/core';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	title = 'chess-clock';

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

	public cd1State: string = "paused";
	public cd2State: string = "paused";

	onBtnOne() {
		this.cd1State = "paused";
		this.cd2State = "active";
		this.cd1.pause();
		this.cd2.resume();
	}

	onBtnTwo() {
		this.cd2State = "paused";
		this.cd1State = "active";
		this.cd2.pause();
		this.cd1.resume();
	}

	onSetTime(time: number) {
		this.cd1.config.leftTime = time;
		this.cd2.config.leftTime = time;
		this.onReset();
	}

	onPause() {
		this.cd1.pause();
		this.cd2.pause();
		this.cd1State = "paused";
		this.cd2State = "paused";
	}

	onReset() {
		this.cd1.restart();
		this.cd2.restart();
		this.cd1State = "paused";
		this.cd2State = "paused";
	}

	handleEvent(event: CountdownEvent) {
		console.log(event);
	}
}

