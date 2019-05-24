import { readFileSync } from "fs";
import { createSourceFile, Decorator, forEachChild, isClassDeclaration, isMethodDeclaration, MethodDeclaration, Node, ScriptTarget, SourceFile } from 'typescript';
import { CodeHelper } from "../helpers/CodeHelper";
import { Position } from "../models/Position";
import { Range } from "../models/Range";
import registry from "../models/StepRegistry";
import { StepRegistryEntry } from "../models/StepRegistryEntry";
import { getListOfFiles } from "../utils/fileUtils";

export class StaticLoader extends CodeHelper {

    public loadImplementations() {
        this.loadFiles();
    }

    public loadStepsFromText(file: string, text: string) {
        let source = createSourceFile(file, text, ScriptTarget.Latest)
        forEachChild(source, (childNode: Node) => {
            if (isClassDeclaration(childNode)) {
                forEachChild(childNode, (node: Node) => {
                    if (isMethodDeclaration(node) && this.hasStepDecorator(node)) {
                        this.processNode(node, file, source);
                    }
                })
            }
        })
    }

    public reloadSteps(content: string, filePath: string) {
        registry.removeSteps(filePath);
        this.loadStepsFromText(filePath, content)
    }

    public reoveSteps(filePath: string) {
        registry.removeSteps(filePath);
    }

    private loadFiles() {
        getListOfFiles().forEach((file: string) => {
            let text = readFileSync(file, 'utf-8')
            this.loadStepsFromText(file, text);
        })
    }

    private processNode(node: MethodDeclaration, file: string, source: SourceFile) {
        let stepText = this.getStepText(node); // TODO: Add alias support
        let stepValue = stepText.replace(/(<.*?>)/g, "{}");
        registry.add(stepValue, new StepRegistryEntry(
            stepText,
            stepValue,
            file,
            undefined,
            this.getRange(node, source)));
    }

    private getRange(node: MethodDeclaration, source: SourceFile): Range {
        let dec = (node.decorators as unknown) as Array<Decorator>;
        let start = source.getLineAndCharacterOfPosition(dec[0].expression.pos);
        let end = source.getLineAndCharacterOfPosition(node.end);
        return new Range(new Position(start.line + 1, start.character), new Position(end.line + 1, end.character));
    }

}