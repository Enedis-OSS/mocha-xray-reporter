import { cleanTestArtifacts, launchMochaAndReturnResult } from './resources/util';
import fs from "fs"

const xrayFile = "xray-results/order.json"
beforeEach(() => {
    cleanTestArtifacts(xrayFile)
})

describe("Order the steps in a good order", () => {
    it("Should put the steps in the good order whatever the order the are coded in", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/step-order.ts'], xrayFile)
        expect(result.tests[0].steps[0].actualResult).toContain("position 1")
        expect(result.tests[0].steps[1].actualResult).toContain("position 2")
        expect(result.tests[0].steps[5].actualResult).toContain("position 6")
        expect(result.tests[0].steps[9].actualResult).toContain("position 10")
        expect(result.tests[0].steps[10].actualResult).toContain("position 11")
        expect(result.tests[0].steps[11].actualResult).toContain("position 12")
    })
})

