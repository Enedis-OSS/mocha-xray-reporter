import { cleanTestArtifacts, launchMochaAndReturnResult } from './resources/util';
import fs from "fs"

const xrayFile = "xray-results/screenshot.json"
beforeEach(() => {
    cleanTestArtifacts(xrayFile)
})

describe("Add screenshot with the good @TICKET and @STEP", () => {
    it("Should add a screenshot", async () => {
        fs.cpSync("screenshots/screenshot.png", "xray-results/screenshot @TICKET-1 @STEP-1.png")
        const result = await launchMochaAndReturnResult(['test/resources/screenshot/with.ts'], xrayFile)
        expect(result.tests[0].steps[0].evidences[0].filename).toContain("screenshot @TICKET-1 @STEP-1.png")
    })

    it("Should not add screenshot", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/screenshot/without.ts'], xrayFile)
        expect(result.tests[0].steps[0].evidences).toHaveLength(0)
    })

    it("Should use only specified screenshots", async () => {
        fs.cpSync("screenshots/screenshot.png", "xray-results/screenshot @TICKET-1 @STEP-1.png")
        fs.cpSync("screenshots/screenshot.png", "xray-results/screenshot @TICKET-1 @STEP-10.png")
        fs.cpSync("screenshots/screenshot.png", "xray-results/screenshot @TICKET-10 @STEP-1.png")
        const result = await launchMochaAndReturnResult(['test/resources/screenshot/pattern.ts'], xrayFile)
        expect(result.tests[0].steps[0].evidences).toHaveLength(1)
        expect(result.tests[0].steps[0].evidences[0].filename).toContain("screenshot @TICKET-1 @STEP-1.png")

    })
})

