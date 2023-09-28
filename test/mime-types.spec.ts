import { cleanTestArtifacts, launchMochaAndReturnResult } from './resources/util';
import fs from "fs"

const xrayFile = "xray-results/mime-types.json"
beforeEach(() => {
    cleanTestArtifacts(xrayFile)
})

describe("Add proofs with the good contentType", () => {
    it("Should add a for each proof its contentType", async () => {
        fs.cpSync("screenshots/screenshot.png", "xray-results/screenshot @TICKET-1 @STEP-1.png")
        fs.cpSync("screenshots/data.json", "xray-results/data @TICKET-1 @STEP-1.json")
        fs.cpSync("screenshots/data.txt", "xray-results/data @TICKET-1 @STEP-1.txt")
        const result = await launchMochaAndReturnResult(['test/resources/screenshot/mime-types.ts'], xrayFile)
        expect(result.tests[0].steps[0].evidences).toHaveLength(3)
        expect(result.tests[0].steps[0].evidences[0].filename).toContain("data @TICKET-1 @STEP-1.json")
        expect(result.tests[0].steps[0].evidences[0].contentType).toBe("application/json")
        expect(result.tests[0].steps[0].evidences[1].filename).toContain("data @TICKET-1 @STEP-1.txt")
        expect(result.tests[0].steps[0].evidences[1].contentType).toBe("text/plain")
        expect(result.tests[0].steps[0].evidences[2].filename).toContain("screenshot @TICKET-1 @STEP-1.png")
        expect(result.tests[0].steps[0].evidences[2].contentType).toBe("image/png")
    })

})

