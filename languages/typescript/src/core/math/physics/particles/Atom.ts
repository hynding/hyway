export class Atom {
    public id: string = '';
    public name: string = '';
    public symbol: string = '';
    public atomicNumber: number = 0;
    public atomicMass: number = 0;
    public density: number = 0;
    public meltingPoint: number = 0;
    public boilingPoint: number = 0;
    public electronegativity: number = 0;
    public ionizationEnergy: number = 0;
    public electronAffinity: number = 0;
    public oxidationStates: number[] = [];
    public electrons: Uint8Array = new Uint8Array(0);

    get valenceElectrons(): number {
        if (this.electrons.length === 0) {
            return 0;
        }
        return this.electrons[this.electrons.length - 1];
    }
}