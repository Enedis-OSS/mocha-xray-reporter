import {launchMochaAndReturnResult} from "./resources/util";
import fs from "fs"

const xrayFile = "xray-results/order.json"
beforeEach(() => {
    try {
        fs.unlinkSync(xrayFile)
    } catch(e) {

    }
})

describe("Order the steps in a good order", () => {
    it("Should end up with PASS if all steps are PASS", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/step-order.ts'], xrayFile)
        expect(result.tests[0].steps[0].actualResult).toContain("position 1")
        expect(result.tests[0].steps[1].actualResult).toContain("position 2")
        expect(result.tests[0].steps[5].actualResult).toContain("position 6")
        expect(result.tests[0].steps[9].actualResult).toContain("position 10")
        expect(result.tests[0].steps[10].actualResult).toContain("position 11")
        expect(result.tests[0].steps[11].actualResult).toContain("position 12")
    })
})

