"use strict";
function Time() {
    this.startTime =
	this.lastUpdate = Date.now();

    this.allTime = 0;
};

Time.prototype.Update = function () {

    this.now = Date.now();
    this.allTime = (this.now - this.startTime) / 1000;
    this.deltaTime = (this.now - this.lastUpdate) / 1000;
    this.lastUpdate = this.now;

};