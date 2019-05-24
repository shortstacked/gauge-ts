import { Range } from "./Range";

export class StepRegistryEntry {

    private readonly _method: Function | undefined;
    private readonly _filePath: string | undefined;
    private readonly _span: Range | undefined;
    private readonly _stepText: string;
    private readonly _stepValue: string;

    private _instance: object | undefined;

    constructor(stepText: string, stepValue: string, filePath: string, method?: Function, span?: Range) {
        this._stepText = stepText;
        this._stepValue = stepValue;
        this._method = method;
        this._filePath = filePath;
        this._span = span;
    }

    public getMethod() {
        return this._method;
    }

    public getInstance() {
        return this._instance;
    }

    public setInstance(instance: object) {
        return this._instance = instance;
    }

    public getFilePath() : string{
        return this._filePath as string;
    }

    public getRange() {
        return this._span;
    }

    public getStepText(): string {
        return this._stepText;
    }
}
