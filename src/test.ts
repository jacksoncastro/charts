export default class Test {

    private extraLatency: number;
    private performanceGain: number;

    constructor(extraLatency: number, performanceGain: number) {
        this.extraLatency = extraLatency;
        this.performanceGain = performanceGain;
    }

    public calcule() {

        console.log('--- NT ---');
        console.log('TARGET:', this.extraLatency);
        console.log('OTHERS:', 0);

        console.log('--- ATS ---');
        console.log('TARGET:', (this.extraLatency - this.performanceGain));
        console.log('OTHERS:', 0);

        console.log('--- DT ---');
        console.log('TARGET:', (this.extraLatency + this.performanceGain));
        console.log('OTHERS:', this.performanceGain);

        console.log('--- DTS ---');
        console.log('TARGET:', this.extraLatency);
        console.log('OTHERS:', this.performanceGain);

    }

    public calculeNew() {

        console.log('--- NT ---');
        console.log('TARGET:', this.extraLatency);
        console.log('OTHERS:', this.extraLatency);

        console.log('--- ATS ---');
        console.log('TARGET:', (this.extraLatency - this.performanceGain));
        console.log('OTHERS:', this.extraLatency);

        console.log('--- DT ---');
        console.log('TARGET:', (this.extraLatency + this.performanceGain));
        console.log('OTHERS:', (this.extraLatency + this.performanceGain));

        console.log('--- DTS ---');
        console.log('TARGET:', this.extraLatency);
        console.log('OTHERS:', (this.extraLatency + this.performanceGain));

    }
}