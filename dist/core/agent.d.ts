import { PageAnalysis, AgentState } from '../types';
export declare class PlaywrightAgent {
    private browser?;
    private state;
    constructor();
    analyzePage(url: string): Promise<PageAnalysis>;
    private extractPageElements;
    private detectElementType;
    generateTest(pageAnalysis: PageAnalysis): Promise<string>;
    run(url: string): Promise<string>;
    getState(): AgentState;
}
//# sourceMappingURL=agent.d.ts.map