import {launchMochaAndReturnResult} from "./resources/util";
import fs from "fs"

const xrayFile = "xray-results/screenshot.json"
beforeEach(() => {
    try {
        fs.unlinkSync(xrayFile)
    } catch(e) {

    }
})

describe("Add screenshot with the good @TICKET and @STEP", () => {
    it("Should add a screenshot", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/screenshot/with.ts'], xrayFile)
        expect(result.tests[0].steps[0].evidences[0].filename).toContain("Test screenshot @TICKET-2 @STEP-1.png")
    })

    it("Should not add screenshot", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/screenshot/without.ts'], xrayFile)
        expect(result.tests[0].steps[0].evidences).toHaveLength(0)
    })
})

