"use strict";

/**
 * 資料頻率
 */
class Freq {
	constructor() {
		this.Tick = "1";     // Tick
		this.Min = "2";      // Min
		this.D = "8";        // 日
		this.W = "9";        // 週
		this.M =  "10";      // 月
		this.AD = "11";      // 還原日
		this.AW = "12";      // 還原週
		this.AM = "13";      // 還原月
		this.Q = "14";       // 季
		this.H = "15";       // 半年
		this.Y = "16";       // 年
		this.One = "999";    // 單一
	}

    freqToName(freq) {
        if (freq == this.D)
            return "D";
        else if (freq == this.W)
            return "W";
        else if (freq == this.M)
            return "M";
        else if (freq == this.AD)
            return "AD";
        else if (freq == this.AW)
            return "AW";
        else if (freq == this.AM)
            return "AM";
        else if (freq == this.Q)
            return "Q";
        else if (freq == this.H)
            return "H";
        else if (freq == this.Y)
            return "Y";
        else if (freq == this.Tick)
            return "Tick";
        else if (freq == this.Min)
            return "Min";
        else if (freq == this.One)
            return "One";
        else
            return "";                
    }

    freqToCName(freq) {
        if (freq == this.D)
            return "日";
        else if (freq == this.W)
            return "週";
        else if (freq == this.M)
            return "月";
        else if (freq == this.AD)
            return "還原日";
        else if (freq == this.AW)
            return "還原週";
        else if (freq == this.AM)
            return "還原月";
        else if (freq == this.Q)
            return "季";
        else if (freq == this.H)
            return "半年";
        else if (freq == this.Y)
            return "年";
        else if (freq == this.Tick)
            return "Tick";
        else if (freq == this.Min)
            return "分鐘";
        else if (freq == this.One)
            return "單一";
        else
            return "";                
    }
}

class CONST {
	constructor() {
		this.Freq = new Freq();
	}
}

module.exports = new CONST();
